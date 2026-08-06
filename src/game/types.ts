export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades'

export type Rank =
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'
  | 'ace'

export type CardId = `${Suit}-${Rank}`

export interface Card {
  readonly id: CardId
  readonly suit: Suit
  readonly rank: Rank
}
