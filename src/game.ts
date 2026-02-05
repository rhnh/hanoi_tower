import {
  type Key,
  type Discs,
  type Rank,
  type State,
  TOTAL_FILE,
  TOTAL_RANK,
  files,
} from './type'
import {
  keys,
  getPositionFromKey,
  memo,
  getKeyPositionFromBound,
  validate,
  Box,
  towerOfHanoi,
  getLastEmptyKeyByKey,
  getFirstNonEmptyKey,
} from './utils'

export function initDiscs(total = 3): Discs {
  const discs: Discs = new Map<Key, Rank>()
  keys.map((k: Key) => discs.set(k, '0'))
  let t = total + 1
  while (total) {
    let key: Key = `a${10 - total}` as Key
    let rank: Rank = `${t - total}` as Rank
    discs.set(key, `${rank}` as Rank)
    total -= 1
  }

  return discs
}

export function gameInit(): State {
  const container = document.getElementById('container') as HTMLElement
  const movesSection = document.createElement('div')

  container?.parentElement?.appendChild(movesSection)
  const board = document.createElement('board')
  const bounds = memo(() => board.getBoundingClientRect())

  movesSection.id = 'moves-section'
  movesSection.classList.add('moves-section')
  // const headings = document.createElement('h4')
  // // headings.innerHTML = 'Moves Section'
  // movesSection.append(headings)
  const defaultState: State = {
    discs: initDiscs(),
    selected: {
      draggingElement: null,
      isDragging: false,
    },
    isViewOnly: false,
    container,
    board,
    bounds,
    counter: 0,
    totalDiscs: 3,
    gameState: 'init',
  }

  createStatusbar(defaultState, container)
  container?.appendChild(board)
  return defaultState
}

export function createDisc(state: State, key: Key): HTMLElement {
  const disc = document.createElement('disc')
  const p = getKeyPositionFromBound(state.bounds())(getPositionFromKey(key))

  disc.style.transform = `translate(${p[0]}px, ${p[1]}px)`
  disc.style.width = `${state.bounds().width / TOTAL_FILE}px`
  disc.style.height = `${state.bounds().height / TOTAL_RANK}px`
  disc.style.display = 'block'
  disc.style.position = 'absolute'

  return disc
}

export const render = (state: State): State => {
  requestAnimationFrame(() => {
    Box(renderDiscs(state)(validate)).map(renderCounter)
  })
  return state
}

export const renderDiscs =
  (state: State) =>
  (validate: (state: State) => State): State => {
    const { discs } = state
    state.board.innerHTML = ''
    for (const [key, value] of discs) {
      const disc = createDisc(state, key)
      disc.dataset.key = key
      disc.dataset.value = value

      disc.classList.add(`disc-${value}`)
      if (value != '0') {
        disc.classList.add('disc')
      }

      // disc.innerHTML = key
      disc.style.textAlign = 'center'
      disc.style.zIndex = '100'

      state.board.appendChild(disc)
    }
    renderBoard(state)
    return validate(state)
  }
const createSVGElement = (tagName: keyof SVGElementTagNameMap): SVGElement =>
  document.createElementNS('http://www.w3.org/2000/svg', tagName)

export const renderBoard = (state: State): State => {
  const board = state.board
  const background = document.createElement('section')
  board.appendChild(background)
  state.board.classList.add(state.gameState)
  renderCounter(state)
  files.map(() => {
    const svg = createSVGElement('svg')
    const vRect = createSVGElement('rect')

    svg.setAttribute(
      'viewBox',
      `0 0 ${state.bounds().width} ${state.bounds().height * 3}`,
    )
    vRect.setAttribute('height', `${state.bounds().height * 2}`)
    vRect.setAttribute('fill', '#03045e')
    vRect.setAttribute('width', '10')
    vRect.setAttribute('x', `50%`)
    vRect.setAttribute('y', '0')
    vRect.setAttribute('rx', '10')
    svg.appendChild(vRect)
    const hRect = createSVGElement('rect')
    const hWidth = state.bounds().width - 50
    svg.setAttribute(
      'viewBox',
      `0 0 ${state.bounds().width} ${state.bounds().height * 3}`,
    )
    hRect.setAttribute('width', `${hWidth}`)
    hRect.setAttribute('fill', '#03045e')
    hRect.setAttribute('height', '20')
    hRect.setAttribute('rx', '10')
    hRect.setAttribute('x', `20`)
    hRect.setAttribute('y', '-10')
    // hRect.setAttribute('y','10');

    svg.appendChild(hRect)
    background.appendChild(svg)
  })

  return state
}

