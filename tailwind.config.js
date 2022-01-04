module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pastel-yellow': {
          200: '#f9f2b6',
          100: '#fdf8c0',
        },
        'pastel-pink': '#facfe2',
        'note-shadow': '#a5a173',
      },
      fontFamily: {
        note: 'Reenie Beanie',
      },
      borderRadius: {
        peel: '60px 5px',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
