export const files = ['a', 'b', 'c'] as const
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

export type File = (typeof files)[number]
export type Rank = (typeof ranks)[number]

export type Key = `${File}${Rank}`

export type Discs = Map<Key, Rank | '0'>

export interface DiscElement extends HTMLElement {
  value: Rank
}

export const TOTAL_FILE = 3
export const TOTAL_RANK = 9

export interface State {
  discs: Discs
  selected: {
    draggingElement: DiscElement | null
    originX: number
    originY: number
    currentX?: number
    currentY?: number
  }
  targetElement?: DiscElement | null
  isViewOnly: boolean
  container: HTMLElement
  board: HTMLElement
  bounds: Memo<DOMRectReadOnly>
}

export type BoxType<T> = {
  map: (f: (value: T) => T) => BoxType<T>
  fold: <U>(f: (value: T) => U) => U
  toStrong: () => void
}

export interface Memo<A> {
  (): A
  clear: () => void
}

export type Position = [number, number]
