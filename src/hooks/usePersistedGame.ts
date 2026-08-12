import { useEffect, useReducer } from 'react'
import {
  gameReducer,
  initialGameState,
  type GameState,
} from '../game/gameReducer.ts'
import { loadGameSnapshot, saveGameSnapshot } from '../shared/storage.ts'

function createInitialState(): GameState {
  const snapshot = loadGameSnapshot()

  if (snapshot === null) {
    return initialGameState
  }

  return {
    discardedIds: snapshot.discardedIds,
    trumpSuit: snapshot.trumpSuit,
    history: [],
  }
}

export function usePersistedGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialGameState,
    createInitialState,
  )

  useEffect(() => {
    saveGameSnapshot({
      discardedIds: state.discardedIds,
      trumpSuit: state.trumpSuit,
    })
  }, [state.discardedIds, state.trumpSuit])

  return [state, dispatch] as const
}
