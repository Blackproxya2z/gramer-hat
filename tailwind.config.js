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
          DEFAULT: '#2D5F3F',
          dark: '#1e4029',
          light: '#3d7c54',
          50: '#f2f8f4',
          100: '#e1efe6',
        },
        cream: {
          DEFAULT: '#f7f4ec',
          dark: '#efeade',
        },
        secondary: {
          DEFAULT: '#F4A261',
          light: '#f7b985',
          dark: '#e0843a',
        },
        accent: {
          DEFAULT: '#E76F51',
          hover: '#d65a3b',
        },
        bgLight: '#FAFAFA',
        darkText: '#1A1A1A',
        subtle: '#6b7280',
      },
      fontFamily: {
        bengaliSerif: ['"Noto Serif Bengali"', 'serif'],
        bengali: ['"Noto Sans Bengali"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
