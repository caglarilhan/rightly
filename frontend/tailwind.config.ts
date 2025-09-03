import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1220",
          blue: "#1D4ED8",
          gold: "#D4AF37",
          sand: "#F8FAFC",
        },
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
