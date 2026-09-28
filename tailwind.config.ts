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
        'digital-darker': '#050914', // Extreme dark for backgrounds
        'digital-dark': '#0B0F19', // Deep dark blue/black
        'digital-card': '#111827', // Lighter dark for cards (Tailwind gray-900)
        'digital-blue': '#3b82f6', // Bright professional blue
        'digital-blue-hover': '#2563eb', // Hover state
        'digital-accent': '#60a5fa', // Light blue accent
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'cricket-bg': "linear-gradient(to bottom, rgba(5, 9, 20, 0.85), rgba(5, 9, 20, 1)), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')",
      },
      boxShadow: {
        'neon': '0 0 20px rgba(59, 130, 246, 0.3)',
        'neon-strong': '0 0 30px rgba(59, 130, 246, 0.6)',
      }
    },
  },
  plugins: [],
};
export default config;
