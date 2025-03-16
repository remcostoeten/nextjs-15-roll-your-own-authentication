/**
 * Date and time constants for consistent use throughout the application.
 * All values are in seconds unless otherwise specified.
 */

// Time constants (in seconds)
export const SECOND = 1;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY; // Approximation
export const YEAR = 365 * DAY; // Approximation

// Common durations for auth tokens, caching, etc.
export const FIFTEEN_MINUTES = 15 * MINUTE;
export const THIRTY_MINUTES = 30 * MINUTE;
export const ONE_HOUR = HOUR;
export const FOUR_HOURS = 4 * HOUR;
export const EIGHT_HOURS = 8 * HOUR;
export const TWELVE_HOURS = 12 * HOUR;
export const ONE_DAY = DAY;
export const THREE_DAYS = 3 * DAY;
export const ONE_WEEK = WEEK;
export const TWO_WEEKS = 2 * WEEK;
export const ONE_MONTH = MONTH;
export const THREE_MONTHS = 3 * MONTH;
export const SIX_MONTHS = 6 * MONTH;
export const ONE_YEAR = YEAR;

// Utility functions to convert between units
export const secondsToMilliseconds = (seconds: number): number => seconds * 1000;
export const minutesToSeconds = (minutes: number): number => minutes * MINUTE;
export const hoursToSeconds = (hours: number): number => hours * HOUR;
export const daysToSeconds = (days: number): number => days * DAY;
export const weeksToSeconds = (weeks: number): number => weeks * WEEK;

/**
 * Get expiration timestamp from now
 * @param seconds - Duration in seconds
 * @returns Timestamp in milliseconds
 */
export const getExpirationFromNow = (seconds: number): number => {
    return Date.now() + secondsToMilliseconds(seconds);
};

export function currentTimestamp(): number {
    return Date.now();
}

/**
 * Check if a timestamp is expired
 * @param timestamp - Timestamp in milliseconds
 * @returns Boolean indicating if the timestamp is expired
 */
export const isExpired = (timestamp: number): boolean => {
    return Date.now() > timestamp;
};