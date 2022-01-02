module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pastel-yellow': '#f9f2b6',
        'pastel-pink': '#facfe2',
      },
      fontFamily: {
        note: 'Reenie Beanie',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
