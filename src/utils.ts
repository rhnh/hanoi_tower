import {
  files,
  ranks,
  type BoxType,
  type DiscElement,
  type Key,
  type Memo,
  type Position,
  type State,
} from './type'
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
export const pos2key = (pos: Position): Key | undefined => {
  return keys[TOTAL_RANK * pos[0] + pos[1]]
}
export const getPositionFromKey = (key: Key): Position =>
  [key.charCodeAt(0) - 97, key.charCodeAt(1) - 49] as Position

export const getKeyPositionFromBound =
  (bound: DOMRect) =>
  (position: Position): Position => {
    const x = (position[0] * bound.width) / TOTAL_FILE
    const y = (position[1] * bound.height) / TOTAL_RANK
    return [x, y]
  }

export const getKeyFromPosition = (pos: Position): Key => {
  return keys[TOTAL_FILE * pos[0] + pos[1]]
}

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
