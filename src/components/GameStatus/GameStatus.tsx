import { SUIT_LABELS, SUIT_SYMBOLS } from '../../game/cards.ts'
import type { Suit } from '../../game/types.ts'
import styles from './GameStatus.module.css'

export interface GameStatusProps {
  readonly remainingCount: number
  readonly discardedCount: number
  readonly pendingCount: number
  readonly isTurnActive: boolean
  readonly trumpSuit: Suit
}

export function GameStatus({
  remainingCount,
  discardedCount,
  pendingCount,
  isTurnActive,
  trumpSuit,
}: GameStatusProps) {
  return (
    <dl className={styles.status} aria-label="Статус партии">
      <div className={styles.item}>
        <dt>Осталось</dt>
        <dd>{remainingCount} из 36</dd>
      </div>
      <div className={styles.item}>
        <dt>В бито</dt>
        <dd>{discardedCount}</dd>
      </div>
      <div className={styles.item}>
        <dt>В текущем ходе</dt>
        <dd>{pendingCount} из 12</dd>
      </div>
      <div className={styles.item}>
        <dt>Ход</dt>
        <dd>{isTurnActive ? 'Идёт' : 'Не начат'}</dd>
      </div>
      <div className={styles.item}>
        <dt>Козырь</dt>
        <dd>
          <span aria-hidden="true">{SUIT_SYMBOLS[trumpSuit]}</span>{' '}
          {SUIT_LABELS[trumpSuit]}
        </dd>
      </div>
    </dl>
  )
}
