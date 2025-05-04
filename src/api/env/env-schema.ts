import { z } from 'zod' // Import Zod
import { createEnvWithHints, schema } from '.'

export const env = createEnvWithHints({
	/**
	 * Specify your server-side environment variables schema here.
	 * This way you can ensure the app isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: schema(z.string().url()) // Zod handles URL validation
			.hint(
				'Required. Provides the connection string for the primary PostgreSQL database. For local dev with default docker-compose, use: "postgresql://postgres:password@postgres:5432/ryoa"'
			),
		JWT_SECRET: schema(z.string().min(1)) // Ensure it's not empty
			.hint(
				'Required. A strong secret for signing JWTs. To auto generate and paste inside your env run `(pnpn/npm/bun) run secret`. If that fails run `openssl rand -base64 32`).'
			),
		ADMIN_EMAIL: schema(z.string().email().optional()) // Zod handles optional and email format
			.hint(
				'Optional. If set, the user registering with this email address will gain admin privileges.'
			),
		REDIS_URL: schema(z.string().url().optional()) // Zod handles optional and URL format
			.hint(
				'Optional. Connection URL for Redis. If using the Docker Compose redis profile (`docker-compose --profile redis up`), the URL is likely "redis://redis:6379".'
			),
		NODE_ENV: schema(
			z.enum(['development', 'test', 'production']).optional()
		).hint(
			'Optional. Sets the runtime environment (e.g., "development", "production"). Often set by Next.js automatically.'
		)
	},

	/**
	 * Specify your client-side environment variables schema here.
	 * This way you can ensure the app isn't built with invalid env vars.
	 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
	 */
	client: {
		// Example:
		// NEXT_PUBLIC_API_URL: schema(z.string().url())
		//   .hint('Required. The public base URL for the API.'),
		// NEXT_PUBLIC_FEATURE_FLAG_X: schema(z.boolean().optional())
		//   .hint('Optional. Enables feature X if set to true.'),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes
	 * (e.g. middlewares) or client-side, so we need to pass it manually here.
	 */
	runtimeEnv: process.env,

	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true

	/**
	 * Optional: Custom error formatting. You can omit this to use the default.
	 */
	// errorFormatter: ({ error, input, schemaDefs }) => {
	//   // Custom formatting logic here if needed
	//   return new Error("Custom validation failed!");
	// },
})

// --- How to use ---
/*
// Server-side (e.g., API route, getServerSideProps)
import { env } from "@/env"; // Adjust path as needed

export default function handler(req, res) {
  console.log("DB URL:", env.DATABASE_URL);
  console.log("JWT Secret:", env.JWT_SECRET);
  // console.log("Client API URL:", env.NEXT_PUBLIC_API_URL); // If defined
  res.status(200).json({ message: 'Success' });
}

// Client-side (e.g., React component) - ONLY use NEXT_PUBLIC_ variables
import { env } from "@/env"; // Adjust path as needed

function MyComponent() {
  // const apiUrl = env.NEXT_PUBLIC_API_URL; // OK
  // const dbUrl = env.DATABASE_URL; // Error! Not available on client
  return <div>{/* ... *\/}</div>;
}
*/
