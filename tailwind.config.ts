import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        northstar: {
          ink: "#14213d",
          blue: "#0f5ea8",
          sky: "#e7f3ff",
          gold: "#f4b942",
          green: "#1f8a4c",
          red: "#be1e2d",
          orange: "#c66a00",
          paper: "#f7fafc"
        }
      },
      boxShadow: {
        field: "0 10px 30px rgba(20, 33, 61, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
