/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f8f3',
          100: '#e1efe4',
          500: '#1e7c34', // Agricultural green
          600: '#166228',
          700: '#104d1e',
          900: '#06260d',
        },
        secondary: {
          50: '#fffbf7',
          100: '#ffebd4',
          500: '#f97316', // Vibrant orange
          600: '#ea580c',
          700: '#c2410c',
        },
        dark: {
          50: '#f6f6f7',
          100: '#eef0f2',
          800: '#1f2937', // Dark gray
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

