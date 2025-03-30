import { env } from "env"

/**
 * Determines if the current environment is local.
 * @returns {boolean} True if running locally, false if running in the cloud.
 */
export function isLocalEnvironment(): boolean {
  return env.ENVIRONMENT !== "cloud"
}
