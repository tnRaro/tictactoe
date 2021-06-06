import { styled } from "../stitches.config";

export const Board = styled("div", {
  display: "grid",
  width: 240,
  height: 240,
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1rem",
});
