import { expect, describe, test, it } from 'vitest'
import { getFirstNonEmptyKey } from '../src/utils'
import { initDiscs } from '../src/game'
describe('getFirstNonEmptyKey', () => {
  const state = initDiscs()
  const f = getFirstNonEmptyKey(state, 'a1')
  test('this', () => {
    expect(f).toBe('a7')
  })
})
