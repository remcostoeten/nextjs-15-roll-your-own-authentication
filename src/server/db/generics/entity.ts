import { SQL } from 'drizzle-orm'
import { PgTableWithColumns } from 'drizzle-orm/pg-core'
import { db } from '../drizzle'

/**
 * Creates a set of CRUD operations for a given Postgres table.
 *
 * @param table - The Postgres table to create operations for
 * @returns An object with create, read, update, and delete functions
 */
export function createEntity<T extends PgTableWithColumns<any>>(table: T) {
	return {
		async create(data: T['$inferInsert']) {
			try {
				const result = await db
					.insert(table)
					.values(data as T['$inferInsert'])
					.returning()
				return result
			} catch (error) {
				console.error('Create operation failed:', error)
				throw error
			}
		},
		async read(where?: SQL<unknown> | undefined, limit?: number) {
			try {
				const baseQuery = db.select().from(table)
				const withWhere = where ? baseQuery.where(where) : baseQuery
				const finalQuery = limit ? withWhere.limit(limit) : withWhere
				return await finalQuery
			} catch (error) {
				console.error('Read operation failed:', error)
				throw error
			}
		},
		async update(where: SQL<unknown>, data: Partial<T['$inferInsert']>) {
			try {
				const result = await db
					.update(table)
					.set(data)
					.where(where)
					.returning()
				return result
			} catch (error) {
				console.error('Update operation failed:', error)
				throw error
			}
		},
		async delete(where: SQL<unknown>) {
			try {
				const result = await db.delete(table).where(where).returning()
				return result
			} catch (error) {
				console.error('Delete operation failed:', error)
				throw error
			}
		}
	}
}
