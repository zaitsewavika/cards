import { describe, expect, it } from 'vitest'
import { initialGameState } from '../game/gameReducer.ts'
import {
  GAME_STORAGE_KEY,
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
  it('saves and loads only a valid snapshot without history', () => {
    const storage = new MemoryStorage()
    const state = {
      ...initialGameState,
      discardedIds: ['clubs-6', 'hearts-ace'] as const,
      trumpSuit: 'diamonds' as const,
      history: [{ discardedIds: [], trumpSuit: 'spades' as const }],
    }

    expect(saveGameSnapshot(state, storage)).toBe(true)
    expect(JSON.parse(storage.getItem(GAME_STORAGE_KEY) ?? '')).toEqual({
      discardedIds: ['clubs-6', 'hearts-ace'],
      trumpSuit: 'diamonds',
    })
    expect(loadGameSnapshot(storage)).toEqual({
      discardedIds: ['clubs-6', 'hearts-ace'],
      trumpSuit: 'diamonds',
    })
  })

  it('rejects duplicate card identifiers', () => {
    const storage = new MemoryStorage()
    storage.setItem(
      GAME_STORAGE_KEY,
      JSON.stringify({
        discardedIds: ['clubs-6', 'clubs-6'],
        trumpSuit: 'spades',
      }),
    )

    expect(loadGameSnapshot(storage)).toBeNull()
  })

  it.each([
    '{broken json',
    JSON.stringify(null),
    JSON.stringify({ discardedIds: ['unknown-card'], trumpSuit: 'spades' }),
    JSON.stringify({ discardedIds: [], trumpSuit: 'unknown-suit' }),
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
