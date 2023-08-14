module.exports = {
  env: {
    browser: true,

    es2021: true,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  extends: ['plugin:react/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
    'import',
    'prettier',
  ],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    'react/display-name': 'off',
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['warn'],
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks:
          '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
      },
    ],
    'react/no-unescaped-entities': 'off',
    'react/jsx-key': 'off',
    'max-len': ['warn', { code: 99 }],
    caseSensitive: 0,
    'linebreak-style': 0,
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
