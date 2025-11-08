import { TOTAL_FILE, TOTAL_RANK, type Discs, type State } from "./type";
import {
  createElement,
  getKeyPositionFromBound,
  keyToPosition,
  memo,
} from "./utils";

export function setup(): State {
  const discs: Discs = new Map();

  discs.set("a1", "0");
  discs.set("a2", "0");
  discs.set("a3", "0");
  discs.set("a4", "0");
  discs.set("a5", "0");
  discs.set("a6", "0");
  discs.set("a7", "1");
  discs.set("a8", "2");
  discs.set("a9", "3");

  discs.set("b1", "0");
  discs.set("b2", "0");
  discs.set("b3", "0");
  discs.set("b4", "0");
  discs.set("b5", "0");
  discs.set("b6", "0");
  discs.set("b7", "0");
  discs.set("b8", "0");
  discs.set("b9", "0");

  discs.set("c1", "0");
  discs.set("c2", "0");
  discs.set("c3", "0");
  discs.set("c4", "0");
  discs.set("c5", "0");
  discs.set("c6", "0");
  discs.set("c7", "0");
  discs.set("c8", "0");
  discs.set("c9", "0");

  const container = document.getElementById("container") as HTMLElement;

  const board = createElement({ tagName: "board", className: "board" });

  const bounds = memo(() => board.getBoundingClientRect());
  const state: State = {
    board,
    container,
    discs,
    isViewOnly: false,
    bounds,
  };
  return state;
}

export function render(state: State): State {
  const { board, discs, container } = state;
  container.innerHTML = "";

  state.bounds = memo(() => container.getBoundingClientRect());
  const { bounds } = state;
  for (const [key, value] of discs) {
    const disc = createElement({ tagName: "disc", className: "disc" });
    disc.dataset.key = key;
    disc.dataset.value = value;
    const p = keyToPosition(key);
    const position = getKeyPositionFromBound(state.bounds())(p);

    disc.style.transform = `translate(${position[0]}px,${position[1]}px)`;
    disc.style.width = `${bounds().width / TOTAL_FILE}px`;

    disc.style.height = `${bounds().height / TOTAL_RANK}px`;
    board.appendChild(disc);
  }
  container.appendChild(board);
  return state;
}
