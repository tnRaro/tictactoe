import { styled } from "../stitches.config";

export const Button = styled("button", {
  appearance: "none",
  border: "none",
  borderRadius: "0.25rem",
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  fontFamily: "inherit",
  transition: "background 0.3s ease-out, color 0.3s ease-out",
  "&:hover": {
    background: "gainsboro",
  },
});
