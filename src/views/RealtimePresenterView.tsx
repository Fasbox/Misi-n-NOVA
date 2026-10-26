import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CircleAlert, ExternalLink, ListRestart, LoaderCircle, LockKeyhole, LogOut, Radio, X } from 'lucide-react'
import type { User } from 'firebase/auth'
import { LiveDecisionStage } from '../components/LiveDecisionStage'
import { PresenterControls } from '../components/PresenterControls'
import { SpeakerNotes } from '../components/SpeakerNotes'
import { StoryStage } from '../components/StoryStage'
import { chapters } from '../content/chapters'
import { scenes } from '../content/scenes'
import { EVENT_ID, firebaseConfigured } from '../firebase/config'
import { advanceToQuestion, initializeEvent, observePresenterAuth, resolvePoll, setPollStatus, signInPresenter, signOutPresenter, subscribeDecisions, subscribePublicState, subscribeVotes, verifyPresenter } from '../firebase/showService'
import { QUESTION_IDS, type PollStatus, type PublicShowState, type QuestionId, type ResolutionMode, type ResolvedDecision, type VoteCounts, type VoteRecord } from '../firebase/types'
import type { Choice, DecisionHistory, Scene } from '../types/story'

const ALL_CHOICES: Choice[] = ['A', 'B', 'C']
const EMPTY_COUNTS: VoteCounts = { A: 0, B: 0, C: 0 }

function describeError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code.includes('invalid-credential')) return 'Correo o contraseña incorrectos.'
  if (code.includes('permission-denied')) return 'Firebase rechazó la operación. Comprueba el rol del presentador y las reglas publicadas.'
  if (code.includes('network-request-failed') || code.includes('unavailable')) return 'Firebase no está disponible. Comprueba la conexión.'
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
}

function notesFor(scene: Scene): string {
  if (scene.kind === 'title') return 'Abre con diez segundos de silencio. Explica que el público decidirá desde un único enlace y que los porcentajes aparecerán en esta misma presentación.'
  if (scene.kind === 'media') return 'Reproduce cada clip manualmente y deja una pausa breve. El segundo fue generado con Seedance. Evita presentar la comparación como prueba de que toda imagen es falsa.'
  if (scene.kind === 'ending') return 'Lee primero el desenlace y después el rastro causal. Cierre: la IA amplifica el alcance de nuestras decisiones, no elimina nuestra responsabilidad.'
  if (scene.kind === 'debrief') return 'Presenta primero la verdad del incidente y después conecta las tres tarjetas con las decisiones reales del público. No hables de aciertos o errores: destaca los costes visibles y pregunta qué control humano habría cambiado más la ruta.'
  if (scene.kind === 'decision') return 'Abre la votación desde la propia diapositiva. Observa las barras en vivo, cierra cuando haya suficiente participación y revela la mayoría. Si hay empate, resuélvelo de forma explícita.'
  return chapters[scene.chapterIndex!].notes[scene.kind as keyof typeof chapters[number]['notes']]
}

function validQuestionId(value: unknown): value is QuestionId {
  return typeof value === 'string' && QUESTION_IDS.includes(value as QuestionId)
}

function questionForScene(scene: Scene): QuestionId | undefined {
  return scene.chapterIndex === undefined ? undefined : QUESTION_IDS[scene.chapterIndex]
}

