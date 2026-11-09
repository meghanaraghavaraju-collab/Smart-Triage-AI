/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a5f7',
          500: '#0c87eb',
          600: '#026bc9', // Primary Hospital Medical Blue
          700: '#0355a3',
          800: '#074886',
          900: '#0c3d6f', // Deep Medical Navy
          950: '#08274a',
        },
        triage: {
          high: '#dc2626',      // Red ESI 1-2 Critical
          highBg: '#fef2f2',
          highBorder: '#fecaca',
          medium: '#d97706',    // Amber ESI 3 Urgent
          mediumBg: '#fffbeb',
          mediumBorder: '#fde68a',
          low: '#059669',       // Green ESI 4-5 Routine
          lowBg: '#ecfdf5',
          lowBorder: '#a7f3d0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'medical': '0 2px 10px -1px rgba(2, 107, 201, 0.08), 0 1px 3px -1px rgba(2, 107, 201, 0.05)',
        'medical-lg': '0 10px 25px -5px rgba(2, 107, 201, 0.1), 0 8px 10px -6px rgba(2, 107, 201, 0.05)',
      }
    },
  },
  plugins: [],
}
