module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: [2, 'always'], // 自动分号插入
    'no-useless-constructor': 0, // 禁止校验空constructor
    'space-before-function-paren': ['error', 'never'], // function关键字与开始参数之间不允许有空格
    'no-unused-vars': 0 // 禁止校验已声明但未使用的变量
  }
};
