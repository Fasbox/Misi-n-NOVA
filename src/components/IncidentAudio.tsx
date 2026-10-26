import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, AudioLines, Check, Pause, Play, RadioTower } from 'lucide-react'

const AUDIO_SOURCE = '/assets/audio/audio-directora-simulado.wav'

function formatTime(value: number, roundUp = false) {
  if (!Number.isFinite(value)) return '00:00'
  const seconds = Math.max(0, roundUp ? Math.ceil(value) : Math.floor(value))
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

const waveform = [22, 42, 28, 68, 38, 78, 54, 30, 72, 46, 88, 62, 36, 76, 48, 28, 64, 84, 44, 70, 34, 58, 80, 40, 66, 30, 74, 52, 86, 46, 62, 26, 70, 38, 82, 56, 32, 68, 44, 76, 36, 60, 84, 48, 72, 30, 64, 42]

export function IncidentAudio({ setup, evidence }: { setup: string; evidence: string[] }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(10.92)
  const [completed, setCompleted] = useState(false)
  const [failed, setFailed] = useState(false)
  const progress = Math.min(100, duration ? (currentTime / duration) * 100 : 0)

  const findings = useMemo(() => [
    { threshold: 0, label: 'CANAL', value: 'Reenvío informal', tone: 'neutral' },
    { threshold: 1.4, label: 'IDENTIDAD', value: 'Atribuida, no autenticada', tone: 'warning' },
    { threshold: 4.4, label: 'AFIRMACIÓN', value: 'Posible exposición de datos', tone: 'warning' },
    { threshold: 8.2, label: 'ESTADO', value: 'Evidencia insuficiente', tone: 'teal' },
  ], [])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio || failed) return
    if (audio.ended) {
      audio.currentTime = 0
      setCompleted(false)
    }
    if (audio.paused) {
      try { await audio.play() } catch { setFailed(true) }
    } else {
      audio.pause()
    }
  }

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const next = (Number(event.target.value) / 100) * duration
    audioRef.current.currentTime = next
    setCurrentTime(next)
  }

  useEffect(() => () => audioRef.current?.pause(), [])

  return (
    <section className={`incident-opening ${playing ? 'is-playing' : ''} ${completed ? 'is-complete' : ''}`}>
      <audio
        ref={audioRef}
        src={AUDIO_SOURCE}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCompleted(true) }}
        onError={() => setFailed(true)}
      />

      <div className="incoming-header">
        <div className="incoming-tag"><RadioTower size={16} /><span>SEÑAL ENTRANTE · 08:20:07</span></div>
        <div className="fiction-tag">AUDIO FICTICIO</div>
      </div>

      <div className="incident-title-row">
        <div>
          <span className="kicker">CAPÍTULO 01 · LA PRIMERA CONCESIÓN</span>
          <h1>El mensaje que lo<br />cambia todo.</h1>
        </div>
        <div className={`signal-beacon ${playing ? 'active' : ''}`} aria-hidden="true">
          <span /><span /><span />
          <AudioLines />
        </div>
      </div>

      <div className="audio-console">
        <div className="audio-primary">
          <div className="audio-source-meta">
            <div><span>VOZ ATRIBUIDA A</span><strong>Dirección general de ASTER</strong></div>
            <div className={`audio-live-state ${playing ? 'live' : ''}`}><i />{playing ? 'REPRODUCIENDO' : completed ? 'REPRODUCCIÓN COMPLETA' : 'EN ESPERA'}</div>
          </div>

          <div className="waveform" aria-hidden="true">
            <div className="waveform-progress" style={{ width: `${progress}%` }} />
            {waveform.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${(index % 9) * 55}ms` }} />)}
            {playing && <div className="waveform-scanner" style={{ left: `${progress}%` }} />}
          </div>

          <div className="audio-controls">
            <button className="audio-play" onClick={() => void togglePlayback()} disabled={failed} aria-label={playing ? 'Pausar audio' : 'Reproducir audio'}>
              {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <span>{formatTime(currentTime)}</span>
            <input aria-label="Posición del audio" type="range" min="0" max="100" step="0.1" value={progress} onChange={seek} />
            <span>{formatTime(duration, true)}</span>
          </div>
          {failed && <div className="audio-error"><AlertTriangle size={16} /> No se pudo cargar el audio local. Comprueba el archivo.</div>}
        </div>

        <aside className="signal-findings">
          <span className="findings-title">LECTURA DE CONTEXTO</span>
          {findings.map((finding) => {
            const visible = currentTime >= finding.threshold || completed
            return <div className={`finding ${visible ? 'visible' : ''} tone-${finding.tone}`} key={finding.label}>
              <div>{visible ? <Check size={13} /> : <span />}</div>
              <p><small>{finding.label}</small><strong>{visible ? finding.value : 'Analizando…'}</strong></p>
            </div>
          })}
          <small className="narrative-disclaimer">Visualización narrativa sincronizada. No representa un análisis forense del archivo.</small>
        </aside>
      </div>

      <div className={`incident-context ${completed ? 'revealed' : ''}`}>
        <p>{setup}</p>
        <div>{evidence.map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}</div>
      </div>
    </section>
  )
}
