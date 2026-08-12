import type { CardId, Suit } from './types.ts'

export interface GameSnapshot {
  readonly discardedIds: readonly CardId[]
  readonly trumpSuit: Suit
  readonly isTurnActive: boolean
  readonly pendingTurnIds: readonly CardId[]
}

export type GameState = GameSnapshot

export type GameAction =
  | { readonly type: 'start-turn' }
  | { readonly type: 'toggle-turn-card'; readonly cardId: CardId }
  | { readonly type: 'finish-turn' }
  | { readonly type: 'take-cards' }
  | { readonly type: 'set-trump'; readonly suit: Suit }
  | { readonly type: 'reset' }
  | { readonly type: 'hydrate'; readonly snapshot: GameSnapshot }

export const INITIAL_TRUMP_SUIT: Suit = 'spades'
export const MAX_TURN_CARD_COUNT = 12

export const initialGameState: GameState = {
  discardedIds: [],
  trumpSuit: INITIAL_TRUMP_SUIT,
  isTurnActive: false,
  pendingTurnIds: [],
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start-turn':
      if (state.isTurnActive) {
        return state
      }

      return {
        ...state,
        isTurnActive: true,
        pendingTurnIds: [],
      }

    case 'toggle-turn-card': {
      if (state.discardedIds.includes(action.cardId)) {
        return state
      }

      if (state.pendingTurnIds.includes(action.cardId)) {
        return {
          ...state,
          pendingTurnIds: state.pendingTurnIds.filter(
            (cardId) => cardId !== action.cardId,
          ),
        }
      }

      if (state.pendingTurnIds.length >= MAX_TURN_CARD_COUNT) {
        return state
      }

      return {
        ...state,
        isTurnActive: true,
        pendingTurnIds: [...state.pendingTurnIds, action.cardId],
      }
    }

    case 'finish-turn':
      if (!state.isTurnActive || state.pendingTurnIds.length === 0) {
        return state
      }

      return {
        ...state,
        discardedIds: [...state.discardedIds, ...state.pendingTurnIds],
        isTurnActive: false,
        pendingTurnIds: [],
      }

    case 'take-cards':
      if (!state.isTurnActive || state.pendingTurnIds.length === 0) {
        return state
      }

      return {
        ...state,
        isTurnActive: false,
        pendingTurnIds: [],
      }

    case 'set-trump':
      if (action.suit === state.trumpSuit) {
        return state
      }

      return {
        ...state,
        trumpSuit: action.suit,
      }

    case 'reset':
      return initialGameState

    case 'hydrate':
      return {
        discardedIds: [...action.snapshot.discardedIds],
        trumpSuit: action.snapshot.trumpSuit,
        isTurnActive: action.snapshot.isTurnActive,
        pendingTurnIds: [...action.snapshot.pendingTurnIds],
      }
  }
}