export function createStatusbar(
  state: State,
  container: HTMLElement,
): HTMLElement {
  const statusBar = document.createElement('article')

  container.appendChild(statusBar)

  statusBar.classList.add('status-bar')
  statusBar.id = 'status-bar'
  const counter = document.createElement('span')
  counter.id = 'counter'
  statusBar.appendChild(counter)
  const buttonSection = document.createElement('span')
  buttonSection.classList.add('btn-section')
  buttonSection.appendChild(
    createButton(
      'Start',
      'startBtn',
    )(() => {
      if (state.gameState === 'over') {
        state.container.innerHTML = ''
        window.location.reload()
        const newState = gameInit()
        newState.gameState = 'playing'
        render(newState)
        return
      }
      state.gameState = 'playing'
      render(state)
    }),
  )
  buttonSection.appendChild(
    createButton(
      '+',
      'addBtn',
    )(() => {
      if (state.gameState !== 'init' || state.totalDiscs >= 9) return
      let totalDiscs = state.totalDiscs + 1
      state.totalDiscs = totalDiscs
      if (state.totalDiscs >= 9) {
        totalDiscs = 9
      }
      state.discs = initDiscs(totalDiscs)
      render(state)
    }),
  )
  buttonSection.appendChild(
    createButton(
      '-',
      'removeBtn',
    )(() => {
      if (state.gameState !== 'init' || state.totalDiscs <= 3) return
      let totalDiscs = state.totalDiscs - 1
      state.totalDiscs = totalDiscs
      state.discs = initDiscs(totalDiscs)
      render(state)
    }),
  )

  buttonSection.appendChild(
    createButton(
      'Restart',
      'restartBtn',
    )(() => {
      state.gameState = 'playing'
      render(state)
      window.location.reload()
    }),
  )

  buttonSection.appendChild(
    createButton(
      'Solve',
      'solveBtn',
    )(() => {
      if (state.gameState !== 'init') return
      // if (state.totalDiscs > 3) return
      const movesSection =
        state.container?.parentElement?.querySelector('#moves-section')
      movesSection?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      towerOfHanoi(state.totalDiscs, 'a1', 'c1', 'b1').map((r, i) => {
        state.gameState = 'playing'
        setTimeout(() => {
          const keys = r.split(',')
          const from = keys[0] as Key
          state.counter++
          const fromKey = getFirstNonEmptyKey(state.discs, from) as Key
          if (!fromKey) return

          const fromValue = state.discs.get(fromKey) as Rank
          state.discs.set(fromKey, '0')
          const to = keys[1] as Key
          const toKey = getLastEmptyKeyByKey({
            discs: state.discs,
            keyToFind: to,
            previous: true,
          })

          const moves = document.createElement('span')
          moves.innerHTML = `${i + 1}. ${from[0]} > ${to[0]}<br>`
          moves.style.fontSize = '10px'
          let isScrolledToBottom
          if (movesSection) {
            isScrolledToBottom =
              movesSection?.scrollHeight - movesSection?.clientHeight <=
              +movesSection?.scrollTop
          }
          console.log(
            isScrolledToBottom,
            movesSection?.scrollHeight,
            movesSection?.clientHeight,
          )
          if (!isScrolledToBottom && movesSection) {
            movesSection!.scrollTop =
              movesSection?.scrollHeight - movesSection?.clientHeight
            movesSection?.appendChild(moves)
          }
          movesSection?.appendChild(moves)
          state.discs.set(toKey, fromValue)
          if (i === 2 ** state.totalDiscs - 2) {
            setTimeout(() => {
              state.container.innerHTML = ''
              container?.parentElement?.removeChild(movesSection!)

              render(gameInit())
            }, 1000)
          }
          render(state)
        }, i * 1000)
      })
    }),
  )
  statusBar.appendChild(buttonSection)
  return container
}

export const createButton =
  (name: string, classname?: string) =>
  (callback: (e: Event) => void): HTMLElement => {
    const button = document.createElement('button')
    button.classList.add('btn')
    if (classname) button.classList.add(classname)
    button.innerHTML = name
    button.addEventListener('click', callback)
    return button
  }

export const renderCounter = (state: State): State => {
  const counter = state.container.querySelector('#counter')
  if (!counter) return state
  counter.innerHTML = `Moves: ${state.counter} Best: ${
    Math.pow(2, state.totalDiscs) - 1
  }`
  return state
}
