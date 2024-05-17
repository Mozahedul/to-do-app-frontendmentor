/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bright-blue-lth": "hsl(220, 98%, 61%)",

        // light theme colors
        "light-gray-lth": "hsl(0, 0%, 98%)",
        "light-grayish-blue-ultra-lth": "hsl(236, 33%, 92%)",
        "light-grayish-blue-lth": "hsl(233, 11%, 84%)",
        "dark-grayish-blue-lth": "hsl(236, 9%, 61%)",
        "dark-grayish-blue-ultra-lth": "hsl(235, 19%, 35%)",

        // dark theme colors
        "dark-blue-dth": "hsl(235, 21%, 11%)",
        "dark-desaturated-blue-dth": "hsl(235, 24%, 19%)",
        "light-grayish-blue-dth": "hsl(234, 39%, 85%)",
        "light-grayish-blue-hvoer-dth": "hsl(236, 33%, 92%)",
        "dark-grayish-blue-dth": "hsl(234, 11%, 52%)",
        "dark-grayish-blue-ultra-dth": "hsl(233, 14%, 35%)",
        "dark-grayish-blue-two-dth": "hsl(237, 14%, 26%)",
      },
      fontFamily: {
        "font-josefin": "'Josefin Sans', sans-serif",
      },
    },
  },
  plugins: [],
};
