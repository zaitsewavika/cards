import { describe, expect, it } from 'vitest'
import { CARDS, RANKS, SUITS } from './cards.ts'

describe('card deck', () => {
  it('contains exactly 36 cards with unique identifiers', () => {
    expect(CARDS).toHaveLength(36)
    expect(new Set(CARDS.map((card) => card.id)).size).toBe(36)
  })

  it('contains every suit exactly once for every rank', () => {
    for (const rank of RANKS) {
      const rankCards = CARDS.filter((card) => card.rank === rank)

      expect(rankCards).toHaveLength(SUITS.length)
      expect(rankCards.map((card) => card.suit)).toEqual(SUITS)
    }
  })

  it('uses RANKS as the only rank ordering source', () => {
    const rankOrder = [...new Set(CARDS.map((card) => card.rank))]

    expect(rankOrder).toEqual(RANKS)
  })
})
