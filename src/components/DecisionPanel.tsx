import { Check, Circle } from 'lucide-react'
import type { Choice, Poll } from '../types/story'

export function DecisionPanel({ poll, selected, onSelect, compact = false }: { poll: Poll; selected?: Choice; onSelect: (choice: Choice) => void; compact?: boolean }) {
  return (
    <section className={`decision-panel ${compact ? 'compact' : ''}`}>
      <div className="decision-heading">
        <span className="kicker">DECISIÓN {poll.id.replace('q', '')}</span>
        <span className="manual-label">SELECCIÓN MANUAL · SIN VOTOS REALES</span>
      </div>
      <h2>{poll.question}</h2>
      <div className="options-grid">
        {poll.options.map((option) => (
          <button key={option.id} className={`option-card ${selected === option.id ? 'selected' : ''}`} onClick={() => onSelect(option.id)} aria-pressed={selected === option.id}>
            <span className="option-key">{option.id}</span>
            <span className="option-copy">{option.text}</span>
            {selected === option.id ? <Check size={22} /> : <Circle size={20} />}
          </button>
        ))}
      </div>
    </section>
  )
}
