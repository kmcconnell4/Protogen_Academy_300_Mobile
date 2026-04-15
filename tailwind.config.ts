import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ccm-blue": "#003591",
        "ccm-gray": "#A0A0A0",
        "ccm-dark": "#1A1A2E",
        "ccm-surface": "#F4F5F7",
      },
      fontFamily: {
        display: ["Barlow Condensed", "Arial Narrow", "Arial", "sans-serif"],
        body: ["Barlow", "Arial", "sans-serif"],
      },
      spacing: {
        "1": "8px",
        "2": "16px",
        "3": "24px",
        "4": "32px",
        "6": "48px",
        "8": "64px",
      },
    },
  },
  plugins: [],
};
export default config;
