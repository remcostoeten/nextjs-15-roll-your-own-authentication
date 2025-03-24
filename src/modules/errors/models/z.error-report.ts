import { z } from 'zod';

export const ErrorReportSchema = z.object({
  url: z.string().url(),
  previousUrl: z.string().url().optional(),
  userAgent: z.string(),
  browserInfo: z.string(),
  systemInfo: z.string(),
  wasAuthenticated: z.boolean(),
  userId: z.string().uuid().optional(),
  userMessage: z.string().optional(),
  errorMessage: z.string(),
  statusCode: z.string(),
  stackTrace: z.string().optional(),
});

export type ErrorReport = z.infer<typeof ErrorReportSchema>;
