module.exports = {
    rules: {
        'import/no-namespace': 'error',
        'import/named': 'error',
        'import/no-cycle': ['error', { maxDepth: 1 }],
        'import/no-self-import': 'error',
    },
    overrides: [
        {
            files: ['**/index.ts', '**/index.tsx', '**/index.js', '**/index.jsx'],
            rules: {
                'import/prefer-default-export': 'off',
                'import/no-default-export': 'error',
                'import/export': 'error',
            },
        },
    ],
}; 