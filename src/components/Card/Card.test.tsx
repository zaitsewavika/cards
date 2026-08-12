import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CARDS } from '../../game/cards.ts'
import { Card } from './Card.tsx'

const CARD = CARDS.find((card) => card.id === 'hearts-ace') ?? CARDS[0]

describe('Card', () => {
  it.each([
    {
      discarded: false,
      pending: false,
      stateLabel: 'Осталась в игре',
      pressed: 'false',
      disabled: false,
    },
    {
      discarded: false,
      pending: true,
      stateLabel: 'Выбрана в текущем ходе',
      pressed: 'true',
      disabled: false,
    },
    {
      discarded: true,
      pending: false,
      stateLabel: 'В бито',
      pressed: 'false',
      disabled: true,
    },
  ])(
    'describes the card state as "$stateLabel"',
    ({ discarded, pending, stateLabel, pressed, disabled }) => {
      render(
        <Card
          card={CARD}
          discarded={discarded}
          pending={pending}
          isTrump
          onToggle={vi.fn()}
        />,
      )

      const button = screen.getByRole('button', {
        name: new RegExp(`${stateLabel}.*Козырная масть`),
      })

      expect(button).toHaveAttribute('aria-pressed', pressed)
      expect(button).toHaveProperty('disabled', disabled)
    },
  )

  it('passes its CardId to the click handler', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(
      <Card
        card={CARD}
        discarded={false}
        pending={false}
        isTrump={false}
        onToggle={onToggle}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Осталась в игре/ }))

    expect(onToggle).toHaveBeenCalledOnce()
    expect(onToggle).toHaveBeenCalledWith(CARD.id)
  })
})
