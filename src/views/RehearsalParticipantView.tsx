import { useMemo, useState } from 'react'
import { Check, ChevronLeft, CloudOff, LockKeyhole, Radio, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DecisionPanel } from '../components/DecisionPanel'
import { chapters } from '../content/chapters'
import type { Choice } from '../types/story'

type MockState = 'waiting' | 'open' | 'closed'

export function RehearsalParticipantView() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const initialState = params.get('estado')
  const initialQuestion = Number(params.get('pregunta') ?? '1')
  const [state, setState] = useState<MockState>(initialState === 'abierta' ? 'open' : initialState === 'cerrada' ? 'closed' : 'waiting')
  const [questionIndex, setQuestionIndex] = useState(Math.min(5, Math.max(0, initialQuestion - 1)))
  const [selected, setSelected] = useState<Choice>()
  const [confirmed, setConfirmed] = useState(false)
  const chapter = chapters[questionIndex]
  const eventName = params.get('evento') ?? 'ensayo-local'

  const changeQuestion = (index: number) => {
    setQuestionIndex(index)
    setSelected(undefined)
    setConfirmed(false)
  }

  return (
    <main className="participant-page">
      <div className="participant-glow" />
      <header className="participant-header"><div><Radio /><strong>ÚLTIMA SEÑAL</strong></div><span>MODO ENSAYO</span></header>
      <section className="phone-card">
        <div className="mock-notice"><CloudOff size={17} /><div><strong>Vista de ergonomía</strong><span>Nada se envía ni se registra</span></div></div>
        {state === 'waiting' && <div className="participant-state waiting-state"><div className="pulse-ring"><Radio size={30} /></div><span>BIENVENIDO A LA MISIÓN</span><h1>Esperando la siguiente decisión</h1><p>Sigue la historia en Teams. En la fase conectada, esta pantalla se actualizará cuando el presentador abra una votación.</p></div>}
        {state === 'open' && !confirmed && <>
          <div className="mobile-question-meta"><span>DECISIÓN {questionIndex + 1} DE 6</span><small>Simulada</small></div>
          <DecisionPanel poll={chapter.poll} selected={selected} onSelect={setSelected} compact />
          <button className="confirm-vote" disabled={!selected} onClick={() => setConfirmed(true)}>Confirmar opción {selected ?? ''}</button>
          <p className="privacy-copy"><LockKeyhole size={14} /> En producción se usará un identificador técnico anónimo. Esta maqueta no crea ninguno.</p>
        </>}
        {state === 'open' && confirmed && <div className="participant-state confirmed-state"><div className="success-mark"><Check /></div><span>SELECCIÓN LOCAL</span><h1>Opción {selected} registrada en este dispositivo</h1><p>No se transmitió al presentador. En la fase de Firebase, un segundo voto con el mismo identificador quedará bloqueado.</p></div>}
        {state === 'closed' && <div className="participant-state closed-state"><div className="closed-icon"><LockKeyhole /></div><span>DECISIÓN {questionIndex + 1}</span><h1>Votación cerrada</h1><p>Sigue la historia en Teams.</p></div>}
      </section>
      <section className="mock-controls">
        <span>CONTROLES SOLO PARA REVISAR LA MAQUETA</span>
        <div className="state-tabs">{(['waiting', 'open', 'closed'] as MockState[]).map((item) => <button key={item} className={state === item ? 'active' : ''} onClick={() => { setState(item); setConfirmed(false); setSelected(undefined) }}>{item === 'waiting' ? 'Espera' : item === 'open' ? 'Abierta' : 'Cerrada'}</button>)}</div>
        <label>Pregunta de muestra<select value={questionIndex} onChange={(event) => changeQuestion(Number(event.target.value))}>{chapters.map((item, index) => <option key={item.id} value={index}>Decisión {item.number}</option>)}</select></label>
        <button className="clear-local" onClick={() => { setSelected(undefined); setConfirmed(false) }}><RotateCcw size={15} /> Reiniciar selección local</button>
      </section>
      <footer className="participant-footer"><span>Evento: {eventName}</span><Link to="/presenter?modo=ensayo"><ChevronLeft size={15} /> Presentador</Link></footer>
    </main>
  )
}
