import { z } from 'zod';

export type ValidationResult<T> = {
    success: boolean;
    data?: T;
    errors?: Record<keyof T, string[]>;
};

export type FormValidator<T extends z.ZodType> = {
    validate: (data: unknown) => ValidationResult<z.infer<T>>;
    validateAsync: (data: unknown) => Promise<ValidationResult<z.infer<T>>>;
};

export const createFormValidator = <T extends z.ZodType>(schema: T): FormValidator<T> => {
    const processZodError = (error: z.ZodError): Record<keyof z.infer<T>, string[]> => {
        return error.errors.reduce((acc, curr) => {
            const path = curr.path[0] as keyof z.infer<T>;
            if (!acc[path]) {
                acc[path] = [];
            }
            acc[path].push(curr.message);
            return acc;
        }, {} as Record<keyof z.infer<T>, string[]>);
    };

    return {
        validate: (data: unknown): ValidationResult<z.infer<T>> => {
            try {
                const validData = schema.parse(data);
                return {
                    success: true,
                    data: validData,
                };
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return {
                        success: false,
                        errors: processZodError(error),
                    };
                }
                throw error;
            }
        },

        validateAsync: async (data: unknown): Promise<ValidationResult<z.infer<T>>> => {
            try {
                const validData = await schema.parseAsync(data);
                return {
                    success: true,
                    data: validData,
                };
            } catch (error) {
                if (error instanceof z.ZodError) {
                    return {
                        success: false,
                        errors: processZodError(error),
                    };
                }
                throw error;
            }
        },
    };
};

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Example usage:
// const loginSchema = z.object({
//     email: emailSchema,
//     password: passwordSchema,
// });
// const loginValidator = createFormValidator(loginSchema); 