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
        'halloween-orange': '#FF6B35',
        'halloween-purple': '#5D3A9B',
        'halloween-black': '#1a1a1a',
        'halloween-green': '#4ECDC4',
      },
    },
  },
  plugins: [],
}
export default config
