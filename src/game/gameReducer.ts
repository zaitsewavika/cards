import type { CardId, Suit } from './types.ts'

export interface GameSnapshot {
  readonly discardedIds: readonly CardId[]
  readonly trumpSuit: Suit
}

export interface GameState extends GameSnapshot {
  readonly history: readonly GameSnapshot[]
}

export type GameAction =
  | { readonly type: 'toggle-card'; readonly cardId: CardId }
  | { readonly type: 'set-trump'; readonly suit: Suit }
  | { readonly type: 'undo' }
  | { readonly type: 'reset' }
  | { readonly type: 'hydrate'; readonly snapshot: GameSnapshot }

export const INITIAL_TRUMP_SUIT: Suit = 'spades'

export const initialGameState: GameState = {
  discardedIds: [],
  trumpSuit: INITIAL_TRUMP_SUIT,
  history: [],
}

function createSnapshot(state: GameState): GameSnapshot {
  return {
    discardedIds: state.discardedIds,
    trumpSuit: state.trumpSuit,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'toggle-card': {
      const discardedIds = state.discardedIds.includes(action.cardId)
        ? state.discardedIds.filter((cardId) => cardId !== action.cardId)
        : [...state.discardedIds, action.cardId]

      return {
        ...state,
        discardedIds,
        history: [...state.history, createSnapshot(state)],
      }
    }

    case 'set-trump':
      if (action.suit === state.trumpSuit) {
        return state
      }

      return {
        ...state,
        trumpSuit: action.suit,
        history: [...state.history, createSnapshot(state)],
      }

    case 'undo': {
      const previousSnapshot = state.history.at(-1)

      if (previousSnapshot === undefined) {
        return state
      }

      return {
        discardedIds: previousSnapshot.discardedIds,
        trumpSuit: previousSnapshot.trumpSuit,
        history: state.history.slice(0, -1),
      }
    }

    case 'reset':
      return initialGameState

    case 'hydrate':
      return {
        discardedIds: [...action.snapshot.discardedIds],
        trumpSuit: action.snapshot.trumpSuit,
        history: [],
      }
  }
}
