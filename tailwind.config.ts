import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#F8F6F2',
        sumi: '#1A1A1A',
        green: '#273323',
        brown: '#5B4634',
        kinari: '#E9E1D2',
      },
      fontFamily: {
        serifjp: ['"Yu Mincho"', '"Hiragino Mincho ProN"', '"Noto Serif JP"', 'serif'],
        sansjp: ['"Yu Gothic"', '"Hiragino Sans"', '"Noto Sans JP"', 'sans-serif'],
      },
      // 見出しは明朝の和文で2行以上になることが多い。Tailwind既定の行間
      // （5xl以上は1）のままだと、md:text-5xl などのレスポンシブ指定が
      // leading-relaxed を打ち消して行が詰まるため、和文向けの行間を既定にする。
      fontSize: {
        '2xl': ['1.5rem', { lineHeight: '1.6' }],
        '3xl': ['1.875rem', { lineHeight: '1.55' }],
        '4xl': ['2.25rem', { lineHeight: '1.5' }],
        '5xl': ['3rem', { lineHeight: '1.45' }],
        '6xl': ['3.75rem', { lineHeight: '1.4' }],
        '7xl': ['4.5rem', { lineHeight: '1.35' }],
      },
      letterSpacing: {
        brand: '0.18em',
      },
    },
  },
  plugins: [],
};

export default config;
