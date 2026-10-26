import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { chapters } from '../content/chapters'
import type { Choice } from '../types/story'
import { EVENT_ID, participantAuth, participantDb, presenterAuth, presenterDb } from './config'
import { QUESTION_IDS, type PublicShowState, type QuestionId, type ResolutionMode, type ResolvedDecision, type VoteCounts, type VoteRecord } from './types'

const statePath = ['events', EVENT_ID, 'state', 'public'] as const

function requireParticipantFirebase() {
  if (!participantAuth || !participantDb) throw new Error('Firebase no está configurado para participantes.')
  return { auth: participantAuth, db: participantDb }
}

function requirePresenterFirebase() {
  if (!presenterAuth || !presenterDb) throw new Error('Firebase no está configurado para el presentador.')
  return { auth: presenterAuth, db: presenterDb }
}

function chapterFor(questionId: QuestionId) {
  const chapter = chapters[QUESTION_IDS.indexOf(questionId)]
  if (!chapter) throw new Error(`Pregunta desconocida: ${questionId}`)
  return chapter
}

function sceneFor(questionId: QuestionId, status: PublicShowState['pollStatus']) {
  const chapter = chapterFor(questionId)
  return `${chapter.id}-${status === 'revealed' ? 'aftermath' : 'decision'}`
}

function newSessionId() {
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const randomPart = crypto.randomUUID().slice(0, 8)
  return `sesion-${timestamp}-${randomPart}`
}

export async function ensureAnonymousParticipant(): Promise<User> {
  const { auth } = requireParticipantFirebase()
  await setPersistence(auth, browserLocalPersistence)
  if (auth.currentUser?.isAnonymous) return auth.currentUser
  if (auth.currentUser) await signOut(auth)
  return (await signInAnonymously(auth)).user
}

export function observePresenterAuth(callback: (user: User | null) => void): Unsubscribe {
  const { auth } = requirePresenterFirebase()
  return onAuthStateChanged(auth, callback)
}

export async function signInPresenter(email: string, password: string): Promise<User> {
  const { auth, db } = requirePresenterFirebase()
  await setPersistence(auth, browserSessionPersistence)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const adminSnapshot = await getDoc(doc(db, 'admins', credential.user.uid))
  if (!adminSnapshot.exists() || adminSnapshot.data().active !== true || adminSnapshot.data().role !== 'presenter') {
    await signOut(auth)
    throw new Error('La cuenta existe, pero no está autorizada como presentador.')
  }
  return credential.user
}

export async function signOutPresenter() {
  const { auth } = requirePresenterFirebase()
  await signOut(auth)
}

export async function verifyPresenter(user: User): Promise<boolean> {
  const { db } = requirePresenterFirebase()
  const snapshot = await getDoc(doc(db, 'admins', user.uid))
  return snapshot.exists() && snapshot.data().active === true && snapshot.data().role === 'presenter'
}

export function subscribePublicState(
  context: 'participant' | 'presenter',
  onValue: (state: PublicShowState | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const db = context === 'participant' ? requireParticipantFirebase().db : requirePresenterFirebase().db
  return onSnapshot(doc(db, ...statePath), (snapshot) => {
    onValue(snapshot.exists() ? snapshot.data() as PublicShowState : null)
  }, onError)
}

export async function getOwnVote(uid: string, sessionId: string, questionId: QuestionId): Promise<VoteRecord | null> {
  const { db } = requireParticipantFirebase()
  const snapshot = await getDoc(doc(db, 'events', EVENT_ID, 'sessions', sessionId, 'votes', questionId, 'responses', uid))
  return snapshot.exists() ? snapshot.data() as VoteRecord : null
}

export async function castVote(uid: string, sessionId: string, questionId: QuestionId, choice: Choice): Promise<void> {
  const { db } = requireParticipantFirebase()
  await setDoc(doc(db, 'events', EVENT_ID, 'sessions', sessionId, 'votes', questionId, 'responses', uid), {
    uid,
    choice,
    createdAt: serverTimestamp(),
  })
}

export function subscribeVotes(
  sessionId: string,
  questionId: QuestionId,
  onValue: (votes: VoteRecord[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requirePresenterFirebase()
  return onSnapshot(collection(db, 'events', EVENT_ID, 'sessions', sessionId, 'votes', questionId, 'responses'), (snapshot) => {
    onValue(snapshot.docs.map((vote) => vote.data() as VoteRecord))
  }, onError)
}

export function subscribeDecisions(
  sessionId: string,
  onValue: (decisions: ResolvedDecision[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const { db } = requirePresenterFirebase()
  return onSnapshot(collection(db, 'events', EVENT_ID, 'sessions', sessionId, 'decisions'), (snapshot) => {
    const decisions = snapshot.docs.map((decision) => decision.data() as ResolvedDecision)
    decisions.sort((a, b) => QUESTION_IDS.indexOf(a.questionId) - QUESTION_IDS.indexOf(b.questionId))
    onValue(decisions)
  }, onError)
}

async function writeState(state: Omit<PublicShowState, 'updatedAt'>) {
  const { db } = requirePresenterFirebase()
  await setDoc(doc(db, ...statePath), { ...state, updatedAt: serverTimestamp() })
}

export async function initializeEvent(): Promise<string> {
  const { db } = requirePresenterFirebase()
  const sessionId = newSessionId()
  const questionId: QuestionId = 'q1'
  const batch = writeBatch(db)
  batch.set(doc(db, 'events', EVENT_ID, 'sessions', sessionId), {
    sessionId,
    createdAt: serverTimestamp(),
  })
  batch.set(doc(db, ...statePath), {
    sessionId,
    activeSceneId: sceneFor(questionId, 'waiting'),
    activeQuestionId: questionId,
    pollStatus: 'waiting',
    resolvedChoice: '',
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
  return sessionId
}

export async function setPollStatus(sessionId: string, questionId: QuestionId, status: 'open' | 'closed') {
  await writeState({
    sessionId,
    activeSceneId: sceneFor(questionId, status),
    activeQuestionId: questionId,
    pollStatus: status,
    resolvedChoice: '',
  })
}

export async function resolvePoll(
  sessionId: string,
  questionId: QuestionId,
  choice: Choice,
  counts: VoteCounts,
  resolutionMode: ResolutionMode,
  tiedChoices: Choice[],
) {
  const { db } = requirePresenterFirebase()
  const batch = writeBatch(db)
  const totalVotes = counts.A + counts.B + counts.C
  batch.set(doc(db, 'events', EVENT_ID, 'sessions', sessionId, 'decisions', questionId), {
    questionId,
    choice,
    counts,
    totalVotes,
    resolutionMode,
    tiedChoices,
    resolvedAt: serverTimestamp(),
  })
  batch.set(doc(db, ...statePath), {
    sessionId,
    activeSceneId: sceneFor(questionId, 'revealed'),
    activeQuestionId: questionId,
    pollStatus: 'revealed',
    resolvedChoice: choice,
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
}

export async function advanceToQuestion(sessionId: string, questionId: QuestionId) {
  await writeState({
    sessionId,
    activeSceneId: sceneFor(questionId, 'waiting'),
    activeQuestionId: questionId,
    pollStatus: 'waiting',
    resolvedChoice: '',
  })
}
