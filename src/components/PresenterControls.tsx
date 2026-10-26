import { ChevronLeft, ChevronRight, Maximize2, NotebookTabs, RotateCcw, Smartphone, Volume2, VolumeX } from 'lucide-react'

export function PresenterControls({
  current, total, canNext, notesOpen, soundEnabled, onPrevious, onNext, onToggleNotes, onToggleSound, onProjection, onReset, onMobile,
}: {
  current: number; total: number; canNext: boolean; notesOpen: boolean; soundEnabled: boolean
  onPrevious: () => void; onNext: () => void; onToggleNotes: () => void; onToggleSound: () => void; onProjection: () => void; onReset: () => void; onMobile: () => void
}) {
  return (
    <nav className="presenter-controls" aria-label="Controles de presentación">
      <button onClick={onPrevious} disabled={current === 0} title="Escena anterior (←)"><ChevronLeft /></button>
      <span className="scene-counter">{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <button className="next-control" onClick={onNext} disabled={!canNext || current === total - 1}>Siguiente <ChevronRight /></button>
      <span className="control-divider" />
      <button className={notesOpen ? 'active' : ''} onClick={onToggleNotes} title="Notas del presentador (N)"><NotebookTabs /></button>
      <button className={soundEnabled ? 'active' : ''} onClick={onToggleSound} title={soundEnabled ? 'Silenciar señales' : 'Activar señales'}>{soundEnabled ? <Volume2 /> : <VolumeX />}</button>
      <button onClick={onMobile} title="Abrir vista participante"><Smartphone /></button>
      <button onClick={onProjection} title="Modo proyección (F)"><Maximize2 /></button>
      <button onClick={onReset} title="Restablecer ensayo"><RotateCcw /></button>
    </nav>
  )
}
