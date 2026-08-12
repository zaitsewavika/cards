import styles from './GameControls.module.css'

export interface GameControlsProps {
  readonly undoDisabled: boolean
  readonly onUndo: () => void
  readonly onReset: () => void
}

export function GameControls({
  undoDisabled,
  onUndo,
  onReset,
}: GameControlsProps) {
  return (
    <div className={styles.controls} aria-label="Управление партией">
      <button type="button" disabled={undoDisabled} onClick={onUndo}>
        Отменить
      </button>
      <button type="button" className={styles.reset} onClick={onReset}>
        Новая партия
      </button>
    </div>
  )
}
