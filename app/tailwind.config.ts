import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sl: {
          bg: '#0f1419',
          card: '#1a2332',
          border: '#2d3a4f',
          accent: '#3b82f6',
          green: '#22c55e',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};

export default config;
