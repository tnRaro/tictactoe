import { beforeEach, describe, expect, test } from "vitest";
import { GameState, PlayerTurn, gameStore } from "./game";

beforeEach(() => {
  const store = gameStore;

  return () => {
    store.setState(
      store.getInitialState()
    );
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
      getState().click(pos);
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

test("click", () => {
  const { getState } = gameStore;
  expect(getState().board).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect(getState().click(4)).toBe(true);
  expect(getState().board).toStrictEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);
  expect(getState().click(4)).toBe(false);
  expect(getState().board).toStrictEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);
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
  const { getState, getInitialState } = gameStore;
  getState().click(5);
  getState().click(3);

  getState().reset();

  expect(getState()).toStrictEqual(getInitialState());
});
