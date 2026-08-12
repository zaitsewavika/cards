import {
  isRedSuit,
  RANK_LABELS,
  SUIT_LABELS,
  SUIT_SYMBOLS,
} from '../../game/cards.ts'
import type { Card as CardModel, CardId } from '../../game/types.ts'
import styles from './Card.module.css'

export interface CardProps {
  readonly card: CardModel
  readonly discarded: boolean
  readonly pending: boolean
  readonly isTrump: boolean
  readonly onToggle: (cardId: CardId) => void
}

export function Card({ card, discarded, pending, isTrump, onToggle }: CardProps) {
  const rankLabel = RANK_LABELS[card.rank]
  const suitLabel = SUIT_LABELS[card.suit]
  const suitSymbol = SUIT_SYMBOLS[card.suit]
  const className = [
    styles.card,
    isRedSuit(card.suit) ? styles.red : styles.black,
    discarded ? styles.discarded : '',
    pending ? styles.pending : '',
    isTrump ? styles.trump : '',
  ]
    .filter(Boolean)
    .join(' ')
  const stateLabel = discarded
    ? 'В бито.'
    : pending
      ? 'Выбрана в текущем ходе.'
      : 'Осталась в игре.'
  const trumpLabel = isTrump ? ' Козырная масть.' : ''

  return (
    <button
      type="button"
      className={className}
      aria-label={`Карта: ${rankLabel}, масть — ${suitLabel}. ${stateLabel}${trumpLabel}`}
      aria-pressed={pending}
      disabled={discarded}
      onClick={() => onToggle(card.id)}
    >
      <span className={styles.corner} aria-hidden="true">
        <span className={styles.rank}>{rankLabel}</span>
        <span className={styles.cornerSuit}>{suitSymbol}</span>
      </span>

      <span className={styles.centerSuit} aria-hidden="true">
        {suitSymbol}
      </span>

      <span
        className={`${styles.corner} ${styles.cornerBottom}`}
        aria-hidden="true"
      >
        <span className={styles.rank}>{rankLabel}</span>
        <span className={styles.cornerSuit}>{suitSymbol}</span>
      </span>

      <span className={styles.discardLabel} aria-hidden="true">
        В бито
      </span>
      <span className={styles.pendingLabel} aria-hidden="true">
        В ходе
      </span>
    </button>
  )
}
