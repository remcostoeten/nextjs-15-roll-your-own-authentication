/**
 * This object contains boolean values indicating the status of various features within the application.
 * @requires restart of the dev serer after changing the boolean value to take effect
 *
 * @note - e-mails are currently not functioning as expected and have a low priority.Register currentlly sets the the verificaiton status to true.
 *
 * @property {boolean} emailVerification - Indicates if email verification is enabled.
 * @property {boolean} rateLimit - Indicates if rate limiting is enabled.
 * @property {boolean} sessionStatus - Indicates if session status tracking is enabled.
 * @property {boolean} allowSignUpWithoutValidation - Indicates if sign-up without validation is allowed.
 */
export const featureFlags = {
	emailVerification: true,
	rateLimit: true,
	sessionStatus: true,
	allowSignUpWithoutValidation: true
} as const
