/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@kit/supabase/database',
            importNames: ['Database'],
            message:
              'Please use the application types from your app "~/lib/database.types" instead',
          },
        ],
      },
    ],
  },
};

module.exports = config;
