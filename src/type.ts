export const files = ["a", "b"];
// export const ranks = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const ranks = ["0", "1", "2"];

export type File = (typeof files)[number];
export type Rank = (typeof ranks)[number];

export type Key = `${File}${Rank}`;

export interface Disc {
  key: Key;
  value: Rank;
}
export interface DiscElement extends HTMLElement {
  key: Key;
}

export interface State {
  discs: DiscElement[];
  currentDisc: DiscElement;
}
