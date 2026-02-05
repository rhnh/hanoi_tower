import { renderDiscs } from './game'
import { TOTAL_FILE, TOTAL_RANK, type Rank, type State } from './type'
import {
  Box,
  getElementByKey,
  getKeyFromPosition,
  getKeyPositionFromBound,
  getLastEmptyKeyByKey,
  getPositionFromKey,
  getPositionKeyAtDom,
  id,
  isGameOver,
  validate,
} from './utils'

export function pointerDown(state: State): State {
  const { board } = state
  board.addEventListener('pointerdown', (e) => {
    if (state.gameState !== 'playing') {
      return
    }

    const position = getPositionKeyAtDom(state.bounds())([e.clientX, e.clientY])
    const key = getKeyFromPosition(position)
    if (!key) return

    const el = getElementByKey(state, key)

    if (el && el.dataset.value !== '0' && el.dataset.draggable) {
      el.style.zIndex = '1000'
      state.selected.originKey = key
      state.selected.originValue = el.dataset.value as Rank
      state.selected.draggingElement = el
      state.selected.isDragging = true
    }
  })
  return state
}
export function move(state: State, x: number, y: number) {
  if (state.selected.draggingElement && state.selected.isDragging) {
    state.selected.draggingElement.style.transform = `translate(${
      x - state.bounds().left - state.bounds().width / TOTAL_FILE / 2
    }px, ${y - state.bounds().top - state.bounds().height / TOTAL_RANK / 2}px)`
  }
}

export function pointerMove(state: State): State {
  const { board } = state
  board.addEventListener('pointermove', (e) => {
    move(state, e.clientX, e.clientY)
  })
  return state
}

function swapTheValue(state: State, e: MouseEvent) {
  const currentPosition = getPositionKeyAtDom(state.bounds())([
    e.clientX,
    e.clientY,
  ])

  let currentKey = getKeyFromPosition(currentPosition)

  // in case the entire file is empty
  const lastKey = getLastEmptyKeyByKey({
    discs: state.discs,
    keyToFind: currentKey,
    previous: false,
  })

  const secondLastKey = getLastEmptyKeyByKey({
    discs: state.discs,
    keyToFind: currentKey,
    previous: true,
  })

  const targetValue = Number(state.discs.get(lastKey))
  const originValue = Number(state.selected.originValue)
  const originalKey = state.selected.originKey

  // reset, unless it is empty
  if (originValue > targetValue && originalKey && originValue) {
    if (targetValue == 0) {
      state.discs.set(lastKey, `${originValue}` as Rank)
      state.discs.set(originalKey, '0')
      state.counter = state.counter + 1
    }
  }

  //swap
  if (originValue < targetValue && originalKey) {
    state.discs.set(secondLastKey, `${originValue}` as Rank)
    state.discs.set(originalKey, '0')
    state.counter = state.counter + 1
  }

  state.selected.draggingElement = null
  state.selected.originKey = undefined
  state.selected.originValue = undefined

  state.gameState = isGameOver(state, currentKey) ? 'over' : 'playing'
  if (state.gameState === 'over') gameOver(state)
}

export function resetElementPosition(state: State): void {
  if (
    state.selected.draggingElement &&
    state.selected.originKey &&
    state.selected.isDragging
  ) {
    const originalKey = state.selected.originKey
    const originalPosition = getKeyPositionFromBound(state.bounds())(
      getPositionFromKey(originalKey),
    )
    state.selected.draggingElement.style.transform = `translate(${originalPosition[0]}px,${originalPosition[1]}px)`
    state.selected.draggingElement.style.zIndex = '1000'
    state.selected.isDragging = false
  }
}

export function pointerUp(state: State): State {
  const { board } = state
  board.addEventListener('pointerup', (e) => {
    if (state.gameState === 'over') return
    resetElementPosition(state)
    swapTheValue(state, e)
    renderDiscs(state)(validate)
  })
  return state
}

export function event(state: State): State {
  return Box(state).map(pointerDown).map(pointerMove).map(pointerUp).fold(id)
}

export const gameOver = (state: State): State => {
  if (state.gameState) {
    state.board.style.opacity = '0.3'
  }
  return state
}
