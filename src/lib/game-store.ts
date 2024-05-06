import { produce } from "immer";
import { createStore } from "zustand";
import { BoardState, PlayerTurn, GameState, WinPatterns, boardStateFor, pickAi, adversaryFor, bit, subset } from "./game";

export interface Game {
  board: BoardState[];
  turn: PlayerTurn;
  state: () => GameState;
  reset: () => void;
  place: (n: number) => boolean;
  actAi: () => void;
  next: () => void;
  howToWin: () => number | undefined;
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
  place: (n: number) => {
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
  actAi: () => set(produce((state: Game) => {
    if (state.state() !== GameState.Playing) return;
    const index = pickAi(state.board, state.turn, Math.random());
    if (index != null) {
      state.board[index] = boardStateFor(state.turn);
      state.turn = adversaryFor(state.turn);
    }
  })),
  next: () => set((state) => ({
    turn: adversaryFor(state.turn),
  })),
  howToWin: () => {
    const state = get().state();
    if (state !== GameState.P1Won && state !== GameState.P2Won) return;
    const p = bit(get().board, state);
    return WinPatterns.find((pattern) => subset(pattern, p));
  },
}));