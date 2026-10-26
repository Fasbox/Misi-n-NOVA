import { ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import type { CaseStudy as CaseStudyType } from '../types/story'

export function CaseStudy({ study }: { study: CaseStudyType }) {
  const isExternal = study.url !== '#'
  return (
    <section className="case-card">
      <div className="case-topline">
        <span className="case-eyebrow">{study.eyebrow}</span>
        <span className={`verification ${study.verification}`}>
          {study.verification === 'verificada' ? <CheckCircle2 size={15} /> : <ShieldAlert size={15} />}
          {study.verification === 'verificada' ? 'Fuente revisada' : 'Revisión editorial pendiente'}
        </span>
      </div>
      <h2>{study.title}</h2>
      <div className="source-line"><strong>{study.source}</strong><span>{study.date}</span></div>
      <p className="case-summary">{study.summary}</p>
      <div className="takeaway"><span>CONEXIÓN CON ASTER</span><p>{study.takeaway}</p></div>
      {isExternal && <div className="source-links">
        <a className="source-link" href={study.url} target="_blank" rel="noreferrer">Abrir fuente original <ArrowUpRight size={18} /></a>
        {study.secondaryUrl && <a className="source-link" href={study.secondaryUrl} target="_blank" rel="noreferrer">{study.secondaryLabel ?? 'Abrir fuente complementaria'} <ArrowUpRight size={18} /></a>}
      </div>}
    </section>
  )
}
