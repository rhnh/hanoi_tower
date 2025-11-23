import {
  type Key,
  type Discs,
  type Rank,
  type State,
  files,
  ranks,
  TOTAL_FILE,
  TOTAL_RANK,
} from './type'
import {
  keys,
  getPositionFromKey,
  memo,
  getKeyPositionFromBound,
} from './utils'

export function initDiscs(): Discs {
  const discs: Discs = new Map<Key, Rank>()
  keys.map((k: Key) => discs.set(k, '0'))
  discs.set('a7', '1')
  discs.set('a8', '2')
  discs.set('a9', '3')

  return discs
}

export function gameInit(): State {
  const container = document.getElementById('container') as HTMLElement
  const bounds = memo(() => container.getBoundingClientRect())
  const board = document.createElement('board')

  const defaultState: State = {
    discs: initDiscs(),
    selected: {
      draggingElement: null,
      originX: 0,
      originY: 0,
    },
    isViewOnly: false,
    container,
    board,
    bounds,
  }
  container?.appendChild(board)

  return defaultState
}

export function createDisc(state: State, key: Key): HTMLElement {
  const disc = document.createElement('DISC')
  const p = getKeyPositionFromBound(state.bounds())(getPositionFromKey(key))
  disc.style.transform = `translate(${p[0]}px, ${p[1]}px)`
  disc.style.width = `${state.bounds().width / TOTAL_FILE}px`
  disc.style.height = `${state.bounds().height / TOTAL_RANK}px`
  disc.style.display = 'block'
  disc.style.position = 'absolute'
  return disc
}

export function render(state: State): State {
  const { discs } = state
  for (const [key, value] of discs) {
    const disc = createDisc(state, key)
    disc.dataset.key = key
    disc.dataset.value = value
    state.board.appendChild(disc)
  }
  return state
}
