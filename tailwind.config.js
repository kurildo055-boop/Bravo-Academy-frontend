/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071723', // Dark Military
          900: '#0B1F33', // Deep Navy
          800: '#173D5C', // Military Blue
          700: '#1F537B',
          600: '#2F75AA',
        },
        gold: {
          400: '#E5C27E',
          500: '#D6AD60', // Primary Gold
          600: '#B88D3D',
          700: '#926C26',
        },
        defense: {
          army: '#2D5A27',
          navy: '#0F3E6D',
          airforce: '#1E88E5',
          success: '#16A36A',
          bgLight: '#F4F7FA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        military: ['Rajdhani', 'Impact', 'sans-serif'],
      },
      animation: {
        'radar-sweep': 'radar 4s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
