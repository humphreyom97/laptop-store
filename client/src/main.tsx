import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, // Blue, matches your buttons
    secondary: { main: "#dc004e" }, // Red, for decommission
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
