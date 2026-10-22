import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import hds from './eslint/hds-plugin.mjs';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'eslint', 'scripts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks, hds },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'hds/no-raw-color': 'error',
      'hds/no-raw-font-size': 'error',
      'hds/no-native-ui': 'error',
      'hds/no-external-ui': 'error',
      'hds/custom-needs-reason': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
