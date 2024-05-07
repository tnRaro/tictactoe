import { beforeEach, describe, expect, test } from "vitest";
import { GameState, PlayerTurn } from "./game";
import { gameStore } from "./game-store";

beforeEach(() => {
  const store = gameStore;

  return () => {
    store.setState(
      store.getInitialState()
    );
    store.getState().reset();
  };
});

describe("state", () => {
  test("human win", () => {
    run([
      { pos: 4, state: GameState.Playing },
      { pos: 5, state: GameState.Playing },
      { pos: 0, state: GameState.Playing },
      { pos: 8, state: GameState.Playing },
      { pos: 2, state: GameState.Playing },
      { pos: 6, state: GameState.Playing },
      { pos: 1, state: GameState.P1Won },
    ]);
  })

  test("ai win", () => {
    run([
      { pos: 0, state: GameState.Playing },
      { pos: 3, state: GameState.Playing },
      { pos: 1, state: GameState.Playing },
      { pos: 2, state: GameState.Playing },
      { pos: 6, state: GameState.Playing },
      { pos: 4, state: GameState.Playing },
      { pos: 7, state: GameState.Playing },
      { pos: 5, state: GameState.P2Won },
    ]);
  })

  test("draw", () => {
    run([
      { pos: 4, state: GameState.Playing },
      { pos: 0, state: GameState.Playing },
      { pos: 2, state: GameState.Playing },
      { pos: 6, state: GameState.Playing },
      { pos: 3, state: GameState.Playing },
      { pos: 5, state: GameState.Playing },
      { pos: 7, state: GameState.Playing },
      { pos: 1, state: GameState.Playing },
      { pos: 8, state: GameState.Draw },
    ]);
  })

  function run(scenario: { pos: number, state: GameState }[]) {
    const { getState } = gameStore;
    const a = scenario.map(({ pos }) => {
      getState().place(pos);
      getState().next();
      return {
        pos,
        state: getState().state(),
      }
    })
    const b = scenario.map(({ pos, state }) => {
      return {
        pos,
        state,
      }
    })
    expect(a).toStrictEqual(b);
  }
});

test("place", () => {
  const { getState } = gameStore;
  expect(getState().board.state).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect(getState().place(4)).toBe(true);
  expect(getState().board.state).toStrictEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  expect(getState().place(4)).toBe(false);
  expect(getState().board.state).toStrictEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);
});

test("next", () => {
  const { getState } = gameStore;
  expect(getState().turn).toBe(PlayerTurn.P1);
  getState().next();
  expect(getState().turn).toBe(PlayerTurn.P2);
  getState().next();
  expect(getState().turn).toBe(PlayerTurn.P1);
  getState().next();
  expect(getState().turn).toBe(PlayerTurn.P2);
});

test("reset", () => {
  const { getState } = gameStore;
  getState().place(5);
  getState().place(3);

  getState().reset();
});

describe("howToWin", () => {
  test("human win", () => {
    const { getState } = gameStore;
    run([4, 5, 0, 8, 2, 6, 1,]);
    expect(getState().howToWin()).toBe(7);
  })

  test("ai win", () => {
    const { getState } = gameStore;
    run([0, 3, 1, 2, 6, 4, 7, 5,]);
    expect(getState().howToWin()).toBe(56);
  })

  test("draw", () => {
    const { getState } = gameStore;
    run([4, 0, 2, 6, 3, 5, 7, 1, 8,]);
    expect(getState().howToWin()).toBeUndefined();
  })

  function run(scenario: number[]) {
    const { getState } = gameStore;
    scenario.forEach((pos) => {
      getState().place(pos);
      getState().next();
    });
  }
})