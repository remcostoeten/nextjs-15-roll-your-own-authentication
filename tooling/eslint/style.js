import filenamesPlugin from "eslint-plugin-filenames";

/** @type {import('eslint').Linter.Config} */
export default {
  plugins: {
    filenames: filenamesPlugin,
  },
  rules: {
    // Enforce kebab-case for file names
    "filenames/match": ["error", "^[a-z0-9-]+$"],

    // Use single quotes
    quotes: ["error", "single"],

    // No semicolons
    semi: ["error", "never"],

    // No trailing commas
    "comma-dangle": ["error", "never"],

    // Prefer function declarations over const arrow functions
    "func-style": ["error", "declaration"],

    // Additional style rules
    indent: ["error", 2],
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "computed-property-spacing": ["error", "never"],
  },
};
