/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sıcak, düşük doygunluklu koyu tema
        coal: {
          DEFAULT: '#12100e', // ana zemin
          900: '#171511',
          800: '#1c1a16',
          700: '#26231e',
          600: '#3a362f', // ince border
        },
        cream: {
          DEFAULT: '#ece6da', // ana metin
          dim: '#a89f90',     // ikincil metin
          faint: '#6e675b',   // soluk metin / etiket
        },
        amber: {
          DEFAULT: '#e8a33d', // tek vurgu rengi
          soft: '#c9872c',
          dim: '#8a6224',
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
