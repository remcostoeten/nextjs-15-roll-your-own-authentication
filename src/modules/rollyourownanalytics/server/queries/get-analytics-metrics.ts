import { analyticsDb } from '../db/connection'
import { analyticsEvents, analyticsSessions, analyticsProjects } from '../schemas/schema-analytics'
import { eq, and, gte, lte, count, avg, sql, desc } from 'drizzle-orm'
import type { TAnalyticsMetrics, TAnalyticsFilter, TPageMetric, TCountryMetric, TDeviceMetric, TBrowserMetric } from '../../types'

export async function getAnalyticsMetrics(
  projectId: string,
  filter: TAnalyticsFilter = {}
): Promise<TAnalyticsMetrics> {
  const whereConditions = [eq(analyticsEvents.projectId, projectId)]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsEvents.timestamp, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsEvents.timestamp, filter.endDate))
  }
  
  if (filter.country) {
    whereConditions.push(eq(analyticsEvents.country, filter.country))
  }
  
  if (filter.device) {
    whereConditions.push(eq(analyticsEvents.device, filter.device))
  }
  
  if (filter.pathname) {
    whereConditions.push(eq(analyticsEvents.pathname, filter.pathname))
  }

  const [basicMetrics] = await analyticsDb
    .select({
      totalPageviews: count(sql`CASE WHEN ${analyticsEvents.type} = 'pageview' THEN 1 END`),
      totalEvents: count(),
      avgDuration: avg(analyticsEvents.duration),
    })
    .from(analyticsEvents)
    .where(and(...whereConditions))

  const sessionWhereConditions = [eq(analyticsSessions.projectId, projectId)]
  
  if (filter.startDate) {
    sessionWhereConditions.push(gte(analyticsSessions.startedAt, filter.startDate))
  }
  
  if (filter.endDate) {
    sessionWhereConditions.push(lte(analyticsSessions.startedAt, filter.endDate))
  }

  const [sessionMetrics] = await analyticsDb
    .select({
      totalSessions: count(),
      totalUsers: count(sql`DISTINCT ${analyticsSessions.visitorId}`),
      avgSessionDuration: avg(sql`${analyticsSessions.endedAt} - ${analyticsSessions.startedAt}`),
      bounceRate: avg(sql`CASE WHEN ${analyticsSessions.bounced} THEN 1.0 ELSE 0.0 END`),
    })
    .from(analyticsSessions)
    .where(and(...sessionWhereConditions))

  const topPages = await getTopPages(projectId, filter)
  
  const topCountries = await getTopCountries(projectId, filter)
  
  const topDevices = await getTopDevices(projectId, filter)
  
  const topBrowsers = await getTopBrowsers(projectId, filter)
  
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const [realtimeData] = await analyticsDb
    .select({
      realtimeVisitors: count(sql`DISTINCT ${analyticsSessions.visitorId}`),
    })
    .from(analyticsSessions)
    .where(
      and(
        eq(analyticsSessions.projectId, projectId),
        gte(analyticsSessions.endedAt, fiveMinutesAgo)
      )
    )

  return {
    totalPageviews: basicMetrics?.totalPageviews || 0,
    totalSessions: sessionMetrics?.totalSessions || 0,
    totalUsers: sessionMetrics?.totalUsers || 0,
    bounceRate: (sessionMetrics?.bounceRate || 0) * 100,
    avgSessionDuration: sessionMetrics?.avgSessionDuration || 0,
    avgPageDuration: basicMetrics?.avgDuration || 0,
    topPages,
    topCountries,
    topDevices,
    topBrowsers,
    realtimeVisitors: realtimeData?.realtimeVisitors || 0,
  }
}

