import {
  isRedSuit,
  SUITS,
  SUIT_LABELS,
  SUIT_SYMBOLS,
} from '../../game/cards.ts'
import type { Suit } from '../../game/types.ts'
import styles from './TrumpSelector.module.css'

export interface TrumpSelectorProps {
  readonly value: Suit
  readonly onChange: (suit: Suit) => void
}

export function TrumpSelector({ value, onChange }: TrumpSelectorProps) {
  return (
    <fieldset className={styles.selector}>
      <legend className={styles.legend}>Козырная масть</legend>
      <div className={styles.options}>
        {SUITS.map((suit) => (
          <button
            key={suit}
            type="button"
            className={`${styles.option} ${
              isRedSuit(suit) ? styles.red : styles.black
            }`}
            aria-label={`Выбрать козырь: ${SUIT_LABELS[suit]}`}
            aria-pressed={value === suit}
            onClick={() => onChange(suit)}
          >
            <span aria-hidden="true">{SUIT_SYMBOLS[suit]}</span>
            <span>{SUIT_LABELS[suit]}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
