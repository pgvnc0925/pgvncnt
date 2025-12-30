/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pv: {
          dark: '#0f172a',
          light: '#f8fafc',
          primary: '#1e40af',
          accent: '#dc2626',
          success: '#16a34a',
          warning: '#ea580c',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
