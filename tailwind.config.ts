import typography from '@tailwindcss/typography';
import type { Config } from "tailwindcss";
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    sidebar: {
      DEFAULT: 'hsl(var(--sidebar-background))',
      foreground: 'hsl(var(--sidebar-foreground))',
      primary: 'hsl(var(--sidebar-primary))',
      'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
      accent: 'hsl(var(--sidebar-accent))',
      'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
      border: 'hsl(var(--sidebar-border))',
      ring: 'hsl(var(--sidebar-ring))',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'slide-out-to-right': {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'toast-in': {
          '0%': {
            transform: 'translateX(calc(100% + 24px)) scale(0.95)',
            opacity: '0',
            filter: 'blur(8px)'
          },
          '60%': {
            transform: 'translateX(-8px) scale(1.02)',
            opacity: '0.85',
            filter: 'blur(0px)'
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',
            filter: 'blur(0px)'
          }
        },
        'toast-out': {
          '0%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',
            filter: 'blur(0px)'
          },
          '30%': {
            transform: 'translateX(-8px) scale(1.02)',
            opacity: '0.85',
            filter: 'blur(0px)'
          },
          '100%': {
            transform: 'translateX(calc(100% + 24px)) scale(0.95)',
            opacity: '0',
            filter: 'blur(8px)'
          }
        },
        'toast-stack': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(var(--stack-offset)) scale(var(--stack-scale))' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-out-to-right': 'slide-out-to-right 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'toast-in': 'toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out': 'toast-out 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-stack': 'toast-stack 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      spacing: {
        ...Array.from({ length: 20 }, (_, i) => i * 16).reduce((acc, val) => ({
          ...acc,
          [val]: `${val}px`,
        }), {})
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            hr: {
              borderColor: 'hsl(var(--border))',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'h1, h2, h3, h4': {
              color: 'hsl(var(--foreground))',
            },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
            },
            strong: {
              color: 'hsl(var(--foreground))',
            },
            code: {
              color: 'hsl(var(--foreground))',
            },
          },
        },
      },
    },
  },
  plugins: [
    tailwindAnimate,
    typography,
  ],
  // @ts-expect-error - safelist is a valid config option but not typed in Config
  safelist: [
    {
      pattern: /translate-[xy]-[-]?\d+/,
    },
  ],
} satisfies Config;

export default config;
