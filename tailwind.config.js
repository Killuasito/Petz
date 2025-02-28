/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scale: {
        102: "1.02",
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      boxShadow: {
        neon: '0 0 5px theme("colors.purple.200"), 0 0 20px theme("colors.purple.700")',
      },
    },
  },
  plugins: [],
};
