// Base units in bytes
export const ONE_BYTE: number = 1
export const ONE_KB: number = 1024
export const ONE_MB: number = ONE_KB * 1024
export const ONE_GB: number = ONE_MB * 1024
export const ONE_TB: number = ONE_GB * 1024

// Common file size limits
export const SIZES = {
	TINY: ONE_MB * 1, // 1MB
	SMALL: ONE_MB * 2, // 2MB
	MEDIUM: ONE_MB * 5, // 5MB
	LARGE: ONE_MB * 10, // 10MB
	XLARGE: ONE_MB * 20, // 20MB
	HUGE: ONE_MB * 50, // 50MB
	MASSIVE: ONE_MB * 100 // 100MB
} as const

// Common upload limits
export const UPLOAD_LIMITS = {
	AVATAR: SIZES.SMALL, // 2MB - Profile pictures
	DOCUMENT: SIZES.MEDIUM, // 5MB - PDFs, docs
	IMAGE: SIZES.MEDIUM, // 5MB - General images
	VIDEO: SIZES.HUGE, // 50MB - Video files
	ATTACHMENT: SIZES.LARGE // 10MB - General attachments
} as const
