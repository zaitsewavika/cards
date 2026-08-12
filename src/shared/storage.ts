import { CARDS, SUITS } from '../game/cards.ts'
import {
  MAX_TURN_CARD_COUNT,
  type GameSnapshot,
} from '../game/gameReducer.ts'
import type { CardId, Suit } from '../game/types.ts'

export const GAME_STORAGE_KEY = 'cards-game-state:v2'
export const LEGACY_GAME_STORAGE_KEY = 'cards-game-state:v1'

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

function parseCardIds(value: unknown): CardId[] | null {
  if (!Array.isArray(value) || !value.every(isCardId)) {
    return null
  }

  const cardIds = value as CardId[]
  return new Set(cardIds).size === cardIds.length ? [...cardIds] : null
}

function parseSnapshot(value: unknown): GameSnapshot | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>

  const discardedIds = parseCardIds(candidate.discardedIds)
  const pendingTurnIds = parseCardIds(candidate.pendingTurnIds)

  if (
    !isSuit(candidate.trumpSuit) ||
    typeof candidate.isTurnActive !== 'boolean' ||
    discardedIds === null ||
    pendingTurnIds === null ||
    pendingTurnIds.length > MAX_TURN_CARD_COUNT
  ) {
    return null
  }

  if (!candidate.isTurnActive && pendingTurnIds.length > 0) {
    return null
  }

  if (pendingTurnIds.some((cardId) => discardedIds.includes(cardId))) {
    return null
  }

  return {
    discardedIds,
    trumpSuit: candidate.trumpSuit,
    isTurnActive: candidate.isTurnActive,
    pendingTurnIds,
  }
}

function parseLegacySnapshot(value: unknown): GameSnapshot | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const discardedIds = parseCardIds(candidate.discardedIds)

  if (!isSuit(candidate.trumpSuit) || discardedIds === null) {
    return null
  }

  return {
    discardedIds,
    trumpSuit: candidate.trumpSuit,
    isTurnActive: false,
    pendingTurnIds: [],
  }
}

export function loadGameSnapshot(storage?: Storage): GameSnapshot | null {
  try {
    const targetStorage = storage ?? window.localStorage
    const serialized = targetStorage.getItem(GAME_STORAGE_KEY)

    if (serialized !== null) {
      return parseSnapshot(JSON.parse(serialized) as unknown)
    }

    const legacySerialized = targetStorage.getItem(LEGACY_GAME_STORAGE_KEY)
    return legacySerialized === null
      ? null
      : parseLegacySnapshot(JSON.parse(legacySerialized) as unknown)
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
      isTurnActive: snapshot.isTurnActive,
      pendingTurnIds: snapshot.pendingTurnIds,
    } satisfies GameSnapshot)

    targetStorage.setItem(GAME_STORAGE_KEY, serialized)
    return true
  } catch {
    return false
  }
}
