import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        /* ── Brand ── */
        navy: {
          DEFAULT: '#0D1B36',
          hover: '#16284E',
          light: '#1E3A5F',
          muted: '#2D4A6E',
        },
        gold: {
          DEFAULT: '#B68A35',
          light: '#C9A24B',
          muted: '#D4B46A',
          subtle: '#F6EDDA',
        },

        /* ── UI Surfaces ── */
        background: '#F7F5F2',
        surface: '#FFFFFF',
        border: '#D7DCE5',
        'border-strong': '#B8BFC9',

        /* ── Text ── */
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        'text-inverse': '#FFFFFF',

        /* ── Semantic ── */
        success: { DEFAULT: '#16A34A', light: '#DCFCE7', text: '#15803D' },
        error: { DEFAULT: '#DC2626', light: '#FEE2E2', text: '#B91C1C' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7', text: '#D97706' },
        info: { DEFAULT: '#3B82F6', light: '#DBEAFE', text: '#2563EB' },

        /* ── Shadcn ── */
        primary: { DEFAULT: '#0D1B36', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#F7F5F2', foreground: '#1F2937' },
        muted: { DEFAULT: '#F3F4F6', foreground: '#6B7280' },
        accent: { DEFAULT: '#B68A35', foreground: '#FFFFFF' },
        destructive: { DEFAULT: '#DC2626', foreground: '#FFFFFF' },
        card: { DEFAULT: '#FFFFFF', foreground: '#1F2937' },
        popover: { DEFAULT: '#FFFFFF', foreground: '#1F2937' },
        input: '#D7DCE5',
        ring: '#B68A35',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        md: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(13,27,54,0.04)',
        sm: '0 1px 3px rgba(13,27,54,0.06), 0 1px 2px rgba(13,27,54,0.04)',
        DEFAULT: '0 4px 6px rgba(13,27,54,0.06), 0 2px 4px rgba(13,27,54,0.04)',
        md: '0 4px 12px rgba(13,27,54,0.08), 0 2px 6px rgba(13,27,54,0.04)',
        lg: '0 10px 24px rgba(13,27,54,0.10), 0 4px 8px rgba(13,27,54,0.06)',
        xl: '0 20px 40px rgba(13,27,54,0.12), 0 8px 16px rgba(13,27,54,0.06)',
        gold: '0 4px 16px rgba(182,138,53,0.20)',
        'gold-lg': '0 8px 24px rgba(182,138,53,0.28)',
        'inner-sm': 'inset 0 1px 2px rgba(13,27,54,0.06)',
      },
      transitionTimingFunction: {
        'ease-spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-spring forwards',
        'fade-out': 'fade-out 0.2s ease-smooth forwards',
        'slide-in-left': 'slide-in-left 0.3s ease-spring forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-spring forwards',
        shimmer: 'shimmer 2s linear infinite',
        'scale-in': 'scale-in 0.2s ease-spring forwards',
      },
    },
  },
  plugins: [animate],
}

export default config
