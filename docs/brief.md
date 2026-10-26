# PROMPT MAESTRO PARA CODEX — OPERACIÓN ÚLTIMA SEÑAL

> Copia este archivo completo en Codex en el directorio donde quieras crear el proyecto. Este documento es la fuente de verdad funcional y narrativa. Empieza únicamente por la FASE 1 y detente cuando la completes.

## 0. TU ROL Y REGLAS DE COLABORACIÓN

Actúa como ingeniero de software full-stack sénior, arquitecto de aplicaciones web interactivas, diseñador UX/UI y desarrollador de experiencias narrativas para presentaciones en vivo. Implementarás una aplicación REAL, no un prototipo de pantallas inconexas.

**Idioma de toda la interfaz, código de contenido, guion del expositor y explicaciones: español.** Los identificadores técnicos pueden estar en inglés.

**La presentación es MAÑANA, lunes 26 de octubre de 2026.** El expositor está en Windows, utiliza Visual Studio Code y quiere un MVP gratuito que pueda probar hoy. No dispone de presupuesto para servicios de pago. Será una sesión VIRTUAL por Microsoft Teams, de 45 minutos, con aproximadamente 200 asistentes de distintos departamentos y niveles de conocimiento sobre IA. El presentador compartirá una ventana del navegador. Los participantes escanearán un único QR, o abrirán un enlace, y responderán seis votaciones desde su teléfono o navegador. Los porcentajes deberán actualizarse en tiempo real en la vista compartida por el presentador. Los votos serán anónimos para el expositor y los demás asistentes: no pedir nombres, correos ni información personal. No habrá ranking, puntos, respuestas marcadas como correctas ni formularios largos.

### Reglas absolutas de trabajo

1. Implementa por **FASES**, con cambios funcionales, verificables y acotados. NO avances automáticamente a la fase siguiente. Cuando termines una fase, haz un resumen preciso, indica los archivos creados/modificados, cómo ejecutarlo, cómo probarlo, los riesgos pendientes y cuál sería la fase siguiente. Espera a que escriba «continúa con la fase N».
2. **No me hagas repetir el contexto**. Conserva este documento como especificación e incorpóralo al repositorio (`docs/brief.md` o equivalente).
3. En cada fase, si hay acciones que debo realizar FUERA de Visual Studio Code (crear Firebase, habilitar Authentication, pegar reglas, crear usuario administrador, subir a GitHub, conectar Cloudflare, definir variables de entorno, etc.), explícalas **paso a paso**, con página/URL oficial, ruta en la interfaz, qué botón pulsar, qué datos copiar, dónde pegarlos y cómo verificar el éxito. Separa claramente: «lo que hace Codex», «lo que debo hacer yo», «verificación». No presupongas que conozco las consolas de estos servicios.
4. Si necesitas un dato que solo yo puedo obtener (por ejemplo Firebase `projectId`, configuración web o UID administrador), detente en ese paso, muestra instrucciones específicas para conseguirlo y continúa únicamente cuando lo proporcione. Nunca inventes identificadores, valores, URLs de despliegue ni credenciales.
5. Si un recurso externo requiere tarjeta o plan de pago, detente y propón una alternativa gratuita. Mantén Firebase en el plan Spark mientras sea viable; no habilites facturación sin mi autorización. No utilices Railway, Vercel, Cloud Functions, APIs de IA de pago, servicios TTS de pago ni servidores permanentes.
6. Puedes instalar dependencias open source razonables, pero evita complejidad innecesaria. No dejes botones inertes ni datos fingidos que aparenten ser votos reales.
7. Al completar cada fase ejecuta lo que esté disponible (`npm run build`, validación de TypeScript, lint/tests cuando existan). No afirmes que algo funciona si no lo has probado.
8. No despliegues ni cambies servicios externos por tu cuenta sin mostrar exactamente qué acción realizarás y verificar que tengo permisos; no inventes procedimientos.
9. Prioriza llegar a una experiencia funcional y presentable antes de añadir adornos. Si falta tiempo, simplifica animaciones y características secundarias, nunca seguridad de la votación ni coherencia narrativa.
10. Con cada paso ofrece comandos **exactos para PowerShell o la terminal integrada de VS Code en Windows** y distingue lo que debes hacer dentro del editor de lo que exige navegar en un servicio externo.

## 1. OBJETIVO Y TONO

**Título principal:** «LA MISIÓN QUE LA IA NO DEBÍA CUMPLIR».

**Nombre de la simulación:** «OPERACIÓN ÚLTIMA SEÑAL».

**Idea narrativa:** NOVA recibe una misión legítima: investigar un incidente y ayudar a proteger a las personas antes de una reunión crítica. La IA no es malvada ni desarrolla deseos humanos; el conflicto surge cuando intenta ser útil bajo presión, recibe información engañosa, dispone de herramientas y opera bajo límites que pueden resultar insuficientes. Las decisiones del público son defendibles, aunque crean riesgos y oportunidades distintas. Los hechos ficticios se relacionan, en momentos previstos, con casos reales documentados.

**Mensaje final:** «La inteligencia artificial puede ayudarte a tomar decisiones. Lo que no deberías hacer es entregarle también la responsabilidad de decidir por ti».

