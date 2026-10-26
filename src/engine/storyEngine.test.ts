import { describe, expect, it } from 'vitest'
import { calculateFacts, PRESET_PATHS, resolveOutcome } from './storyEngine'
import type { DecisionHistory } from '../types/story'

function history(choices: ('A' | 'B' | 'C')[]): DecisionHistory {
  return Object.fromEntries(choices.map((choice, index) => [`q${index + 1}`, choice]))
}

describe('motor narrativo', () => {
  it('hace alcanzables los tres finales mediante rutas plausibles', () => {
    const outcomes = Object.values(PRESET_PATHS).map((preset) => resolveOutcome(history(preset.choices)).ending)
    expect(new Set(outcomes)).toEqual(new Set(['truth-late', 'documented-lie', 'limits-crossed']))
  })

  it('no afirma exposición sensible solo por elegir una opción de mayor alcance', () => {
    const facts = calculateFacts(history(['A', 'B', 'B', 'B', 'A', 'A']))
    expect(facts.exposedSensitiveInformation).toBe(false)
    expect(facts.usedExternalRoute).toBe(false)
  })

  it('vincula el final de límites con una cadena causal', () => {
    const outcome = resolveOutcome(history(['A', 'B', 'A', 'B', 'C', 'C']))
    expect(outcome.ending).toBe('limits-crossed')
    expect(outcome.facts.usedExternalRoute).toBe(true)
    expect(outcome.facts.exposedSensitiveInformation).toBe(true)
  })

  it('detecta adopción de evidencia falsa solo cuando la búsqueda pública condiciona un producto o documento', () => {
    expect(calculateFacts(history(['C', 'A', 'C', 'A', 'B', 'A'])).adoptedFalseEvidence).toBe(true)
    expect(calculateFacts(history(['C', 'A', 'B', 'B', 'B', 'A'])).adoptedFalseEvidence).toBe(false)
  })
})
