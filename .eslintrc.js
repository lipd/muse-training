const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'unicorn', 'promise', 'prettier', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      },
      typescript: {},
    },
  },
  rules: {
    'import/extensions': [
      ERROR,
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
        json: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
    'import/prefer-default-export': OFF,
    'import/no-unresolved': ERROR,
    'import/no-dynamic-require': OFF,

    'unicorn/consistent-function-scoping': OFF,
    'unicorn/prefer-module': OFF,
    'unicorn/filename-case': [
      ERROR,
      {
        cases: {
          // 中划线
          kebabCase: true,
          // 小驼峰
          camelCase: false,
          // 下划线
          snakeCase: false,
          // 大驼峰
          pascalCase: false,
        },
      },
    ],
    'unicorn/prevent-abbreviations': OFF,
    'unicorn/no-array-reduce': OFF,
    'unicorn/no-null': OFF,
    'unicorn/no-array-for-each': OFF,

    'react/prop-types': OFF,
    'react/jsx-filename-extension': [ERROR, { extensions: ['.tsx', 'ts', '.jsx', 'js'] }],
    'react/jsx-indent-props': [ERROR, 2],
    'react/jsx-indent': [ERROR, 2],
    'react/jsx-one-expression-per-line': OFF,
    'react/jsx-uses-react': OFF,
    'react/destructuring-assignment': OFF,
    'react/state-in-constructor': OFF,
    'react/jsx-props-no-spreading': OFF,
    'react/react-in-jsx-scope': OFF,
    'react-hooks/exhaustive-deps': OFF,

    'jsx-a11y/click-events-have-key-events': OFF,
    'jsx-a11y/no-noninteractive-element-interactions': OFF,
    'jsx-a11y/no-static-element-interactions': OFF,

    'no-shadow': 'off',
    '@typescript-eslint/ban-ts-comment': OFF,
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/no-empty-function': WARN,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-explicit-any': OFF,
    '@typescript-eslint/no-use-before-define': ERROR,
    '@typescript-eslint/no-unused-vars': WARN,

    'global-require': OFF,
    'no-use-before-define': OFF,
    'no-restricted-syntax': OFF,
    'no-unused-expressions': OFF,
    'no-param-reassign': OFF,
  },
}
