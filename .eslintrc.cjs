module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/eslint-config-typescript',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['sort-keys-fix', 'import'],
  root: true,
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',

    '@typescript-eslint/ban-types': 'off',

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    '@typescript-eslint/no-empty-function': 'off',

    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/no-non-null-assertion': 'off',
    // TS
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['sibling', 'parent'], 'index'],
        'newlines-between': 'always'
      }
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'off',

    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],

    // Prettier
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],

    'sort-keys-fix/sort-keys-fix': 'error',

    'vue/html-self-closing': [
      'error',
      {
        html: {
          component: 'always',
          normal: 'always',
          void: 'always'
        },
        math: 'always',
        svg: 'always'
      }
    ],

    'vue/multi-word-component-names': 'off',

    // Vue
    'vue/no-v-html': 'off',

    'vue/order-in-components': 'error',

    'vue/require-default-prop': 'off',

    'vue/require-explicit-emits': 'off',
    'vue/sort-keys': ['error', 'asc']
  }
}