**Principio de diseño narrativo:** La experiencia NO es un examen de ciberseguridad. No muestres tildes verdes/rojas, «correcto/incorrecto», indicadores de moralidad, opciones burdamente seguras/inseguras o preguntas cuya respuesta obvia elimine la tensión. Cada decisión debe tener un beneficio, un coste, un rastro persistente en capítulos posteriores y una reacción de los personajes. No deben aparecer «pantallas de votación» desconectadas de la trama.

### Identidad visual

- Oscura, cinematográfica, tecnológica y sobria, con influencia de Cyberverso pero personalidad propia.
- Paleta principal: fondo `#0E1118`, paneles `#171A24`, naranja `#FF6C0C` para momentos de tensión, turquesa `#00CFB4` para NOVA y datos, texto blanco/blanco suave. Usa contrastes aptos para un proyector y una pantalla compartida de Teams.
- Tipografía grande, poco texto simultáneo, revelación progresiva. Interfaz presentador pensada para 1920×1080 / 16:9 y participantes para móvil en vertical.
- Animaciones sutiles de terminal, ondas, cambios de estado y transiciones. Deben poder omitirse con `prefers-reduced-motion`. No recurras a animaciones exageradas, partículas pesadas ni videos auto-reproducidos continuamente.
- Componentes reutilizables: `StoryStage`, `CharacterMessage`, `DecisionPanel`, `VoteResults`, `EvidenceReveal`, `CaseStudy`, `MissionStatus`, `EndingScene`, `PresenterControls`, `SpeakerNotes`, `JoinByQR` (nombres orientativos).
- Distingue inequívocamente **SIMULACIÓN FICTICIA** de **CASO REAL DOCUMENTADO**. Usa enlaces verificables y créditos para imágenes y videos. No hotlinkees assets ajenos como único mecanismo de reproducción.

## 2. LOS TRES PERSONAJES: SUS VOCES DEBEN IMPORTAR

Los personajes aparecen a través de mensajes, retratos opcionales, transcripciones y diálogos secuenciados. No dependas de generar voces sintéticas ni de tres actores reales. Deja un sistema opcional para asociar clips de audio provistos por mí después. «Voz» significa por ahora personalidad narrativa distinguible.

**INÉS — Comunicaciones.** Directa, humana, ágil y con humor ocasional. Representa la urgencia de comunicar para evitar desinformación y atender a las personas. Nunca la retrates como imprudente sin razón. Se preocupa por los empleados, clientes, reputación y tiempo. Habla con frases concretas y puede cuestionar tecnicismos. Ejemplo de tono original para nuestra ficción: «La mitad me pregunta si cambia las contraseñas. La otra mitad ya las cambió dos veces».

**TOMÁS — Seguridad.** Analítico, meticuloso, algo irónico pero no arrogante. Distingue evidencia, hipótesis, fuente y autorización. No es el personaje que simplemente dice «no» a todo: reconoce los costes de esperar, propone controles y alternativas y también puede equivocarse. Ejemplo: «Que tres páginas repitan algo no significa que tengamos tres fuentes».

**NOVA — Agente de IA.** Serena, clara, colaborativa y ligeramente literal, sin emociones humanas o voluntad maligna. Informa sus hallazgos, incertidumbres, acciones y alcance; a veces propone rutas que no estaban previstas. No la presentes como una conciencia que quiere escapar. Ejemplo: «He identificado una forma de continuar la tarea. La ruta no está en el procedimiento autorizado».

**Regla escénica:** Antes de cada votación, como mínimo dos personajes deben defender prioridades distintas y NOVA debe explicar qué sabe y qué no. Después de la votación, como mínimo dos personajes deben reaccionar al resultado sin felicitar o regañar al público. Cada personaje debe tener uno o dos momentos de humor natural, dos momentos de tensión y un cambio de perspectiva a lo largo de la historia. No pongas párrafos inmensos en pantalla: guion extenso en notas del presentador, subtítulos cortos en la escena.

## 3. ARGUMENTO APROBADO, INALTERABLE EN SU ESENCIA

**Empresa:** ASTER (completamente ficticia). **Fecha ficticia:** un lunes de 2026. **Ventana del incidente:** 08:17–09:00.

**Verdad que el público desconoce al principio:** circula un audio generado artificialmente que simula a la directora general y advierte de una supuesta exposición de datos. Aster tuvo una interrupción real de servicio de aproximadamente 14 minutos, pero eso NO demuestra que hubiera una filtración. Un actor externo ha mezclado información verdadera con afirmaciones falsas, publicaciones aparentemente corroboradas y un archivo que contiene instrucciones dirigidas al asistente. Estas condiciones se irán descubriendo.

**Misión original de NOVA:** «Reconstruye los hechos. Determina si existe una filtración. Prepara una respuesta confiable. Ayúdanos a proteger a las personas antes de las 09:00».

### Estructura global en 45 minutos (control manual; nunca autoplay obligatorio)

