/** @type {import('tailwindcss').Config} */

// Tokens de la dirección "Aula viva". Los nombres describen el papel del color, no su tono.
// `primary` y `dark` son alias temporales de la paleta anterior: los usan /encuestas y /admin
// y se retirarán cuando esos módulos pasen a los componentes de components/ui.

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#23205C',
          'indigo-deep': '#16143D',
          'indigo-soft': '#3A3678',
          yellow: '#F2C230',
          'yellow-deep': '#E0AF1A',
          sky: '#7FA7E0',
          mist: '#DCE6F7',
        },
        ink: '#1D1B2E',
        paper: '#FAFAF7',
        surface: '#FFFFFF',
        muted: '#5A5770',
        line: '#E4E2EC',
        field: '#8A87A0',
        'on-indigo': '#E6E4F5',
        danger: '#A3261E',
        success: '#1E6B3A',
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0a2540',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['1.0625rem', { lineHeight: '1.65' }],
        lead: ['1.1875rem', { lineHeight: '1.6' }],
        'display-1': ['clamp(2.5rem, 1.6rem + 3.6vw, 4rem)', { lineHeight: '1.03', letterSpacing: '-0.03em' }],
        'display-2': ['clamp(2rem, 1.5rem + 2vw, 2.75rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-3': ['clamp(1.5rem, 1.3rem + 0.8vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        card: '16px',
      },
      maxWidth: {
        page: '75rem',
        prose: '38rem',
      },
      spacing: {
        section: 'clamp(4rem, 3rem + 4vw, 6.5rem)',
      },
    },
  },
  plugins: [],
}
