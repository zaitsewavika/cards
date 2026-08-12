import { CARDS, SUITS } from './cards.ts'
import type { GameSnapshot } from './gameReducer.ts'
import type { Suit } from './types.ts'

export function getRemainingCardCount(state: GameSnapshot): number {
  return CARDS.length - state.discardedIds.length
}

export function getOrderedSuits(trumpSuit: Suit): readonly Suit[] {
  return [...SUITS.filter((suit) => suit !== trumpSuit), trumpSuit]
}
