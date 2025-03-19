module.exports = {
	rules: {
		'import/no-namespace': 'off',
		'import/named': 'off',
		'import/no-cycle': 'off',
		'import/no-self-import': 'off',
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-var-requires': 'off',
	},
	overrides: [
		{
			files: [
				'**/index.ts',
				'**/index.tsx',
				'**/index.js',
				'**/index.jsx',
			],
			rules: {
				'import/prefer-default-export': 'off',
				'import/no-default-export': 'off',
				'import/export': 'off',
			},
		},
	],
}
