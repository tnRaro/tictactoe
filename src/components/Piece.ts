import { styled } from "../stitches.config";

export const Piece = styled("button", {
  appearance: "none",
  border: "none",
  "--smooth-corners": 4,
  color: "white",
  maskImage: "paint(smooth-corners)",
  transition: "transform 0.2s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
  variants: {
    type: {
      0: {},
      1: {
        background: [
          "radial-gradient(at bottom, hsl(16deg 100% 50% / 33%), hsl(328deg 100% 54% / 0%))",
          "linear-gradient(deeppink, orangered)",
        ].join(),
      },
      3: {
        background: [
          "radial-gradient(at bottom, hsl(210deg 100% 56% / 33%), hsl(248deg 53% 58% / 0%))",
          "linear-gradient(slateblue, dodgerblue)",
        ].join(),
      },
    },
    highlight: {
      true: {
        transform: "scale(1.1)",
      },
    },
  },
  defaultVariants: {
    type: "0",
  },
});
