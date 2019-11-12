module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-undef": "off",
    "no-unused-vars": "off"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module"
  }
};
