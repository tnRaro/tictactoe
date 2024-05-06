import { atom, useAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import React, { useEffect, useRef } from "react";
import { Board } from "../components/Board";
import { Button } from "../components/Button";
import { Flex } from "../components/Flex";
import { Piece } from "../components/Piece";
import { Text } from "../components/Text";
import { pickAi } from "../lib/game";

// 1 인간 3 AI
type TPlayer = 1 | 3;
type TPiece = 0 | TPlayer;
type TGameStateDraw = 2;
type TBoard = [TPiece, TPiece, TPiece, TPiece, TPiece, TPiece, TPiece, TPiece, TPiece];
type TGameState = TGameStateDraw | TPlayer | null;

const boardAtom = atomWithReset<TBoard>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
const gameStateAtom = atomWithReset<TGameState>(null);
const playerTurnAtom = atomWithReset<TPlayer>(3);
const winPatternAtom = atomWithReset<number>(0);
const aiAtom = atom(true);

const useGameState = () => {
  const [board] = useAtom(boardAtom);
  const [playerTurn] = useAtom(playerTurnAtom);
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [winPattern, setWinPattern] = useAtom(winPatternAtom);
  const isEnded = gameState != null;
  useEffect(() => {
    const placedPieces = board.map((piece) => +(piece === playerTurn));
    const placedPiecesBitfield = placedPieces.reduce(
      (acc, placedPiece, index) => acc | (placedPiece << index),
      0
    );
    const winPatterns = [7, 56, 448, 73, 146, 292, 273, 84];
    const winPattern = winPatterns.find((pattern) => (placedPiecesBitfield & pattern) === pattern);
    if (winPattern != null) {
      setGameState(playerTurn);
      setWinPattern(winPattern);
    } else {
      if (board.every((piece) => piece !== 0)) {
        setGameState(2);
      }
    }
  }, [board]);
  return {
    gameState,
    isEnded,
    winPattern,
  };
};

const usePlayerTurn = () => {
  const [board] = useAtom(boardAtom);
  const [playerTurn, setPlayerTurn] = useAtom(playerTurnAtom);
  useEffect(() => {
    setPlayerTurn((playerTurn) => ((playerTurn + 2) % 4) as TPlayer);
  }, [board]);
  return playerTurn;
};

const useBoard = () => {
  const [board, setBoard] = useAtom(boardAtom);
  const [gameState] = useAtom(gameStateAtom);

  const placePiece = (index: number, player: TPlayer) => {
    const isEnded = gameState != null;
    if (isEnded) return;
    if (board[index] !== 0) return;
    setBoard((board) => board.map((piece, i) => (i === index ? player : piece)) as TBoard);
  };

  return [board, placePiece] as const;
};

const useReset = () => {
  const resetBoard = useResetAtom(boardAtom);
  const resetGameState = useResetAtom(gameStateAtom);
  const resetPlayerTurn = useResetAtom(playerTurnAtom);
  const resetWinPattern = useResetAtom(winPatternAtom);

  const reset = () => {
    resetBoard();
    resetGameState();
    resetPlayerTurn();
    resetWinPattern();
  };
  return reset;
};

const useAi = (placePiece: (index: number, player: TPlayer) => void) => {
  const [board] = useAtom(boardAtom);
  const [playerTurn] = useAtom(playerTurnAtom);
  const [ai] = useAtom(aiAtom);
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    if (!ai) {
      return;
    }
    if (playerTurn !== 3) {
      return;
    }
    const id = setTimeout(() => {
      const i = pickAi(board, playerTurn, Math.random())!;
      placePiece(i, playerTurn);
    }, Math.random() * 300 + 200);
    return () => clearTimeout(id);
  }, [playerTurn]);
  return ai;
};

const Page: React.VoidFunctionComponent<unknown> = () => {
  const [board, placePiece] = useBoard();
  const { gameState, winPattern } = useGameState();
  const playerTurn = usePlayerTurn();
  const reset = useReset();
  const ai = useAi(placePiece);

  return (
    <>
      <Flex direction="vertical" align="center" gap="1" grow="1">
        <Flex align="center">
          <Piece as="div" type={playerTurn} css={{ width: "1rem", height: "1rem" }} />
          <Text>{"'s turn"}</Text>
        </Flex>
        <Board>
          {board.map((piece, index) => {
            return (
              <Piece
                key={index}
                type={piece}
                onClick={() => {
                  if (ai) {
                    if (playerTurn !== 1) {
                      return;
                    }
                  }
                  placePiece(index, playerTurn);
                }}
                highlight={(winPattern & (1 << index)) !== 0}
              />
            );
          })}
        </Board>
        {gameState != null && (
          <>
            <Flex align="center" gap="half">
              {gameState === 2 ? (
                "Draw!"
              ) : (
                <>
                  <Piece as="div" type={gameState} css={{ width: "1rem", height: "1rem" }} />
                  {"won!"}
                </>
              )}
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
};

export default Page;
