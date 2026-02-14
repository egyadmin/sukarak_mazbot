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
          dark: '#3e516b',
          emerald: '#166f50',
          pink: '#c13e7f',
          teal: '#29b0cf',
        },
        background: {
          DEFAULT: '#f5fffc',
          secondary: '#e2f6f7',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        zain: ['Zain', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
