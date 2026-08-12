import { describe, expect, it } from 'vitest'
import { SUITS } from './cards.ts'
import { getOrderedSuits } from './selectors.ts'

describe('getOrderedSuits', () => {
  it.each(SUITS)('places %s last without losing other suits', (trumpSuit) => {
    const orderedSuits = getOrderedSuits(trumpSuit)

    expect(orderedSuits).toHaveLength(SUITS.length)
    expect(orderedSuits.at(-1)).toBe(trumpSuit)
    expect(new Set(orderedSuits)).toEqual(new Set(SUITS))
  })
})
