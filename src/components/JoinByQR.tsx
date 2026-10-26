import { QRCodeSVG } from 'qrcode.react'

export function JoinByQR() {
  const url = `${window.location.origin}/participar?evento=ensayo-local`
  return (
    <div className="join-card">
      <div className="qr-frame"><QRCodeSVG value={url} size={116} bgColor="#ffffff" fgColor="#0e1118" /></div>
      <div><span className="kicker">VISTA MÓVIL DE ENSAYO</span><strong>/participar?evento=ensayo-local</strong><p>El QR abre una maqueta local. No registra ni transmite votos.</p></div>
    </div>
  )
}
