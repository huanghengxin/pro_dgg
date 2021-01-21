// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', 'prettier', 'prettier/vue'],
  plugins: ['prettier'],
  globals: {
    // 以下变量已在webpack中提供
    __PROD__: 'readonly',
    Vue: 'readonly',
    VueRouter: 'readonly',
    Axios: 'readonly',
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
    'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
    'vue/custom-event-name-casing': ['off'],
    'vue/no-v-html': ['off'],
  },
};
