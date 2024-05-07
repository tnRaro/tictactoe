import { Board } from "./board";

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

export class Game {
  private _board = new Board();
  private _turn: PlayerTurn = PlayerTurn.P1;

  get board() {
    return this._board;
  }
  get turn() {
    return this._turn;
  }
  set turn(value: PlayerTurn) {
    this._turn = value;
  }
  get state() {
    if (this.isWon(PlayerTurn.P1)) return GameState.P1Won;
    if (this.isWon(PlayerTurn.P2)) return GameState.P2Won;
    if (this.isDraw()) return GameState.Draw;
    return GameState.Playing;
  }
  private isWon(turn: PlayerTurn) {
    const pattern = this._board.stateOf(turn);
    return WinPatterns.some((p) => (pattern & p) === p);
  }
  private isDraw() {
    return this._board.isSerried();
  }

  place(index: number) {
    if (this.state !== GameState.Playing) return;
    if (!this._board.isEmpty(index)) return;
    this._board.place(index, boardStateFor(this._turn));
    this._turn = adversaryFor(this._turn);
  }
  placeAi() {
    const index = pickAi(this._board.state, this._turn, Math.random());
    if (index != null) {
      this.place(index);
    }
  }
  howToWin() {
    const state = this.state;
    if (state !== GameState.P1Won && state !== GameState.P2Won) return;
    const p = this.board.stateOf(playerTurnFor(state));
    return WinPatterns.find((pattern) => subset(pattern, p));
  }
}

export function playerTurnFor(state: GameState) {
  if (state === GameState.P1Won) return PlayerTurn.P1;
  if (state === GameState.P2Won) return PlayerTurn.P2;
  throw new Error(`unexpected game state: ${state}`);
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
