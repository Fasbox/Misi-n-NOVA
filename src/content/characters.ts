import type { Character, CharacterId } from '../types/story'

export const characters: Record<CharacterId, Character> = {
  ines: { id: 'ines', name: 'Inés', role: 'Comunicaciones', initials: 'IN', portrait: '/assets/characters/ines.png' },
  tomas: { id: 'tomas', name: 'Tomás', role: 'Seguridad', initials: 'TO', portrait: '/assets/characters/tomas.png' },
  nova: { id: 'nova', name: 'NOVA', role: 'Agente de IA', initials: 'NV', portrait: '/assets/characters/nova.png' },
}
