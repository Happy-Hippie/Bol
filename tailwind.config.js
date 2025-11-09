/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bol-purple': '#5C7A58',
        'bol-pink': '#C85F3D',
        'bol-blue': '#7B9CA8',
        'bol-orange': '#E6B84D',
        'bol-dark': '#3D4F3B',
        'bol-light': '#F5F7F5',
        'bol-sage': '#7A9B76',
        'bol-terracotta': '#C85F3D',
        'bol-gold': '#E6B84D',
        'bol-mint': '#C5D8C5',
        'bol-slate': '#7B9CA8',
      },
      backgroundImage: {
        'gradient-pink-orange': 'linear-gradient(135deg, #C85F3D 0%, #E6B84D 100%)',
        'gradient-orange-pink': 'linear-gradient(135deg, #E6B84D 0%, #C85F3D 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #7B9CA8 0%, #5C7A58 100%)',
        'gradient-purple-blue': 'linear-gradient(135deg, #5C7A58 0%, #7B9CA8 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
