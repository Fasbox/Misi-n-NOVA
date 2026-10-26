import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore'
import { readFileSync } from 'node:fs'

const projectId = 'demo-nova-rules'
const eventId = 'operacion-ultima-senal-2026'
const sessionId = 'sesion-20261025-abcdef12'
const otherSessionId = 'sesion-20261025-fedcba98'
let environment: RulesTestEnvironment

const stateDoc = (db: Firestore) => doc(db, 'events', eventId, 'state', 'public')
const sessionDoc = (db: Firestore, id = sessionId) => doc(db, 'events', eventId, 'sessions', id)
const voteDoc = (db: Firestore, uid: string, questionId = 'q1', activeSessionId = sessionId) => doc(db, 'events', eventId, 'sessions', activeSessionId, 'votes', questionId, 'responses', uid)
const decisionDoc = (db: Firestore, questionId = 'q1') => doc(db, 'events', eventId, 'sessions', sessionId, 'decisions', questionId)

function stateData(status: 'waiting' | 'open' | 'closed' | 'revealed' = 'open', questionId = 'q1', activeSessionId = sessionId) {
  return {
    sessionId: activeSessionId,
    activeSceneId: status === 'revealed' ? 'first-concession-aftermath' : 'first-concession-decision',
    activeQuestionId: questionId,
    pollStatus: status,
    resolvedChoice: status === 'revealed' ? 'A' : '',
    updatedAt: new Date(),
  }
}

function validDecision(questionId = 'q1') {
  return {
    questionId,
    choice: 'A',
    counts: { A: 2, B: 1, C: 0 },
    totalVotes: 3,
    resolutionMode: 'majority',
    tiedChoices: [],
    resolvedAt: serverTimestamp(),
  }
}

async function seedState(status: 'waiting' | 'open' | 'closed' | 'revealed' = 'open', questionId = 'q1', activeSessionId = sessionId) {
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    await setDoc(stateDoc(db), stateData(status, questionId, activeSessionId))
    await setDoc(sessionDoc(db, activeSessionId), { sessionId: activeSessionId, createdAt: new Date() })
    await setDoc(doc(db, 'admins', 'admin-1'), { active: true, role: 'presenter' })
  })
}

describe('reglas de Firestore para seis votaciones', () => {
  beforeAll(async () => {
    environment = await initializeTestEnvironment({
      projectId,
      firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
    })
  })

  beforeEach(async () => {
    await environment.clearFirestore()
    await seedState('open')
  })

  afterAll(async () => environment.cleanup())

  it('rechaza a usuarios no autenticados', async () => {
    const db = environment.unauthenticatedContext().firestore()
    await assertFails(getDoc(stateDoc(db)))
    await assertFails(setDoc(voteDoc(db, 'nadie'), { uid: 'nadie', choice: 'A', createdAt: serverTimestamp() }))
  })

  it('permite que un anónimo cree solamente su propio voto válido durante la apertura', async () => {
    const db = environment.authenticatedContext('anon-1', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    await assertSucceeds(setDoc(voteDoc(db, 'anon-1'), { uid: 'anon-1', choice: 'B', createdAt: serverTimestamp() }))
    await assertSucceeds(getDoc(voteDoc(db, 'anon-1')))
  })

  it('admite cualquiera de las seis preguntas cuando es la activa', async () => {
    await seedState('open', 'q6')
    const db = environment.authenticatedContext('anon-6', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    await assertSucceeds(setDoc(voteDoc(db, 'anon-6', 'q6'), { uid: 'anon-6', choice: 'C', createdAt: serverTimestamp() }))
  })

  it('bloquea segundo voto, opción inválida y voto en identidad ajena', async () => {
    const db = environment.authenticatedContext('anon-1', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    await assertSucceeds(setDoc(voteDoc(db, 'anon-1'), { uid: 'anon-1', choice: 'A', createdAt: serverTimestamp() }))
    await assertFails(setDoc(voteDoc(db, 'anon-1'), { uid: 'anon-1', choice: 'C', createdAt: serverTimestamp() }))
    await assertFails(deleteDoc(voteDoc(db, 'anon-1')))
    await assertFails(setDoc(voteDoc(db, 'anon-2'), { uid: 'anon-2', choice: 'A', createdAt: serverTimestamp() }))
    await assertFails(setDoc(voteDoc(db, 'anon-1', 'q2'), { uid: 'anon-1', choice: 'D', createdAt: serverTimestamp() }))
  })

  it('bloquea votos cerrados, preguntas inactivas y sesiones anteriores', async () => {
    const db = environment.authenticatedContext('anon-closed', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    await assertFails(setDoc(voteDoc(db, 'anon-closed', 'q2'), { uid: 'anon-closed', choice: 'A', createdAt: serverTimestamp() }))
    await assertFails(setDoc(voteDoc(db, 'anon-closed', 'q1', otherSessionId), { uid: 'anon-closed', choice: 'A', createdAt: serverTimestamp() }))
    await seedState('closed')
    await assertFails(setDoc(voteDoc(db, 'anon-closed'), { uid: 'anon-closed', choice: 'A', createdAt: serverTimestamp() }))
  })

  it('impide leer o listar votos ajenos', async () => {
    await environment.withSecurityRulesDisabled(async (context) => {
      await setDoc(voteDoc(context.firestore(), 'anon-2'), { uid: 'anon-2', choice: 'C', createdAt: new Date() })
    })
    const db = environment.authenticatedContext('anon-1', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    await assertFails(getDoc(voteDoc(db, 'anon-2')))
    await assertFails(getDocs(collection(db, 'events', eventId, 'sessions', sessionId, 'votes', 'q1', 'responses')))
  })

  it('impide que un participante controle el evento, cree sesiones o escriba decisiones', async () => {
    const db = environment.authenticatedContext('anon-1', { firebase: { sign_in_provider: 'anonymous' } }).firestore()
    await assertFails(setDoc(stateDoc(db), { ...stateData('open'), updatedAt: serverTimestamp() }))
    await assertFails(setDoc(sessionDoc(db, otherSessionId), { sessionId: otherSessionId, createdAt: serverTimestamp() }))
    await assertFails(setDoc(decisionDoc(db), validDecision()))
    await assertFails(getDoc(decisionDoc(db)))
    await assertFails(setDoc(doc(db, 'admins', 'anon-1'), { active: true, role: 'presenter' }))
  })

  it('permite al administrador crear una sesión, controlar q1–q6 y registrar decisiones', async () => {
    const db = environment.authenticatedContext('admin-1', { firebase: { sign_in_provider: 'password' } }).firestore()
    await assertSucceeds(setDoc(sessionDoc(db, otherSessionId), { sessionId: otherSessionId, createdAt: serverTimestamp() }))
    await assertSucceeds(setDoc(stateDoc(db), { ...stateData('waiting', 'q6', otherSessionId), updatedAt: serverTimestamp() }))
    await assertSucceeds(setDoc(decisionDoc(db), validDecision()))
    const decisions = await assertSucceeds(getDocs(collection(db, 'events', eventId, 'sessions', sessionId, 'decisions')))
    expect(decisions.size).toBe(1)
  })

  it('conserva decisiones y sesiones como registros inmutables', async () => {
    const db = environment.authenticatedContext('admin-1', { firebase: { sign_in_provider: 'password' } }).firestore()
    await assertSucceeds(setDoc(decisionDoc(db), validDecision()))
    await assertFails(setDoc(decisionDoc(db), { ...validDecision(), choice: 'B' }))
    await assertFails(deleteDoc(decisionDoc(db)))
    await assertFails(deleteDoc(sessionDoc(db)))
  })
})
