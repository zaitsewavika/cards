import { describe, expect, it } from 'vitest'
import { CARDS } from '../game/cards.ts'
import { initialGameState } from '../game/gameReducer.ts'
import {
  GAME_STORAGE_KEY,
  LEGACY_GAME_STORAGE_KEY,
  loadGameSnapshot,
  saveGameSnapshot,
} from './storage.ts'

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('game storage', () => {
  it('saves and loads a valid v2 snapshot with an active turn', () => {
    const storage = new MemoryStorage()
    const state = {
      discardedIds: ['clubs-6'] as const,
      trumpSuit: 'diamonds' as const,
      isTurnActive: true,
      pendingTurnIds: ['hearts-ace'] as const,
    }

    expect(saveGameSnapshot(state, storage)).toBe(true)
    expect(JSON.parse(storage.getItem(GAME_STORAGE_KEY) ?? '')).toEqual(state)
    expect(loadGameSnapshot(storage)).toEqual(state)
  })

  it('migrates a valid v1 snapshot as a game without an active turn', () => {
    const storage = new MemoryStorage()
    storage.setItem(
      LEGACY_GAME_STORAGE_KEY,
      JSON.stringify({
        discardedIds: ['clubs-6'],
        trumpSuit: 'hearts',
      }),
    )

    expect(loadGameSnapshot(storage)).toEqual({
      discardedIds: ['clubs-6'],
      trumpSuit: 'hearts',
      isTurnActive: false,
      pendingTurnIds: [],
    })
  })

  it.each([
    {
      discardedIds: ['clubs-6', 'clubs-6'],
      trumpSuit: 'spades',
      isTurnActive: false,
      pendingTurnIds: [],
    },
    {
      discardedIds: [],
      trumpSuit: 'spades',
      isTurnActive: true,
      pendingTurnIds: ['clubs-6', 'clubs-6'],
    },
    {
      discardedIds: ['clubs-6'],
      trumpSuit: 'spades',
      isTurnActive: true,
      pendingTurnIds: ['clubs-6'],
    },
    {
      discardedIds: [],
      trumpSuit: 'spades',
      isTurnActive: false,
      pendingTurnIds: ['clubs-6'],
    },
    {
      discardedIds: [],
      trumpSuit: 'spades',
      isTurnActive: true,
      pendingTurnIds: CARDS.slice(0, 13).map((card) => card.id),
    },
  ])('rejects an inconsistent v2 snapshot', (snapshot) => {
    const storage = new MemoryStorage()
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify(snapshot))

    expect(loadGameSnapshot(storage)).toBeNull()
  })

  it.each([
    '{broken json',
    JSON.stringify(null),
    JSON.stringify({
      discardedIds: ['unknown-card'],
      trumpSuit: 'spades',
      isTurnActive: false,
      pendingTurnIds: [],
    }),
    JSON.stringify({
      discardedIds: [],
      trumpSuit: 'unknown-suit',
      isTurnActive: false,
      pendingTurnIds: [],
    }),
  ])('rejects invalid stored data', (serialized) => {
    const storage = new MemoryStorage()
    storage.setItem(GAME_STORAGE_KEY, serialized)

    expect(loadGameSnapshot(storage)).toBeNull()
  })

  it('does not throw when storage access is forbidden', () => {
    const storage = new MemoryStorage()
    storage.getItem = () => {
      throw new DOMException('Blocked', 'SecurityError')
    }
    storage.setItem = () => {
      throw new DOMException('Blocked', 'SecurityError')
    }

    expect(loadGameSnapshot(storage)).toBeNull()
    expect(saveGameSnapshot(initialGameState, storage)).toBe(false)
  })
})
