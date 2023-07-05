import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#808080",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        },
        contained: {
          boxShadow: "none",
        },
        containedPrimary: {
          color: "#fff",
        },
        containedSecondary: {
          color: "#fff",
        },
      },
    },
  },
  // Добавьте другие настройки темы, если нужно
});
