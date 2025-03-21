module.exports = {
	extends: [
		'next/core-web-vitals',
		'plugin:@typescript-eslint/recommended',
		'plugin:@next/next/recommended',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	env: {
		browser: true,
		node: true,
		es6: true
	},
	settings: {
		'import/resolver': {
			typescript: {},
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		}
	},
	rules: {
		'@typescript-eslint/no-unused-vars': ['warn', {
			argsIgnorePattern: '^_',
			varsIgnorePattern: '^_',
			ignoreRestSiblings: true
		}],
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
		'eqeqeq': ['error', 'always'],
	},
	overrides: [
		{
			files: ['**/tools/**/*', '**/scripts/**/*'],
			rules: {
				'@typescript-eslint/no-require-imports': 'off',
				'@typescript-eslint/no-var-requires': 'off',
			}
		},
		{
			files: ['**/*.js', '**/*.jsx'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			}
		}
	]
}
