/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B9DCFE',
          300: '#90C6FD',
          400: '#6BA6F7',
          500: '#4B8EF0',
          600: '#2B6EE2',
          700: '#1E54C0',
          800: '#1A449E',
          900: '#163A7E',
          950: '#0F2654',
        },
        secondary: '#57D8A5',  // Secondary Green - Success messages, approvals, notifications
        accent: '#A78BFA',     // Accent Purple - Highlights, links, subtle emphasis
        background: '#F7FAFC', // Background Light - Main background (light and clean)
        'text-dark': '#374151', // Text Dark Gray - Primary text color
        'text-light': '#718096', // Text Light Gray - Secondary text, placeholders
        warning: '#FFD966',    // Warning Yellow - Warnings and attention highlights
        error: '#FC8181',      // Error Soft Red - Error messages, warnings
      },
    },
  },
  plugins: [],
}
