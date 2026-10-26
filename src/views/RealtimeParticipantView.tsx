import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, Cloud, Flag, LoaderCircle, LockKeyhole, Radio, RefreshCw } from 'lucide-react'
import { chapters } from '../content/chapters'
import { EVENT_ID } from '../firebase/config'
import { castVote, ensureAnonymousParticipant, getOwnVote, subscribePublicState } from '../firebase/showService'
import { QUESTION_IDS, type PublicShowState, type QuestionId, type VoteRecord } from '../firebase/types'
import type { Choice } from '../types/story'

function readableError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code.includes('permission-denied')) return 'La pregunta se cerró, la sesión cambió o este navegador ya registró un voto.'
  if (code.includes('network-request-failed') || code.includes('unavailable')) return 'No se pudo conectar con Firebase. Comprueba la red corporativa e inténtalo de nuevo.'
  if (code.includes('operation-not-allowed')) return 'La autenticación anónima aún no está habilitada en Firebase.'
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

function validQuestionId(value: unknown): value is QuestionId {
  return typeof value === 'string' && QUESTION_IDS.includes(value as QuestionId)
}

export function RealtimeParticipantView() {
  const [state, setState] = useState<PublicShowState | null>(null)
  const [uid, setUid] = useState<string>()
  const [vote, setVote] = useState<VoteRecord | null>()
  const [selected, setSelected] = useState<Choice>()
  const [connection, setConnection] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>()

  const questionId = validQuestionId(state?.activeQuestionId) ? state.activeQuestionId : undefined
  const sessionId = typeof state?.sessionId === 'string' ? state.sessionId : undefined
  const questionIndex = questionId ? QUESTION_IDS.indexOf(questionId) : 0
  const poll = chapters[questionIndex].poll

  useEffect(() => {
    let unsubscribe: () => void = () => {}
    let cancelled = false
    const connect = async () => {
      try {
        const user = await ensureAnonymousParticipant()
        if (cancelled) return
        setUid(user.uid)
        unsubscribe = subscribePublicState('participant', (next) => {
          setState(next)
          setConnection('connected')
          setError(undefined)
        }, (snapshotError) => {
          setConnection('error')
          setError(readableError(snapshotError))
        })
      } catch (connectError) {
        if (!cancelled) {
          setConnection('error')
          setError(readableError(connectError))
        }
      }
    }
    void connect()
    return () => { cancelled = true; unsubscribe() }
  }, [])

  useEffect(() => {
    if (!uid || !sessionId || !questionId) {
      setVote(undefined)
      return
    }
    let cancelled = false
    setVote(undefined)
    setSelected(undefined)
    void getOwnVote(uid, sessionId, questionId)
      .then((ownVote) => { if (!cancelled) setVote(ownVote) })
      .catch((voteError) => { if (!cancelled) setError(readableError(voteError)) })
    return () => { cancelled = true }
  }, [uid, sessionId, questionId])

  const submit = async () => {
    if (!uid || !sessionId || !questionId || !selected || sending) return
    setSending(true)
    setError(undefined)
    try {
      await castVote(uid, sessionId, questionId, selected)
      setVote({ uid, choice: selected })
    } catch (submitError) {
      setError(readableError(submitError))
      try { setVote(await getOwnVote(uid, sessionId, questionId)) } catch { /* La red o las reglas pueden impedir confirmar el estado. */ }
    } finally {
      setSending(false)
    }
  }

  const pollOpen = state?.pollStatus === 'open' && Boolean(sessionId && questionId)
  const missionComplete = state?.pollStatus === 'revealed' && questionId === 'q6'
  const questionLabel = useMemo(() => `DECISIÓN ${questionIndex + 1} DE ${QUESTION_IDS.length}`, [questionIndex])

  return (
    <main className="live-participant-page">
      <header className="live-participant-header">
        <div><Radio size={17} /><strong>ÚLTIMA SEÑAL</strong></div>
        <span className={`live-connection ${connection}`}><i />{connection === 'connected' ? 'Conectado' : connection === 'error' ? 'Sin conexión' : 'Conectando'}</span>
      </header>

      <section className="live-participant-card">
        <div className="live-event-label"><span>EVENTO EN VIVO</span><small>{EVENT_ID}</small></div>

        {connection === 'connecting' && <div className="live-state-screen"><LoaderCircle className="spin" /><h1>Conectando con la misión</h1><p>Estamos preparando una sesión anónima en este navegador.</p></div>}

        {connection === 'error' && <div className="live-state-screen error"><AlertTriangle /><h1>No pudimos conectar</h1><p>{error}</p><button onClick={() => window.location.reload()}><RefreshCw size={16} /> Reintentar</button></div>}

        {connection === 'connected' && (!state || !sessionId || state.pollStatus === 'waiting') && <div className="live-state-screen"><div className="waiting-signal"><Radio /></div><span>{sessionId ? questionLabel : 'BIENVENIDO A LA MISIÓN'}</span><h1>Esperando la siguiente decisión</h1><p>Sigue la historia en Teams. La pregunta aparecerá aquí cuando el presentador la abra.</p></div>}

        {connection === 'connected' && pollOpen && vote === undefined && <div className="live-state-screen"><LoaderCircle className="spin" /><h1>Comprobando tu participación</h1><p>Verificamos si este navegador ya respondió esta decisión.</p></div>}

        {connection === 'connected' && pollOpen && vote === null && <div className="live-vote-form">
          <div className="live-question-meta"><span>{questionLabel}</span><small>Votación abierta</small></div>
          <h1>{poll.question}</h1>
          <div className="live-options">{poll.options.map((option) => <button key={option.id} className={selected === option.id ? 'selected' : ''} onClick={() => setSelected(option.id)} disabled={sending}><span>{option.id}</span><p>{option.text}</p>{selected === option.id && <Check />}</button>)}</div>
          <button className="live-submit" onClick={() => void submit()} disabled={!selected || sending}>{sending ? <><LoaderCircle className="spin" /> Registrando…</> : `Confirmar opción ${selected ?? ''}`}</button>
          {error && <p className="inline-error"><AlertTriangle size={15} />{error}</p>}
        </div>}

        {connection === 'connected' && pollOpen && vote && <div className="live-state-screen success"><div className="success-mark"><Check /></div><span>VOTO REGISTRADO · {questionLabel}</span><h1>Elegiste la opción {vote.choice}</h1><p>Tu selección no puede modificarse. Sigue la historia en Teams.</p></div>}

        {connection === 'connected' && missionComplete && <div className="live-state-screen success"><div className="success-mark"><Flag /></div><span>MISIÓN COMPLETADA</span><h1>Las seis decisiones quedaron resueltas</h1><p>{vote ? `Tu última elección fue la opción ${vote.choice}. ` : ''}El desenlace se mostrará en la transmisión de Teams.</p></div>}

        {connection === 'connected' && state && !missionComplete && ['closed', 'revealed'].includes(state.pollStatus) && <div className="live-state-screen"><div className="closed-icon"><LockKeyhole /></div><span>{questionLabel}</span><h1>{state.pollStatus === 'revealed' ? 'Resultado registrado' : 'Votación cerrada'}</h1><p>{vote ? `Tu voto por la opción ${vote.choice} quedó registrado.` : 'La votación terminó antes de que se registrara una selección.'} Sigue la historia en Teams.</p></div>}
      </section>

      <footer className="live-privacy"><Cloud size={15} /><p>No solicitamos nombre ni correo. Firebase asigna a este navegador un identificador técnico anónimo; esto no impide votar desde otro dispositivo o una ventana privada.</p></footer>
    </main>
  )
}
