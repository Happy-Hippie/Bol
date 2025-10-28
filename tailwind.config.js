/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bol-purple': '#4A1A5C',
        'bol-pink': '#D946A6',
        'bol-blue': '#2563A5',
        'bol-orange': '#F59E42',
        'bol-dark': '#2D1B3D',
        'bol-light': '#F8F9FA',
      },
      backgroundImage: {
        'gradient-pink-orange': 'linear-gradient(135deg, #D946A6 0%, #F59E42 100%)',
        'gradient-orange-pink': 'linear-gradient(135deg, #F59E42 0%, #FF6B9D 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #2563A5 0%, #4A1A5C 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #4A1A5C 0%, #2563A5 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
