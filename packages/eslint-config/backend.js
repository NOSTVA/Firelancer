const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier", "airbnb"],
  plugins: ["only-warn", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
  },
  env: {
    node: true,
    es2021: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
    "coverage/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};
