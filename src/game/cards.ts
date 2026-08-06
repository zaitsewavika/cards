import type { Card, CardId, Rank, Suit } from './types.ts'

export const SUITS = [
  'clubs',
  'diamonds',
  'hearts',
  'spades',
] as const satisfies readonly Suit[]

export const RANKS = [
  '6',
  '7',
  '8',
  '9',
  '10',
  'jack',
  'queen',
  'king',
  'ace',
] as const satisfies readonly Rank[]

export const SUIT_SYMBOLS: Readonly<Record<Suit, string>> = {
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
  spades: '♠',
}

export const SUIT_LABELS: Readonly<Record<Suit, string>> = {
  clubs: 'трефы',
  diamonds: 'бубны',
  hearts: 'черви',
  spades: 'пики',
}

export const RANK_LABELS: Readonly<Record<Rank, string>> = {
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  jack: 'В',
  queen: 'Д',
  king: 'К',
  ace: 'Т',
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'diamonds' || suit === 'hearts'
}

export function createDeck(): readonly Card[] {
  return RANKS.flatMap((rank) =>
    SUITS.map((suit) => ({
      id: `${suit}-${rank}` as CardId,
      suit,
      rank,
    })),
  )
}

export const CARDS: readonly Card[] = Object.freeze(createDeck())
