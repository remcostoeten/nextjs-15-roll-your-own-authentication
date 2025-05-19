export const USER_CREATION_CODE = [
	{
		lineNumber: 1,
		content: [{ type: 'comment', content: '// auth/password-utils.ts' }],
	},
	{
		lineNumber: 2,
		content: [{ type: 'keyword', content: 'import' }, { type: 'text', content: ' { ' }, { type: 'variable', content: 'hash' }, { type: 'text', content: ', ' }, { type: 'variable', content: 'compare' }, { type: 'text', content: ' } ' }, { type: 'keyword', content: 'from' }, { type: 'string', content: "'@/lib/crypto'" }],
	},
	{
		lineNumber: 3,
		content: [{ type: 'text', content: '' }],
	},
	{
		lineNumber: 4,
		content: [{ type: 'keyword', content: 'export async function' }, { type: 'function', content: ' createUser' }, { type: 'text', content: '(' }, { type: 'parameter', content: 'email' }, { type: 'text', content: ': ' }, { type: 'type', content: 'string' }, { type: 'text', content: ', ' }, { type: 'parameter', content: 'password' }, { type: 'text', content: ': ' }, { type: 'type', content: 'string' }, { type: 'text', content: ') {' }],
	},
	{
		lineNumber: 5,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'const' }, { type: 'text', content: ' hashedPassword = ' }, { type: 'keyword', content: 'await' }, { type: 'function', content: ' hash' }, { type: 'text', content: '(password)' }],
	},
	{
		lineNumber: 6,
		content: [{ type: 'text', content: '' }],
	},
	{
		lineNumber: 7,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'return' }, { type: 'text', content: ' ' }, { type: 'keyword', content: 'await' }, { type: 'text', content: ' db.user.' }, { type: 'function', content: 'create' }, { type: 'text', content: '({' }],
	},
	{
		lineNumber: 8,
		content: [{ type: 'text', content: '    email,' }],
	},
	{
		lineNumber: 9,
		content: [{ type: 'text', content: '    password: hashedPassword,' }],
	},
	{
		lineNumber: 10,
		content: [{ type: 'text', content: '  })' }],
	},
	{
		lineNumber: 11,
		content: [{ type: 'text', content: '}' }],
	},
]

export const USER_LOGIN_CODE = [
	{
		lineNumber: 1,
		content: [{ type: 'comment', content: '// auth/login.ts' }],
	},
	{
		lineNumber: 2,
		content: [{ type: 'keyword', content: 'import' }, { type: 'text', content: ' { ' }, { type: 'variable', content: 'compare' }, { type: 'text', content: ' } ' }, { type: 'keyword', content: 'from' }, { type: 'string', content: "'@/lib/crypto'" }],
	},
	{
		lineNumber: 3,
		content: [{ type: 'keyword', content: 'import' }, { type: 'text', content: ' { ' }, { type: 'variable', content: 'createSession' }, { type: 'text', content: ' } ' }, { type: 'keyword', content: 'from' }, { type: 'string', content: "'@/lib/session'" }],
	},
	{
		lineNumber: 4,
		content: [{ type: 'text', content: '' }],
	},
	{
		lineNumber: 5,
		content: [{ type: 'keyword', content: 'export async function' }, { type: 'function', content: ' login' }, { type: 'text', content: '(' }, { type: 'parameter', content: 'email' }, { type: 'text', content: ': ' }, { type: 'type', content: 'string' }, { type: 'text', content: ', ' }, { type: 'parameter', content: 'password' }, { type: 'text', content: ': ' }, { type: 'type', content: 'string' }, { type: 'text', content: ') {' }],
	},
	{
		lineNumber: 6,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'const' }, { type: 'text', content: ' user = ' }, { type: 'keyword', content: 'await' }, { type: 'text', content: ' db.user.' }, { type: 'function', content: 'findUnique' }, { type: 'text', content: '({ ' }, { type: 'property', content: 'where' }, { type: 'text', content: ': { email } })' }],
	},
	{
		lineNumber: 7,
		content: [{ type: 'text', content: '' }],
	},
	{
		lineNumber: 8,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'if' }, { type: 'text', content: ' (!user) ' }, { type: 'keyword', content: 'throw new' }, { type: 'class', content: ' Error' }, { type: 'text', content: '(' }, { type: 'string', content: "'Invalid credentials'" }, { type: 'text', content: ')' }],
	},
	{
		lineNumber: 9,
		content: [{ type: 'text', content: '' }],
	},
	{
		lineNumber: 10,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'const' }, { type: 'text', content: ' isValid = ' }, { type: 'keyword', content: 'await' }, { type: 'function', content: ' compare' }, { type: 'text', content: '(password, user.password)' }],
	},
	{
		lineNumber: 11,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'if' }, { type: 'text', content: ' (!isValid) ' }, { type: 'keyword', content: 'throw new' }, { type: 'class', content: ' Error' }, { type: 'text', content: '(' }, { type: 'string', content: "'Invalid credentials'" }, { type: 'text', content: ')' }],
	},
	{
		lineNumber: 12,
		content: [{ type: 'text', content: '' }],
	},
	{
		lineNumber: 13,
		content: [{ type: 'text', content: '  ' }, { type: 'keyword', content: 'return' }, { type: 'text', content: ' ' }, { type: 'keyword', content: 'await' }, { type: 'function', content: ' createSession' }, { type: 'text', content: '(user.id)' }],
	},
	{
		lineNumber: 14,
		content: [{ type: 'text', content: '}' }],
	},
]



