/** @type {import('tailwindcss').Config} */

// Renkler CSS değişkenlerinden gelir (src/index.css).
// :root       -> aydınlık tema (beyaz zemin, mavi vurgu)
// .dark       -> koyu tema (coal zemin, amber vurgu)
// Bu sayede tüm bileşenlerdeki coal/cream/amber sınıf adları değişmeden temaya göre renk üretir.
const rgb = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coal: {
          DEFAULT: rgb('--coal'),
          900: rgb('--coal-900'),
          800: rgb('--coal-800'),
          700: rgb('--coal-700'),
          600: rgb('--coal-600'),
        },
        cream: {
          DEFAULT: rgb('--cream'),
          dim: rgb('--cream-dim'),
          faint: rgb('--cream-faint'),
        },
        amber: {
          DEFAULT: rgb('--amber'),
          soft: rgb('--amber-soft'),
          dim: rgb('--amber-dim'),
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '6px',
      },
    },
  },
  plugins: [],
};
