import { expect, test } from "vitest";
import { pickAi } from "./game";

test("ai", () => {
  const bs = [0, 1, 3];
  const ts = [1, 3];
  for (const b0 of bs) {
    for (const b1 of bs) {
      for (const b2 of bs) {
        for (const b3 of bs) {
          for (const b4 of bs) {
            for (const b5 of bs) {
              for (const b6 of bs) {
                for (const b7 of bs) {
                  for (const b8 of bs) {
                    for (const t of ts) {
                      const it = 5;
                      for (let i = 0; i < it; i++) {
                        const board = [
                          b0, b1, b2,
                          b3, b4, b5,
                          b6, b7, b8
                        ];
                        const turn = t;
                        const random = i / it;
                        expect(pickAi(board, turn, random))
                          .toStrictEqual(old_ai(board, turn, random));
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});

export function old_ai(board: number[], playerTurn: number, random: number) {
  const aiPlaced = board.map((piece) => +(piece === playerTurn));
  const aiPlacedBitfield = aiPlaced.reduce((acc, piece, index) => acc | (piece << index), 0);
  const humanPlaced = board.map((piece) => +(piece === (playerTurn + 2) % 4));
  const humanPlacedBitfield = humanPlaced.reduce(
    (acc, piece, index) => acc | (piece << index),
    0
  );
  const winPatterns = [7, 56, 448, 73, 146, 292, 273, 84];
  const firstPatterns = winPatterns
    .filter((pattern) => (pattern & ~humanPlacedBitfield) === pattern)
    .filter((pattern) => (pattern & ~aiPlacedBitfield) !== pattern)
    .filter(
      (pattern) =>
        Array.from({ length: 9 }).reduce<number>(
          (acc, _, index) => acc + (((pattern & ~aiPlacedBitfield) >> index) & 1),
          0
        ) === 1
    );
  if (firstPatterns.length > 0) {
    const point = firstPatterns[(random * firstPatterns.length) | 0] & ~aiPlacedBitfield;
    for (let i = 0; i < 9; i++) {
      if (((point >> i) & 1) === 1) {
        return i;
      }
    }
  }
  const secondPatterns = winPatterns
    .filter((pattern) => (pattern & ~aiPlacedBitfield) === pattern)
    .filter((pattern) => (pattern & ~humanPlacedBitfield) !== pattern)
    .filter(
      (pattern) =>
        Array.from({ length: 9 }).reduce<number>(
          (acc, _, index) => acc + (((pattern & ~humanPlacedBitfield) >> index) & 1),
          0
        ) === 1
    );
  if (secondPatterns.length > 0) {
    const point =
      secondPatterns[(random * secondPatterns.length) | 0] & ~humanPlacedBitfield;
    for (let i = 0; i < 9; i++) {
      if (((point >> i) & 1) === 1) {
        return i;
      }
    }
  }
  const thirdPatterns = winPatterns
    .filter((pattern) => (pattern & ~aiPlacedBitfield) === pattern)
    .filter((pattern) => (pattern & ~humanPlacedBitfield) !== pattern)
    .filter(
      (pattern) =>
        Array.from({ length: 9 }).reduce<number>(
          (acc, _, index) => acc + (((pattern & ~humanPlacedBitfield) >> index) & 1),
          0
        ) === 1
    );
  if (thirdPatterns.length > 0) {
    const point =
      thirdPatterns[(random * thirdPatterns.length) | 0] & ~humanPlacedBitfield;
    for (let i = 0; i < 9; i++) {
      if (((point >> i) & 1) === 2) {
        return i;
      }
    }
  }
  const emptyPieces = board
    .map((piece, index) => [piece, index])
    .filter(([piece]) => piece === 0);
  if (emptyPieces.length > 0) {
    const next = emptyPieces[(random * emptyPieces.length) | 0][1];
    return next;
  }
}