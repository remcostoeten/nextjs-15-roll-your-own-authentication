import { eq, gte, lte, and, desc } from "drizzle-orm";
import { TAnalyticsFilter } from "../../types";
import { analyticsDb } from "../db/connection";
import { analyticsEvents } from "../schemas/schema-analytics";

export async function getEvents(
  projectId: string,
  filter: TAnalyticsFilter & { limit?: number; offset?: number } = {}
) {
  const whereConditions = [eq(analyticsEvents.projectId, projectId)]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsEvents.timestamp, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsEvents.timestamp, filter.endDate))
  }
  
  if (filter.pathname) {
    whereConditions.push(eq(analyticsEvents.pathname, filter.pathname))
  }

  const events = await analyticsDb
    .select()
    .from(analyticsEvents)
    .where(and(...whereConditions))
    .orderBy(desc(analyticsEvents.timestamp))
    .limit(filter.limit || 100)
    .offset(filter.offset || 0)

  return events
}