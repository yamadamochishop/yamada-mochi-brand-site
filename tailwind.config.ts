import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#F8F6F2",
        sumi: "#1A1A1A",
        green: "#273323",
        brown: "#5B4634",
        kinari: "#E9E1D2"
      },
      fontFamily: {
        serifjp: [
          '"Yu Mincho"',
          '"Hiragino Mincho ProN"',
          '"Noto Serif JP"',
          "serif"
        ],
        sansjp: [
          '"Yu Gothic"',
          '"Hiragino Sans"',
          '"Noto Sans JP"',
          "sans-serif"
        ]
      },
      letterSpacing: {
        brand: "0.18em"
      }
    }
  },
  plugins: []
};

export default config;
