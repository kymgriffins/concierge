import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-family-display)'],
        body: ['var(--font-family-body)'],
      },
      colors: {
        black: 'hsl(var(--color-black))',
        white: 'hsl(var(--color-white))',
        gray: {
          50: 'hsl(var(--color-gray-light))',
          200: 'hsl(var(--color-gray-200))',
          800: 'hsl(var(--color-gray-800))',
        }
      },
      fontSize: {
        'hero': 'var(--font-size-hero)',
        'h1': 'var(--font-size-h1)',
        'h2': 'var(--font-size-h2)',
        'body': 'var(--font-size-body)',
        'caption': 'var(--font-size-caption)',
      },
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'normal': 'var(--line-height-normal)',
      },
      spacing: {
        'section-y': 'var(--section-padding-y)',
        'section-x': 'var(--section-padding-x)',
        'card-gap': 'var(--card-gap)',
      },
      height: {
        'hero': 'var(--hero-height)',
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
      },
      scale: {
        'hover': 'var(--hover-scale)',
      },
      transitionDuration: {
        'default': 'var(--transition-duration)',
      },
      animation: {
        'pulse-slow': 'pulse var(--pulse-duration) cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
};

export default config;
