/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      keyframes: {
        "drip-down": {
          "0%": {
            transform: "translate(-50%, -8px)",
            opacity: "0",
          },
          "50%": {
            opacity: "0.7",
          },
          "100%": {
            transform: "translate(-50%, 0)",
            opacity: "1",
          },
        },
        "bubble-up": {
          "0%": {
            transform: "translate(-50%, 0) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(-50%, -8px) scale(0.8)",
            opacity: "0",
          },
        },
      },
      animation: {
        "drip-down": "drip-down 0.3s ease-out forwards",
        "bubble-up": "bubble-up 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
};
