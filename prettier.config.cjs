/** @type {import("prettier").Config} */
const config = {
  arrowParens: "always",
  printWidth: 120,
  singleQuote: true,
  useTabs: false,
  tabWidth: 4,
  bracketSpacing: true,
  trailingComma: "none",
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};

module.exports = config;
