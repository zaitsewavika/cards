import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RANK_LABELS, RANKS } from '../../game/cards.ts'
import { GameBoard } from './GameBoard.tsx'

describe('GameBoard', () => {
  it('renders 36 cards in rank order with trump in the last column', () => {
    render(
      <GameBoard
        trumpSuit="hearts"
        discardedIds={[]}
        pendingTurnIds={[]}
        onToggleCard={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('button', { name: /^Карта:/ })).toHaveLength(36)

    const rows = screen.getAllByRole('row').slice(1)
    expect(rows).toHaveLength(RANKS.length)

    rows.forEach((row, index) => {
      const cards = within(row).getAllByRole('button')

      expect(cards).toHaveLength(4)
      expect(cards[0]).toHaveAccessibleName(
        new RegExp(`Карта: ${RANK_LABELS[RANKS[index]]},`),
      )
      expect(cards.at(-1)).toHaveAccessibleName(/масть — черви.*Козырная масть/)
    })
  })

  it('does not allow a discarded card to be selected again', async () => {
    const user = userEvent.setup()
    const onToggleCard = vi.fn()
    render(
      <GameBoard
        trumpSuit="spades"
        discardedIds={['clubs-6']}
        pendingTurnIds={[]}
        onToggleCard={onToggleCard}
      />,
    )

    const discardedCard = screen.getByRole('button', {
      name: /Карта: 6, масть — трефы.*В бито/,
    })
    expect(discardedCard).toBeDisabled()

    await user.click(discardedCard)
    expect(onToggleCard).not.toHaveBeenCalled()
  })
})
