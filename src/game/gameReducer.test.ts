import { describe, expect, it } from 'vitest'
import { CARDS } from './cards.ts'
import {
  gameReducer,
  initialGameState,
  MAX_TURN_CARD_COUNT,
} from './gameReducer.ts'

describe('gameReducer turn flow', () => {
  it('produces the same selection after manual and automatic turn start', () => {
    const cardId = CARDS[0].id
    const automatic = gameReducer(initialGameState, {
      type: 'toggle-turn-card',
      cardId,
    })
    const started = gameReducer(initialGameState, { type: 'start-turn' })
    const manual = gameReducer(started, {
      type: 'toggle-turn-card',
      cardId,
    })

    expect(automatic).toEqual(manual)
    expect(automatic.isTurnActive).toBe(true)
    expect(automatic.pendingTurnIds).toEqual([cardId])
  })

  it('removes a pending card when it is selected again', () => {
    const cardId = CARDS[0].id
    const selected = gameReducer(initialGameState, {
      type: 'toggle-turn-card',
      cardId,
    })

    expect(
      gameReducer(selected, { type: 'toggle-turn-card', cardId }),
    ).toEqual({
      ...selected,
      pendingTurnIds: [],
    })
  })

  it('limits a turn to 12 cards but still permits deselection', () => {
    const selected = CARDS.slice(0, MAX_TURN_CARD_COUNT).reduce(
      (state, card) =>
        gameReducer(state, {
          type: 'toggle-turn-card',
          cardId: card.id,
        }),
      initialGameState,
    )
    const overLimit = gameReducer(selected, {
      type: 'toggle-turn-card',
      cardId: CARDS[MAX_TURN_CARD_COUNT].id,
    })

    expect(overLimit).toBe(selected)
    expect(
      gameReducer(overLimit, {
        type: 'toggle-turn-card',
        cardId: CARDS[0].id,
      }).pendingTurnIds,
    ).toHaveLength(MAX_TURN_CARD_COUNT - 1)
  })

  it('moves selected cards to discarded cards when the turn finishes', () => {
    const selected = gameReducer(initialGameState, {
      type: 'toggle-turn-card',
      cardId: CARDS[0].id,
    })

    expect(gameReducer(selected, { type: 'finish-turn' })).toEqual({
      ...selected,
      discardedIds: [CARDS[0].id],
      isTurnActive: false,
      pendingTurnIds: [],
    })
  })

  it('returns selected cards to play when somebody takes them', () => {
    const selected = gameReducer(initialGameState, {
      type: 'toggle-turn-card',
      cardId: CARDS[0].id,
    })

    expect(gameReducer(selected, { type: 'take-cards' })).toEqual({
      ...selected,
      isTurnActive: false,
      pendingTurnIds: [],
    })
  })

  it('does not select a discarded card', () => {
    const state = {
      ...initialGameState,
      discardedIds: [CARDS[0].id],
    }

    expect(
      gameReducer(state, {
        type: 'toggle-turn-card',
        cardId: CARDS[0].id,
      }),
    ).toBe(state)
  })

  it('keeps cards unchanged when trump changes and clears the turn on reset', () => {
    const selected = gameReducer(initialGameState, {
      type: 'toggle-turn-card',
      cardId: CARDS[0].id,
    })
    const withTrump = gameReducer(selected, {
      type: 'set-trump',
      suit: 'hearts',
    })

    expect(withTrump.pendingTurnIds).toEqual(selected.pendingTurnIds)
    expect(gameReducer(withTrump, { type: 'reset' })).toEqual(initialGameState)
  })
})
