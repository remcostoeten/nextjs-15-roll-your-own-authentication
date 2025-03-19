import { createClient } from '@libsql/client'
import * as schema from './schemas'
import { drizzle } from 'drizzle-orm/libsql'
import { env } from 'env'

const client = createClient({
	url: env.DATABASE_URL,
})

export const db = drizzle(client, { schema })
