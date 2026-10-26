# Firebase — Fase 3

## Estado

Completada y validada contra el proyecto `nova-98421` el 25 de octubre de 2026.

## Modelo por sesión

```text
/events/{eventId}/state/public
/events/{eventId}/sessions/{sessionId}
/events/{eventId}/sessions/{sessionId}/votes/{questionId}/responses/{uid}
/events/{eventId}/sessions/{sessionId}/decisions/{questionId}
```

El estado público solo contiene la sesión activa, la pregunta activa, su estado, la escena visible y la opción revelada. Los participantes no pueden leer decisiones, listar votos ni descubrir escenas futuras mediante Firestore.

Cada reinicio crea un `sessionId` nuevo. Las sesiones anteriores quedan conservadas, pero sus votos están fuera de la ruta activa y no participan en los nuevos porcentajes.

## Secuencia operativa

1. El presentador crea una sesión nueva.
2. Prepara y abre `q1`.
3. Los móviles reciben la pregunta automáticamente y crean un único voto inmutable.
4. El presentador cierra la pregunta.
5. Una mayoría única queda seleccionada automáticamente. Si hay empate —o no hubo respuestas— el presentador debe elegir explícitamente y la modalidad queda registrada.
6. Al revelar, Firestore guarda los conteos, la resolución y la decisión; la interfaz muestra la consecuencia y las reacciones.
7. El presentador avanza manualmente a la siguiente pregunta.
8. Tras `q6`, el motor calcula el desenlace a partir de las seis decisiones persistidas y muestra el rastro causal.

## Reinicio seguro

«Reiniciar con una sesión nueva» requiere confirmación. No ejecuta eliminaciones: cambia el estado público a un identificador nuevo, por lo que todos los participantes conectados vuelven a espera y las respuestas anteriores permanecen separadas.

## Seguridad validada

```powershell
npm run test:rules
```

Las nueve pruebas cubren usuarios sin autenticar, las seis preguntas, segundo voto, opciones inválidas, identidad ajena, preguntas cerradas, sesiones anteriores, lectura de votos ajenos, control administrativo, decisiones persistentes y prohibición de borrado o sobrescritura.

## Validación manual completada

- Inicio de sesión del presentador correcto.
- Sesión nueva creada sin reutilizar votos de la fase 2.
- Recorrido real de `q1` a `q6` con participante autenticado anónimamente.
- Cambio automático de pregunta en el móvil confirmado.
- Consecuencias, callbacks, trazabilidad `6/6` y desenlace final confirmados.
- Reinicio mediante un identificador de sesión nuevo confirmado.
