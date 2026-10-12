/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#102A43',
          'navy-light': '#1b3a5b',
          'navy-dark': '#0a1d30',
          blue: '#2563EB',
          'blue-light': '#38BDF8',
          bg: '#F4F7FB',
          card: '#FFFFFF',
          text: '#172B4D',
          muted: '#62748A',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(16, 42, 67, 0.05)',
        'card': '0 4px 20px -2px rgba(16, 42, 67, 0.08)',
        'modal': '0 20px 40px -10px rgba(16, 42, 67, 0.25)',
      }
    },
  },
  plugins: [],
}
