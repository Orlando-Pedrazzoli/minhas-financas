/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ... resto do extend ...

      // Adicionar animation delays
      animationDelay: {
        2000: '2000ms',
        4000: '4000ms',
        6000: '6000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Plugin para animation-delay
    function ({ addUtilities, theme }) {
      const delays = theme('animationDelay');
      const delayUtilities = Object.entries(delays).map(([key, value]) => {
        return {
          [`.animation-delay-${key}`]: {
            'animation-delay': value,
          },
        };
      });
      addUtilities(delayUtilities);
    },
    // Plugin para safe areas
    function ({ addUtilities }) {
      addUtilities({
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-bottom': {
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)',
        },
      });
    },
  ],
};
