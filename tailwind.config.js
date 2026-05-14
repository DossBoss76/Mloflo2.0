/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0c0f',
        'bg-secondary': '#10141a',
        'bg-tertiary': '#161b23',
        'bg-card': '#1c222c',
        'bg-hover': '#222832',
        'green-brand': '#04d39e',
        'green-brand-2': '#04d374',
        'blue-brand': '#6dc2f1',
        'blue-brand-2': '#92E3FB',
        'blue-accent': '#4aa2eb',
        'blue-dark': '#4B72BC',
        'amber-brand': '#f5a623',
        'red-brand': '#ff5c5c',
        'text-primary': '#e8eaed',
        'text-secondary': '#8c9199',
        'text-muted': '#4d5563',
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-default': 'rgba(255,255,255,0.10)',
        'border-emphasis': 'rgba(109,194,241,0.25)',
      },
      fontFamily: {
        palanquin: ['Palanquin', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        barlow: ['"Barlow Semi Condensed"', 'sans-serif'],
      },
      borderRadius: {
        '10': '10px',
        '12': '12px',
      },
    },
  },
  plugins: [],
};
