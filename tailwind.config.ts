// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffe8dd',
          200: '#ffccb8',
          300: '#ffaa8a',
          400: '#ff8a5c',
          500: '#ff7033',
          600: '#f55818',
          700: '#e04a0f',
          800: '#b83c0c',
          900: '#942f0a'
        },
        dark: {
          50: '#e6e8ec',
          100: '#c7cbd4',
          200: '#9da3b0',
          300: '#737b8c',
          400: '#4a5468',
          500: '#202c44',
          600: '#0f1a2e',
          700: '#081429',
          800: '#051024',
          900: '#020a1c',
          950: '#010511'
        },
        brand: {
          'orange': '#ff7033',
          'dark-blue': '#020a1c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'pulse-orange': 'pulseOrange 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 112, 51, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 112, 51, 0)' }
        }
      },
      boxShadow: {
        'orange-glow': '0 0 30px rgba(255, 112, 51, 0.5)',
      }
    },
  },
  plugins: [],
}

export default config