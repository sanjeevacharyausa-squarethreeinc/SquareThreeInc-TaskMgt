import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "plum-deep": "#3F1F3A",
        plum: "#61375B",
        gold: "#F2B84B",
        "bg-light": "#F6F3F7",
        priority: {
          high: "#DC2626",
          medium: "#D97706",
          low: "#16A34A",
        },
        status: {
          open: "#6B7280",
          progress: "#2563EB",
          completed: "#16A34A",
          scheduled: "#7C3AED",
        },
      },
    },
  },
  plugins: [],
};
export default config;
