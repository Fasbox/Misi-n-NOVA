import { chapters } from './chapters'
import type { Scene } from '../types/story'

export const scenes: Scene[] = [
  { id: 'title', kind: 'title', label: 'Apertura' },
  { id: 'media', kind: 'media', label: 'Prólogo · evidencia visual' },
  ...chapters.flatMap((chapter, chapterIndex): Scene[] => [
    { id: `${chapter.id}-briefing`, kind: 'briefing', chapterIndex, label: `Capítulo ${chapter.number}` },
    { id: `${chapter.id}-dialogue`, kind: 'dialogue', chapterIndex, label: `Capítulo ${chapter.number} · voces` },
    { id: `${chapter.id}-decision`, kind: 'decision', chapterIndex, label: `Decisión ${chapter.number}` },
    { id: `${chapter.id}-aftermath`, kind: 'aftermath', chapterIndex, label: `Consecuencia ${chapter.number}` },
    { id: `${chapter.id}-case`, kind: 'case-study', chapterIndex, label: `Puente documental ${chapter.number}` },
  ]),
  { id: 'ending', kind: 'ending', label: 'Desenlace' },
  { id: 'debrief', kind: 'debrief', label: 'Conclusión y aprendizaje' },
]
