import {
  isRedSuit,
  RANKS,
  SUIT_LABELS,
  SUIT_SYMBOLS,
} from '../../game/cards.ts'
import { getOrderedSuits } from '../../game/selectors.ts'
import type { Card as CardModel, CardId, Suit } from '../../game/types.ts'
import { Card } from '../Card/Card.tsx'
import styles from './GameBoard.module.css'

export interface GameBoardProps {
  readonly trumpSuit: Suit
  readonly discardedIds: readonly CardId[]
  readonly onToggleCard: (cardId: CardId) => void
}

export function GameBoard({
  trumpSuit,
  discardedIds,
  onToggleCard,
}: GameBoardProps) {
  const orderedSuits = getOrderedSuits(trumpSuit)
  const discardedCardIds = new Set(discardedIds)

  return (
    <section className={styles.board} aria-label="Игровое поле">
      <div className={styles.scroller}>
        <div
          className={styles.grid}
          role="grid"
          aria-colcount={orderedSuits.length}
          aria-rowcount={RANKS.length + 1}
        >
          <div className={styles.headerRow} role="row">
            {orderedSuits.map((suit, index) => {
              const isTrump = index === orderedSuits.length - 1

              return (
                <div
                  key={suit}
                  className={`${styles.header} ${isTrump ? styles.trumpColumn : ''}`}
                  role="columnheader"
                >
                  {isTrump && <span className={styles.trumpLabel}>Козырь</span>}
                  <span
                    className={isRedSuit(suit) ? styles.redSuit : styles.blackSuit}
                    aria-hidden="true"
                  >
                    {SUIT_SYMBOLS[suit]}
                  </span>
                  <span>{SUIT_LABELS[suit]}</span>
                </div>
              )
            })}
          </div>

          {RANKS.map((rank) => (
            <div key={rank} className={styles.cardRow} role="row">
              {orderedSuits.map((suit, index) => {
                const card = {
                  id: `${suit}-${rank}`,
                  suit,
                  rank,
                } satisfies CardModel

                return (
                  <div
                    key={card.id}
                    className={`${styles.cardCell} ${
                      index === orderedSuits.length - 1
                        ? styles.trumpColumn
                        : ''
                    }`}
                    role="gridcell"
                  >
                    <Card
                      card={card}
                      discarded={discardedCardIds.has(card.id)}
                      isTrump={suit === trumpSuit}
                      onToggle={onToggleCard}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
