import { QRCodeSVG } from 'qrcode.react'
import { EVENT_ID } from '../firebase/config'

export function JoinByQR({ mode = 'rehearsal', opening = false }: { mode?: 'rehearsal' | 'live'; opening?: boolean }) {
  const eventId = mode === 'live' ? EVENT_ID : 'ensayo-local'
  const url = `${window.location.origin}/participar?evento=${eventId}`
  const visibleUrl = `${window.location.host}/participar`
  return (
    <div className={`join-card ${opening ? 'opening-join' : ''}`}>
      <div className="qr-frame"><QRCodeSVG value={url} size={opening ? 144 : 116} bgColor="#ffffff" fgColor="#0e1118" /></div>
      <div>
        <span className="kicker">{mode === 'live' ? 'ENTRA AHORA · VOTACIÓN ANÓNIMA' : 'VISTA MÓVIL DE ENSAYO'}</span>
        <strong>{opening ? visibleUrl : `/participar?evento=${eventId}`}</strong>
        <p>{mode === 'live' ? 'Escanea o abre el enlace. La primera pregunta aparecerá cuando comience la misión.' : 'El QR abre una maqueta local. No registra ni transmite votos.'}</p>
      </div>
    </div>
  )
}
