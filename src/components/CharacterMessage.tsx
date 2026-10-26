import { characters } from '../content/characters'
import type { DialogueLine } from '../types/story'

export function CharacterMessage({ line, compact = false }: { line: DialogueLine; compact?: boolean }) {
  const character = characters[line.character]
  return (
    <article className={`character-message character-${character.id} ${compact ? 'compact' : ''}`}>
      <div className="character-avatar" aria-hidden="true">
        <span>{character.initials}</span>
        <img src={character.portrait} alt="" />
      </div>
      <div className="character-copy">
        <div className="character-meta">
          <strong>{character.name}</strong>
          <span>{line.label ?? character.role}</span>
        </div>
        <p>{line.text}</p>
      </div>
    </article>
  )
}
