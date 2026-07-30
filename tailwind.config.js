/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#eef9ff', 100: '#d9f1ff', 200: '#b8e6ff', 300: '#86d6ff',
          400: '#4dbfff', 500: '#22a3f5', 600: '#1084d1', 700: '#0e6aab',
          800: '#125a8c', 900: '#144d74',
        },
        leaf: {
          50: '#eefdf3', 100: '#d5f9e2', 200: '#aef1c8', 300: '#75e3a6',
          400: '#43cd82', 500: '#22b566', 600: '#169153', 700: '#147445',
          800: '#135c39', 900: '#114b31',
        },
        sunny: {
          50: '#fffbea', 100: '#fff3c4', 200: '#ffe58a', 300: '#ffd24d',
          400: '#ffbe22', 500: '#f9a007', 600: '#dd7a04', 700: '#b75808',
          800: '#94440d', 900: '#7a390f',
        },
        tangerine: {
          50: '#fff4ed', 100: '#ffe4d3', 200: '#ffc4a6', 300: '#ff9c6e',
          400: '#ff7539', 500: '#fa5411', 600: '#eb3a07', 700: '#c22908',
          800: '#9a220f', 900: '#7d1f10',
        },
        good: { DEFAULT: '#22b566', light: '#d5f9e2' },
        avg: { DEFAULT: '#f9a007', light: '#fff3c4' },
        bad: { DEFAULT: '#f0473f', light: '#ffe1df' },
      },
      fontFamily: {
        heading: ['"Baloo 2"', '"Poppins"', 'sans-serif'],
        body: ['"Poppins"', '"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '24px',
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(20, 77, 116, 0.18)',
        card: '0 4px 16px -4px rgba(20, 77, 116, 0.12)',
        glow: '0 0 0 4px rgba(255, 190, 34, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-8px) translateX(6px)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        drift: 'drift 30s linear infinite',
        driftSlow: 'drift 45s linear infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
        popIn: 'popIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
