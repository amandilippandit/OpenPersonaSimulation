import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "system-ui"],
      },
      colors: {
        ink: {
          950: "#0a0a14",
          900: "#0f0f1e",
          850: "#141427",
          800: "#1a1a2e",
          700: "#252540",
          600: "#35354f",
          500: "#4a4a66",
          400: "#6b6b85",
          300: "#9898ac",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
