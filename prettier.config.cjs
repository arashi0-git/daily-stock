/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: false,
  semi: true,
  printWidth: 100,
  trailingComma: "none",
  plugins: [require.resolve("prettier-plugin-tailwindcss")]
};
