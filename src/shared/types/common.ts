/**
 * UUID type for strongly typing IDs throughout the application
 */
export type UUID = string & { readonly _brand: unique symbol };

/**
 * Helper function to cast a string to UUID type
 * @param id - String ID to cast to UUID
 */
export function asUUID(id: string): UUID {
	return id as UUID;
}

/**
 * Helper function to create a new UUID
 * Uses the native crypto API when available
 */
export function createUUID(): UUID {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID() as UUID;
	}

	// Fallback implementation for environments without crypto.randomUUID
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	}) as UUID;
}

/**
 * Type guard to check if a string is a valid UUID
 * @param id - String to check
 */
export function isUUID(id: string): id is UUID {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(id);
}
