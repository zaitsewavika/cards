import styles from './GameControls.module.css'

export interface GameControlsProps {
  readonly isTurnActive: boolean
  readonly canResolveTurn: boolean
  readonly onStartTurn: () => void
  readonly onFinishTurn: () => void
  readonly onTakeCards: () => void
  readonly onReset: () => void
}

export function GameControls({
  isTurnActive,
  canResolveTurn,
  onStartTurn,
  onFinishTurn,
  onTakeCards,
  onReset,
}: GameControlsProps) {
  return (
    <div className={styles.controls} aria-label="Управление партией">
      <button type="button" disabled={isTurnActive} onClick={onStartTurn}>
        Начало хода
      </button>
      <button
        type="button"
        disabled={!canResolveTurn}
        onClick={onFinishTurn}
      >
        Конец хода
      </button>
      <button type="button" disabled={!canResolveTurn} onClick={onTakeCards}>
        Взял
      </button>
      <button type="button" className={styles.reset} onClick={onReset}>
        Новая партия
      </button>
    </div>
  )
}
