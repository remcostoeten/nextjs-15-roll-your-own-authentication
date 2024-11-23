import { SQL } from 'drizzle-orm'
import { PgTableWithColumns } from 'drizzle-orm/pg-core'
import { db } from '../drizzle'

/**
 * Executes a database query on the specified table.
 *
 * @param table - The Postgres table to query
 * @param where - Optional WHERE clause for the query
 * @param limit - Optional LIMIT clause for the query
 * @returns A promise that resolves to an array of query results
 *
 * @example
 * const users = await query(usersTable, eq(usersTable.id, 1), 1);
 */
export async function query<T extends PgTableWithColumns<any>>(
	table: T,
	where?: SQL<unknown> | undefined,
	limit?: number
) {
	try {
		const baseQuery = db.select().from(table)
		const withWhere = where ? baseQuery.where(where) : baseQuery
		const finalQuery = limit ? withWhere.limit(limit) : withWhere

		return await finalQuery
	} catch (error) {
		console.error('Query operation failed:', error)
		throw error
	}
}