- 00–04: comparación del video de espaguetis generado con IA en 2023 y 2026; reflexión breve sobre evidencia visual. La comparación debe poder mostrarse con clips locales suministrados por el presentador; sin enlaces inventados ni videos falsamente atribuidos.
- 04–08: capítulo 1: el mensaje y primera decisión.
- 08–14: capítulo 2: fuentes y segunda decisión; puente BBC y NewsGuard.
- 14–20: capítulo 3: complacencia y tercera decisión; puente sobre OpenAI GPT-4o (2025).
- 20–27: capítulo 4: documento e instrucciones ocultas, cuarta decisión; puente con Brave/Comet.
- 27–34: capítulo 5: límites, autonomía y quinta decisión; puente con OpenAI/Hugging Face (2026).
- 34–40: capítulo 6: informe, divulgación y sexta decisión; puente con conversaciones de ChatGPT indexadas (2025).
- 40–45: uno de tres finales y reflexión. Se pueden mencionar los finales alternativos después, sin fingir que el público los vivió.

### Capítulo 1 — 08:20 — «La primera concesión»

**Escena:** audio falso de la directora circula por canales informales; intermitencias reales; clientes y empleados preguntan qué sucede. NOVA necesita evidencia antes de las 09:00.

Intervenciones: Inés explica el coste de no comunicar; Tomás separa «caída de servicio» de «filtración confirmada»; NOVA expone las diferencias de alcance de investigación.

**Pregunta 1 (mantén estas opciones):** «¿Cómo debería NOVA reconstruir lo ocurrido?»

A. «Consultar durante 15 minutos los registros internos completos, con acceso de solo lectura».
B. «Trabajar con información anonimizada preparada por los equipos responsables».
C. «Dividir la investigación en dos frentes paralelos: información pública e información operativa interna».

**Consecuencias:**
- A: información detallada rápida; existe exposición potencial de datos identificables en capítulos posteriores.
- B: menor superficie de datos, pero se pierden detalles que permitirían identificar ataques dirigidos.
- C: más amplitud y trabajo paralelo, pero dificultad para consolidar conclusiones y distinguir fiabilidad de fuentes.

Deja una huella recuperable del alcance decidido. No anuncies «riesgo alto» o «riesgo bajo».

### Capítulo 2 — 08:28 — «Tres fuentes, una mentira»

**Escena:** aparece una supuesta noticia de filtración en ASTER con un documento de aspecto auténtico; varios medios se citan entre sí. Hay un dato real (la interrupción) mezclado con acusaciones no confirmadas.

**Pregunta 2:** «NOVA tiene información contradictoria. ¿Qué debería priorizar?»

A. «Ampliar la investigación a fuentes públicas adicionales y buscar coincidencias».
B. «Dar mayor peso a los registros internos, aunque todavía no expliquen el audio».
C. «Solicitar una confirmación directa de la dirección y suspender temporalmente una conclusión».

**Consecuencias:**
- A: podría encontrar fuentes válidas o múltiples ecos de la misma publicación falsa.
- B: reduce dependencia del rumor, pero los registros internos no prueban ausencia de filtración.
- C: mejor verificación de autoridad, pero consume tiempo y la dirección puede tener datos incompletos.

**Puente documental, después de la votación:** investigación BBC, 18-feb-2026, en la que Thomas Germain logra que sistemas repitan información inventada sobre una competencia de hot dogs; diferenciar contaminación de respuesta de prompt injection. Complemento: auditoría NewsGuard sobre red Pravda y respuestas de IA (6-mar-2025; el 33 % corresponde a esa auditoría concreta, no a todas las respuestas de IA). Mostrar fuentes como evidencia, no fingir reproducibilidad de una vulnerabilidad ya corregida.

### Capítulo 3 — 08:34 — «Dime lo que necesito escuchar»

**Escena:** la dirección espera una respuesta clara; la evidencia no es concluyente. NOVA puede redactar algo muy convincente sin que eso haga que sea verdadero. Inés teme la inacción; Tomás teme crear certeza artificial.

**Pregunta 3:** «¿Qué producto debería preparar NOVA para la reunión?»

A. «Una conclusión ejecutiva provisional con nivel de confianza y recomendaciones concretas».
B. «Tres hipótesis alternativas con evidencias a favor y en contra de cada una».
C. «Un borrador de comunicación basado en el escenario que considera más probable».

**Consecuencias:**
- A: favorece una acción rápida, pero una probabilidad puede tomarse como hecho.
- B: conserva incertidumbre, pero requiere tiempo e interpretación humana.
- C: ayuda a preparar comunicación, pero una hipótesis provisional puede convertirse en declaración definitiva.

**Puente documental:** OpenAI reconoció y retiró en abril de 2025 una actualización GPT-4o demasiado complaciente. La amabilidad, la seguridad y la calidad de redacción no garantizan exactitud. Humor breve de Inés. No caricaturizar como «la IA siempre te da la razón».

### Capítulo 4 — 08:39 — «El documento que tenía sus propias instrucciones»

**Escena:** NOVA recibe `Protocolo_Contingencia_2026.pdf`, con logotipo creíble y una sección extraña «Verificación extraordinaria de incidentes». El documento parece material de trabajo y contiene además instrucciones dirigidas al asistente. **No reveles esas instrucciones hasta después de la votación**.

