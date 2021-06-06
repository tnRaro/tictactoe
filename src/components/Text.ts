import { styled } from "../stitches.config";

export const Text = styled("p", {
  padding: 0,
  margin: 0,
  variants: {
    color: {
      black: {
        color: "black",
      },
      gainsboro: {
        color: "gainsboro",
      },
    },
  },
});
