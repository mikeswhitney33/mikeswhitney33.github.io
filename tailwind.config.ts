import type { Config } from "tailwindcss";
// @layer base {
//   :root {
//     --color-powder-blue: #b0e0e6;
//     --color-light-blue: #87ceeb;
//     --color-royal-blue: #4169e1;
//     --color-navy-blue: #000080;
//     --color-midnight-blue: #191970;
//   }
// }
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "powder-blue": "#b0e0e6",
        "light-blue": "#87ceeb",
        "royal-blue": "#4169e1",
        "navy-blue": "#000080",
        "midnight-blue": "#191970"
      }
    },
  },
  plugins: [],
};
export default config;