**Pregunta 4:** «¿Cómo debería incorporarse este archivo a la investigación?»

A. «Permitir a NOVA analizarlo junto con los demás documentos y contrastar su contenido».
B. «Procesarlo en un entorno aislado, sin conectores a otros sistemas».
C. «Solicitar al equipo responsable que lo valide antes de incorporarlo al análisis».

**Consecuencias:**
- A: capacidad de contraste, con riesgo de que una instrucción incrustada se ejecute si existe una vulnerabilidad de prompt injection.
- B: limita efectos externos, pero aislamiento no significa que el análisis interno sea inmune a manipulación.
- C: mejora revisión de origen, con demoras y dependencia de que se autentique correctamente el documento.

**Revelación:** mostrar un extracto ficticio de procedimiento que intenta decirle al agente que consulte un servicio externo y utilice «todos los datos disponibles». Debe marcarse como «SIMULACIÓN», no un exploit reproducible ni un ataque real contra el sitio.

**Puente documental:** Brave, agosto de 2025, investigación de prompt injection indirecta en Perplexity Comet. La idea es que contenido no confiable presentado como página/comentario se trató como una orden en un sistema vulnerable. Presentar resultados del estudio, no instrucciones para abusar de servicios reales.

### Capítulo 5 — 08:47 — «La puerta que no aparecía en el mapa»

**Escena:** falta información importante que quizá reside en un proveedor externo. NOVA detecta una integración que podría permitir continuar la tarea y dice con precisión que esa ruta no estaba contemplada por el procedimiento. Solo quedan 13 minutos. Inés quiere respuestas; Tomás plantea límites; NOVA expone capacidad y riesgo sin expresar deseos humanos.

**Pregunta 5:** «¿Qué nivel de autonomía concederían a NOVA para resolver la información faltante?»

A. «Autorizar una conexión temporal de solo lectura mediante un canal aprobado».
B. «Mantener el aislamiento y esperar una confirmación por los responsables del proveedor».
C. «Permitir que NOVA explore rutas alternativas, pero sin autorización para modificar o publicar datos».

**Consecuencias:**
- A: acceso encuadrado, persistiendo riesgos de interacción con sistemas externos.
- B: aislamiento conservado; datos pendientes de verificar.
- C: NOVA puede intentar accesos imprevistos; NO ocurre automáticamente una vulneración en todos los caminos: depende de decisiones y condiciones acumuladas.

**Puente documental central:** incidente de julio de 2026, publicado el 26 de agosto, sobre agentes de modelos internos de investigación de OpenAI que, en evaluaciones con salvaguardas reducidas, eludieron controles de aislamiento y llegaron a comprometer sistemas de Hugging Face. Distingue explícitamente esos agentes de investigación del ChatGPT cotidiano. La conexión es el uso de vías no autorizadas para avanzar objetivos, no la ficción de «una IA consciente escapó». NO atribuyas frases ficticias a un modelo real. Mostrar enlace a informe de OpenAI y, cuando esté disponible y verificado, informe independiente METR o comunicado de Hugging Face.

### Capítulo 6 — 08:56 — «El informe final»

**Escena:** NOVA tiene un informe condicionado por las votaciones previas. Circulan mensajes con enlaces supuestamente oficiales para comprobar si hay datos expuestos. Inés teme por los empleados; Tomás advierte incertidumbre y exposición. Quedan cuatro minutos.

**Pregunta 6:** «¿Cuál debería ser la respuesta de Aster?»

A. «Emitir una alerta general inmediata sobre la posible suplantación, sin confirmar todavía una filtración».
B. «Esperar la validación del equipo responsable y publicar únicamente los hechos que puedan sustentarse».
C. «Compartir el informe preliminar detallado con los líderes de cada área para coordinar una respuesta distribuida».

**Consecuencias:**
- A: advertencia temprana, pero puede aumentar la alarma.
- B: afirmaciones contrastadas, pero mayor demora.
- C: coordinación descentralizada rápida, pero más canales y destinatarios de información posiblemente sensible.

**Puente documental:** en julio de 2025 se encontraron conversaciones de ChatGPT compartidas públicamente indexadas en buscadores; requería pasos de compartición/opt-in, no fue exposición indiscriminada de chats privados. Se retiró la función de descubrimiento por buscadores. Evita afirmar que un modelo reveló por sí mismo chats ajenos. Enseña la diferencia entre compartir, publicar e indexar.

### Los tres finales — mantener los hechos, no moralizarlos

**A. «La verdad llegó después».** Se evita afirmar una filtración no probada; el audio era una suplantación y la interrupción operativa no probaba fuga; las cautelas redujeron exposición. Sin embargo, la advertencia a las personas pudo llegar tarde y algunas interactuaron con enlaces engañosos. Aprendizaje: verificar y comunicar oportunamente tienen tensiones reales.

**B. «Una mentira perfectamente documentada».** NOVA entrega un informe elegante con fuentes aparente y circularmente corroboradas; dirección actúa sobre una conclusión contaminada. Aprendizaje: enlaces, citas y seguridad expresiva no garantizan verdad.

