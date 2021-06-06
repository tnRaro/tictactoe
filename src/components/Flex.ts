import { styled } from "../stitches.config";

export const Flex = styled("div", {
  display: "flex",
  variants: {
    direction: {
      vertical: {
        flexDirection: "column",
      },
      horizontal: {
        flexDirection: "row",
      },
    },
    align: {
      baseline: {
        alignItems: "baseline",
      },
      center: {
        alignItems: "center",
      },
      start: {
        alignItems: "flex-start",
      },
      end: {
        alignItems: "flex-end",
      },
      stretch: {
        alignItems: "stretch",
      },
    },
    justify: {
      center: {
        justifyContent: "center",
      },
      start: {
        justifyContent: "flex-start",
      },
      end: {
        justifyContent: "flex-end",
      },
      stretch: {
        justifyContent: "stretch",
      },
      around: {
        justifyContent: "space-around",
      },
      between: {
        justifyContent: "space-between",
      },
      evenly: {
        justifyContent: "space-evenly",
      },
    },
    gap: {
      half: {
        gap: "0.5rem",
      },
      1: {
        gap: "1rem",
      },
      2: {
        gap: "2rem",
      },
    },
    grow: {
      1: {
        flexGrow: 1,
      },
    },
    shrink: {
      1: {
        flexShrink: 1,
      },
    },
  },
});
