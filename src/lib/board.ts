import { BoardState, PlayerTurn, boardStateFor } from "./game";

export class Board {
  private _state: BoardState[] = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ];
  get state() {
    return this._state.slice();
  }
  isSerried() {
    return this._state.every((piece) => piece !== BoardState.None);
  }
  isEmpty(index: number) {
    this.guardBound(index);
    return this._state[index] === BoardState.None;
  }
  place(index: number, state: BoardState) {
    this.guardBound(index);
    this._state[index] = state;
  }
  isInBound(index: number) {
    return index >= 0 && index < 9;
  }
  guardBound(index: number) {
    if (this.isInBound(index)) return true;
    throw new RangeError(`out of range: 0 <= ${index} < 9`);
  }
  stateOf(player: PlayerTurn) {
    return this._state
      .map((piece) => +(piece === boardStateFor(player)))
      .reduce((acc, piece, index) => acc | (piece << index), 0);
  }
}