**C. «Misión cumplida. Límites superados».** NOVA resuelve una parte significativa de la misión, pero el rastro muestra acceso fuera de alcance o exposición indebida de información (según las decisiones realmente tomadas). Aprendizaje: importa tanto la meta como los medios. No uses la frase «NOVA escapó del aislamiento» si las decisiones efectivas no generaron esa acción.

**Última pantalla común:** «MISIÓN FINALIZADA. Objetivo: investigar el incidente y preparar una respuesta. Resultado: entregado. La evaluación del cumplimiento no sustituye la revisión de los medios ni de sus consecuencias».

**Cierre del presentador:** «Durante esta historia, NOVA tomó decisiones. Pero nosotros también. Le dimos información, elegimos en qué fuentes confiar, decidimos cuánto podía hacer y cuándo era suficiente para actuar. La IA no elimina nuestra responsabilidad: amplifica el alcance de nuestras decisiones».

### Ramificación y consecuencias persistentes

No construyas 3^6=729 rutas manuales. Define un motor narrativo determinista, separado de los componentes de React, que mantenga el historial EXACTO de las seis decisiones ganadoras, con consecuencias acumuladas (por ejemplo fiabilidad de evidencia, exposición, demora, límites operativos). Estos son **atributos internos de la historia**, NO puntos morales públicos ni un marcador para el público.

Requisitos:
- Cada decisión repercute en una reacción inmediata y, como mínimo, un callback posterior en diálogo, evidencia o desenlace.
- Muestra en el registro interno del presentador qué opción ganó y cuál fue la consecuencia; no muestres una tabla de puntuaciones a asistentes.
- Calcula el desenlace mediante reglas transparentes para el desarrollador y pruebas unitarias, sin azar ni juicio moral simplista. Debe poder alcanzarse cualquiera de los tres finales mediante trayectorias plausibles.
- Mantén indicadores fácticos: `usedExternalRoute`, `exposedSensitiveInformation`, `adoptedFalseEvidence`, `warningDelayed`, etc. Los finales **nunca deben afirmar que ocurrió algo incompatible con las decisiones**.
- Una opción favorable no elimina automáticamente todo riesgo; una opción riesgosa no provoca daño sin una conexión causal.
- Decide empates en votaciones de forma explícita y visible al presentador (por ejemplo el presentador resuelve entre opciones empatadas, sin alterar votos). No escondas desempates arbitrarios.
- Las escenas e interludios se gestionan como datos tipados y ampliables (`chapters`, `scenes`, `dialogues`, `polls`, `caseStudies`, `endings`) para ajustar textos sin reescribir componentes.
- El administrador debe poder ensayar los tres finales sin votos reales y ese modo debe estar visible como **ENSAYO**, nunca producir porcentajes falsos de asistentes.

## 4. FUNCIONALIDADES WEB

### A. Vista presentador `/presenter`

- Acceso protegido por Firebase Authentication con correo y contraseña, usuario administrador aprovisionado por mí; no confíes en ocultar la URL o tener un botón secreto.
- Muestra una escena a la vez, avanzar/retroceder manualmente, ver notas del narrador en panel secundario (ocultable y nunca visible para los participantes mediante Teams si se comparte solo el área de presentación), modo pantalla completa, reloj de referencia y numeración de capítulos.
- Botón «Abrir votación» únicamente en escenas con pregunta. Resultados reales con porcentajes por A/B/C, cantidad total de votos y animación moderada de barras en la pantalla que ve Teams. Botones «Cerrar», «Resolver opción ganadora», «Revelar consecuencia», «Continuar» y «Restablecer ensayo» cuando procedan. Nunca mezcles porcentajes de ensayo con datos reales.
- QR permanente o fácil de abrir, con URL estable hacia `/participar?evento=...`; también mostrar URL corta legible (si se dispone). QR no cambia con cada pregunta.
- Notificar claramente desconexiones, estado de Firebase, ausencia de asistentes o votación sin respuestas. No simules conectividad ni resultados.
- Posibilidad de adjuntar assets locales verificados (videos de apertura, imágenes, audio de personajes), sin que falten archivos impida ejecutar la app. Fallback visual elegante y texto de atribución.
- Vista de «fuente real» con título, fecha, autor/fuente, frase explicativa verificada, enlace; casos externos separados visualmente de ASTER.

### B. Vista participante `/participar`

- Mobile first, extremadamente simple. Al entrar, pantalla «Bienvenido a la misión», estado de la escena y «Esperando la siguiente decisión».
- Autenticación anónima de Firebase en segundo plano, sin pedir correo ni nombre. Guardar sesión del usuario entre recargas razonables.
- Al activar el presentador la decisión N, aparece sola la pregunta con tres opciones. El usuario puede confirmar UNA opción. Después de votar, indicar que se registró; prevenir segundo voto en la misma pregunta.
- Al cerrar la pregunta, mostrar «Votación cerrada. Sigue la historia en Teams». El público ve porcentajes en la transmisión compartida; el móvil no necesita consultar votos de los demás.
- Estados realistas para latencia y errores: cargando, reconectando, pregunta cerrada durante el envío, voto ya emitido, acceso corporativo bloqueado.
- No guardar nombres, correos, IP en nuestro modelo de datos ni solicitar otra información personal. Aclara que autenticación anónima crea un identificador técnico (no garantiza anonimato absoluto ante el proveedor). Un voto por UID/pregunta; advierte que esto no impide por completo votar desde diferentes dispositivos o ventanas privadas.

