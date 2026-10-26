/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend:
    {
      colors: 
      { 
        primary: "#5F6FFF" 
      },
      gridTemplateColumns:
      {
        'auto':'repeat(auto-fill, minmax(200px,1fr))  '
      }
    },
  },
  plugins: [],
}