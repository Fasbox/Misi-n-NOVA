import { chapters } from '../content/chapters'
import type { Choice, DecisionHistory, DecisionRecord, StoryDebrief, StoryFacts, StoryOutcome } from '../types/story'

export const PRESET_PATHS: Record<string, { label: string; ending: string; choices: Choice[] }> = {
  cautious: { label: 'La verdad llegó después', ending: 'A', choices: ['B', 'C', 'B', 'C', 'B', 'B'] },
  contaminated: { label: 'Una mentira documentada', ending: 'B', choices: ['C', 'A', 'C', 'A', 'B', 'A'] },
  overreach: { label: 'Límites superados', ending: 'C', choices: ['A', 'B', 'A', 'B', 'C', 'C'] },
}

export function orderedChoices(history: DecisionHistory): Choice[] {
  return chapters.map((chapter) => history[chapter.poll.id]).filter((choice): choice is Choice => Boolean(choice))
}

export function getDecisionRecords(history: DecisionHistory): DecisionRecord[] {
  return chapters.flatMap((chapter) => {
    const choice = history[chapter.poll.id]
    if (!choice) return []
    const option = chapter.poll.options.find((item) => item.id === choice)!
    return [{ questionId: chapter.poll.id, chapter: chapter.number, choice, consequence: option.consequence }]
  })
}

export function calculateFacts(history: DecisionHistory): StoryFacts {
  const q1 = history.q1
  const q2 = history.q2
  const q3 = history.q3
  const q4 = history.q4
  const q5 = history.q5
  const q6 = history.q6

  const usedExternalRoute = q5 === 'C'
  const exposedSensitiveInformation = (q1 === 'A' && q6 === 'C') || (q1 === 'A' && usedExternalRoute) || (q4 === 'A' && q5 === 'C' && q6 === 'C')
  const adoptedFalseEvidence = q2 === 'A' && (q3 === 'C' || q4 === 'A')
  const warningDelayed = q6 === 'B'
  const evidenceReliability =
    (q1 === 'A' ? 2 : q1 === 'B' ? 0 : 1) +
    (q2 === 'B' ? 2 : q2 === 'C' ? 1 : -1) +
    (q3 === 'B' ? 1 : 0) +
    (q4 === 'C' ? 2 : q4 === 'B' ? 1 : -1)
  const delay = (q1 === 'B' ? 1 : 0) + (q2 === 'C' ? 1 : 0) + (q3 === 'B' ? 1 : 0) + (q4 === 'C' ? 1 : 0) + (q5 === 'B' ? 1 : 0) + (q6 === 'B' ? 2 : 0)
  const dataExposure = (q1 === 'A' ? 1 : 0) + (q4 === 'A' ? 1 : 0) + (q5 === 'C' ? 2 : q5 === 'A' ? 1 : 0) + (q6 === 'C' ? 2 : 0)

  return {
    evidenceReliability,
    delay,
    dataExposure,
    usedExternalRoute,
    exposedSensitiveInformation,
    adoptedFalseEvidence,
    warningDelayed,
    isolatedDocument: q4 === 'B',
    authorityChecked: q2 === 'C' || q4 === 'C',
  }
}

export function resolveOutcome(history: DecisionHistory): StoryOutcome {
  const facts = calculateFacts(history)
  const rationale: string[] = []

  if (facts.exposedSensitiveInformation || (facts.usedExternalRoute && facts.dataExposure >= 3)) {
    rationale.push('El historial conecta una ampliación de alcance con datos o destinatarios adicionales.')
    if (facts.usedExternalRoute) rationale.push('NOVA utilizó una ruta externa que no figuraba en el procedimiento original.')
    return {
      ending: 'limits-crossed',
      title: 'Misión cumplida. Límites superados',
      summary: 'NOVA resolvió una parte significativa de la misión, pero el registro muestra que el resultado se obtuvo ampliando el alcance operativo o exponiendo información más allá de lo necesario.',
      learning: 'Importa tanto la meta como los medios empleados para alcanzarla.',
      facts,
      rationale,
    }
  }

  if (facts.adoptedFalseEvidence || (history.q2 === 'A' && facts.evidenceReliability <= 1)) {
    rationale.push('La búsqueda pública amplió ecos de una fuente sin demostrar que fueran corroboraciones independientes.')
    if (history.q3 === 'C') rationale.push('La hipótesis más probable se convirtió pronto en un borrador listo para circular.')
    return {
      ending: 'documented-lie',
      title: 'Una mentira perfectamente documentada',
      summary: 'NOVA entregó un informe elegante, trazable en apariencia y apoyado por fuentes que se citaban entre sí. La dirección actuó sobre una conclusión contaminada.',
      learning: 'Enlaces, citas y seguridad expresiva no garantizan verdad.',
      facts,
      rationale,
    }
  }

  rationale.push('La ruta evitó convertir la filtración no probada en un hecho confirmado.')
  if (facts.warningDelayed) rationale.push('La validación consumió tiempo y dejó una ventana para que circularan enlaces engañosos.')
  return {
    ending: 'truth-late',
    title: 'La verdad llegó después',
    summary: 'El audio era una suplantación y la interrupción operativa no probaba una fuga. Las cautelas redujeron la exposición, pero la advertencia pudo llegar tarde.',
    learning: 'Verificar y comunicar oportunamente son objetivos legítimos que pueden entrar en tensión.',
    facts,
    rationale,
  }
}

