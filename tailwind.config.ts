import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'digital-dark': '#0B0F19', // Deep dark blue/black
        'digital-card': '#111827', // Lighter dark for cards (Tailwind gray-900)
        'digital-blue': '#2563EB', // Professional blue
        'digital-blue-hover': '#1D4ED8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'cricket-bg': "linear-gradient(to bottom, rgba(11, 15, 25, 0.8), rgba(11, 15, 25, 1)), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')",
      }
    },
  },
  plugins: [],
};
export default config;
