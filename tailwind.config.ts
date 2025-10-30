import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'halloween-orange': '#A11610',
        'halloween-purple': '#170026',
        'halloween-black': '#040006',
        'halloween-green': '#8BFF57',
        'halloween-ember': '#3A0507',
        'halloween-ash': '#221128',
        'halloween-mist': '#E6E2F3',
      },
      boxShadow: {
        haunted: '0 0 25px rgba(139, 255, 87, 0.15), inset 0 0 35px rgba(161, 22, 16, 0.2)',
        'haunted-glow': '0 0 35px rgba(139, 255, 87, 0.5)',
      },
      backgroundImage: {
        haunted:
          'radial-gradient(circle at 20% 20%, rgba(161, 22, 16, 0.35), transparent 60%), radial-gradient(circle at 80% 0%, rgba(139, 255, 87, 0.2), transparent 55%), linear-gradient(180deg, rgba(8, 0, 12, 0.98) 0%, rgba(5, 0, 10, 1) 45%, rgba(29, 0, 29, 0.95) 100%)',
        'haunted-panel':
          'linear-gradient(145deg, rgba(34, 17, 40, 0.95) 0%, rgba(58, 5, 7, 0.92) 100%)',
        'haunted-panel-glare':
          'radial-gradient(circle at top, rgba(139, 255, 87, 0.12), rgba(5, 0, 10, 0.92))',
      },
      animation: {
        'pulse-slow': 'pulse 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