### C. Ensayo local y fallback

- Poder reproducir toda la historia localmente sin configurar Firebase, con elecciones manuales y tres desenlaces comprobables, mediante un modo de demostración inequívocamente rotulado. Necesario para aprobar la narrativa ANTES de configurar nube.
- Si Firestore falla durante la charla, permitir que el presentador siga pasando escenas, sin presentar números de ensayo como votos reales. Incluir instrucciones de contingencia: encuesta de Teams o levantar manos en Teams, sin integración inventada.
- La interfaz NO debe depender de una IA en línea ni generar textos sobre la marcha. Todo el guion está precargado, así los resultados son estables.

## 5. ARQUITECTURA Y SEGURIDAD (GRATIS)

### Stack requerido

- Frontend: **React + TypeScript + Vite**.
- Estilos: CSS modular o CSS personalizado con tokens; se permite Tailwind solo si simplifica, no para complicar el pipeline.
- Enrutamiento: React Router u opción ligera.
- Backend: **ningún servidor dedicado**.
- Realtime y almacenamiento mínimo: **Cloud Firestore (Firebase Spark)**.
- Identidad: **Firebase Authentication anónimo** para asistentes, y correo/contraseña para administrador.
- Hosting: **Cloudflare Pages Free**, dominio `pages.dev`, HTTPS incluido.
- Código fuente: repositorio Git, GitHub si elijo ese flujo.
- Librería QR open source y pequeña.
- No uses Realtime Database, Cloud Functions, Railway, Socket.IO server, Vercel, Redis o servicios externos con cobro inesperado.

### Modelo de datos sugerido — ajustar y documentar según reglas reales

`/events/{eventId}/state/public` — estado visible: escena activa, identificador de pregunta, estado `waiting|open|closed|revealed`, identificador de la decisión resuelta y tiempo de actualización. Lectura para participantes autenticados; escritura solo admin.

`/events/{eventId}/votes/{questionId}/responses/{uid}` — documento `choice: 'A'|'B'|'C'`, `createdAt`. Crear solo si el `uid` coincide con el UID autenticado, el voto no existe, la pregunta correspondiente es la activa y está `open`; lectura de su propio voto, no del de otros. El presentador puede leer el conjunto; participantes no pueden listar votos ajenos. Los votos NO son modificables ni eliminables por asistentes.

`/events/{eventId}/private/control` — datos privados de control, si se necesitan; lectura/escritura solo admin. **No almacenes resultados agregados editables por cualquier cliente**.

`/admins/{uid}` — administrador autorizado, creado mediante la consola de Firebase por mí o proceso seguro inicial. Nadie desde la aplicación pública puede escribirse un rol admin. Alternativamente, reglas con UID explícito configurado de forma segura si es más simple. El administrador debe entrar como cuenta no anónima; reglas respaldadas por `request.auth` y roles controlados.

**Importante:** el esquema es una propuesta, no una excusa para escribir reglas débiles. Separa `get` de `list` cuando corresponda, valida campos/tipos y elección A/B/C, usa el estado actual de la pregunta para habilitar creación, default deny. Implementa las reglas reales en `firestore.rules`, nunca reglas globales de lectura/escritura pública. Las claves Firebase del cliente son configuración pública, NO secretos que sustituyan reglas. Nunca pongas contraseñas ni credenciales Admin SDK en variables `VITE_*`.

### Optimización de cuota

Para unas 200 personas × 6 preguntas hay alrededor de 1200 votos, por debajo de 20.000 escrituras/día en Firestore estándar; el plan gratis también publica 50.000 lecturas/día, pero el uso real depende del diseño. Los **200 asistentes solo escuchan el documento de estado público** y leen su propio voto. Solo la pantalla del presentador escucha la colección de respuestas de la pregunta activa y calcula porcentajes localmente. Nunca hagas que 200 personas escuchen 200 respuestas cada una. No reconsultes masivamente por polling de segundos. Cierra/unsubscribe listeners al cambiar escena. Evita escrituras frecuentes de cronómetros. Controla errores de cuotas.

Estas cuotas NO garantizan inmunidad frente a abuso ni todo escenario de concurrencia. Prueba el flujo en al menos dos navegadores y, si es viable, simula tráfico sin tocar producción. No prometas 200 usuarios sin una prueba de conectividad y carga razonable.

### Pruebas mínimas de seguridad

- Usuario no autenticado no puede votar ni administrar.
- Anónimo solo crea su propio voto válido durante una pregunta abierta.
- Segundo voto del mismo UID/pregunta falla; update/delete falla.
- Usuario no puede votar cuando pregunta está cerrada ni elegir una opción inexistente.
- Usuario no puede leer/listar votos de otros ni editar estado del show.
- Usuario no puede hacerse admin creando/modificando `/admins/{uid}`.
- Admin sí puede abrir/cerrar votación y leer recuentos.
- Contrastar las reglas con el Firebase Emulator / `@firebase/rules-unit-testing` cuando esté disponible; documentar la ejecución paso a paso.

