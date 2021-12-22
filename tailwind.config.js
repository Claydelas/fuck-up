module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      lineClamp: {
        note: '8',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
