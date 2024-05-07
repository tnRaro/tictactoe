export const WinPatterns = [7, 56, 448, 73, 146, 292, 273, 84];

export const enum PlayerTurn {
  P1 = 1,
  P2 = 3,
}

export const enum GameState {
  Playing,
  P1Won,
  Draw,
  P2Won,
}

export const enum BoardState {
  None = 0,
  P1 = 1,
  P2 = 3,
}

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

export function boardStateFor(turn: PlayerTurn) {
  if (turn === PlayerTurn.P1) return BoardState.P1;
  if (turn === PlayerTurn.P2) return BoardState.P2;
  throw new Error(`unexpected player turn: ${turn}`);
}

export function adversaryFor(turn: PlayerTurn) {
  if (turn === PlayerTurn.P1) return PlayerTurn.P2;
  if (turn === PlayerTurn.P2) return PlayerTurn.P1;
  throw new Error(`unexpected player turn: ${turn}`);
}

export function pickAi(board: BoardState[], playerTurn: PlayerTurn, random: number) {
  const a = bit(board, playerTurn);
  const b = bit(board, adversaryFor(playerTurn));

  const pattenrs = [
    [a, b],
    [b, a],
  ];
  for (const p of pattenrs) {
    const wins = pattern(p[0], p[1]);
    if (wins.length > 0) {
      return 31 - Math.clz32(intersection(pick(wins), ~p[0]));
    }
  }
  const emptyPieces = board
    .map((piece, index) => ({ piece, index }))
    .filter(({ piece }) => piece === 0);
  if (emptyPieces.length > 0) {
    return pick(emptyPieces).index;
  }

  function pattern(a: number, b: number) {
    return WinPatterns
      .filter((win) => subset(win, ~b))
      .filter((win) => !subset(win, ~a))
      .filter(
        (win) => Array.from({ length: 9 }).reduce<number>(
          (acc, _, index) => acc + intersection(intersection(win, ~a) >> index, 1),
          0
        ) === 1
      );
  }
  function pick<T>(items: T[]): T {
    return items[random * items.length | 0];
  }
}

export function bit(board: BoardState[], turn: number) {
  const x = board.map((piece) => +(piece === turn));
  return x.reduce(
    (acc, piece, index) => acc | (piece << index),
    0
  );
}

export function subset(a: number, b: number) {
  return intersection(a, b) === a
}

export function intersection(a: number, b: number) {
  return (a & b);
}
