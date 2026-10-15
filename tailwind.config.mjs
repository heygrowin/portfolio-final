/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        brand: 'var(--brand)',
        accent: 'var(--accent)',
        ink: 'var(--ink)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        night: {
          1: 'var(--night-1)',
          2: 'var(--night-2)',
        },
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}