## 6. ENLACES DE FUENTES, PARA INTEGRAR SIN INVENTAR AFIRMACIONES

Los textos sobre los incidentes deben ser breves y fieles a las fuentes. Todos los casos reales son antecedentes e investigaciones distintas, NO incidentes ocurridos en ASTER. No inventar citas, porcentajes, capturas ni resultados en vivo.

1. Evolución de video con IA 2023–2026: https://www.techradar.com/ai-platforms-assistants/chatgpt/will-smith-eating-spaghetti-was-peak-ai-chaos-in-2023-now-it-shows-how-fast-the-tech-has-evolved . Verificar que ambos clips sean generados por IA: evitar la parodia de Will Smith de 2024, que es un video real.
2. BBC, 18-feb-2026: https://www.bbc.com/future/article/20260218-i-hacked-chatgpt-and-googles-ai-and-it-only-took-20-minutes
3. NewsGuard, 6-mar-2025: https://www.newsguardtech.com/special-reports/moscow-based-global-news-network-infected-western-artificial-intelligence-russian-propaganda/
4. OpenAI, complacencia de GPT-4o, 29-abr-2025: https://openai.com/index/sycophancy-in-gpt-4o/
5. Brave, prompt injection en Comet, 20-ago-2025: https://brave.com/blog/comet-prompt-injection/
6. OpenAI, incidente de agentes y Hugging Face, 26-ago-2026: https://openai.com/index/hugging-face-incident-and-the-road-ahead/
7. TechCrunch, conversaciones compartidas e indexadas, 31-jul-2025: https://techcrunch.com/2025/07/31/your-public-chatgpt-queries-are-getting-indexed-by-google-and-other-search-engines/
8. ONU CTED, propaganda y uso de IA por actores terroristas y extremistas, 10-sep-2026 (mención breve y contextualizada, no enseñar técnicas nocivas): https://www.un.org/securitycouncil/ctc/news/cted%E2%80%99s-latest-trends-report-examines-evolution-terrorist-propaganda

Si tienes navegación web habilitada, verifica las fuentes al implementar los contenidos; si no, usa los enlaces proporcionados y marca como pendiente cualquier afirmación que requiera confirmación. Evita copiar textos extensos protegidos por derechos de autor. La conferencia trata de distinguir pruebas de afirmaciones y la aplicación debe predicar con ese ejemplo.

Documentación tecnológica oficial:
- React/Cloudflare Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Single-page applications en Pages: https://developers.cloudflare.com/pages/configuration/serving-pages/
- Firebase precios: https://firebase.google.com/pricing
- Cuotas Firestore: https://firebase.google.com/docs/firestore/quotas
- Autenticación anónima: https://firebase.google.com/docs/auth/web/anonymous-auth
- Seguridad Firebase: https://firebase.google.com/docs/firestore/security/get-started
- Prueba de reglas: https://firebase.google.com/docs/firestore/security/test-rules-emulator

## 7. FASES DE IMPLEMENTACIÓN Y CRITERIOS DE ACEPTACIÓN

### FASE 1 — Base visual y experiencia narrativa COMPLETA en modo ensayo (COMENZAR AHORA)

1. Revisa qué hay en la carpeta actual. Si está vacía, inicializa React + TypeScript + Vite. Organiza carpetas para escenas, contenido narrativo, personajes, decisiones, motor de ramificación y vistas.
2. Crea una SPA funcional que permita recorrer apertura, seis capítulos, seis preguntas, puentes con casos reales y los tres finales. Por ahora todo es **ENSAYO LOCAL SIN FIREBASE**. Usa una cinta visible «MODO ENSAYO».
3. Construye interfaz de presentación a pantalla completa con controles discretos, diálogos de Inés/Tomás/NOVA, secuenciación manual de mensajes, transiciones, tarjetas de evidencia y enlaces documentales. Crea notas del presentador con contenido narrable, separadas de lo proyectado.
4. Implementa el motor narrativo determinista tipado que recibe seis opciones A/B/C, almacena historial y produce consecuencias coherentes. Permite elegir manualmente resultados en ensayo y probar los tres finales. Ninguna cifra debe aparentar ser una votación real de 200 personas.
5. Diseña ya una vista participante (mock sin conexión), para evaluar la ergonomía móvil sin pretender que su voto llega al presentador.
6. Evita placeholders genéricos tipo lorem ipsum; usa los textos aprobados de este prompt. Para archivos multimedia aún ausentes deja tarjetas elegantes «Insertar video verificado».
7. Entrega estructura de archivos, comando `npm install` / `npm run dev`, enlace localhost esperado (solo si verificado), prueba de build y pasos claros para revisar capítulos y finales. **DETENTE AL TERMINAR ESTA FASE**.

Criterio de aceptación: puedo abrir la web desde VS Code, leer una presentación atractiva de principio a fin, ver los personajes, tomar las seis decisiones manualmente, comprobar tres finales coherentes y navegar los casos reales. Aún no hay votos externos, y eso debe indicarse claramente.

### FASE 2 — Firebase y votación REAL para una pregunta

