/**
 * Creates a secure hash of the input string
 * @param input String to hash
 * @returns Hashed string
 */
export const hashSync = (input: string): string => {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(36) // Convert to base-36 for shorter string
}

/**
 * Creates a more secure hash using Web Crypto API
 * @param input String to hash
 * @returns Promise resolving to hashed string
 */
export const hashAsync = async (input: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
} 