import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0A0A0A",
        charcoal: "#121212",
        crimson: {
          900: "#990000",
          800: "#B30000",
          700: "#CC0000",
          600: "#DC2626",
          500: "#EF4444",
        },
        steel: {
          100: "#E2E8F0",
          300: "#CBD5E1",
          500: "#64748B",
        },
      },
      fontFamily: {
        display: ["Syne", "'Plus Jakarta Sans'", "sans-serif"],
        sans: ["Inter", "'Geist Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "crimson-glow": "0 0 24px rgba(220, 38, 38, 0.45), 0 0 64px rgba(153, 0, 0, 0.35)",
        "crimson-sm": "0 0 12px rgba(220, 38, 38, 0.4)",
        "card": "0 20px 60px -20px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "hero-grid": "linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px)",
        "red-radial": "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(153,0,0,0.35), transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
