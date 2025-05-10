import { db } from 'db';
import { userActions, ActionType } from '@/modules/metrics/api/schemas/action-log-schema';

export interface LogActionInput {
  userId?: number | null;
  actionType: ActionType;
  ipAddress?: string | null;
  userAgent?: string | null;
  path?: string | null;
  // Add location fields if you plan to populate them
  country?: string | null;
  region?: string | null;
  city?: string | null;
  details?: Record<string, any> | null;
}

export async function logUserAction(input: LogActionInput): Promise<void> {
  try {
    await db.insert(userActions).values({
      userId: input.userId ?? null,
      actionType: input.actionType,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      path: input.path ?? null,
      country: input.country ?? null,
      region: input.region ?? null,
      city: input.city ?? null,
      details: input.details ?? null,
    });
  } catch (error) {
    console.error('Failed to log user action:', {
        actionType: input.actionType,
        userId: input.userId,
        error: error,
    });
  }
}
