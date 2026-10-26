import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const EVENT_ID = (import.meta.env.VITE_FIREBASE_EVENT_ID as string | undefined) || 'operacion-ultima-senal-2026'

export const firebaseConfigured = Object.values(firebaseConfig).every((value) => typeof value === 'string' && value.length > 0)

let participantApp: FirebaseApp | null = null
let presenterApp: FirebaseApp | null = null

if (firebaseConfigured) {
  participantApp = getApps().find((app) => app.name === '[DEFAULT]') ?? initializeApp(firebaseConfig)
  presenterApp = getApps().find((app) => app.name === 'presenter') ?? initializeApp(firebaseConfig, 'presenter')
}

export const participantAuth: Auth | null = participantApp ? getAuth(participantApp) : null
export const participantDb: Firestore | null = participantApp ? getFirestore(participantApp) : null
export const presenterAuth: Auth | null = presenterApp ? getAuth(presenterApp) : null
export const presenterDb: Firestore | null = presenterApp ? getFirestore(presenterApp) : null
