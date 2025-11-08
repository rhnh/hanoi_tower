import type { Key, Position, State } from "./type";
import { getElementByKey, getKeyAtDomPos, pos2key } from "./utils";

export function bindEvents(state: State): State {
  const board = state.board;
  board.addEventListener("pointerdown", (e) => {
    const position = getKeyAtDomPos(state.bounds())([
      e.clientX,
      e.clientY,
    ]) as Position;
    console.log(position, pos2key(position));
    const selectedElement = getElementByKey(state, pos2key(position) as Key);
    console.log(selectedElement);
  });
  return state;
}
