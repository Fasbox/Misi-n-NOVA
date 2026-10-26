import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ListRestart, Radio, X } from 'lucide-react'
import { PresenterControls } from '../components/PresenterControls'
import { SpeakerNotes } from '../components/SpeakerNotes'
import { StoryStage } from '../components/StoryStage'
import { chapters } from '../content/chapters'
import { scenes } from '../content/scenes'
import { PRESET_PATHS } from '../engine/storyEngine'
import type { Choice, DecisionHistory, Scene } from '../types/story'

function notesFor(scene: Scene): string {
  if (scene.kind === 'title') return 'Abre con diez segundos de silencio. Presenta ASTER como ficción y explica que el público decidirá bajo presión, sin respuestas “correctas”. Avanza cuando todos puedan ver la pantalla.'
  if (scene.kind === 'media') return 'Reproduce cada clip manualmente y deja una pausa breve entre ambos. El segundo fue generado con Seedance. Cierra preguntando qué señales visuales dejaron de ser confiables y evita presentar la comparación como una prueba de que toda imagen es falsa.'
  if (scene.kind === 'ending') return 'Lee primero el resultado, después el rastro causal. Cierre: durante esta historia, NOVA tomó decisiones; nosotros elegimos datos, fuentes, alcance y momento. La IA amplifica el alcance de nuestras decisiones, no elimina nuestra responsabilidad.'
  if (scene.kind === 'debrief') return 'Haz una pausa antes de revelar los hechos. Aclara que no estás corrigiendo al público: estás comparando lo que se sabía al decidir con lo que se sabe al final. Recorre las tres tarjetas y cierra preguntando qué control humano habría cambiado más su ruta.'
  return chapters[scene.chapterIndex!].notes[scene.kind as keyof typeof chapters[number]['notes']]
}

export function RehearsalPresenterView() {
  const [sceneIndex, setSceneIndex] = useState(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('escena') ?? '1')
    return Number.isFinite(requested) ? Math.min(scenes.length - 1, Math.max(0, requested - 1)) : 0
  })
  const [history, setHistory] = useState<DecisionHistory>({})
  const [notesOpen, setNotesOpen] = useState(true)
  const [projection, setProjection] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showReset, setShowReset] = useState(false)
  const activeAudio = useRef<HTMLAudioElement | null>(null)
  const scene = scenes[sceneIndex]
  const selectedForScene = scene.kind === 'decision' ? history[chapters[scene.chapterIndex!].poll.id] : undefined
  const canNext = scene.kind !== 'decision' || Boolean(selectedForScene)

  const playCue = useCallback((source: string) => {
    if (!soundEnabled) return
    activeAudio.current?.pause()
    const audio = new Audio(source)
    audio.volume = 0.72
    activeAudio.current = audio
    void audio.play().catch(() => undefined)
  }, [soundEnabled])

  const move = useCallback((direction: 1 | -1) => {
    setSceneIndex((current) => {
      const next = Math.min(scenes.length - 1, Math.max(0, current + direction))
      if (direction === 1 && next !== current) {
        if (scenes[next].kind === 'decision') playCue('/assets/audio/votacion-abierta.wav')
        if (scenes[next].kind === 'aftermath') playCue('/assets/audio/revelacion.mp3')
      }
      return next
    })
  }, [playCue])

  const toggleSound = () => {
    setSoundEnabled((enabled) => {
      if (enabled) activeAudio.current?.pause()
      return !enabled
    })
  }

  const applyPreset = (choices: Choice[]) => {
    setHistory(Object.fromEntries(choices.map((choice, index) => [`q${index + 1}`, choice])))
    setSceneIndex(scenes.findIndex((item) => item.kind === 'ending'))
    setShowReset(false)
  }

  const enterProjection = async () => {
    setProjection(true)
    setNotesOpen(false)
    try { await document.documentElement.requestFullscreen?.() } catch { /* Fullscreen can be browser-blocked. */ }
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A') return
      if (event.key === 'ArrowRight' && canNext) move(1)
      if (event.key === 'ArrowLeft') move(-1)
      if (event.key.toLowerCase() === 'n') setNotesOpen((open) => !open)
      if (event.key.toLowerCase() === 'f') void enterProjection()
      if (event.key === 'Escape') setProjection(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [canNext, move])

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setProjection(false) }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const progress = useMemo(() => ((sceneIndex + 1) / scenes.length) * 100, [sceneIndex])

  return (
    <div className={`presenter-shell ${projection ? 'projection-mode' : ''}`}>
      {!projection && <header className="app-bar">
        <div className="brand"><Radio size={17} /><strong>ÚLTIMA SEÑAL</strong><span>CONTROL DE PRESENTACIÓN</span></div>
        <div className="rehearsal-ribbon">MODO ENSAYO · SIN CONEXIÓN · SIN VOTOS REALES</div>
        <Link to="/participar?evento=ensayo-local" target="_blank">Vista participante</Link>
      </header>}
      <div className={`presentation-grid ${notesOpen && !projection ? 'with-notes' : ''}`}>
        <section className="projection-surface" aria-live="polite">
          <StoryStage scene={scene} history={history} onChoose={(pollId, choice) => setHistory((current) => ({ ...current, [pollId]: choice }))} />
          {!projection && <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>}
        </section>
        {notesOpen && !projection && <SpeakerNotes note={notesFor(scene)} onClose={() => setNotesOpen(false)} />}
      </div>
      {!projection && <PresenterControls current={sceneIndex} total={scenes.length} canNext={canNext} notesOpen={notesOpen} soundEnabled={soundEnabled} onPrevious={() => move(-1)} onNext={() => move(1)} onToggleNotes={() => setNotesOpen((open) => !open)} onToggleSound={toggleSound} onProjection={() => void enterProjection()} onReset={() => setShowReset(true)} onMobile={() => window.open('/participar?evento=ensayo-local', '_blank')} />}
      {projection && <button className="exit-projection" onClick={() => { setProjection(false); void document.exitFullscreen?.() }}><X size={18} /> Salir de proyección</button>}
      {showReset && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowReset(false)}>
          <section className="reset-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-icon"><ListRestart /></div><span className="kicker">CONTROL DE ENSAYO</span><h2 id="reset-title">Restablecer o probar un desenlace</h2>
            <p>Las rutas precargadas son elecciones manuales, no resultados de asistentes.</p>
            <div className="preset-list">{Object.values(PRESET_PATHS).map((preset) => <button key={preset.ending} onClick={() => applyPreset(preset.choices)}><span>FINAL {preset.ending}</span><strong>{preset.label}</strong><ChevronDown /></button>)}</div>
            <button className="reset-all" onClick={() => { setHistory({}); setSceneIndex(0); setShowReset(false) }}>Borrar decisiones y volver al inicio</button>
            <button className="modal-close" onClick={() => setShowReset(false)} aria-label="Cerrar"><X /></button>
          </section>
        </div>
      )}
    </div>
  )
}
