import React from "react";
import { useStore } from "zustand";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Piece } from "../components/Piece";
import { Text } from "../components/Text";
import { GameState, PlayerTurn, gameStore } from "../lib/game";

const Page = () => {
  const ai = true;
  const { board, place, next, reset, state, turn, howToWin, actAi } = useStore(gameStore);

  const s = state();

  return (
    <>
      <Flex direction="vertical" align="center" gap="1" grow="1">
        <Flex align="center">
          <Piece as="div" type={turn} css={{ width: "1rem", height: "1rem" }} />
          <Text>{"'s turn"}</Text>
        </Flex>
        <Board>
          {board.map((piece, index) => {
            return (
              <Piece
                key={index}
                type={piece}
                onClick={() => {
                  if (s !== GameState.Playing) return;
                  if (ai) {
                    if (turn !== PlayerTurn.P1) {
                      return;
                    }
                  }
                  if (place(index)) {
                    next();
                    setTimeout(actAi, Math.random() * 300 + 200);
                  }
                }}
                highlight={((howToWin() ?? 0) & (1 << index)) !== 0}
              />
            );
          })}
        </Board>
        {s !== GameState.Playing && (
          <>
            <Flex align="center" gap="half">
              {displayState()}
            </Flex>
            <Button onClick={reset}>retry!</Button>
          </>
        )}
      </Flex>
      <Flex justify="center">
        <Text>
          <Text as="a" color="black" href="https://github.com/tnRaro">
            tnRaro
          </Text>
          's Tic Tac Toe
        </Text>
      </Flex>
    </>
  );

  function displayState() {
    switch (s) {
      case GameState.Playing: return;
      case GameState.Draw: return "Draw!";
      case GameState.P1Won:
      case GameState.P2Won: {
        return (
          <>
            <Piece as="div" type={s} css={{ width: "1rem", height: "1rem" }} />
            {"won!"}
          </>
        )
      }
    }
  }
};

export default Page;
