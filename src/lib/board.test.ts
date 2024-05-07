import { beforeEach, describe, expect, test } from "vitest";
import { Board } from "./board";
import { BoardState, PlayerTurn } from "./game";

let board: Board;

beforeEach(() => {
  board = new Board();
});

describe("bound", () => {
  test("guardRange(-1)", () => {
    expect(() => board.guardRange(-1)).toThrowError(new RangeError("out of range: 0 <= -1 < 9"));
  });
  test("guardRange(9)", () => {
    expect(() => board.guardRange(9)).toThrowError(new RangeError("out of range: 0 <= 9 < 9"));
  });
  test("isInRange(-1)", () => {
    expect(board.isInRange(-1)).toBe(false);
  });
  test("isInRange(5)", () => {
    expect(board.isInRange(5)).toBe(true);
  });
  test("isInRange(9)", () => {
    expect(board.isInRange(9)).toBe(false);
  });
});

describe("place", () => {
  test("place(4, P1)", () => {
    board.place(4, BoardState.P1);
    expect(board.state).toStrictEqual([0, 0, 0, 0, BoardState.P1, 0, 0, 0, 0]);
  });
  test("override", () => {
    board.place(5, BoardState.P1);
    board.place(5, BoardState.P2);
    expect(board.state).toStrictEqual([0, 0, 0, 0, 0, BoardState.P2, 0, 0, 0]);
  });
})

test("empty", () => {
  board.place(1, BoardState.P1);
  expect(board.isEmpty(0)).toBe(true);
  expect(board.isEmpty(1)).toBe(false);
  for (let i = 2; i < 9; i++)
    expect(board.isEmpty(i)).toBe(true);
})

test("isSerried()", () => {
  expect(board.isSerried()).toBe(false);
  board.place(0, BoardState.P1);
  expect(board.isSerried()).toBe(false);
  board.place(1, BoardState.P2);
  expect(board.isSerried()).toBe(false);
  board.place(2, BoardState.P1);
  expect(board.isSerried()).toBe(false);
  board.place(3, BoardState.P2);
  expect(board.isSerried()).toBe(false);
  board.place(4, BoardState.P1);
  expect(board.isSerried()).toBe(false);
  board.place(5, BoardState.P2);
  expect(board.isSerried()).toBe(false);
  board.place(6, BoardState.P1);
  expect(board.isSerried()).toBe(false);
  board.place(7, BoardState.P2);
  expect(board.isSerried()).toBe(false);
  board.place(8, BoardState.P1);
  expect(board.isSerried()).toBe(true);
})

test("stateOf", () => {
  expect(board.stateOf(PlayerTurn.P1)).toBe(0);
  expect(board.stateOf(PlayerTurn.P2)).toBe(0);

  board.place(1, BoardState.P1);
  board.place(2, BoardState.P1);
  board.place(5, BoardState.P2);
  board.place(3, BoardState.P2);

  expect(board.stateOf(PlayerTurn.P1)).toBe(2 ** 1 + 2 ** 2);
  expect(board.stateOf(PlayerTurn.P2)).toBe(2 ** 5 + 2 ** 3);
})