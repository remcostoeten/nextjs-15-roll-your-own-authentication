import { env } from 'env';

type TEnv = 'development' | 'production';

type TIfEnvOptions =
	| TEnv
	| TEnv[]
	| {
			env?: TEnv | TEnv[];
			flag?: keyof typeof env;
			value?: string | boolean;
	  };

/**
 * Checks if the current environment or a specific env flag matches given criteria.
 *
 * @param {TIfEnvOptions} options - Environment(s) or conditions to match against.
 * @returns {boolean} True if conditions match the current environment.
 */
export function ifEnv(options: TIfEnvOptions): boolean {
	const currentEnv = env.NODE_ENV;

	if (typeof options === 'string' || Array.isArray(options)) {
		return Array.isArray(options) ? options.includes(currentEnv) : currentEnv === options;
	}

	let matches = true;

	if (options.env) {
		matches = Array.isArray(options.env)
			? options.env.includes(currentEnv)
			: currentEnv === options.env;
	}

	if (options.flag) {
		const flagValue = (env as Record<string, any>)[options.flag];

		if (options.value !== undefined) {
			matches = matches && flagValue === options.value;
		} else {
			matches = matches && !!flagValue;
		}
	}

	return matches;
}

/**
 * @example
 * // Check if current environment is 'development'
 * ifEnv('development');
 *
 * @example
 * // Check if current environment is either 'development' or 'production'
 * ifEnv(['development', 'production']);
 *
 * @example
 * // Check if current environment is 'production' AND the JWT_SECRET flag is set (truthy)
 * ifEnv({ env: 'production', flag: 'JWT_SECRET' });
 *
 * @example
 * // Check if environment is 'development' or 'production' AND NEXT_PUBLIC_APP_URL equals a specific value
 * ifEnv({ env: ['development', 'production'], flag: 'NEXT_PUBLIC_APP_URL', value: 'https://myapp.com' });
 *
 * @example
 * // Check if the ADMIN_EMAIL environment variable is set (truthy), regardless of env
 * ifEnv({ flag: 'ADMIN_EMAIL' });
 */
