import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'

function getStatusValue(label: string, value: string) {
  const status = screen.getByLabelText('Статус партии')
  const statusItem = within(status).getByText(label).parentElement

  expect(statusItem).not.toBeNull()
  return within(statusItem as HTMLElement).getByText(value)
}

describe('App turn scenarios', () => {
  it('automatically starts a turn and confirms the selected card as discarded', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: /Карта: 6, масть — трефы.*Осталась в игре/,
      }),
    )

    expect(screen.getByText('Начинаем ход')).toBeInTheDocument()
    expect(getStatusValue('В текущем ходе', '1 из 12')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Конец хода' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Конец хода' }))

    expect(getStatusValue('В бито', '1')).toBeInTheDocument()
    expect(getStatusValue('В текущем ходе', '0 из 12')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /Карта: 6, масть — трефы.*В бито/,
      }),
    ).toBeDisabled()
  })

  it('returns selected cards to play when somebody takes them', async () => {
    const user = userEvent.setup()
    render(<App />)
    const card = screen.getByRole('button', {
      name: /Карта: 6, масть — трефы.*Осталась в игре/,
    })

    await user.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Взял' }))

    expect(getStatusValue('В бито', '0')).toBeInTheDocument()
    expect(getStatusValue('В текущем ходе', '0 из 12')).toBeInTheDocument()
    expect(card).toBeEnabled()
    expect(card).toHaveAttribute('aria-pressed', 'false')
  })

  it('warns and keeps the thirteenth card unselected', async () => {
    const user = userEvent.setup()
    render(<App />)
    const cards = screen.getAllByRole('button', { name: /^Карта:/ })

    for (const card of cards.slice(0, 12)) {
      await user.click(card)
    }
    await user.click(cards[12])

    expect(
      screen.getByText('За один ход можно выбрать не больше 12 карт'),
    ).toBeInTheDocument()
    expect(getStatusValue('В текущем ходе', '12 из 12')).toBeInTheDocument()
    expect(cards[12]).toHaveAttribute('aria-pressed', 'false')
  })
})
