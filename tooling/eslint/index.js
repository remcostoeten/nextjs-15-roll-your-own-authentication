import reactConfig from "./react.js";
import styleConfig from "./style.js";

/** @type {import('eslint').Linter.Config} */
const config = {
  files: ["**/*.ts", "**/*.tsx"],
  ...reactConfig,
  ...styleConfig,
};

export default config;