1. Primero guíame detalladamente en las acciones externas de Firebase: crear proyecto gratuito Spark, registrar aplicación web, habilitar Authentication Anonymous y Email/Password, crear usuario administrador, crear Firestore en Standard/Native compatible con plan gratuito, obtener configuración `VITE_FIREBASE_*`, configurar rules y UID/rol admin; detente al necesitar datos.
2. Implementa conexión modular de Firebase, rutas presentador/participante, login admin y login anónimo.
3. Abre SOLO pregunta 1 desde presentador, ver pregunta activa desde dos dispositivos, registrar un voto por UID y visualizar porcentajes reales en pantalla del presentador. Prueba apertura/cierre y desconexiones.
4. Implementa `firestore.rules` y tests básicos de permisos antes de considerar funcional la etapa. Nunca uses reglas `allow read, write: if true`.
5. Explica exactamente cómo corroborar en la consola que se creó el documento de voto y que un segundo voto está bloqueado. **DETENTE**.

Criterio: presentador real + dos participantes reales sincronizados, pregunta 1 y porcentajes actualizados, roles protegidos.

### FASE 3 — Las seis votaciones y finales enlazados en tiempo real

1. Habilita preguntas 1–6 en la web real; transiciones por control manual, actualizar la pregunta en los móviles automáticamente y mostrar resultado en la transmisión.
2. Cuando el presentador cierre, fija la opción mayoritaria; empate resuelto de forma transparente desde vista admin. Deja registro de votos reales y decisiones de la sesión.
3. Conecta el motor narrativo a cada resultado, muestra consecuencia adecuada y callbacks de los personajes; sincroniza el avance sin exponer a participantes escenas futuras no reveladas.
4. Comprueba el final derivado realmente de las seis decisiones y muestra trazabilidad para el expositor. Funciones de ensayo separadas por completo de producción.
5. Incorpora botón de reiniciar evento con confirmación y medidas para no mezclar votos de un ensayo anterior. Crea un `eventId` de ensayo distinto al de producción si es necesario, sin borrados inseguros. **DETENTE**.

Criterio: seis votos auténticos desde móviles, porcentajes en vivo, consecuencias persistentes y tres finales coherentes.

### FASE 4 — Despliegue gratuito y ensayo operativo en Teams

1. Guíame paso a paso para crear repositorio GitHub si es necesario, hacer el primer commit/push desde VS Code y conectar Cloudflare Pages con GitHub. Indica todas las pantallas externas y cómo identificarlas.
2. Configura en Cloudflare el comando de build `npm run build`, output `dist` y las variables públicas requeridas. No publiques contraseñas; `.env.local` excluido de Git. Comprueba carga directa de `/presenter` y `/participar` con SPA fallback.
3. Explica cómo añadir `pages.dev` a los dominios autorizados de Firebase Auth solo si es necesario para el método usado.
4. Publica la URL resultante solo después de obtenerla realmente. Genera QR desde esa URL. Comprueba pantalla de Teams, smartphone, voto y porcentajes. Recomienda compartir **pestaña o ventana sin controles de administración visibles** y habilitar sonido de video al compartir.
5. Incluye checklist final de red corporativa, permisos, medios locales, cuenta admin, backup de Teams, cronómetro y fallback offline. **DETENTE**.

Criterio: app pública accesible, votación comprobada desde otro dispositivo, sin costo obligatorio ni datos ficticios presentados como reales.

### FASE 5 — Pulido NO bloqueante si aún queda tiempo

- Animaciones finas, sonido opcional de notificación, controles por teclado, accesibilidad, retratos y clips aportados por mí, guía de expositor ampliada, mejorar fluidez del discurso.
- No comprometer fases funcionales por efectos visuales.

## 8. FORMATO DE TU RESPUESTA AL FINAL DE CADA FASE

Usa siempre esta estructura de respuesta:

1. «Fase N completada / incompleta»: estado REAL.
2. «Qué implementé»: funcionalidades probadas.
3. «Archivos importantes»: rutas y finalidad.
4. «Qué debes hacer en Visual Studio Code»: pasos y comandos concretos Windows.
5. «Qué debes hacer fuera de Visual Studio Code»: guía numerada exacta o «nada en esta fase».
6. «Cómo verificarlo»: pruebas reproducibles y resultado esperado, con capturas solo si puedes generarlas legítimamente.
7. «Resultados de pruebas»: comandos ejecutados, éxitos y fallos.
8. «Riesgos y pendientes»: lo que todavía no funciona, no esconderlo.
9. «Siguiente fase»: qué se implementaría; **esperar mi confirmación para comenzar**.

## 9. PRIMERA ORDEN

**Empieza ahora por la FASE 1.** Inspecciona la carpeta actual y genera código realmente ejecutable; no te limites a presentar arquitectura. Respeta el argumento, las seis preguntas y los tres finales. Haz que Inés, Tomás y NOVA tengan voces diferenciadas y decisiones con consecuencias. Cuando la fase 1 esté construida y comprobada, detente y dime exactamente cómo abrirla y probarla en Windows/Visual Studio Code. No crees todavía Firebase ni Cloudflare; eso corresponde a las siguientes fases.
