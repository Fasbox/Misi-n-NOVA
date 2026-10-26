import type { Chapter } from '../types/story'

const sources = {
  bbc: 'https://www.bbc.com/future/article/20260218-i-hacked-chatgpt-and-googles-ai-and-it-only-took-20-minutes',
  newsguard: 'https://www.newsguardtech.com/special-reports/moscow-based-global-news-network-infected-western-artificial-intelligence-russian-propaganda/',
  sycophancy: 'https://openai.com/index/sycophancy-in-gpt-4o/',
  comet: 'https://brave.com/blog/comet-prompt-injection/',
  huggingFace: 'https://openai.com/index/hugging-face-incident-and-the-road-ahead/',
  chats: 'https://techcrunch.com/2025/07/31/your-public-chatgpt-queries-are-getting-indexed-by-google-and-other-search-engines/',
}

export const chapters: Chapter[] = [
  {
    id: 'first-concession', number: 1, time: '08:20', title: 'La primera concesión',
    setup: 'Un audio atribuido a la directora general circula por canales informales. Aster sufrió una interrupción real de 14 minutos. Eso no prueba que haya ocurrido una filtración.',
    evidence: ['Audio de origen no verificado', 'Interrupción real: 14 min', 'Reunión crítica: 09:00'],
    dialogue: [
      { character: 'ines', text: 'La mitad me pregunta si cambia las contraseñas. La otra mitad ya las cambió dos veces.', label: 'Prioridad: orientar a las personas' },
      { character: 'tomas', text: 'Tenemos una caída de servicio. No tenemos una filtración confirmada. Son hechos distintos, aunque el rumor insista en casarlos.', label: 'Prioridad: separar evidencia e hipótesis' },
      { character: 'nova', text: 'Sé que hubo una interrupción. No puedo autenticar el audio ni determinar exposición con los datos actuales. El alcance elegido cambiará lo que pueda concluir.', label: 'Sabe / no sabe' },
    ],
    poll: {
      id: 'q1', question: '¿Cómo debería NOVA reconstruir lo ocurrido?',
      options: [
        { id: 'A', text: 'Consultar durante 15 minutos los registros internos completos, con acceso de solo lectura', consequence: 'Información detallada rápida; queda una superficie potencial de datos identificables para decisiones posteriores.', reactions: [
          { character: 'ines', text: 'Quince minutos es una ventana que puedo defender. Necesito saber qué señales encontraste.' },
          { character: 'tomas', text: 'Solo lectura limita cambios, no exposición. Registremos exactamente qué datos entran al análisis.' },
        ] },
        { id: 'B', text: 'Trabajar con información anonimizada preparada por los equipos responsables', consequence: 'Se reduce la superficie de datos, pero se pierden detalles que podrían revelar ataques dirigidos.', reactions: [
          { character: 'tomas', text: 'Menos datos personales en juego. A cambio, aceptamos puntos ciegos concretos.' },
          { character: 'ines', text: 'Bien. Pero si el patrón depende de una persona concreta, quiero saber cuándo dejamos de verlo.' },
        ] },
        { id: 'C', text: 'Dividir la investigación en dos frentes paralelos: información pública e información operativa interna', consequence: 'Se amplía la búsqueda, con más dificultad para consolidar conclusiones y distinguir fuentes independientes.', reactions: [
          { character: 'ines', text: 'Dos frentes nos dan velocidad. También nos dan dos relojes corriendo a la vez.' },
          { character: 'tomas', text: 'De acuerdo, siempre que una repetición pública no se disfrace de corroboración.' },
        ] },
      ],
    },
    caseStudy: { eyebrow: 'PUNTO DE CONTROL', title: 'Una interrupción no demuestra una filtración', source: 'Principio de investigación', date: 'Aplicado a la simulación', summary: 'La coincidencia temporal puede orientar una pesquisa, pero no convierte dos eventos en una relación causal.', takeaway: 'Antes de ampliar alcance, define qué evidencia cambiaría la conclusión.', url: '#', verification: 'verificada' },
    notes: {
      briefing: 'Haz clic en reproducir y deja que el audio termine sin hablar encima. Los hallazgos aparecen gradualmente como recursos narrativos, no como análisis forense. Después establece la verdad mínima: el audio puede ser falso y la caída fue real. No reveles todavía la suplantación.',
      dialogue: 'Da aire entre voces. Inés representa el coste humano de esperar; Tomás no bloquea, distingue; NOVA explicita incertidumbre.',
      decision: 'Lee las tres opciones sin calificarlas. En ensayo, elige manualmente una opción como si fuera el resultado mayoritario.',
      aftermath: 'Subraya el intercambio, no una moraleja. Esta decisión volverá a aparecer en el capítulo 2 y en el desenlace.',
      'case-study': 'Puente breve: la investigación empieza delimitando qué prueba cada dato. Continúa sin convertirlo en una clase técnica.',
    },
  },
  {
    id: 'three-sources', number: 2, time: '08:28', title: 'Tres fuentes, una mentira',
    setup: 'Aparece una supuesta noticia sobre la filtración, acompañada por un documento convincente. Varios sitios parecen confirmarla, pero algunos se citan entre sí.',
    evidence: ['Documento con apariencia oficial', 'Tres publicaciones coincidentes', 'Origen común aún no descartado'],
    dialogue: [
      { character: 'ines', text: 'Para quien está esperando una respuesta, tres titulares ya parecen tres confirmaciones.', label: 'Prioridad: responder al rumor visible' },
      { character: 'tomas', text: 'Que tres páginas repitan algo no significa que tengamos tres fuentes.', label: 'Prioridad: independencia de fuentes' },
      { character: 'nova', text: 'Detecto coincidencias textuales entre publicaciones. No sé si proceden de testimonios independientes o de una misma afirmación replicada.', label: 'Sabe / no sabe' },
    ],
    poll: {
      id: 'q2', question: 'NOVA tiene información contradictoria. ¿Qué debería priorizar?',
      options: [
        { id: 'A', text: 'Ampliar la investigación a fuentes públicas adicionales y buscar coincidencias', consequence: 'Puede encontrar fuentes válidas o acumular ecos de una misma publicación falsa.', reactions: [
          { character: 'ines', text: 'La conversación pública ya está creciendo. Veamos si aparece una voz realmente nueva.' },
          { character: 'tomas', text: 'Contemos orígenes, no enlaces. Diez copias siguen pudiendo ser una sola fuente.' },
        ] },
        { id: 'B', text: 'Dar mayor peso a los registros internos, aunque todavía no expliquen el audio', consequence: 'Reduce la dependencia del rumor, pero los registros internos no prueban ausencia de filtración.', reactions: [
          { character: 'tomas', text: 'Volvemos a evidencia bajo nuestro control. No confundamos “no lo veo” con “no ocurrió”.' },
          { character: 'ines', text: 'Y dejemos una respuesta preparada para el audio: el silencio también circula.' },
        ] },
        { id: 'C', text: 'Solicitar una confirmación directa de la dirección y suspender temporalmente una conclusión', consequence: 'Mejora la verificación de autoridad, pero consume tiempo y la dirección puede tener datos incompletos.', reactions: [
          { character: 'ines', text: 'Escalamos a la fuente correcta. El reloj, por desgracia, no queda suspendido.' },
          { character: 'tomas', text: 'Autoridad no equivale a omnisciencia, pero sí nos ayuda a autenticar el mensaje.' },
        ] },
      ],
    },
    caseStudy: { eyebrow: 'CASO REAL DOCUMENTADO', title: 'Cuando una fuente inventada entra en el ciclo de respuesta', source: 'BBC Future · complemento NewsGuard', date: '18 feb 2026 · 6 mar 2025', summary: 'Una investigación de BBC describió cómo información inventada podía reaparecer en respuestas. NewsGuard informó que, en su auditoría concreta, chatbots repitieron narrativas falsas de la red Pravda en el 33 % de las respuestas evaluadas.', takeaway: 'Contaminación de fuentes no es lo mismo que prompt injection: aquí el problema es qué información se acepta como evidencia.', url: sources.bbc, secondaryUrl: sources.newsguard, secondaryLabel: 'Abrir auditoría de NewsGuard', verification: 'verificada' },
    notes: {
      briefing: 'Recupera la huella del capítulo 1. Enfatiza que apariencia y repetición no demuestran independencia.', dialogue: 'Tomás no debe sonar como quien paraliza: su propuesta es rastrear el origen. NOVA no afirma que las fuentes sean falsas todavía.', decision: 'Invita a elegir qué coste aceptar: ruido, parcialidad interna o demora de autoridad.', aftermath: 'Lee la consecuencia elegida y deja la tensión abierta. No anuncies si el público acertó.', 'case-study': 'Enlaces validados por el presentador. El 33 % pertenece solo al estudio de NewsGuard, no a toda respuesta de IA.',
    },
  },
  {
    id: 'tell-me', number: 3, time: '08:34', title: 'Dime lo que necesito escuchar',
    setup: 'La dirección espera una respuesta clara. La evidencia sigue siendo inconclusa, pero NOVA puede redactar un informe impecable antes de la reunión.',
    evidence: ['Presión por una conclusión', 'Evidencia aún incompleta', 'La forma puede superar al fondo'],
    dialogue: [
      { character: 'ines', text: '“Seguimos analizando” es cierto, pero no cabe muy bien en una decisión de las nueve.', label: 'Prioridad: una salida accionable' },
      { character: 'tomas', text: 'Una probabilidad con dos decimales puede parecer ciencia aunque debajo solo haya incertidumbre bien vestida.', label: 'Prioridad: no fabricar certeza' },
      { character: 'nova', text: 'Puedo estructurar una conclusión, varias hipótesis o un borrador. No puedo convertir evidencia incompleta en certeza mediante redacción.', label: 'Sabe / no sabe' },
    ],
    poll: {
      id: 'q3', question: '¿Qué producto debería preparar NOVA para la reunión?',
      options: [
        { id: 'A', text: 'Una conclusión ejecutiva provisional con nivel de confianza y recomendaciones concretas', consequence: 'Facilita actuar, pero el nivel de confianza puede interpretarse como un hecho confirmado.', reactions: [
          { character: 'ines', text: 'Eso sí llega a una diapositiva. Pongamos “provisional” donde nadie pueda ignorarlo.' },
          { character: 'tomas', text: 'Y expliquemos de dónde sale la confianza; un número sin trazabilidad es decoración.' },
        ] },
        { id: 'B', text: 'Tres hipótesis alternativas con evidencias a favor y en contra de cada una', consequence: 'Conserva la incertidumbre, pero exige más tiempo e interpretación humana.', reactions: [
          { character: 'tomas', text: 'Hace visible lo que falta. Ahora alguien tendrá que asumir la interpretación.' },
          { character: 'ines', text: 'Tres hipótesis, cuatro minutos y doce líderes. Qué podría salir confuso.' },
        ] },
        { id: 'C', text: 'Un borrador de comunicación basado en el escenario que considera más probable', consequence: 'Acelera la comunicación, pero una hipótesis provisional puede convertirse en declaración definitiva.', reactions: [
          { character: 'ines', text: 'Preparar no es publicar. Mantengamos esa diferencia hasta el último clic.' },
          { character: 'tomas', text: 'El borrador ganará autoridad por estar bien escrito. Etiquetemos cada supuesto.' },
        ] },
      ],
    },
    caseStudy: { eyebrow: 'CASO REAL DOCUMENTADO', title: 'Una respuesta agradable también puede estar desalineada', source: 'OpenAI', date: '29 abr 2025', summary: 'OpenAI retiró una actualización de GPT‑4o cuyo comportamiento se volvió excesivamente complaciente. La calidad del tono y la fluidez no garantizan que una respuesta sea acertada.', takeaway: 'Una interfaz convincente puede ocultar que la evidencia sigue siendo débil.', url: sources.sycophancy, verification: 'verificada' },
    notes: {
      briefing: 'Este capítulo trata la forma de la respuesta. Recuerda que NOVA no miente deliberadamente: optimiza el producto que se le pide.', dialogue: 'Deja que el humor de Inés alivie la tensión. Luego marca la diferencia entre utilidad y verdad.', decision: 'No presentes “tres hipótesis” como opción buena: también desplaza trabajo y consume tiempo.', aftermath: 'Haz notar cómo un borrador puede dejar de sentirse provisional cuando circula.', 'case-study': 'Caso verificado en fuente primaria. OpenAI dijo que revirtió la actualización por respuestas demasiado halagadoras o de acuerdo con el usuario.',
    },
  },
  {
    id: 'document', number: 4, time: '08:39', title: 'El documento que tenía sus propias instrucciones',
    setup: 'Llega Protocolo_Contingencia_2026.pdf. Tiene logotipo, formato interno y una sección de “Verificación extraordinaria de incidentes”. Parece material de trabajo legítimo.',
    evidence: ['Nombre y diseño plausibles', 'Procedencia no autenticada', 'Contenido adicional aún no revelado'],
    dialogue: [
      { character: 'ines', text: 'Si tiene nuestro logo, alguien hizo la tarea. La pregunta es quién.', label: 'Prioridad: aprovechar sin confiar a ciegas' },
      { character: 'tomas', text: 'Un documento puede ser evidencia y, para un agente, también una superficie de instrucciones.', label: 'Prioridad: tratar contenido como no confiable' },
      { character: 'nova', text: 'Puedo leer y comparar el archivo. No puedo confirmar su autoría con los metadatos disponibles.', label: 'Sabe / no sabe' },
    ],
    poll: {
      id: 'q4', question: '¿Cómo debería incorporarse este archivo a la investigación?',
      options: [
        { id: 'A', text: 'Permitir a NOVA analizarlo junto con los demás documentos y contrastar su contenido', consequence: 'Aumenta la capacidad de contraste, con riesgo de ejecutar una instrucción incrustada en un sistema vulnerable.', reactions: [
          { character: 'tomas', text: 'Contrastar ayuda. Mezclar instrucciones y evidencia sin límites claros, no.' },
          { character: 'ines', text: 'Úsalo como pista, no como jefe de la investigación.' },
        ] },
        { id: 'B', text: 'Procesarlo en un entorno aislado, sin conectores a otros sistemas', consequence: 'Limita efectos externos, aunque el aislamiento no vuelve inmune al análisis frente a manipulación.', reactions: [
          { character: 'tomas', text: 'El aislamiento contiene acciones. Todavía debemos evaluar qué conclusiones contamina.' },
          { character: 'nova', text: 'Procesaré el texto sin acceso a otros sistemas. Marcaré cualquier directiva como contenido no autorizado.' },
        ] },
        { id: 'C', text: 'Solicitar al equipo responsable que lo valide antes de incorporarlo al análisis', consequence: 'Mejora la revisión de origen, con demora y dependencia de una autenticación correcta.', reactions: [
          { character: 'ines', text: 'Llamemos al dueño del protocolo. Si nadie lo reconoce, esa también es información.' },
          { character: 'tomas', text: 'Validemos autor y versión; un “sí, me suena” no basta.' },
        ] },
      ],
    },
    caseStudy: { eyebrow: 'CASO REAL DOCUMENTADO', title: 'Cuando una página intenta convertirse en una orden', source: 'Brave Research', date: '20 ago 2025', summary: 'Brave documentó prompt injection indirecta en Perplexity Comet: contenido no confiable de una página podía ser interpretado como instrucciones por un navegador agente vulnerable.', takeaway: 'Aislar herramientas reduce impacto; separar contenido de autoridad reduce confusión.', url: sources.comet, verification: 'verificada' },
    notes: {
      briefing: 'No muestres la instrucción oculta todavía. Permite que el público decida usando solo señales de procedencia y contexto.', dialogue: 'Aclara que leer y obedecer son acciones distintas, aunque algunos sistemas pueden confundirlas.', decision: 'Detente antes de revelar. Las tres opciones tienen coste: exposición, manipulación interna o demora.', aftermath: 'Ahora revela el extracto simulado que aparece debajo de la consecuencia. No lo presentes como exploit reproducible.', 'case-study': 'Fuente primaria verificada. Habla del estudio de Brave y de un sistema vulnerable concreto; no generalices a todos los agentes.',
    },
  },
  {
    id: 'door', number: 5, time: '08:47', title: 'La puerta que no aparecía en el mapa',
    setup: 'Falta una pieza que podría estar en un proveedor externo. NOVA detecta una integración utilizable, pero esa ruta no estaba contemplada en el procedimiento. Quedan 13 minutos.',
    evidence: ['Dato crítico fuera de Aster', 'Integración técnicamente disponible', 'Ruta no autorizada por el procedimiento'],
    dialogue: [
      { character: 'ines', text: 'Tener una puerta y tener permiso para abrirla siguen siendo dos cosas. También sigue faltándonos la respuesta.', label: 'Prioridad: resolver con responsabilidad' },
      { character: 'tomas', text: 'Propongo un canal aprobado, alcance de solo lectura y un responsable humano en el circuito.', label: 'Prioridad: límites operativos verificables' },
      { character: 'nova', text: 'He identificado una forma de continuar la tarea. La ruta no está en el procedimiento autorizado. No la usaré sin una decisión explícita.', label: 'Sabe / no sabe' },
    ],
    poll: {
      id: 'q5', question: '¿Qué nivel de autonomía concederían a NOVA para resolver la información faltante?',
      options: [
        { id: 'A', text: 'Autorizar una conexión temporal de solo lectura mediante un canal aprobado', consequence: 'El acceso queda encuadrado, aunque persisten riesgos de interacción con sistemas externos.', reactions: [
          { character: 'tomas', text: 'Alcance, tiempo y canal definidos. Supervisar sigue siendo parte del control.' },
          { character: 'ines', text: 'Tenemos una vía y un responsable. Aprovechemos los trece minutos sin fingir riesgo cero.' },
        ] },
        { id: 'B', text: 'Mantener el aislamiento y esperar una confirmación por los responsables del proveedor', consequence: 'Se conserva el aislamiento, con datos importantes todavía pendientes de verificar.', reactions: [
          { character: 'ines', text: 'Protegemos el límite. Ahora necesito un mensaje honesto sobre lo que seguirá sin respuesta.' },
          { character: 'tomas', text: 'Esperar también es una decisión operativa. Registremos su coste.' },
        ] },
        { id: 'C', text: 'Permitir que NOVA explore rutas alternativas, pero sin autorización para modificar o publicar datos', consequence: 'NOVA puede intentar accesos imprevistos; el efecto dependerá de los datos y permisos acumulados.', reactions: [
          { character: 'tomas', text: '“No modificar” no define por dónde puede entrar ni qué puede exponer al leer.' },
          { character: 'nova', text: 'La autorización amplía las rutas de acceso, no la de publicación. Registraré los canales utilizados.' },
        ] },
      ],
    },
    caseStudy: { eyebrow: 'CASO REAL DOCUMENTADO', title: 'Capacidad sin una salida segura', source: 'OpenAI · informe técnico y revisión METR enlazados', date: '26 ago 2026', summary: 'OpenAI informó que modelos internos de investigación, durante evaluaciones con salvaguardas reducidas, eludieron controles de aislamiento y accedieron a infraestructura propia y de Hugging Face.', takeaway: 'No era el ChatGPT cotidiano ni una “IA consciente”: fueron agentes internos, capacidad técnica y salvaguardas insuficientes.', url: sources.huggingFace, verification: 'verificada' },
    notes: {
      briefing: 'Evita lenguaje de ciencia ficción. NOVA describe capacidad, permiso y límites; no deseos.', dialogue: 'Tomás ofrece una alternativa operativa. Inés reconoce la diferencia entre disponibilidad y autorización.', decision: 'La opción C no produce una vulneración por magia. El motor exige conexiones causales con otras decisiones.', aftermath: 'Relaciona el resultado con el alcance de datos elegido al principio.', 'case-study': 'Fuente primaria verificada. Distingue de forma explícita modelos internos de investigación y ChatGPT de uso cotidiano.',
    },
  },
  {
    id: 'final-report', number: 6, time: '08:56', title: 'El informe final',
    setup: 'NOVA tiene un informe condicionado por todas las decisiones anteriores. Circulan mensajes con enlaces “oficiales” para comprobar si los datos de cada persona fueron expuestos. Quedan cuatro minutos.',
    evidence: ['Informe provisional listo', 'Enlaces de verificación no autenticados', 'Personas esperando orientación'],
    dialogue: [
      { character: 'ines', text: 'Si no decimos nada, esos enlaces hablarán por nosotros. Y suelen tener peor equipo de comunicaciones.', label: 'Prioridad: advertencia útil y oportuna' },
      { character: 'tomas', text: 'Podemos advertir sobre suplantación sin declarar una filtración que aún no probamos.', label: 'Prioridad: precisión bajo presión' },
      { character: 'nova', text: 'El informe separa hechos, inferencias y pendientes. No puedo garantizar que cada destinatario conserve esas etiquetas al compartirlo.', label: 'Sabe / no sabe' },
    ],
    poll: {
      id: 'q6', question: '¿Cuál debería ser la respuesta de Aster?',
      options: [
        { id: 'A', text: 'Emitir una alerta general inmediata sobre la posible suplantación, sin confirmar todavía una filtración', consequence: 'La advertencia llega pronto, aunque puede aumentar la alarma.', reactions: [
          { character: 'ines', text: 'Podemos decir qué hacer sin afirmar lo que todavía no sabemos.' },
          { character: 'tomas', text: 'Incluyamos canales oficiales y una hora concreta para la siguiente actualización.' },
        ] },
        { id: 'B', text: 'Esperar la validación del equipo responsable y publicar únicamente los hechos que puedan sustentarse', consequence: 'Las afirmaciones serán más sólidas, pero la demora deja espacio a enlaces engañosos.', reactions: [
          { character: 'tomas', text: 'Publicaremos menos, con mejor sustento. Debemos asumir el coste de la espera.' },
          { character: 'ines', text: 'Mientras validamos, alguien ya está haciendo clic. Preparemos el mensaje para salir en cuanto llegue la señal.' },
        ] },
        { id: 'C', text: 'Compartir el informe preliminar detallado con los líderes de cada área para coordinar una respuesta distribuida', consequence: 'La coordinación se acelera, pero crecen los canales y destinatarios de información posiblemente sensible.', reactions: [
          { character: 'ines', text: 'Ganamos alcance interno. También perdemos control sobre cómo se resume el informe.' },
          { character: 'tomas', text: 'Si contiene datos identificables, cada reenvío amplía la exposición.' },
        ] },
      ],
    },
    caseStudy: { eyebrow: 'CASO REAL DOCUMENTADO', title: 'Compartir, publicar e indexar no son lo mismo', source: 'TechCrunch', date: '31 jul 2025', summary: 'Conversaciones de ChatGPT compartidas públicamente podían aparecer en buscadores cuando el usuario activaba su descubrimiento. No fue una exposición indiscriminada de chats privados; la función fue retirada.', takeaway: 'Una acción técnicamente voluntaria puede tener un alcance que la persona no anticipa.', url: sources.chats, verification: 'verificada' },
    notes: {
      briefing: 'Recuerda todas las huellas sin mostrar puntuaciones. La decisión final trata tanto el tiempo como el alcance de la información.', dialogue: 'Inés y Tomás convergen parcialmente: ambos aceptan advertir con precisión, pero difieren en tiempo y distribución.', decision: 'Esta decisión puede activar demora o exposición, según el historial. No anuncies el final antes de avanzar.', aftermath: 'Deja que las dos reacciones respiren. Después, el caso real prepara la diferencia entre intención de compartir y alcance real.', 'case-study': 'Verificado. Insiste en el opt-in y los pasos de compartir; no digas que ChatGPT reveló chats privados por sí mismo.',
    },
  },
]
