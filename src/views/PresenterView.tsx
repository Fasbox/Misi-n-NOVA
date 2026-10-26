import { RehearsalPresenterView } from './RehearsalPresenterView'
import { RealtimePresenterView } from './RealtimePresenterView'

export function PresenterView() {
  const rehearsal = new URLSearchParams(window.location.search).get('modo') === 'ensayo'
  return rehearsal ? <RehearsalPresenterView /> : <RealtimePresenterView />
}
