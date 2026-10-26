import { BookOpen, X } from 'lucide-react'

export function SpeakerNotes({ note, onClose }: { note: string; onClose: () => void }) {
  return (
    <aside className="speaker-notes" aria-label="Notas del presentador">
      <div className="notes-header"><div><BookOpen size={18} /><span>NOTAS DEL PRESENTADOR</span></div><button onClick={onClose} title="Ocultar notas"><X size={19} /></button></div>
      <p>{note}</p>
      <div className="notes-warning">Oculta este panel antes de compartir la ventana completa en Teams.</div>
    </aside>
  )
}
