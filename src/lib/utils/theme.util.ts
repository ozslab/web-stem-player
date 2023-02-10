import { PaletteMode, createTheme } from "@mui/material";

export const getTheme = (paletteMode: PaletteMode) =>
  createTheme({
    palette: {
      mode: paletteMode,
    },
  });
