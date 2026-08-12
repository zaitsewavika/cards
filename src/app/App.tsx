import { useReducer } from 'react'
import { GameControls } from '../components/GameControls/GameControls.tsx'
import { GameBoard } from '../components/GameBoard/GameBoard.tsx'
import { GameStatus } from '../components/GameStatus/GameStatus.tsx'
import { TrumpSelector } from '../components/TrumpSelector/TrumpSelector.tsx'
import { gameReducer, initialGameState } from '../game/gameReducer.ts'
import { canUndo, getRemainingCardCount } from '../game/selectors.ts'
import styles from './App.module.css'

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const discardedCount = state.discardedIds.length

  function handleReset() {
    const shouldReset =
      discardedCount === 0 ||
      window.confirm(
        'Начать новую партию? Все отметки карт «в бито» будут удалены.',
      )

    if (shouldReset) {
      dispatch({ type: 'reset' })
    }
  }

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <div className={styles.intro}>
          <h1>Cards</h1>
          <p className={styles.lead}>
            Помощник для учёта карт в игре «Дурак».
          </p>
        </div>
        <GameStatus
          remainingCount={getRemainingCardCount(state)}
          discardedCount={discardedCount}
          trumpSuit={state.trumpSuit}
        />
        <TrumpSelector
          value={state.trumpSuit}
          onChange={(suit) => dispatch({ type: 'set-trump', suit })}
        />
        <GameControls
          undoDisabled={!canUndo(state)}
          onUndo={() => dispatch({ type: 'undo' })}
          onReset={handleReset}
        />
      </header>
      <GameBoard
        trumpSuit={state.trumpSuit}
        discardedIds={state.discardedIds}
        onToggleCard={(cardId) => dispatch({ type: 'toggle-card', cardId })}
      />
    </main>
  )
}

export default App
