import { createStore } from "zustand";
import { BoardState, Game, GameState, PlayerTurn } from "./game";

export interface GameStore {
  _game: Game;
  state: () => GameState;
  reset: () => void;
  place: (n: number) => boolean;
  actAi: () => void;
  next: () => void;
  howToWin: () => number | undefined;
  turn: () => PlayerTurn;
  board: () => BoardState[];
}

export const gameStore = createStore<GameStore>((set, get) => ({
  _game: new Game(),
  state: () => {
    return get()._game.state;
  },
  reset: () => set(() => ({
    _game: new Game(),
  })),
  turn: () => get()._game.turn,
  board: () => get()._game.board.state,
  place: (n: number) => {
    if (!get()._game.board.isEmpty(n)) return false;
    get()._game.place(n);
    set((state) => ({ _game: state._game }));
    return true;
  },
  actAi: () => {
    get()._game.placeAi();
    set((state) => ({ _game: state._game }));
  },
  next: () => { },
  howToWin: () => {
    return get()._game.howToWin();
  },
}));