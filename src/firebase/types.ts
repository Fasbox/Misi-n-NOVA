import type { Choice } from '../types/story'

export type PollStatus = 'waiting' | 'open' | 'closed' | 'revealed'
export type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'
export type ResolutionMode = 'majority' | 'tie' | 'no-votes'

export const QUESTION_IDS: QuestionId[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

export interface PublicShowState {
  sessionId: string
  activeSceneId: string
  activeQuestionId: QuestionId
  pollStatus: PollStatus
  resolvedChoice: Choice | ''
  updatedAt?: unknown
}

export interface VoteRecord {
  uid: string
  choice: Choice
  createdAt?: unknown
}

export interface VoteCounts {
  A: number
  B: number
  C: number
}

export interface ResolvedDecision {
  questionId: QuestionId
  choice: Choice
  counts: VoteCounts
  totalVotes: number
  resolutionMode: ResolutionMode
  tiedChoices: Choice[]
  resolvedAt?: unknown
}

export type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'error'
