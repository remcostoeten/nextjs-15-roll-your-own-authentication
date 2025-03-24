import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
	resolvePluginsRelativeTo: __dirname,
})

export default [
	...compat.extends('next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'plugin:@next/next/recommended'),
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		languageOptions: {
			parserOptions: {
				project: [resolve(__dirname, 'tsconfig.json')],
				ecmaVersion: 2020,
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			'import/resolver': {
				typescript: {},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-this-alias': 'warn',
			'react/no-unescaped-entities': 'off',
			'react-hooks/exhaustive-deps': 'warn',
			'@next/next/no-img-element': 'warn',
			'react/display-name': 'off',
			'@typescript-eslint/no-require-imports': 'warn',
			'no-console': 'warn',
			'prefer-const': 'warn',
			'no-var': 'error',
			eqeqeq: ['error', 'always'],
		},
	},
	{
		files: ['**/tools/**/*', '**/scripts/**/*'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-var-requires': 'off',
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
		},
	},
]
