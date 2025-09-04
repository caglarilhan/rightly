import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1220",
          blue: "#1D4ED8",
          gold: "#D4AF37",
          sand: "#F8FAFC",
        },
        "brand-navy": "#0B1220",
        "brand-blue": "#1D4ED8",
        "brand-gold": "#D4AF37",
        "brand-sand": "#F8FAFC",
        ink: "#111827",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      container: { center: true, screens: { "2xl": "1280px" } },
    },
  },
  plugins: [],
};
export default config;
