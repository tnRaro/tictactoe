import { produce } from "immer";
import { createStore } from "zustand";
import { GameState, PlayerTurn, WinPatterns, adversaryFor, boardStateFor, pickAi, subset } from "./game";
import { Board } from "./board";

export interface Game {
  board: Board;
  turn: PlayerTurn;
  state: () => GameState;
  reset: () => void;
  place: (n: number) => boolean;
  actAi: () => void;
  next: () => void;
  howToWin: () => number | undefined;
}

export const gameStore = createStore<Game>((set, get) => ({
  board: new Board(),
  turn: PlayerTurn.P1,
  state: () => {
    if (isWon(PlayerTurn.P1)) return GameState.P1Won;
    if (isWon(PlayerTurn.P2)) return GameState.P2Won;
    if (isDraw()) return GameState.Draw;
    return GameState.Playing;

    function isWon(turn: PlayerTurn) {
      const pattern = get().board.stateOf(turn);
      return WinPatterns.some((p) => (pattern & p) === p);

    }
    function isDraw() {
      return get().board.isSerried() // and nobody won
    }
  },
  reset: () => set(() => ({
    board: new Board(),
    turn: PlayerTurn.P1,
  })),
  place: (n: number) => {
    if (!get().board.isEmpty(n)) return false;
    set(produce((state: Game) => {
      state.board.place(n, boardStateFor(state.turn));
    }));
    return true;
  },
  actAi: () => set(produce((state: Game) => {
    if (state.state() !== GameState.Playing) return;
    const index = pickAi(state.board.state, state.turn, Math.random());
    if (index != null) {
      state.board.place(index, boardStateFor(state.turn));
      state.turn = adversaryFor(state.turn);
    }
  })),
  next: () => set((state) => ({
    turn: adversaryFor(state.turn),
  })),
  howToWin: () => {
    const state = get().state();
    if (state !== GameState.P1Won && state !== GameState.P2Won) return;
    const p = get().board.stateOf(state as number as PlayerTurn);
    return WinPatterns.find((pattern) => subset(pattern, p));
  },
}));