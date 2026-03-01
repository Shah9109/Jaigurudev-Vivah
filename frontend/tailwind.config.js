/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4D8D",
        secondary: "#FFFDD0", // Cream white
        accent: "#EF4444", // Red (Tailwind red-500)
        "card-bg": "#FAFAFA", // Soft white
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "pink-gradient": "linear-gradient(to bottom, #FFF0F5, #FFFFFF)", // Light pink to white
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
