// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   darkMode: "class",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//           50: "#F0F7FF",
//           100: "#E0EFFF",
//           200: "#B9DCFE",
//           300: "#90C6FD",
//           400: "#6BA6F7",
//           500: "#4B8EF0",
//           600: "#2B6EE2",
//           700: "#1E54C0",
//           800: "#1A449E",
//           900: "#163A7E",
//           950: "#0F2654",
//         },
//         secondary: {
//           DEFAULT: "#57D8A5",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "#FC8181",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: "#E5ECF6",
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//           100: "#F3E8FF",
//           200: "#E0D3FF",
//           400: "#C4A5FA",
//           500: "#A78BFA",
//           600: "#9B7CFF",
//           700: "#825EFF",
//         },
//         success: {
//           DEFAULT: "#10B981",
//           soft: "#D1FAE5",
//         },
//         warning: {
//           DEFAULT: "#FFD966",
//         },
//         error: {
//           DEFAULT: "#FC8181",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         sidebar: {
//           DEFAULT: "#FFFFFF",
//           muted: "#F1F5F9",
//           accent: "#E0EFFF",
//           highlight: "#4B8EF0",
//           dark: "#111827",
//           "dark-muted": "#1E293B",
//           "dark-accent": "#2B6EE2",
//         },
//         brand: {
//           blue: "#1DA1F2",
//           linkedin: "#0A66C2",
//           facebook: "#1877F2",
//           threads: "#000000",
//         },
//         mithe: {
//           primary: "#0080FF",
//           secondary: "#E6F2FF",
//           accent: "#F0F7FF",
//           gray: "#F9FAFB",
//         },
//         "text-dark": "#374151",
//         "text-light": "#718096",
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: {
//             height: "0",
//           },
//           to: {
//             height: "var(--radix-accordion-content-height)",
//           },
//         },
//         "accordion-up": {
//           from: {
//             height: "var(--radix-accordion-content-height)",
//           },
//           to: {
//             height: "0",
//           },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
// };

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
        border: "#D1D5DB",
        input: "#E5E7EB",
        ring: "#4C57FF",
        background: "#F9FAFB",
        foreground: "#1F2937",
        primary: {
          DEFAULT: "#4C57FF", // Skedlii Indigo
          hover: "#3B47D6",
          50: "#EEF1FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#06B6D4", // Creative Teal
          100: "#E0F7FA",
          200: "#B2EBF2",
          300: "#4DD0E1",
          400: "#26C6DA",
          500: "#00BCD4",
          600: "#00ACC1",
          700: "#0097A7",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#EF4444", // Updated error red
          soft: "#FEE2E2",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10B981", // Green for success
          soft: "#D1FAE5",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FEF3C7",
        },
        accent: {
          DEFAULT: "#A855F7", // Purple glow
          100: "#F3E8FF",
          200: "#E9D5FF",
          400: "#D8B4FE",
          500: "#C084FC",
          600: "#A855F7",
          700: "#9333EA",
          foreground: "#ffffff",
        },
        muted: "#E5ECF6",
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1F2937",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1F2937",
        },
        sidebar: {
          DEFAULT: "#FFFFFF",
          muted: "#F1F5F9",
          accent: "#E0EFFF",
          highlight: "#4C57FF",
          dark: "#111827",
          "dark-muted": "#1E293B",
          "dark-accent": "#3B47D6",
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
        "text-dark": "#1F2937",
        "text-light": "#E5E7EB",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
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
