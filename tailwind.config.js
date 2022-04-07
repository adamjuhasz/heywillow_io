const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        leftRightAnim: {
          "0%": { "background-position": "0% 0%" },
          "100%": { "background-position": "-200% 0%" },
        },
        largePing: {
          "75%, 100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
      },
      animation: {
        loading: "leftRightAnim 1s linear infinite",
        "ping-slow": "largePing 3s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
