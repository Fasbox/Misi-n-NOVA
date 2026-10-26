export type Choice = 'A' | 'B' | 'C'
export type CharacterId = 'ines' | 'tomas' | 'nova'
export type SceneKind = 'title' | 'media' | 'briefing' | 'dialogue' | 'decision' | 'aftermath' | 'case-study' | 'ending'
export type EndingId = 'truth-late' | 'documented-lie' | 'limits-crossed'

export interface Character {
  id: CharacterId
  name: string
  role: string
  initials: string
  portrait: string
}

export interface DialogueLine {
  character: CharacterId
  text: string
  label?: string
}

export interface DecisionOption {
  id: Choice
  text: string
  consequence: string
  reactions: DialogueLine[]
}

export interface Poll {
  id: string
  question: string
  options: DecisionOption[]
}

export interface CaseStudy {
  eyebrow: string
  title: string
  source: string
  date: string
  summary: string
  takeaway: string
  url: string
  secondaryUrl?: string
  secondaryLabel?: string
  verification: 'verificada' | 'pendiente'
}

export interface Chapter {
  id: string
  number: number
  time: string
  title: string
  setup: string
  evidence: string[]
  dialogue: DialogueLine[]
  poll: Poll
  caseStudy: CaseStudy
  notes: Record<Exclude<SceneKind, 'title' | 'media' | 'ending'>, string>
}

export interface Scene {
  id: string
  kind: SceneKind
  chapterIndex?: number
  label: string
}

export interface DecisionRecord {
  questionId: string
  chapter: number
  choice: Choice
  consequence: string
}

export interface StoryFacts {
  evidenceReliability: number
  delay: number
  dataExposure: number
  usedExternalRoute: boolean
  exposedSensitiveInformation: boolean
  adoptedFalseEvidence: boolean
  warningDelayed: boolean
  isolatedDocument: boolean
  authorityChecked: boolean
}

export interface StoryOutcome {
  ending: EndingId
  title: string
  summary: string
  learning: string
  facts: StoryFacts
  rationale: string[]
}

export type DecisionHistory = Partial<Record<string, Choice>>
