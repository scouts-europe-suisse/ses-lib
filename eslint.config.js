import js from '@eslint/js';
import react from 'eslint-plugin-react';
import neostandard from 'neostandard';

export default [
  js.configs.recommended,
  ...neostandard({ semi: true, ts: true }),
  {
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  { ignores: ['node_modules/*', 'dist/*'] },
];
