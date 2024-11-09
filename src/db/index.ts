import { env } from '@/lib/env'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const client = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN
})

export const db = drizzle(client, { schema })

export type Database = typeof db
export type Schema = typeof schema