async function getTopPages(projectId: string, filter: TAnalyticsFilter): Promise<TPageMetric[]> {
  const whereConditions = [
    eq(analyticsEvents.projectId, projectId),
    eq(analyticsEvents.type, 'pageview')
  ]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsEvents.timestamp, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsEvents.timestamp, filter.endDate))
  }

  const pages = await analyticsDb
    .select({
      pathname: analyticsEvents.pathname,
      title: analyticsEvents.title,
      views: count(),
      uniqueViews: count(sql`DISTINCT ${analyticsEvents.sessionId}`),
      avgDuration: avg(analyticsEvents.duration),
      bounces: count(sql`CASE WHEN ${analyticsEvents.bounced} THEN 1 END`),
      exits: count(sql`CASE WHEN ${analyticsEvents.exitPage} THEN 1 END`),
    })
    .from(analyticsEvents)
    .where(and(...whereConditions))
    .groupBy(analyticsEvents.pathname, analyticsEvents.title)
    .orderBy(desc(count()))
    .limit(10)

  return pages.map(page => ({
    pathname: page.pathname,
    title: page.title || undefined,
    views: page.views,
    uniqueViews: page.uniqueViews,
    avgDuration: page.avgDuration || 0,
    bounceRate: page.views > 0 ? (page.bounces / page.views) * 100 : 0,
    exitRate: page.views > 0 ? (page.exits / page.views) * 100 : 0,
  }))
}

async function getTopCountries(projectId: string, filter: TAnalyticsFilter): Promise<TCountryMetric[]> {
  const whereConditions = [eq(analyticsSessions.projectId, projectId)]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsSessions.startedAt, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsSessions.startedAt, filter.endDate))
  }

  const countries = await analyticsDb
    .select({
      country: analyticsSessions.country,
      sessions: count(),
    })
    .from(analyticsSessions)
    .where(and(...whereConditions, sql`${analyticsSessions.country} IS NOT NULL`))
    .groupBy(analyticsSessions.country)
    .orderBy(desc(count()))
    .limit(10)

  const totalSessions = countries.reduce((sum, country) => sum + country.sessions, 0)

  return countries.map(country => ({
    country: country.country || 'Unknown',
    sessions: country.sessions,
    percentage: totalSessions > 0 ? (country.sessions / totalSessions) * 100 : 0,
  }))
}

async function getTopDevices(projectId: string, filter: TAnalyticsFilter): Promise<TDeviceMetric[]> {
  const whereConditions = [eq(analyticsSessions.projectId, projectId)]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsSessions.startedAt, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsSessions.startedAt, filter.endDate))
  }

  const devices = await analyticsDb
    .select({
      device: analyticsSessions.device,
      sessions: count(),
    })
    .from(analyticsSessions)
    .where(and(...whereConditions, sql`${analyticsSessions.device} IS NOT NULL`))
    .groupBy(analyticsSessions.device)
    .orderBy(desc(count()))

  const totalSessions = devices.reduce((sum, device) => sum + device.sessions, 0)

  return devices.map(device => ({
    device: device.device || 'Unknown',
    sessions: device.sessions,
    percentage: totalSessions > 0 ? (device.sessions / totalSessions) * 100 : 0,
  }))
}

async function getTopBrowsers(projectId: string, filter: TAnalyticsFilter): Promise<TBrowserMetric[]> {
  const whereConditions = [eq(analyticsSessions.projectId, projectId)]
  
  if (filter.startDate) {
    whereConditions.push(gte(analyticsSessions.startedAt, filter.startDate))
  }
  
  if (filter.endDate) {
    whereConditions.push(lte(analyticsSessions.startedAt, filter.endDate))
  }

  const browsers = await analyticsDb
    .select({
      browser: analyticsSessions.browser,
      sessions: count(),
    })
    .from(analyticsSessions)
    .where(and(...whereConditions, sql`${analyticsSessions.browser} IS NOT NULL`))
    .groupBy(analyticsSessions.browser)
    .orderBy(desc(count()))
    .limit(10)

  const totalSessions = browsers.reduce((sum, browser) => sum + browser.sessions, 0)

  return browsers.map(browser => ({
    browser: browser.browser || 'Unknown',
    sessions: browser.sessions,
    percentage: totalSessions > 0 ? (browser.sessions / totalSessions) * 100 : 0,
  }))
}