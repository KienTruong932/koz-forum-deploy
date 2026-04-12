"use client";
import { Quicksand } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface PaletteOptions {
    kozLogo?: string;
  }
  interface Palette {
    kozLogo: string;
  }
}

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data"
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#1255a1ff" },
        secondary: { main: "#000000ff" },
        text: {
          primary: "#000000ff",
        },
        action: {
          hover: "#ffffff",
        },
        kozLogo: "#fff",
      },
    },
    dark: {
      palette: {
        primary: { main: "#005ec9ff" },
        secondary: { main: "#ffffffff" },
        text: {
          primary: "#ffffffff",
        },
        action: {
          hover: "#ffffff00",
        },
        kozLogo: "rgb(0, 119, 255)",
      },
    },
  },
  defaultColorScheme: 'light',
  typography: {
    fontFamily: quicksand.style.fontFamily,
  },
});

export default theme;
