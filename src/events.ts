import type { Key, State } from './type'
import {
  Box,
  getElementByKey,
  getKeyFromPosition,
  getPositionKeyAtDom,
  id,
} from './utils'

export function pointerDown(state: State): State {
  const { board } = state
  board.addEventListener('pointerdown', (e) => {
    state.selected.originX = e.clientX
    state.selected.originX = e.clientY
    const p = getKeyFromPosition(
      getPositionKeyAtDom(state.bounds())([e.clientX, e.clientY]),
    )
    const el = getElementByKey(state, p)
    console.log(el)
  })
  return state
}

export function pointerMove(state: State): State {
  const { board } = state
  board.addEventListener('pointerdown', (e) => {
    state.selected.originX = e.clientX
    state.selected.originX = e.clientY
  })
  return state
}

export function pointerUp(state: State): State {
  const { board } = state
  board.addEventListener('pointerdown', (e) => {
    state.selected.originX = e.clientX
    state.selected.originX = e.clientY
  })
  return state
}

export function event(state: State): State {
  return Box(state).map(pointerDown).map(pointerMove).map(pointerUp).fold(id)
}
