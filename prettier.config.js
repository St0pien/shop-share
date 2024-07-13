/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  semi: true,
  tabWidth: 2,
  arrowParens: 'avoid',
  trailingComma: 'none',
  jsxSingleQuote: true,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss']
};

export default config;
