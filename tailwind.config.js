/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // Adding the primary color palette from commented section
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          // Adding the secondary color from commented section
          // DEFAULT: "#57D8A5", // Secondary Green - Success messages, approvals, notifications
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          // Adding the accent color from commented section
          // DEFAULT: "#A78BFA", // Accent Purple - Highlights, links, subtle emphasis
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          blue: "#1DA1F2",
          linkedin: "#0A66C2",
          facebook: "#1877F2",
          threads: "#000000",
        },
        mithe: {
          primary: "#0080FF",
          secondary: "#E6F2FF",
          accent: "#F0F7FF",
          gray: "#F9FAFB",
        },
        // Keeping these colors from the commented section
        // background: "#F7FAFC", // Background Light - Main background (light and clean)
        "text-dark": "#374151", // Text Dark Gray - Primary text color
        "text-light": "#718096", // Text Light Gray - Secondary text, placeholders
        warning: "#FFD966", // Warning Yellow - Warnings and attention highlights
        error: "#FC8181", // Error Soft Red - Error messages, warnings
        // Adding success color for consistency
        success: {
          100: "rgba(87, 216, 165, 0.1)",
          700: "rgba(16, 185, 129, 1)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};