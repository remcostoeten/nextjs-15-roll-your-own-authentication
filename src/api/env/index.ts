import { ZodError, z, type ZodType, type ZodTypeDef } from 'zod'

// Define error formatting function type
type ErrorFormatterOptions = {
	error: ZodError
	input: Record<string, unknown>
	schemaDefs: Record<string, EnvVar<any>> // Pass schema definitions to access hints
}
type ErrorFormatter = (opts: ErrorFormatterOptions) => Error

// --- EnvVar Class: Wraps Zod schema and stores hint ---
class EnvVar<T extends ZodType<any, ZodTypeDef, any>> {
	_schema: T // The underlying Zod schema (e.g., z.string())
	_hint?: string // Optional hint message

	constructor(schema: T) {
		this._schema = schema
	}

	/**
	 * Adds a descriptive hint to the environment variable definition.
	 * This hint will be included in the error message if validation fails.
	 * @param description The hint text.
	 * @returns The EnvVar instance for chaining.
	 */
	hint(description: string): this {
		this._hint = description
		return this
	}

	// We don't need .required()/.optional() here because Zod handles that intrinsically.
	// e.g., z.string() is required, z.string().optional() is optional.
}

// --- Factory function for creating EnvVar instances ---
// This makes defining the schema slightly cleaner
export function schema<T extends ZodType<any, ZodTypeDef, any>>(
	validator: T
): EnvVar<T> {
	return new EnvVar(validator)
}

// --- Default Error Formatter ---
function defaultErrorFormatter({ error, schemaDefs }) {
	const issueMessages = error.issues.map((issue) => {
		const varName = issue.path.join('.') // Get variable name (handles nested paths if ever needed)
		const baseMessage = `❌ Invalid value for "${varName}": ${issue.message}.`
		// Find the corresponding EnvVar definition to get the hint
		const hint = schemaDefs[varName]?._hint
		return hint ? `${baseMessage}\n   -> Hint: ${hint}` : baseMessage
	})

	const combinedError = `\n❌ Environment variable validation failed:\n\n${issueMessages.join(
		'\n\n'
	)}\n`
	return new Error(combinedError)
}

// --- createEnv Function ---
interface CreateEnvOptions<
	TServer extends Record<string, EnvVar<ZodType>>,
	TClient extends Record<string, EnvVar<ZodType>>
> {
	/**
	 * Server-side environment variables schema.
	 * These are only available on the server.
	 */
	server: TServer

	/**
	 * Client-side environment variables schema.
	 * Must be prefixed with `NEXT_PUBLIC_`. These are available on both server and client.
	 */
	client: TClient

	/**
	 * The object containing the runtime environment variables.
	 * Usually `process.env`.
	 */
	runtimeEnv: NodeJS.ProcessEnv

	/**
	 * Optional flag to skip validation. Useful for certain build steps or environments.
	 * @default false
	 */
	skipValidation?: boolean

	/**
	 * Optional flag to treat empty strings (`""`) as `undefined`.
	 * @default false
	 */
	emptyStringAsUndefined?: boolean

	/**
	 * Custom error formatting function.
	 */
	errorFormatter?: ErrorFormatter
}

// Helper type to infer the shape of the validated environment object
type InferEnvShape<
	TServer extends Record<string, EnvVar<ZodType>>,
	TClient extends Record<string, EnvVar<ZodType>>
> = z.infer<z.ZodObject<{ [K in keyof TServer]: TServer[K]['_schema'] }>> &
	z.infer<z.ZodObject<{ [K in keyof TClient]: TClient[K]['_schema'] }>>

export function createEnvWithHints<
	TServer extends Record<string, EnvVar<ZodType>> = Record<string, never>, // Default to empty object
	TClient extends Record<string, EnvVar<ZodType>> = Record<string, never> // Default to empty object
>(opts: CreateEnvOptions<TServer, TClient>): InferEnvShape<TServer, TClient> {
	// --- Prepare Runtime Environment ---
	const runtimeEnv = opts.runtimeEnv ?? process.env
	const formattedRuntimeEnv = { ...runtimeEnv }

	// Process emptyStringAsUndefined option
	if (opts.emptyStringAsUndefined) {
		for (const [key, value] of Object.entries(formattedRuntimeEnv)) {
			if (value === '') {
				delete formattedRuntimeEnv[key] // Treat empty string as undefined
			}
		}
	}

	// --- Prepare Schemas ---
	const serverSchemaDefs = opts.server ?? {}
	const clientSchemaDefs = opts.client ?? {}
	const allSchemaDefs = { ...serverSchemaDefs, ...clientSchemaDefs } // For hint lookup

	// Extract Zod schemas from EnvVar wrappers
	const serverSchema = z.object(
		Object.fromEntries(
			Object.entries(serverSchemaDefs).map(([key, envVar]) => [
				key,
				envVar._schema
			])
		)
	)
	const clientSchema = z.object(
		Object.fromEntries(
			Object.entries(clientSchemaDefs).map(([key, envVar]) => [
				key,
				envVar._schema
			])
		)
	)
	const mergedSchema = serverSchema.merge(clientSchema)

	// --- Validate Client Schema Keys ---
	for (const key of Object.keys(clientSchemaDefs)) {
		if (!key.startsWith('NEXT_PUBLIC_')) {
			throw new Error(
				`❌ Invalid client environment variable name: "${key}". Client variables must be prefixed with "NEXT_PUBLIC_".`
			)
		}
	}

	// --- Skip Validation Logic ---
	if (opts.skipValidation) {
		console.warn('⚠️ Environment variable validation skipped.')
		// Return the runtime environment without validation, but attempt to merge/shape it
		// This is potentially unsafe and should be used cautiously.
		// A simple approach is to return an empty object or a proxy that warns on access.
		// For simplicity, we'll return the formatted runtime env casted, but this bypasses type safety.
		return formattedRuntimeEnv as InferEnvShape<TServer, TClient>
	}

	// --- Perform Validation ---
	const parsed = mergedSchema.safeParse(formattedRuntimeEnv)

	// --- Handle Validation Errors ---
	if (!parsed.success) {
		const errorFormatter = opts.errorFormatter ?? defaultErrorFormatter
		const formattedError = errorFormatter({
			error: parsed.error,
			input: formattedRuntimeEnv,
			schemaDefs: allSchemaDefs // Pass definitions for hint lookup
		})
		throw formattedError // Throw the formatted error to halt execution
	}

	// --- Return Validated Environment ---
	// parsed.data contains the validated and typed environment variables
	return parsed.data as InferEnvShape<TServer, TClient>
}
