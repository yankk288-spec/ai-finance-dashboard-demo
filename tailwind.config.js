/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af'
        },
        finance: {
          ink: '#111827',
          muted: '#64748b',
          line: '#e2e8f0',
          bg: '#f6f8fb'
        }
      },
      boxShadow: {
        soft: '0 12px 32px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
