/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        hand: ['"Fredoka"', '"Comic Sans MS"', 'cursive'],
        rounded: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
        lavender: {
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
        },
        blush: {
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
        },
        cream: {
          50: '#fffdf7',
          100: '#fefce8',
          200: '#fef9c3',
        },
        navy: {
          700: '#1e293b',
          800: '#1e1b4b',
          900: '#1e1b4b',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(124, 58, 237, 0.25)',
        cloud: '0 8px 30px -6px rgba(56, 189, 248, 0.35)',
        glow: '0 0 30px rgba(167, 139, 250, 0.5)',
        pop: '0 6px 0 0 rgba(30, 27, 75, 0.12)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        'drift': {
          '0%': { transform: 'translateX(-20px)' },
          '100%': { transform: 'translateX(calc(100vw + 20px))' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        sparkle: {
          '0%': { offsetDistance: '0%', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { offsetDistance: '100%', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(167,139,250,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(167,139,250,0.8)' },
        },
        'path-dash': {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'path-dash': 'path-dash 1s linear infinite',
        'bounce-in': 'bounce-in 0.5s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        'pop-in': 'pop-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