function AdminLogin({ onAuthenticated }: { onAuthenticated: (user: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(undefined)
    try { onAuthenticated(await signInPresenter(email.trim(), password)) }
    catch (loginError) { setError(describeError(loginError)) }
    finally { setLoading(false) }
  }

  return <main className="admin-login-page">
    <section className="admin-login-panel">
      <div className="admin-login-brand"><Radio /><span>OPERACIÓN ÚLTIMA SEÑAL</span></div>
      <div className="admin-login-icon"><LockKeyhole /></div>
      <span className="kicker">ACCESO DEL PRESENTADOR</span>
      <h1>Control de la sesión</h1>
      <p>Después de entrar tendrás la historia y las votaciones en una sola presentación.</p>
      <form onSubmit={(event) => void submit(event)}>
        <label>Correo administrativo<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Contraseña<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button disabled={loading}>{loading ? <><LoaderCircle className="spin" /> Verificando…</> : 'Entrar a la presentación'}</button>
      </form>
      {error && <div className="admin-error"><CircleAlert />{error}</div>}
      <a href="/presenter?modo=ensayo">Abrir modo ensayo sin Firebase <ExternalLink size={14} /></a>
    </section>
  </main>
}

export function RealtimePresenterView() {
  const [user, setUser] = useState<User | null>()
  const [authorized, setAuthorized] = useState(false)
  const [state, setState] = useState<PublicShowState | null>()
  const [votes, setVotes] = useState<VoteRecord[]>([])
  const [decisions, setDecisions] = useState<ResolvedDecision[]>([])
  const [sceneIndex, setSceneIndex] = useState(0)
  const [notesOpen, setNotesOpen] = useState(true)
  const [projection, setProjection] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [manualChoice, setManualChoice] = useState<Choice>()
  const [showReset, setShowReset] = useState(false)
  const hydratedScene = useRef(false)
  const activeAudio = useRef<HTMLAudioElement | null>(null)

  const sessionId = typeof state?.sessionId === 'string' ? state.sessionId : undefined
  const activeQuestionId = validQuestionId(state?.activeQuestionId) ? state.activeQuestionId : undefined
  const scene = scenes[sceneIndex]
  const sceneQuestionId = questionForScene(scene)
  const sceneDecision = sceneQuestionId ? decisions.find((decision) => decision.questionId === sceneQuestionId) : undefined
  const history = useMemo<DecisionHistory>(() => Object.fromEntries(decisions.map((decision) => [decision.questionId, decision.choice])), [decisions])
  const participantUrl = `${window.location.origin}/participar?evento=${EVENT_ID}`

  useEffect(() => {
    if (!firebaseConfigured) { setUser(null); return }
    return observePresenterAuth((nextUser) => {
      if (!nextUser) { setUser(null); setAuthorized(false); return }
      void verifyPresenter(nextUser).then((isAdmin) => {
        setAuthorized(isAdmin)
        setUser(isAdmin ? nextUser : null)
      }).catch(() => { setAuthorized(false); setUser(null) })
    })
  }, [])

  useEffect(() => {
    if (!user || !authorized) return
    return subscribePublicState('presenter', setState, (nextError) => setError(describeError(nextError)))
  }, [user, authorized])

  useEffect(() => {
    setVotes([])
    setManualChoice(undefined)
    if (!user || !authorized || !sessionId || !activeQuestionId) return
    return subscribeVotes(sessionId, activeQuestionId, setVotes, (nextError) => setError(describeError(nextError)))
  }, [user, authorized, sessionId, activeQuestionId])

  useEffect(() => {
    setDecisions([])
    if (!user || !authorized || !sessionId) return
    return subscribeDecisions(sessionId, setDecisions, (nextError) => setError(describeError(nextError)))
  }, [user, authorized, sessionId])

  useEffect(() => {
    if (!state || !sessionId || hydratedScene.current) return
    const resumeIndex = scenes.findIndex((item) => item.id === state.activeSceneId)
    if (resumeIndex >= 0) setSceneIndex(resumeIndex)
    hydratedScene.current = true
  }, [state, sessionId])

  const liveCounts = useMemo<VoteCounts>(() => ({
    A: votes.filter((vote) => vote.choice === 'A').length,
    B: votes.filter((vote) => vote.choice === 'B').length,
    C: votes.filter((vote) => vote.choice === 'C').length,
  }), [votes])
  const displayedCounts = sceneDecision?.counts ?? (sceneQuestionId === activeQuestionId ? liveCounts : EMPTY_COUNTS)
  const displayedTotal = displayedCounts.A + displayedCounts.B + displayedCounts.C
  const maxVotes = Math.max(displayedCounts.A, displayedCounts.B, displayedCounts.C)
  const leaders = ALL_CHOICES.filter((choice) => maxVotes > 0 && displayedCounts[choice] === maxVotes)
  const candidates = displayedTotal === 0 ? ALL_CHOICES : leaders
  const winner = candidates.length === 1 ? candidates[0] : manualChoice
  const resolutionMode: ResolutionMode = displayedTotal === 0 ? 'no-votes' : leaders.length > 1 ? 'tie' : 'majority'
  const displayStatus: PollStatus = sceneDecision ? 'revealed' : sceneQuestionId === activeQuestionId ? state?.pollStatus ?? 'waiting' : 'waiting'
  const activeDecision = scene.kind === 'decision' && sceneQuestionId === activeQuestionId && !sceneDecision
  const canNext = scene.kind !== 'decision' || Boolean(sceneDecision)
  const progress = ((sceneIndex + 1) / scenes.length) * 100

  const playCue = useCallback((source: string) => {
    if (!soundEnabled) return
    activeAudio.current?.pause()
    const audio = new Audio(source)
    audio.volume = 0.72
    activeAudio.current = audio
    void audio.play().catch(() => undefined)
  }, [soundEnabled])

  const perform = async <T,>(operation: () => Promise<T>): Promise<T | null> => {
    setBusy(true)
    setError(undefined)
    try { return await operation() }
    catch (operationError) { setError(describeError(operationError)); return null }
    finally { setBusy(false) }
  }

  const moveNext = useCallback(async () => {
    if (!canNext || sceneIndex >= scenes.length - 1 || !sessionId) return
    const nextIndex = sceneIndex + 1
    const nextScene = scenes[nextIndex]
    if (nextScene.kind === 'briefing' && nextScene.chapterIndex !== undefined) {
      const nextQuestionId = QUESTION_IDS[nextScene.chapterIndex]
      const previousQuestionId = QUESTION_IDS[nextScene.chapterIndex - 1]
      const previousResolved = !previousQuestionId || decisions.some((decision) => decision.questionId === previousQuestionId)
      if (previousResolved && activeQuestionId !== nextQuestionId) {
        const advanced = await perform(() => advanceToQuestion(sessionId, nextQuestionId))
        if (advanced === null) return
      }
    }
    if (nextScene.kind === 'decision') playCue('/assets/audio/votacion-abierta.wav')
    setSceneIndex(nextIndex)
  }, [activeQuestionId, canNext, decisions, playCue, sceneIndex, sessionId])

  const revealCurrent = async () => {
    if (!sessionId || !sceneQuestionId || !winner) return
    const tiedChoices = resolutionMode === 'tie' ? leaders : []
    const resolved = await perform(() => resolvePoll(sessionId, sceneQuestionId, winner, displayedCounts, resolutionMode, tiedChoices))
    if (resolved === null) return
    setDecisions((current) => current.some((item) => item.questionId === sceneQuestionId) ? current : [...current, {
      questionId: sceneQuestionId,
      choice: winner,
      counts: displayedCounts,
      totalVotes: displayedTotal,
      resolutionMode,
      tiedChoices,
    }])
    playCue('/assets/audio/revelacion.mp3')
    setSceneIndex((current) => Math.min(scenes.length - 1, current + 1))
  }

  const startFreshSession = async () => {
    hydratedScene.current = true
    const created = await perform(initializeEvent)
    if (typeof created === 'string') {
      setSceneIndex(0)
      setDecisions([])
      setVotes([])
      setShowReset(false)
    }
  }

  const enterProjection = async () => {
    setProjection(true)
    setNotesOpen(false)
    try { await document.documentElement.requestFullscreen?.() } catch { /* El navegador puede bloquear pantalla completa. */ }
  }

  const toggleSound = () => {
    setSoundEnabled((enabled) => {
      if (enabled) activeAudio.current?.pause()
      return !enabled
    })
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (['BUTTON', 'A', 'INPUT'].includes(target.tagName)) return
      if (event.key === 'ArrowRight' && canNext) void moveNext()
      if (event.key === 'ArrowLeft') setSceneIndex((current) => Math.max(0, current - 1))
      if (event.key.toLowerCase() === 'n') setNotesOpen((open) => !open)
      if (event.key.toLowerCase() === 'f') void enterProjection()
      if (event.key === 'Escape') setProjection(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canNext, moveNext])

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setProjection(false) }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  if (!firebaseConfigured) return <AdminLogin onAuthenticated={setUser} />
  if (user === undefined) return <main className="admin-loading"><LoaderCircle className="spin" /><span>Verificando sesión administrativa…</span></main>
  if (!user) return <AdminLogin onAuthenticated={(nextUser) => { setUser(nextUser); setAuthorized(true) }} />
  if (state === undefined) return <main className="admin-loading"><LoaderCircle className="spin" /><span>Recuperando el estado de la presentación…</span></main>

  if (!sessionId) return <main className="live-deck-setup">
    <section><div className="admin-login-brand"><Radio /><span>OPERACIÓN ÚLTIMA SEÑAL</span></div><span className="kicker">PRESENTACIÓN EN VIVO</span><h1>Una historia.<br />Una sola ventana.</h1><p>Prepara una sesión para recorrer la narrativa completa y controlar las seis votaciones dentro de sus propias diapositivas.</p><button disabled={busy} onClick={() => void startFreshSession()}>{busy ? <LoaderCircle className="spin" /> : <Radio />} Preparar presentación</button><a href="/presenter?modo=ensayo">Volver al ensayo local</a></section>
  </main>

  return <div className={`presenter-shell live-story-shell ${projection ? 'projection-mode' : ''}`}>
    {!projection && <header className="app-bar live-story-bar">
      <div className="brand"><Radio size={17} /><strong>ÚLTIMA SEÑAL</strong><span>PRESENTACIÓN + VOTACIÓN</span></div>
      <div className="live-story-ribbon"><i /> EN VIVO · {decisions.length}/6 DECISIONES</div>
      <button className="signout-control" onClick={() => void signOutPresenter()}><LogOut /> Salir</button>
    </header>}

    <div className={`presentation-grid ${notesOpen && !projection ? 'with-notes' : ''}`}>
      <section className="projection-surface" aria-live="polite">
        {scene.kind === 'decision' && scene.chapterIndex !== undefined ? <LiveDecisionStage
          chapterIndex={scene.chapterIndex}
          status={displayStatus}
          counts={displayedCounts}
          resolvedChoice={sceneDecision?.choice ?? (sceneQuestionId === activeQuestionId && state?.pollStatus === 'revealed' ? state.resolvedChoice || undefined : undefined)}
          busy={busy}
          active={activeDecision}
          manualChoice={manualChoice}
          candidates={candidates}
          resolutionMode={sceneDecision?.resolutionMode ?? resolutionMode}
          participantUrl={participantUrl}
          onManualChoice={setManualChoice}
          onOpen={() => sceneQuestionId && void perform(() => setPollStatus(sessionId, sceneQuestionId, 'open'))}
          onClose={() => sceneQuestionId && void perform(() => setPollStatus(sessionId, sceneQuestionId, 'closed'))}
          onReveal={() => void revealCurrent()}
        /> : <StoryStage scene={scene} history={history} mode="live" onChoose={() => undefined} />}
        {!projection && <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>}
      </section>
      {notesOpen && !projection && <SpeakerNotes note={notesFor(scene)} onClose={() => setNotesOpen(false)} />}
    </div>

    {!projection && <PresenterControls current={sceneIndex} total={scenes.length} canNext={canNext} notesOpen={notesOpen} soundEnabled={soundEnabled} onPrevious={() => setSceneIndex((current) => Math.max(0, current - 1))} onNext={() => void moveNext()} onToggleNotes={() => setNotesOpen((open) => !open)} onToggleSound={toggleSound} onProjection={() => void enterProjection()} onReset={() => setShowReset(true)} onMobile={() => window.open(participantUrl, '_blank')} />}
    {projection && <button className="exit-projection" onClick={() => { setProjection(false); void document.exitFullscreen?.() }}><X size={18} /> Salir de proyección</button>}
    {error && <div className="live-error-toast"><CircleAlert />{error}<button onClick={() => setError(undefined)}><X /></button></div>}

    {showReset && <div className="modal-backdrop" role="presentation" onClick={() => setShowReset(false)}>
      <section className="reset-modal live-reset-modal" role="dialog" aria-modal="true" aria-labelledby="live-reset-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-icon"><ListRestart /></div><span className="kicker">NUEVA SESIÓN REAL</span><h2 id="live-reset-title">¿Reiniciar toda la presentación?</h2>
        <p>Volverás a la portada y se creará una sesión sin votos. Los datos actuales permanecerán conservados en Firestore, pero no se mezclarán con el nuevo recorrido.</p>
        <div className="reset-warning"><CircleAlert /> Los móviles conectados volverán inmediatamente al estado de espera.</div>
        <button className="reset-all" disabled={busy} onClick={() => void startFreshSession()}>{busy ? 'Creando sesión…' : 'Sí, crear sesión y volver al inicio'}</button>
        <button className="modal-close" onClick={() => setShowReset(false)} aria-label="Cerrar"><X /></button>
      </section>
    </div>}
  </div>
}
