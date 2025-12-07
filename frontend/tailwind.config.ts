import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f3f0',
        moss: {
          50: '#f9fdf9',
          100: '#f0f8f2',
          200: '#d4eae0',
          300: '#a8d9c8',
          400: '#7cc4b0',
          500: '#4a7c59',
          600: '#3d6847',
          700: '#2b5743',
          800: '#1e4620',
          900: '#142f15',
        },
        sage: {
          50: '#f6fdf9',
          100: '#edf8f3',
          200: '#d0eae2',
          300: '#a3dcd0',
          400: '#76cebe',
          500: '#4a9b7c',
          600: '#3a8667',
          700: '#2a6f56',
          800: '#1d5342',
          900: '#142f2a',
        },
      },
      animation: {
        'fade-in-minimal': 'fadeInMinimal 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        fadeInMinimal: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
