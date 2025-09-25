/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
       colors: {
        primary: {
          blue: "#0a0a1a",
        },
      },
    },
  },
  plugins: [],
}
