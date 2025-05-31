import { eq, gte, lte, and, desc } from "drizzle-orm";
import { TAnalyticsFilter } from "../../types";
import { analyticsDb } from "../db/connection";
import { analyticsSessions } from "../schemas/schema-analytics";

export async function getSessions(
  projectId: string,
  filter: TAnalyticsFilter & { limit?: number; offset?: number } = {}
) {
  const whereConditions = [eq(analyticsSessions.projectId, projectId)]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsSessions.startedAt, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsSessions.startedAt, filter.endDate))
  }

  const sessions = await analyticsDb
    .select()
    .from(analyticsSessions)
    .where(and(...whereConditions))
    .orderBy(desc(analyticsSessions.startedAt))
    .limit(filter.limit || 100)
    .offset(filter.offset || 0)

  return sessions
}