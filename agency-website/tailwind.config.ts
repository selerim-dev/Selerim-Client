import type { Config } from 'tailwindcss'
import { tokens } from './src/config/tokens'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...tokens.colors,
      },
      fontFamily: tokens.typography.fontFamily,
      screens: tokens.breakpoints,
      keyframes: {
        'gradient-rotate': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'gradient-rotate': 'gradient-rotate 3s linear infinite',
      },
      backgroundSize: {
        'gradient-rotate': '200% 200%',
      },
    },
  },
  plugins: [],
}

export default config 