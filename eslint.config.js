import js from '@eslint/js'
import typescript from 'typescript-eslint'
import jest from 'eslint-plugin-jest'

export default [
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      // Disable base rules in favor of TypeScript equivalents
      'no-unused-vars': 'off',
      'semi': 'off',
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': ['error', {'allowExpressions': true}],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-includes': 'error'
    }
  },
  {
    files: ['**/*.test.ts'],
    plugins: {
      jest
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  },
  {
    ignores: ['dist/', 'lib/', 'node_modules/']
  }
]