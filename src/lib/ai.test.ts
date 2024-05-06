import { expect, test } from "vitest";
import { old_ai } from "./ai";
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