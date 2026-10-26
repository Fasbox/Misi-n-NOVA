import { useState } from 'react'
import { AlertTriangle, ArrowRight, Clapperboard, Database, Eye, FileAudio, FileSearch2, MessageSquare, Play, RadioTower, ShieldCheck, TimerReset } from 'lucide-react'
import { chapters } from '../content/chapters'
import { buildDebrief, callbackForChapter, getDecisionRecords, resolveOutcome } from '../engine/storyEngine'
import type { Choice, DecisionHistory, Scene } from '../types/story'
import { CaseStudy } from './CaseStudy'
import { CharacterMessage } from './CharacterMessage'
import { DecisionPanel } from './DecisionPanel'
import { EvidenceReveal } from './EvidenceReveal'
import { IncidentAudio } from './IncidentAudio'
import { JoinByQR } from './JoinByQR'
import { MissionStatus } from './MissionStatus'

export function StoryStage({ scene, history, onChoose, mode = 'rehearsal' }: { scene: Scene; history: DecisionHistory; onChoose: (pollId: string, choice: Choice) => void; mode?: 'rehearsal' | 'live' }) {
  if (scene.kind === 'title') return <TitleScene mode={mode} />
  if (scene.kind === 'media') return <MediaScene mode={mode} />
  if (scene.kind === 'ending') return <EndingScene history={history} mode={mode} />
  if (scene.kind === 'debrief') return <DebriefScene history={history} mode={mode} />

  const chapter = chapters[scene.chapterIndex!]
  const selected = history[chapter.poll.id]
  const callback = callbackForChapter(scene.chapterIndex!, history)

  return (
    <main className={`story-stage scene-${scene.kind}`}>
      <MissionStatus time={chapter.time} chapter={chapter.number} mode={mode} />
      <div className="stage-body">
        {scene.kind === 'briefing' && chapter.number === 1 && <IncidentAudio setup={chapter.setup} evidence={chapter.evidence} />}
        {scene.kind === 'briefing' && chapter.number !== 1 && (
          <>
            <div className="chapter-heading"><span>CAPÍTULO {String(chapter.number).padStart(2, '0')}</span><h1>{chapter.title}</h1></div>
            {callback && <div className="callback-banner"><TimerReset size={18} /><div><span>HUELLA DE LA DECISIÓN ANTERIOR</span><p>{callback}</p></div></div>}
            <p className="setup-copy">{chapter.setup}</p>
            <div className="evidence-grid">{chapter.evidence.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
          </>
        )}
        {scene.kind === 'dialogue' && (
          <>
            <div className="section-heading"><span>ANTES DE DECIDIR</span><h1>Tres voces. Ninguna tiene la imagen completa.</h1></div>
            <div className="dialogue-stack">{chapter.dialogue.map((line) => <CharacterMessage key={`${line.character}-${line.text}`} line={line} />)}</div>
          </>
        )}
        {scene.kind === 'decision' && <DecisionPanel poll={chapter.poll} selected={selected} onSelect={(choice) => onChoose(chapter.poll.id, choice)} />}
        {scene.kind === 'aftermath' && selected && (
          <>
            <div className="result-heading"><span className="option-key large">{selected}</span><div><span>{mode === 'live' ? 'RESULTADO REAL DE LA VOTACIÓN' : 'RESULTADO MANUAL DEL ENSAYO'}</span><h1>La decisión deja una huella</h1></div></div>
            <div className="consequence-card"><AlertTriangle size={24} /><p>{chapter.poll.options.find((option) => option.id === selected)!.consequence}</p></div>
            {chapter.number === 4 && <EvidenceReveal />}
            <div className="reaction-grid">{chapter.poll.options.find((option) => option.id === selected)!.reactions.map((line) => <CharacterMessage key={`${line.character}-${line.text}`} line={line} compact />)}</div>
          </>
        )}
        {scene.kind === 'case-study' && <CaseStudy study={chapter.caseStudy} />}
      </div>
      <div className="stage-corner">SIMULACIÓN FICTICIA · ASTER</div>
    </main>
  )
}

function TitleScene({ mode }: { mode: 'rehearsal' | 'live' }) {
  return (
    <main className="story-stage title-scene">
      <MissionStatus time="08:17" mode={mode} />
      <div className="title-grid">
        <div className="title-copy">
          <span className="hero-kicker"><RadioTower size={17} /> UNA EXPERIENCIA INTERACTIVA SOBRE IA Y RESPONSABILIDAD</span>
          <h1>LA MISIÓN QUE<br />LA IA <em>NO DEBÍA</em><br />CUMPLIR</h1>
          <div className="title-rule" />
          <p>Operación Última Señal</p>
          <small>ASTER · LUNES · 08:17</small>
        </div>
        <div className="signal-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="nova-core">NOVA<span>EN ESPERA</span></div></div>
      </div>
      <div className="opening-footer"><span>SIMULACIÓN FICTICIA</span><p>Las decisiones serán defendibles. Sus efectos, persistentes.</p><ArrowRight /></div>
    </main>
  )
}

function MediaScene({ mode }: { mode: 'rehearsal' | 'live' }) {
  return (
    <main className="story-stage media-scene">
      <MissionStatus time="00:00" mode={mode} />
      <div className="stage-body">
        <div className="section-heading"><span>PRÓLOGO · 00—04 MIN</span><h1>¿Cuándo dejó de bastar con mirar?</h1><p>Dos videos generados con IA. Tres años de distancia. Una misma pregunta sobre la evidencia.</p></div>
        <div className="media-compare">
          <MediaVideo year="2023" source="/assets/video/apertura-ia-2023.mp4" detail="Primera generación · referencia histórica" />
          <div className="versus">VS</div>
          <MediaVideo year="2026" source="/assets/video/apertura-ia-2026.mp4" detail="Generado con Seedance" />
        </div>
        <div className="media-prompt"><Eye size={20} /><p>Si la calidad visual mejora más rápido que nuestra capacidad de verificar, ¿qué señales seguiremos usando?</p></div>
        <a className="editorial-reference" href="https://www.techradar.com/ai-platforms-assistants/chatgpt/will-smith-eating-spaghetti-was-peak-ai-chaos-in-2023-now-it-shows-how-fast-the-tech-has-evolved" target="_blank" rel="noreferrer">Referencia editorial para verificar la comparación · TechRadar <ArrowRight size={16} /></a>
      </div>
    </main>
  )
}

function MediaVideo({ year, source, detail }: { year: string; source: string; detail: string }) {
  const [failed, setFailed] = useState(false)
  return <figure className="media-video">
    <div className="video-frame">
      {failed ? <div className="media-placeholder"><Clapperboard size={36} /><strong>Video no disponible</strong><small>Comprueba el archivo local</small></div> : <video controls playsInline preload="metadata" onError={() => setFailed(true)} aria-label={`Video generado con IA de ${year}`}><source src={source} type="video/mp4" /></video>}
      {!failed && <div className="video-play-hint"><Play size={13} fill="currentColor" /> REPRODUCCIÓN MANUAL</div>}
    </div>
    <figcaption><span>{year}</span><strong>{detail}</strong></figcaption>
  </figure>
}

function EndingScene({ history, mode }: { history: DecisionHistory; mode: 'rehearsal' | 'live' }) {
  const outcome = resolveOutcome(history)
  const records = getDecisionRecords(history)
  return (
    <main className={`story-stage ending-scene ending-${outcome.ending}`}>
      <MissionStatus time="09:00" mode={mode} />
      <div className="ending-layout">
        <section className="ending-main">
          <span className="hero-kicker"><ShieldCheck size={17} /> DESENLACE DETERMINADO POR 6 DECISIONES</span>
          <p className="ending-code">FINAL {outcome.ending === 'truth-late' ? 'A' : outcome.ending === 'documented-lie' ? 'B' : 'C'}</p>
          <h1>{outcome.title}</h1>
          <p className="ending-summary">{outcome.summary}</p>
          <div className="ending-learning"><span>LO QUE DEJA ESTA RUTA</span><p>{outcome.learning}</p></div>
          <blockquote>“La inteligencia artificial puede ayudarte a tomar decisiones. Lo que no deberías hacer es entregarle también la responsabilidad de decidir por ti”.</blockquote>
        </section>
        <aside className="decision-log">
          <span className="kicker">{mode === 'live' ? 'TRAZABILIDAD DE LA SESIÓN REAL' : 'REGISTRO INTERNO DEL PRESENTADOR'}</span>
          <h2>Rastro de decisiones</h2>
          <div className="log-list">{records.map((record) => <div key={record.questionId}><span>{record.chapter}</span><strong>{record.choice}</strong><p>{record.consequence}</p></div>)}</div>
          <div className="rationale"><span>POR QUÉ ESTE FINAL</span>{outcome.rationale.map((item) => <p key={item}>{item}</p>)}</div>
        </aside>
      </div>
      <div className="mission-complete"><FileAudio size={18} /><p><strong>MISIÓN FINALIZADA.</strong> Objetivo: investigar el incidente y preparar una respuesta. Resultado: entregado. La evaluación del cumplimiento no sustituye la revisión de los medios ni de sus consecuencias.</p></div>
    </main>
  )
}

const debriefIcons = {
  evidence: FileSearch2,
  permissions: Database,
  communication: MessageSquare,
}

function DebriefScene({ history, mode }: { history: DecisionHistory; mode: 'rehearsal' | 'live' }) {
  const debrief = buildDebrief(history)
  const outcome = resolveOutcome(history)

  return (
    <main className="story-stage debrief-scene">
      <MissionStatus time="09:02" mode={mode} />
      <div className="debrief-body">
        <header className="debrief-heading">
          <span className="hero-kicker"><ShieldCheck size={17} /> CONCLUSIÓN · DESPUÉS DE DECIDIR</span>
          <h1>¿Qué aprendimos realmente?</h1>
          <p>No hubo una opción perfecta. Hubo decisiones sobre evidencia, permisos y comunicación que cambiaron el resultado.</p>
        </header>

        <section className="truth-reveal" aria-labelledby="truth-title">
          <div><span>LA VERDAD DEL INCIDENTE</span><h2 id="truth-title">Hechos que ya podemos separar del ruido</h2></div>
          <ol>{debrief.incidentFacts.map((fact, index) => <li key={fact}><span>0{index + 1}</span><p>{fact}</p></li>)}</ol>
        </section>

        <section className="learning-grid" aria-label="Aprendizajes de la ruta elegida">
          {debrief.insights.map((insight) => {
            const Icon = debriefIcons[insight.id]
            return <article key={insight.id} className={`learning-card learning-${insight.id}`}>
              <div><Icon /><span>{insight.title}</span></div>
              <p>{insight.route}</p>
              <footer><strong>PARA LLEVAR</strong>{insight.principle}</footer>
            </article>
          })}
        </section>

        <div className="debrief-close">
          <span>FINAL {outcome.ending === 'truth-late' ? 'A' : outcome.ending === 'documented-lie' ? 'B' : 'C'} · {outcome.title}</span>
          <p>La IA amplificó la ruta elegida. La responsabilidad permaneció en quienes definieron <strong>qué investigar, con qué datos, hasta dónde actuar y cuándo comunicar.</strong></p>
        </div>
      </div>
      <div className="stage-corner">SIMULACIÓN FICTICIA · DEBRIEF</div>
    </main>
  )
}

export function LobbyCard() {
  return <JoinByQR />
}
