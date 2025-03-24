enum CharacterSets {
	FULL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
	UPPERCASE_ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
	LOWERCASE_ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyz0123456789',
	LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	LOWERCASE = 'abcdefghijklmnopqrstuvwxyz',
	NUMBERS = '0123456789',
	MATRIX = 'abcdefghijklmnopqrstuvwxyz0123456789',
	HACKER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?',
	BINARY = '01',
	HEX = '0123456789ABCDEF',
	SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,./<>?',
	CODE = '0123456789!@#$%^&*()_+-=[]{}|;:,./<>?',
	CYBER = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+{}[]<>~`|',
}

function getRandomChar(charSet: CharacterSets = CharacterSets.FULL): string {
	return charSet.charAt(Math.floor(Math.random() * charSet.length))
}

function scrambleText(
	length: number,
	charSet: CharacterSets = CharacterSets.FULL
): string {
	let result = ''
	for (let i = 0; i < length; i++) {
		result += getRandomChar(charSet)
	}
	return result
}

export { getRandomChar, scrambleText, CharacterSets }
