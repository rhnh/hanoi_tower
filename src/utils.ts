import type {
  BoxType,
  DiscElement,
  Key,
  Memo,
  Position,
  State,
  Discs,
} from './type'
import { files, ranks } from './type'
export const TOTAL_FILE = 3
export const TOTAL_RANK = 9

export const createElement = ({
  tagName,
  className,
}: {
  className: string
  tagName?: keyof HTMLElementTagNameMap | 'container' | 'board' | 'disc'
}): HTMLElement => {
  const tag = tagName ?? 'div'
  const element = document.createElement(tag)
  element.classList.add(className)

  return element
}

export const Box = <T>(x: T): BoxType<T> => ({
  map: <U>(f: (value: T) => U): BoxType<U> => Box(f(x)),
  fold: <U>(f: (value: T) => U): U => f(x),
  toStrong: () => console.log(x),
})

export function id<Type>(arg: Type): Type {
  return arg
}

export function memo<A>(f: () => A): Memo<A> {
  let v: A | undefined
  const ret = (): A => {
    if (v === undefined) v = f()
    return v
  }
  ret.clear = () => {
    v = undefined
  }
  return ret
}

export const keys: Key[] = files
  .map((file) => ranks.map((rank) => `${file}${rank}` as Key))
  .flat()

export const getPositionFromKey = (key: Key): Position =>
  [key.charCodeAt(0) - 97, key.charCodeAt(1) - 49] as Position

export const getKeyPositionFromBound =
  (bound: DOMRectReadOnly) =>
  (position: Position): Position => {
    const x = (position[0] * bound.width) / TOTAL_FILE
    const y = (position[1] * bound.height) / TOTAL_RANK
    return [x, y]
  }

/**
 *
 * @param pos position in form of 0, 1 and will be multiplied  by 9 to get exact position
 * @returns
 */
export const getKeyFromPosition = (pos: Position): Key =>
  keys[TOTAL_RANK * pos[0] + pos[1]]

export const getPositionKeyAtDom =
  (bounds: DOMRectReadOnly) =>
  (pos: Position): Position => {
    let file = Math.floor((TOTAL_FILE * (pos[0] - bounds.left)) / bounds.width)
    let rank = Math.floor((TOTAL_RANK * (pos[1] - bounds.top)) / bounds.height)
    return file >= 0 && file < TOTAL_RANK && rank >= 0 && rank < TOTAL_RANK
      ? [file, rank]
      : [-1, -1]
  }

export const getElementByKey = (state: State, key: Key): DiscElement | null => {
  let el = state.board.firstChild
  while (el) {
    if (
      (el as DiscElement).dataset.key === key &&
      (el as DiscElement).tagName === 'DISC'
    )
      return el as DiscElement
    el = el.nextSibling
  }
  return null
}

export const getDiscsByKey = (discs: Discs, key: Key): Discs => {
  const d: Discs = new Map()
  if (!key) {
    return discs
  }
  for (const [k, v] of discs) {
    if (!key) return discs

    if (k.startsWith(key[0])) {
      d.set(k, v)
    }
  }

  return d
}

export const getFirstNonEmptyKey = (discs: Discs, key: Key): Key | null => {
  const d = getDiscsByKey(discs, key)
  for (const [k, v] of d) {
    if (v !== '0') {
      return k as Key
    }
  }
  return null
}

export const isEmptyDisc = (d: Discs): boolean => {
  let result = false
  for (const [_, v] of d) {
    if (v == '0') {
      result = true
    } else {
      return false
    }
  }
  return result
}

export const getLastEmptyKeyByKey = ({
  discs,
  keyToFind,
  previous = false,
}: {
  discs: Discs
  keyToFind: Key
  previous?: boolean
}): Key => {
  const d = getDiscsByKey(discs, keyToFind)
  // check if all values are zero; return the last one

  let key: Key = 'a1'

  if (isEmptyDisc(d)) {
    return `${keyToFind[0]}9` as Key
  }

  for (const [k, v] of d) {
    if (v === '0') continue
    else {
      key = k
      break
    }
  }

  const p = previous ? +key[1] - 1 : key[1]
  key = `${key[0]}${p}` as Key
  return key
}

export const validate = (state: State): State => {
  const { board, discs } = state
  for (let i = 0; i < 3; i++) {
    const key = `${String.fromCharCode(97 + i)}${i + 1}` as Key
    const k = getLastEmptyKeyByKey({ discs, keyToFind: key })
    const el = board.querySelector(`[data-key=${k}]`) as HTMLElement
    if (el) {
      el.dataset.draggable = 'yes'
    }
  }
  return state
}

export const nonEmptyDiscs = (d: Discs) =>
  new Map([...d].filter(([_, v]) => +v !== 0))

export const isGameOver = (state: State, key: Key): boolean =>
  !key || key[0] === 'a'
    ? false
    : nonEmptyDiscs(getDiscsByKey(state.discs, key)).size === state.totalDiscs

export function towerOfHanoi(n: number, from: Key, to: Key, aux: Key) {
  let result: string[] = []

  function solve(n: number, from: Key, to: Key, aux: Key) {
    if (n === 0) return

    solve(n - 1, from, aux, to)

    result.push(`${from},${to}`)

    solve(n - 1, aux, to, from)
  }

  solve(n, from, to, aux)

  return result
}
