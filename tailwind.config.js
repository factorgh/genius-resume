/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main brand colors
        'primary': {
          50: '#E6EFEE',
          100: '#C0D6D3',
          200: '#9ABBB7',
          300: '#75A19A',
          400: '#578C84',
          500: '#2D665F',  // Primary deep green
          600: '#285C56',
          700: '#22504A',
          800: '#1C443F',
          900: '#163934',
          950: '#0D2220',
        },
        'accent': {
          50: '#FEF8E6',
          100: '#FDEEBB',
          200: '#FCE490',
          300: '#FBDB65',
          400: '#F9D13A',
          500: '#F4B400',  // Golden yellow accent
          600: '#DFA300',
          700: '#CA9300',
          800: '#B58300',
          900: '#A07300',
          950: '#654800',
        },
        'secondary': {
          50: '#E7F5F2',
          100: '#C3E5DE',
          200: '#9FD4CA',
          300: '#7BC3B6',
          400: '#57B3A2',
          500: '#409585',
          600: '#358678',
          700: '#2A756A',
          800: '#1F655D',
          900: '#124A42',
          950: '#0A2E28',
        },
        'neutral': {
          50: '#F9F9F9',
          100: '#F2F2F2',
          200: '#E0E0E0',  // Light gray for borders
          300: '#CCCCCC',
          400: '#B3B3B3',
          500: '#999999',
          600: '#737373',
          700: '#595959',
          800: '#404040',
          900: '#333333',  // Dark gray for text
          950: '#1A1A1A',
        },
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Lato', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'button': '0 2px 4px 0 rgba(45, 102, 95, 0.15)',
        'gold': '0 4px 6px -1px rgba(244, 180, 0, 0.1), 0 2px 4px -1px rgba(244, 180, 0, 0.06)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'pulse-gentle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}
