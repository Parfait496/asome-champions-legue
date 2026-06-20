/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: 'var(--color-gold, #F5C842)',
          dark: 'var(--color-gold-dark, #C49A10)',
        },
        pitch: {
          DEFAULT: '#0D3B2E',
          light: '#155340',
        },
        accent: '#E8F54A',
        dark: '#080F0D',
        surface: {
          DEFAULT: '#111C18',
          raised: '#1A2E28',
        },
        border: '#1E3028',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}