/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      keyframes: {
        floatGradient: {
          "0%": {
            backgroundPosition: "0% 0%, 100% 0%, 0% 100%",
          },
          "50%": {
            backgroundPosition: "50% 10%, 70% 20%, 30% 90%",
          },
          "100%": {
            backgroundPosition: "0% 0%, 100% 0%, 0% 100%",
          },
        },
      },
      animation: {
        "float-gradient": "floatGradient 18s ease-in-out infinite",
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(800px 400px at 10% -10%, rgba(99, 102, 241, 0.18), transparent), radial-gradient(700px 350px at 110% 0%, rgba(34, 211, 238, 0.14), transparent), linear-gradient(180deg, rgba(2, 6, 23, 0.08), transparent)",
      },
    },
  },
  plugins: [],
};
