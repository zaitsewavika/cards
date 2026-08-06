import { CARDS, SUITS } from './cards.ts'
import type { GameSnapshot, GameState } from './gameReducer.ts'
import type { Suit } from './types.ts'

export function getRemainingCardCount(state: GameSnapshot): number {
  return CARDS.length - state.discardedIds.length
}

export function canUndo(state: GameState): boolean {
  return state.history.length > 0
}

export function getOrderedSuits(trumpSuit: Suit): readonly Suit[] {
  return [...SUITS.filter((suit) => suit !== trumpSuit), trumpSuit]
}
