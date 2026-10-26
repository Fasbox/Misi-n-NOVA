# Operación Última Señal

Experiencia narrativa interactiva para una presentación en vivo sobre evidencia, autonomía y responsabilidad al utilizar sistemas de IA.

## Estado

- Fase 1: experiencia narrativa completa en **modo ensayo local**.
- Fase 2: conexión Firebase y votación real para la pregunta 1 completadas. Reglas publicadas y flujo presentador-participante validado en vivo.
- Fase 3: seis votaciones, sesiones independientes, decisiones persistentes y desenlace causal completados y validados en vivo de `q1` a `q6`.
- Fase 4: preparación para Cloudflare Pages en curso. La presentación real ya integra historia, controles y resultados en una sola ventana.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Ejecutar en Windows / PowerShell

```powershell
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173/`.

- Presentador real protegido: `http://localhost:5173/presenter`
- Participante real: `http://localhost:5173/participar?evento=operacion-ultima-senal-2026`
- Presentador en ensayo: `http://localhost:5173/presenter?modo=ensayo`
- Participante de maqueta: `http://localhost:5173/participar?evento=ensayo-local`

Para abrir una escena concreta durante una revisión puede usarse `?escena=N`, por ejemplo `/presenter?escena=2` para la comparación de videos.

## Controles

- Flechas izquierda/derecha: cambiar de escena.
- `N`: mostrar u ocultar notas.
- `F`: entrar en modo proyección y ocultar controles/notas.
- Botón de reinicio: borrar el ensayo o cargar una ruta que llega a cada uno de los tres finales.

En una escena de decisión hay que seleccionar A, B o C antes de continuar. Las elecciones pueden cambiarse al retroceder.

## Verificación

```powershell
npm test
npm run test:rules
npm run build
npm run preview
```

El motor narrativo está separado de React en `src/engine/storyEngine.ts`. Las reglas de Firestore están en `firestore.rules` y se prueban contra el emulador oficial.

## Medios

Los videos de apertura, retratos y señales sonoras están en `public/assets/`. La reproducción de video es manual; las señales de votación y revelación pueden silenciarse desde los controles del presentador. Si falta un video, la interfaz muestra un fallback en vez de romper la escena.

## Firebase

La configuración web local se lee desde `.env.local`, que está excluido de Git. Los asistentes reciben una sesión anónima automática: no escriben nombre, correo ni contraseña. El presentador usa la cuenta administrativa creada en Firebase Authentication.

Las reglas se publican con:

```powershell
npx firebase-tools@15.34.1 deploy --only firestore:rules --project nova-98421
```

No publiques reglas globales ni uses modo de prueba.

Cada reinicio de producción crea una ruta nueva bajo `events/{eventId}/sessions/{sessionId}`. No borra sesiones anteriores ni mezcla sus votos. El enlace de participantes permanece estable durante todo el evento.

En producción, `/presenter` recorre la historia completa. Las diapositivas de decisión contienen los controles para abrir, cerrar y revelar la votación, además de los porcentajes en vivo; el presentador no necesita abrir un panel separado.