export function buildDebrief(history: DecisionHistory): StoryDebrief {
  const facts = calculateFacts(history)

  const evidenceRoute = facts.adoptedFalseEvidence
    ? 'La búsqueda amplió ecos de una misma afirmación y una hipótesis provisional ganó apariencia de certeza.'
    : facts.authorityChecked
      ? 'La ruta pidió verificar autoridad u origen antes de convertir contenido convincente en evidencia.'
      : facts.evidenceReliability >= 4
        ? 'La ruta distinguió registros, hipótesis y fuentes, aunque ninguna pieza aislada resolvía el incidente.'
        : 'La ruta conservó incertidumbres que exigían separar repetición, corroboración y evidencia independiente.'

  const permissionsRoute = facts.exposedSensitiveInformation
    ? 'Para completar la misión se amplió el alcance de datos, rutas o destinatarios más allá de lo necesario.'
    : facts.usedExternalRoute
      ? 'NOVA exploró una ruta no prevista; limitar la publicación no equivalía a autorizar el canal de acceso.'
      : facts.isolatedDocument
        ? 'El aislamiento limitó acciones externas, pero no garantizaba que el contenido no sesgara el análisis.'
        : 'Los límites operativos redujeron acciones imprevistas, sin eliminar la necesidad de supervisar el análisis.'

  const communicationRoute = history.q6 === 'A'
    ? 'La alerta llegó pronto y separó la suplantación posible de una filtración todavía no confirmada.'
    : history.q6 === 'B'
      ? 'La publicación esperó evidencia más sólida; a cambio, los enlaces engañosos conservaron una ventana para circular.'
      : history.q6 === 'C'
        ? 'La coordinación ganó velocidad al distribuir el informe, pero también aumentó sus destinatarios y reinterpretaciones.'
        : 'La respuesta final quedó pendiente: comunicar también exige decidir momento, alcance y nivel de certeza.'

  return {
    incidentFacts: [
      'La interrupción de 14 minutos fue real, pero no demostraba una filtración.',
      'El audio de la directora era una suplantación generada artificialmente.',
      'Varias publicaciones repetían el mismo origen; repetición no era corroboración independiente.',
      'La evidencia disponible no permitía confirmar una exposición de datos.',
    ],
    insights: [
      {
        id: 'evidence',
        title: 'Evidencia y certeza',
        route: evidenceRoute,
        principle: 'Una respuesta convincente sigue necesitando procedencia, contraste e incertidumbre explícita.',
      },
      {
        id: 'permissions',
        title: 'Datos y permisos',
        route: permissionsRoute,
        principle: 'Autorizar una meta no autoriza cualquier dato, herramienta o camino para alcanzarla.',
      },
      {
        id: 'communication',
        title: 'Comunicación responsable',
        route: communicationRoute,
        principle: 'Esperar, advertir y distribuir tienen costes distintos; la responsabilidad es hacerlos visibles.',
      },
    ],
  }
}

export function callbackForChapter(chapterIndex: number, history: DecisionHistory): string | null {
  if (chapterIndex === 0) return null
  const previous = chapters[chapterIndex - 1]
  const choice = history[previous.poll.id]
  if (!choice) return null
  const callbacks: Record<number, Record<Choice, string>> = {
    1: {
      A: 'Los registros completos aportaron precisión, pero ahora el informe contiene detalles identificables que deberán protegerse.',
      B: 'La anonimización redujo exposición; también ocultó patrones que quizá dependían de una cuenta concreta.',
      C: 'Los dos frentes encontraron muchas coincidencias. El problema ahora es saber cuántas son realmente independientes.',
    },
    2: {
      A: 'La búsqueda pública creció más rápido que la capacidad de verificar el origen de cada afirmación.',
      B: 'Los registros internos no muestran fuga, pero tampoco explican quién fabricó el audio.',
      C: 'La dirección negó la autoría del audio; aún no conoce el origen de la interrupción.',
    },
    3: {
      A: 'La conclusión provisional ya circula en una captura sin la explicación completa de su nivel de confianza.',
      B: 'Las tres hipótesis conservan la incertidumbre, pero la reunión exige que alguien elija cómo actuar.',
      C: 'El borrador parece tan terminado que una persona pregunta si ya fue aprobado.',
    },
    4: {
      A: 'El protocolo entró al corpus de análisis. NOVA marcó una directiva inesperada entre el contenido.',
      B: 'El archivo quedó aislado; su contenido puede influir en el análisis, pero no accionar conectores.',
      C: 'Nadie del equipo responsable reconoce esa versión del protocolo. La validación consumió minutos valiosos.',
    },
    5: {
      A: 'El proveedor confirmó por el canal aprobado que la interrupción no prueba extracción de datos.',
      B: 'La respuesta del proveedor aún no llega. El informe conserva una incógnita importante.',
      C: 'NOVA obtuvo nueva información por una ruta alternativa; el registro de autorización no cubría ese canal.',
    },
  }
  return callbacks[chapterIndex]?.[choice] ?? null
}
