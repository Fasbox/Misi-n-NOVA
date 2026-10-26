import { firebaseConfigured } from '../firebase/config'
import { RealtimeParticipantView } from './RealtimeParticipantView'
import { RehearsalParticipantView } from './RehearsalParticipantView'

export function ParticipantView() {
  const eventId = new URLSearchParams(window.location.search).get('evento')
  const rehearsal = eventId === 'ensayo-local' || !firebaseConfigured
  return rehearsal ? <RehearsalParticipantView /> : <RealtimeParticipantView />
}
