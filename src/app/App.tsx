import { useReducer } from 'react'
import { GameBoard } from '../components/GameBoard/GameBoard.tsx'
import { gameReducer, initialGameState } from '../game/gameReducer.ts'
import styles from './App.module.css'

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  return (
    <main className={styles.app}>
      <h1>Cards</h1>
      <p className={styles.lead}>
        Помощник для учёта карт в игре «Дурак».
      </p>
      <GameBoard
        trumpSuit={state.trumpSuit}
        discardedIds={state.discardedIds}
        onToggleCard={(cardId) => dispatch({ type: 'toggle-card', cardId })}
      />
    </main>
  )
}

export default App
