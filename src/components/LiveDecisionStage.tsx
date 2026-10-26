import { BarChart3, Check, CircleAlert, LoaderCircle, LockKeyhole, Play, QrCode, Square, Users } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { chapters } from '../content/chapters'
import type { PollStatus, ResolutionMode, VoteCounts } from '../firebase/types'
import type { Choice } from '../types/story'
import { MissionStatus } from './MissionStatus'

function statusLabel(status: PollStatus) {
  if (status === 'open') return 'VOTACIÓN ABIERTA'
  if (status === 'closed') return 'VOTACIÓN CERRADA'
  if (status === 'revealed') return 'RESULTADO FIJADO'
  return 'LISTA PARA ABRIR'
}

function resolutionLabel(mode: ResolutionMode) {
  if (mode === 'majority') return 'Mayoría directa'
  if (mode === 'tie') return 'Desempate explícito'
  return 'Sin respuestas'
}

const decisionVisuals = [
  { label: 'RASTRO DE SEÑAL', code: 'AUDIO / REGISTROS' },
  { label: 'MAPA DE FUENTES', code: 'ORIGEN / ECO' },
  { label: 'UMBRAL DE CERTEZA', code: 'HIPÓTESIS / INFORME' },
  { label: 'DOCUMENTO INTERVENIDO', code: 'CONTENIDO / INSTRUCCIÓN' },
  { label: 'RUTA NO PREVISTA', code: 'CAPACIDAD / PERMISO' },
  { label: 'RADIO DE DIFUSIÓN', code: 'MENSAJE / ALCANCE' },
] as const

export function LiveDecisionStage({
  chapterIndex,
  status,
  counts,
  resolvedChoice,
  busy,
  active,
  manualChoice,
  candidates,
  resolutionMode,
  participantUrl,
  onManualChoice,
  onOpen,
  onClose,
  onReveal,
}: {
  chapterIndex: number
  status: PollStatus
  counts: VoteCounts
  resolvedChoice?: Choice
  busy: boolean
  active: boolean
  manualChoice?: Choice
  candidates: Choice[]
  resolutionMode: ResolutionMode
  participantUrl: string
  onManualChoice: (choice: Choice) => void
  onOpen: () => void
  onClose: () => void
  onReveal: () => void
}) {
  const chapter = chapters[chapterIndex]
  const poll = chapter.poll
  const total = counts.A + counts.B + counts.C
  const showResults = status !== 'waiting'
  const needsManualChoice = status === 'closed' && candidates.length !== 1
  const winner = resolvedChoice ?? (candidates.length === 1 ? candidates[0] : manualChoice)
  const visual = decisionVisuals[chapterIndex]

  return <main className={`story-stage live-decision-scene decision-theme-${chapter.number}`}>
    <div className="decision-atmosphere" aria-hidden="true"><i /><i /><i /></div>
    <MissionStatus time={chapter.time} chapter={chapter.number} mode="live" />
    <div className="stage-body live-decision-body">
      <div className="live-decision-heading">
        <div><span>DECISIÓN {chapter.number} DE 6 · SESIÓN REAL</span><h1>{poll.question}</h1></div>
        <aside className="decision-scene-meta">
          <div className="decision-signature"><span>{visual.label}</span><strong>{visual.code}</strong></div>
          <div className={`poll-state state-${status}`}>{statusLabel(status)}</div>
        </aside>
      </div>

      <div className="slide-result-list">{poll.options.map((option) => {
        const count = counts[option.id]
        const percentage = total ? Math.round((count / total) * 100) : 0
        const highlighted = resolvedChoice === option.id || (status === 'closed' && manualChoice === option.id)
        return <div className={`slide-result ${highlighted ? 'winner' : ''}`} key={option.id}>
          <span className="option-key">{option.id}</span>
          <p>{option.text}</p>
          <strong>{showResults ? `${percentage}%` : '—'}</strong>
          <div className="result-bar"><i style={{ width: showResults ? `${percentage}%` : '0%' }} /></div>
          <small>{showResults ? `${count} ${count === 1 ? 'voto' : 'votos'}` : 'Esperando apertura'}</small>
        </div>
      })}</div>

      <div className="live-slide-footer">
        <div className="live-slide-total"><Users /><strong>{total}</strong><span>{total === 1 ? 'respuesta' : 'respuestas'}</span></div>
        <div className="live-slide-qr"><div><QRCodeSVG value={participantUrl} size={66} bgColor="#ffffff" fgColor="#0e1118" /></div><span><QrCode /> Escanea una vez<br /><b>/participar</b></span></div>
        <div className="live-slide-action">
          {!active && status !== 'revealed' && <span className="action-note"><LockKeyhole /> Esta no es la decisión activa.</span>}
          {active && status === 'waiting' && <button className="vote-action open" disabled={busy} onClick={onOpen}>{busy ? <LoaderCircle className="spin" /> : <Play />} Abrir votación</button>}
          {active && status === 'open' && <button className="vote-action close" disabled={busy} onClick={onClose}><Square /> Cerrar votación</button>}
          {active && status === 'closed' && <>
            {needsManualChoice && <div className="slide-tie"><span>{total ? 'EMPATE' : 'SIN RESPUESTAS'}</span><div>{candidates.map((choice) => <button key={choice} className={manualChoice === choice ? 'selected' : ''} onClick={() => onManualChoice(choice)}>{choice}</button>)}</div></div>}
            <button className="vote-action reveal" disabled={busy || !winner} onClick={onReveal}><BarChart3 /> Revelar {winner ? `opción ${winner}` : 'resultado'}</button>
          </>}
          {status === 'revealed' && <span className="action-complete"><Check /> Opción {resolvedChoice} registrada · {resolutionLabel(resolutionMode)}</span>}
        </div>
      </div>

      {active && status === 'open' && total === 0 && <div className="live-slide-notice"><CircleAlert /> La votación está abierta. Aún no hay respuestas.</div>}
    </div>
    <div className="stage-corner">VOTACIÓN EN VIVO · RESULTADOS REALES</div>
  </main>
}
