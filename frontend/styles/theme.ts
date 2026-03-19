import { createTheme } from "@mui/material/styles";

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",     // indigo
      dark: "#4338ca",
      light: "#a5b4fc",
    },
    secondary: {
      main: "#8b5cf6",     // purple (used for gamification)
    },
    background: {
      default: "#f8fafc",  // very light gray
      paper: "#ffffff",
    },
    success: { main: "#10b981" },
    warning: { main: "#f59e0b" },
    error:   { main: "#ef4444" },
  },
  typography: {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    h1: { fontSize: "2rem",   fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    h3: { fontSize: "1.25rem",fontWeight: 600 },
    body1: { fontSize: "0.9rem" },
    body2: { fontSize: "0.8rem" },
  },
  shape: { borderRadius: 10 },
  components: {
    // Remove default MUI button text transform (ALL CAPS is ugly)
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 3px rgba(0,0,0,0.08)", borderRadius: 12 },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      dark: "#6366f1",
      light: "#c7d2fe",
    },
    secondary: { main: "#a78bfa" },
    background: {
      default: "#0f172a",   // slate-900
      paper:   "#1e293b",   // slate-800
    },
    success: { main: "#34d399" },
    warning: { main: "#fbbf24" },
    error:   { main: "#f87171" },
  },
  typography: {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    h1: { fontSize: "2rem",   fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
    h3: { fontSize: "1.25rem",fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
  },
});
