# Despliegue — Fase 4

## Arquitectura de publicación

- Código: repositorio GitHub conectado a Cloudflare Pages.
- Build: `npm run build`.
- Directorio publicado: `dist`.
- Rama de producción: `main`.
- Runtime: sitio estático; no hay servidor, Functions ni servicios de pago.
- Rutas SPA: Cloudflare Pages sirve `index.html` para `/presenter` y `/participar` al no existir un `404.html` superior.

## Variables de compilación

Cloudflare debe recibir estos nombres con los mismos valores de `.env.local`:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_EVENT_ID
```

No se configura ninguna contraseña, credencial administrativa, token de Firebase CLI ni archivo `.env.local` en GitHub.

## Firebase después del primer despliegue

Cuando Cloudflare entregue el dominio real `*.pages.dev`, se añade solo el nombre de host en:

```text
Firebase Console → Authentication → Settings → Authorized domains → Add domain
```

Después se comprueban directamente las rutas `/presenter` y `/participar?evento=operacion-ultima-senal-2026`.

## Estado

Preparación local completada y rama `main` publicada en:

```text
https://github.com/Fasbox/Misi-n-NOVA
```

Pendientes: conexión de Cloudflare, variables, primer despliegue, validación del dominio en Firebase si fuera necesaria y ensayo desde otro dispositivo.
