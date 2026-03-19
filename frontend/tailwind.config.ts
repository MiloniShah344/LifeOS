import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Important: prefix Tailwind to avoid conflicts with MUI
  // We DON'T use a prefix here — instead we use important: true
  important: true,
  theme: {
    extend: {
      colors: {
        // LifeOS brand colors
        primary: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          500: "#6366f1",   // indigo-500 (main brand)
          600: "#4f46e5",
          700: "#4338ca",
          900: "#1e1b4b",
        },
        gamification: {
          xp:    "#f59e0b",  // amber — XP points
          level: "#8b5cf6",  // purple — level badge
          streak:"#10b981",  // emerald — streak
        },
        mood: {
          great: "#22c55e",
          good:  "#86efac",
          okay:  "#fbbf24",
          bad:   "#f87171",
          awful: "#ef4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":    "fadeIn 0.2s ease-in-out",
        "slide-up":   "slideUp 0.3s ease-out",
        "bounce-xp":  "bounceXP 0.5s ease-out",
      },
      keyframes: {
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:  { from: { transform: "translateY(10px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        bounceXP: { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.2)" } },
      },
    },
  },
  plugins: [],
};

export default config;
