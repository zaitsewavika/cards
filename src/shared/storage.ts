import { CARDS, SUITS } from '../game/cards.ts'
import type { GameSnapshot } from '../game/gameReducer.ts'
import type { CardId, Suit } from '../game/types.ts'

export const GAME_STORAGE_KEY = 'cards-game-state:v1'

const KNOWN_CARD_IDS = new Set<CardId>(CARDS.map((card) => card.id))

function isSuit(value: unknown): value is Suit {
  return (
    typeof value === 'string' &&
    (SUITS as readonly string[]).includes(value)
  )
}

function isCardId(value: unknown): value is CardId {
  return typeof value === 'string' && KNOWN_CARD_IDS.has(value as CardId)
}

function parseSnapshot(value: unknown): GameSnapshot | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>

  if (!isSuit(candidate.trumpSuit) || !Array.isArray(candidate.discardedIds)) {
    return null
  }

  if (!candidate.discardedIds.every(isCardId)) {
    return null
  }

  const discardedIds = candidate.discardedIds as CardId[]

  if (new Set(discardedIds).size !== discardedIds.length) {
    return null
  }

  return {
    discardedIds: [...discardedIds],
    trumpSuit: candidate.trumpSuit,
  }
}

export function loadGameSnapshot(storage?: Storage): GameSnapshot | null {
  try {
    const targetStorage = storage ?? window.localStorage
    const serialized = targetStorage.getItem(GAME_STORAGE_KEY)

    if (serialized === null) {
      return null
    }

    return parseSnapshot(JSON.parse(serialized) as unknown)
  } catch {
    return null
  }
}

export function saveGameSnapshot(
  snapshot: GameSnapshot,
  storage?: Storage,
): boolean {
  try {
    const targetStorage = storage ?? window.localStorage
    const serialized = JSON.stringify({
      discardedIds: snapshot.discardedIds,
      trumpSuit: snapshot.trumpSuit,
    } satisfies GameSnapshot)

    targetStorage.setItem(GAME_STORAGE_KEY, serialized)
    return true
  } catch {
    return false
  }
}
