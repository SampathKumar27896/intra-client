// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/bg.png')",
      },
      colors: {
        card: {
          DEFAULT: "var(--card)",
        },
      },
    }
  },
  plugins: [],
}
