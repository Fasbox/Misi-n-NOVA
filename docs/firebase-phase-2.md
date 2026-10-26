# Firebase — Fase 2

> Estado: completada y validada contra el proyecto `nova-98421` el 25 de octubre de 2026.

## Separación de modos

| Ruta | Uso | Persistencia |
|---|---|---|
| `/presenter` | Control real protegido por correo/contraseña y documento `admins/{uid}` | Firestore |
| `/participar?evento=operacion-ultima-senal-2026` | Participación real con autenticación anónima silenciosa | Firestore |
| `/presenter?modo=ensayo` | Historia completa con decisiones manuales | Memoria local |
| `/participar?evento=ensayo-local` | Maqueta móvil | Memoria local |

Las aplicaciones Firebase de participante y presentador usan instancias de Auth separadas. Esto permite probar ambos roles en ventanas del mismo navegador sin convertir accidentalmente al presentador en participante.

## Datos de la pregunta 1

```text
/events/operacion-ultima-senal-2026/state/public
/events/operacion-ultima-senal-2026/votes/q1/responses/{uid}
/admins/{uid}
```

El estado público contiene la escena, la pregunta activa, `waiting|open|closed|revealed`, la opción resuelta y la hora de actualización. Cada voto contiene solamente `uid`, `choice` y `createdAt`.

## Propiedades de seguridad

- Sin autenticación no se puede leer el estado ni votar.
- El participante se autentica automáticamente de forma anónima.
- Solo puede crear el documento cuyo ID coincide con su UID.
- Solo puede votar A, B o C durante `q1` abierta.
- No puede actualizar ni borrar el voto.
- No puede listar votos o leer los de otra persona.
- No puede cambiar el estado ni crear un administrador.
- Solo una cuenta no anónima con `/admins/{uid}` activo puede controlar el evento y listar respuestas.

## Comprobación de reglas

```powershell
npm run test:rules
```

La prueba arranca Firestore Emulator, carga `firestore.rules`, ejecuta siete escenarios y apaga el emulador automáticamente.

## Validación en vivo

- Reglas compiladas y publicadas en `cloud.firestore`.
- Inicio de sesión del presentador verificado.
- Sesión anónima del participante verificada sin pedir datos personales.
- Voto registrado y resultado actualizado en tiempo real en el panel del presentador.
