# Arquitectura de la aplicación

## Capas

- `src/content`: personajes, capítulos, diálogos, preguntas, consecuencias, fuentes y escenas.
- `src/engine`: reglas deterministas, hechos acumulados, callbacks y resolución de finales.
- `src/components`: piezas visuales reutilizables de la presentación.
- `src/views`: experiencia del presentador y maqueta móvil del participante.

## Motor narrativo

El historial conserva exactamente una opción `A | B | C` por pregunta. Los indicadores internos son fácticos y no se muestran como puntuación moral:

- `usedExternalRoute`
- `exposedSensitiveInformation`
- `adoptedFalseEvidence`
- `warningDelayed`
- `isolatedDocument`
- `authorityChecked`
- señales auxiliares de fiabilidad, demora y superficie de datos

La prioridad de desenlace es causal:

1. **Límites superados** solo aparece cuando existe exposición sensible o una ruta externa combinada con suficiente superficie de datos.
2. **Mentira documentada** aparece cuando una búsqueda pública no independiente condiciona un producto o documento, sin que ya exista el desenlace de límites.
3. **La verdad llegó después** cubre las rutas restantes y adapta su explicación si la advertencia fue demorada.

Los tres finales tienen rutas precargadas y pruebas unitarias. No se generan combinaciones manuales ni se usa azar.

## Estado y privacidad

El modo ensayo mantiene su estado solamente en memoria y nunca se mezcla con producción. En el modo real, Firestore conserva un documento público de coordinación, una ruta independiente por sesión, una respuesta inmutable por UID/pregunta y decisiones resueltas que solo puede leer el presentador.

La autenticación de participantes es anónima y silenciosa. La aplicación no solicita nombres ni correos; el identificador técnico de Firebase solo se guarda dentro de cada voto para aplicar la regla de una respuesta por UID y pregunta.

## Fuentes editoriales

Las tarjetas separan la ficción ASTER de los casos externos. Los enlaces fueron validados por el presentador. El dato del 33 % se mantiene limitado explícitamente a la auditoría de NewsGuard, sin generalizarlo a todas las respuestas de IA.
