import { useEffect, useState } from 'react'
import { GameBoard } from '../components/GameBoard/GameBoard.tsx'
import { GameControls } from '../components/GameControls/GameControls.tsx'
import { GameStatus } from '../components/GameStatus/GameStatus.tsx'
import { TrumpSelector } from '../components/TrumpSelector/TrumpSelector.tsx'
import { MAX_TURN_CARD_COUNT } from '../game/gameReducer.ts'
import { getRemainingCardCount } from '../game/selectors.ts'
import type { CardId } from '../game/types.ts'
import { usePersistedGame } from '../hooks/usePersistedGame.ts'
import styles from './App.module.css'

interface Notice {
  readonly id: number
  readonly text: string
}

function App() {
  const [state, dispatch] = usePersistedGame()
  const [notice, setNotice] = useState<Notice | null>(null)
  const discardedCount = state.discardedIds.length
  const pendingCount = state.pendingTurnIds.length

  useEffect(() => {
    if (notice === null) {
      return
    }

    const timeoutId = window.setTimeout(() => setNotice(null), 2500)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  function announce(message: string) {
    setNotice({ id: Date.now(), text: message })
  }

  function handleToggleCard(cardId: CardId) {
    const isPending = state.pendingTurnIds.includes(cardId)

    if (!isPending && pendingCount >= MAX_TURN_CARD_COUNT) {
      announce('За один ход можно выбрать не больше 12 карт')
      return
    }

    if (!state.isTurnActive) {
      announce('Начинаем ход')
    }

    dispatch({ type: 'toggle-turn-card', cardId })
  }

  function handleReset() {
    const shouldReset =
      (discardedCount === 0 && pendingCount === 0) ||
      window.confirm(
        'Начать новую партию? Карты «в бито» и выбор текущего хода будут очищены.',
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
          pendingCount={pendingCount}
          isTurnActive={state.isTurnActive}
          trumpSuit={state.trumpSuit}
        />
        <TrumpSelector
          value={state.trumpSuit}
          onChange={(suit) => dispatch({ type: 'set-trump', suit })}
        />
        <GameControls
          isTurnActive={state.isTurnActive}
          canResolveTurn={state.isTurnActive && pendingCount > 0}
          onStartTurn={() => dispatch({ type: 'start-turn' })}
          onFinishTurn={() => dispatch({ type: 'finish-turn' })}
          onTakeCards={() => dispatch({ type: 'take-cards' })}
          onReset={handleReset}
        />
      </header>
      <p className={styles.notice} aria-live="polite" aria-atomic="true">
        {notice === null ? null : <span key={notice.id}>{notice.text}</span>}
      </p>
      <GameBoard
        trumpSuit={state.trumpSuit}
        discardedIds={state.discardedIds}
        pendingTurnIds={state.pendingTurnIds}
        onToggleCard={handleToggleCard}
      />
    </main>
  )
}

export default App
