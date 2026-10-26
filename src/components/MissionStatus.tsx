import { Clock3, Radio, Wifi, WifiOff } from 'lucide-react'

export function MissionStatus({ time, chapter, minimal = false, mode = 'rehearsal' }: { time: string; chapter?: number; minimal?: boolean; mode?: 'rehearsal' | 'live' }) {
  return (
    <div className={`mission-status ${minimal ? 'minimal' : ''}`}>
      <div><Radio size={16} /><span>OPERACIÓN ÚLTIMA SEÑAL</span></div>
      {!minimal && mode === 'rehearsal' && <div className="offline-chip"><WifiOff size={14} /> Local · sin Firebase</div>}
      {!minimal && mode === 'live' && <div className="live-chip"><Wifi size={14} /> Firebase · en vivo</div>}
      {chapter && <div><span>CAP. {String(chapter).padStart(2, '0')}</span></div>}
      <div><Clock3 size={15} /><time>{time}</time></div>
    </div>
  )
}
