import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#c9a227",
          600: "#a18320",
          700: "#7a6318",
          800: "#524210",
          900: "#2b2208",
        },
        bronze: {
          50: "#fdf4ef",
          100: "#fae5d9",
          200: "#f4c7b0",
          300: "#eda380",
          400: "#cd7f32",
          500: "#b56929",
          600: "#965522",
          700: "#72401a",
          800: "#4d2b12",
          900: "#29170a",
        },
        arena: {
          dark: "#0d0c0a",
          darker: "#070605",
          card: "#15140f",
          border: "#2a2820",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        score: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
