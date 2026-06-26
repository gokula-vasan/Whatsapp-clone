// tailwind.config.js
module.exports = {
  // If your files are inside a "src/" folder or "app/", but missing below, 
  // Tailwind assumes they don't exist and compiles ZERO classes!
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"], 
  theme: { extend: {} },
  plugins: [],
}