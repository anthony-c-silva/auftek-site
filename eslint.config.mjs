import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default [
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      // TypeScript - Erros de tipagem e variáveis
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],

      // No ESLint 9, usamos apenas a versão do TS se estivermos em um projeto TS
      "no-unused-vars": "off",

      // Segurança e Melhores Práticas
      "@typescript-eslint/no-var-requires": "error",

      // Next.js específico
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",

      // React e Hooks
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Debugging
      "no-console": "warn",
    },
  },
];