import { test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "../pages";
import { gameStore } from "./game-store";

let buttons: HTMLButtonElement[];

beforeEach(async () => {
  const { unmount } = render(<Page />);

  buttons = await screen.findAllByRole("button");

  return () => {
    unmount();
    gameStore.setState(gameStore.getInitialState());
    gameStore.getState().reset();
  }
});

test("initial", async () => {
  expect(buttons.every(button => button.classList.length === 1)).toStrictEqual(true);
})

test("place", async () => {
  fireEvent.click(buttons[4]);

  expect(buttons.map(x => [...x.classList].filter(x => /-type-[13]$/.test(x)).map(x => x.match(/[13]$/)![0]).join("")))
    .toStrictEqual(["", "", "", "", "1", "", "", "", ""]);
})

test("initial", async () => {
  expect(buttons.every(button => button.classList.length === 1)).toStrictEqual(true);
})