/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9efff',
          500: '#1d7ef0',
          600: '#165fcc',
          700: '#1148a3'
        }
      }
    }
  },
  plugins: []
};

export default config;

