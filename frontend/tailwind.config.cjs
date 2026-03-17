module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // 👈 IMPORTANT (remove ts/tsx if not using)
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};