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
    isTurnActive: snapshot.isTurnActive,
    pendingTurnIds: snapshot.pendingTurnIds,
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
      isTurnActive: state.isTurnActive,
      pendingTurnIds: state.pendingTurnIds,
    })
  }, [
    state.discardedIds,
    state.isTurnActive,
    state.pendingTurnIds,
    state.trumpSuit,
  ])

  return [state, dispatch] as const
}
