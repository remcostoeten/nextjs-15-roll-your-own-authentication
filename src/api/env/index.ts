/**
 * @author Remco Stoeten
 * @description Environment variable validation and parsing utility (Core Logic).
 * Imports the schema from schema.ts and validates process.env against it.
 * Provides type-safe access to environment variables. Throws an error
 * during startup if required variables are missing or invalid.
 * NOTE: Assumes Next.js built-in .env handling (dotenv package is NOT used).
 */

import { ENV_SCHEMA } from './env-schema'; 

/**
 * Represents a definition for an environment variable.
 * Allows chaining `.required()`, `.optional()`, and `.hint()`.
 * @template T The expected type of the environment variable (e.g., string, number).
 */
class EnvVar<T> {
    private isVarRequired: boolean = false;
    private varHint: string | undefined = undefined;
    private keyName: string;
    private parser: (value: string | undefined) => T | undefined;

    /**
     * Creates an instance of EnvVar.
     * @param key The name of the environment variable.
     * @param parser A function to parse the raw string value.
     */
    constructor(key: string, parser: (value: string | undefined) => T | undefined) {
        this.keyName = key;
        this.parser = parser;
    }

    /** Marks the environment variable as required. */
    required(): this {
        this.isVarRequired = true;
        return this;
    }

    /** Marks the environment variable as optional. */
    optional(): this {
        this.isVarRequired = false;
        return this;
    }

    /** Adds a descriptive hint to the environment variable. */
    hint(description: string): this {
        this.varHint = description;
        return this;
    }

    /**
     * Retrieves, parses, and validates the value from the environment source.
     * @param envSource The environment object (typically process.env).
     * @returns The parsed value (type T) or undefined if optional and missing/invalid.
     * @throws Error if a required variable is missing or invalid.
     */
    getValue(envSource: NodeJS.ProcessEnv): T | undefined {
        const rawValue = envSource[this.keyName];
        const isMissingOrEmpty = rawValue === undefined || rawValue === '';

        if (isMissingOrEmpty) {
            if (this.isVarRequired) {
                let errorMessage = `❌ Missing required environment variable: "${this.keyName}".`;
                if (this.varHint) {
                    errorMessage += `\n   -> Hint: ${this.varHint}`;
                }
                throw new Error(errorMessage);
            }
            return undefined;
        }

        const parsedValue = this.parser(rawValue);

        if (parsedValue === undefined) {
             if (this.isVarRequired) {
                 let errorMessage = `❌ Invalid value for required environment variable: "${this.keyName}". Received: "${rawValue}".`;
                 if (this.varHint) {
                     errorMessage += `\n   -> Hint: ${this.varHint}`;
                 }
                 throw new Error(errorMessage);
             }
             return undefined;
        }
        return parsedValue;
    }

    // Internal getter for type inference in parseEnv
    get _isRequired(): boolean {
        return this.isVarRequired;
    }
}

// --- Schema Definition Factory Functions ---

/** Factory function for string environment variables. */
export function string(key: string): EnvVar<string> {
    const parser = (value: string | undefined): string | undefined => {
        return (value !== undefined && value !== '') ? value : undefined;
    };
    return new EnvVar<string>(key, parser);
}

/** Factory function for number environment variables. */
/* // Uncomment and adapt if needed
export function number(key: string): EnvVar<number> {
    const parser = (value: string | undefined): number | undefined => {
        if (value === undefined || value === '') return undefined;
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    };
    return new EnvVar<number>(key, parser);
}
*/

// --- Runtime Validation Logic ---

// Infer the resulting type structure based on the imported schema.
type EnvSchemaType = typeof ENV_SCHEMA;
type ParsedEnv = {
  [K in keyof EnvSchemaType]:
    EnvSchemaType[K] extends EnvVar<infer T>
      ? EnvSchemaType[K]['_isRequired'] extends true
        ? T
        : T | undefined
      : never;
};

/**
 * Parses environment variables based on the imported schema.
 * @param schema The schema object (imported ENV_SCHEMA).
 * @param envSource The environment object (typically process.env).
 * @returns An object containing the validated environment variables.
 * @throws Aggregated error if validation fails.
 */
function parseEnv(schema: EnvSchemaType, envSource: NodeJS.ProcessEnv): ParsedEnv {
    const result: Partial<ParsedEnv> = {};
    const errors: string[] = [];

    for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
            const varDef = schema[key as keyof EnvSchemaType] as EnvVar<any>;
            try {
                result[key as keyof ParsedEnv] = varDef.getValue(envSource);
            } catch (error: any) {
                errors.push(error.message);
            }
        }
    }

    if (errors.length > 0) {
        const combinedError = `\n❌ Environment variable validation failed:\n\n${errors.join('\n\n')}\n`;
        throw new Error(combinedError);
    }

    return result as ParsedEnv;
}

// --- Export the Validated Environment ---
// Validation runs when this module is imported.
export const env = parseEnv(ENV_SCHEMA, process.env);

