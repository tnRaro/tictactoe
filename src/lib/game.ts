import { produce } from "immer";
import { createStore } from "zustand/vanilla";

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

export interface Game {
  board: BoardState[];
  turn: PlayerTurn;
  state: () => GameState;
  reset: () => void;
  click: (n: number) => boolean;
  next: () => void;
  _placedPieces: (turn: PlayerTurn) => number;
}

export const gameStore = createStore<Game>((set, get) => ({
  board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  turn: PlayerTurn.P1,
  state: () => {
    if (isWon(PlayerTurn.P1)) return GameState.P1Won;
    if (isWon(PlayerTurn.P2)) return GameState.P2Won;
    if (isDraw()) return GameState.Draw;
    return GameState.Playing;

    function isWon(turn: PlayerTurn) {
      const pattern = get()._placedPieces(turn);
      return WinPatterns.some((p) => (pattern & p) === p);

    }
    function isDraw() {
      return get().board.every((piece) => piece !== BoardState.None) // and nobody won
    }
  },
  _placedPieces(turn) {
    const pieces = get().board.map((piece) => +(piece === boardStateFor(turn)));
    return pieces.reduce((acc, piece, i) => acc | (piece << i), 0);
  },
  reset: () => set(() => ({
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    turn: PlayerTurn.P1,
  })),
  click: (n: number) => {
    if (!isInbound(n)) {
      throw new RangeError(`out of range: 0 <= ${n} < 9`);
    }
    if (get().board[n] !== 0) return false;
    set(produce((state: Game) => {
      state.board[n] = boardStateFor(state.turn);
    }));
    return true;
    function isInbound(n: number) {
      if (n < 0 || n >= 9) return false;
      return true;
    }
  },
  ai: () => set(produce((state: Game) => {
    const index = pickAi(state.board, state.turn, Math.random());
    if (index && state.click(index)) {
      state.next();
    }
  })),
  next: () => set((state) => ({
    turn: adversaryFor(state.turn),
  })),
}));

function boardStateFor(turn: PlayerTurn) {
  if (turn === PlayerTurn.P1) return BoardState.P1;
  if (turn === PlayerTurn.P2) return BoardState.P2;
  throw new Error(`unexpected player turn: ${turn}`);
}

function adversaryFor(turn: PlayerTurn) {
  if (turn === PlayerTurn.P1) return PlayerTurn.P2;
  if (turn === PlayerTurn.P2) return PlayerTurn.P1;
  throw new Error(`unexpected player turn: ${turn}`);
}

export function pickAi(board: BoardState[], playerTurn: PlayerTurn, random: number) {
  const a = bit(playerTurn);
  const b = bit(adversaryFor(playerTurn));

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
    return [7, 56, 448, 73, 146, 292, 273, 84]
      .filter((win) => subset(win, ~b))
      .filter((win) => !subset(win, ~a))
      .filter(
        (win) => Array.from({ length: 9 }).reduce<number>(
          (acc, _, index) => acc + intersection(intersection(win, ~a) >> index, 1),
          0
        ) === 1
      );
  }

  function subset(a: number, b: number) {
    return intersection(a, b) === a
  }

  function intersection(a: number, b: number) {
    return (a & b);
  }

  function bit(turn: number) {
    const x = board.map((piece) => +(piece === turn));
    return x.reduce(
      (acc, piece, index) => acc | (piece << index),
      0
    );
  }

  function pick<T>(items: T[]): T {
    return items[random * items.length | 0];
  }
}