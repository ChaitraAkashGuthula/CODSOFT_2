import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#E23744", // Zomato Crimson
          hover: "#cb202d",
          orange: "#FC8019", // Swiggy Orange
          green: "#1BA672",
        },
        food: {
          veg: "#0F8A65",
          nonveg: "#E43B4F",
          rating: "#24963F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F4F5F7",
          subtle: "#F8F9FA",
          border: "#E8E8E8",
        },
        ink: {
          900: "#1C1C1C", // Main bold headings
          700: "#3E4152",
          500: "#686B78", // Description text
          400: "#93959F",
          300: "#D4D5D9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "Geist Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        elevated: "0 8px 24px rgba(0, 0, 0, 0.12)",
        btn: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
