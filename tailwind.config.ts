import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "flip-x": {
          "0%": { transform: "scaleX(1)" },
          "50%": { transform: "scaleX(-1)" },
          "100%": { transform: "scaleX(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "menu-in": {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "menu-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-100%)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-slide-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "flip-x": "flip-x 0.8s ease-in-out",
        "fade-in": "fade-in 1s ease-in-out forwards",
        "fade-out": "fade-out 1s ease-in-out forwards",
        "enter-from-left": "enter-from-left 0.4s ease-out forwards",
        "menu-in": "menu-in 0.4s ease-out forwards",
        "menu-out": "menu-out 0.4s ease-out forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "reveal-slide-up": "reveal-slide-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      fontFamily: {
        gilda: ["var(--font-gilda)", "serif"],
        barlow: ["var(--font-barlow)", "sans-serif"],
        "barlow-c": ["var(--font-barlow-c)", "sans-serif"],
        allura: ["var(--font-allura)", "cursive"],
        vazir: ["var(--font-vazir)", "sans-serif"],
      },
      colors: {
        header: {
          bg: "#0f0f0f",
          fg: "#f5f0e8",
          mute: "#a39e94",
          accent: "#c9a962",
          "accent-hover": "#d4b978",
        },
      },
    },
  },
  plugins: [],
};

export default config;
