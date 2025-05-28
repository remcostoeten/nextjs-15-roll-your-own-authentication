/**
 * No-operation function that can be used as a placeholder
 * for optional callbacks or to silently catch errors.
 */
export const noop = (): void => {
  // Intentionally empty
};

/**
 * No-operation function that accepts any arguments
 * Useful for event handlers or callbacks that require parameters
 */
export const noopArgs = (..._args: any[]): void => {
  // Intentionally empty
};