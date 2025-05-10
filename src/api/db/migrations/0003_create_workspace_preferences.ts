import { sql } from 'drizzle-orm';
import { pgTable, serial, integer, json, timestamp } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  await db.schema.createTable('workspace_preferences')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => 
      col.notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('preferences', 'jsonb', (col) => col.notNull().defaultTo('{}'))
    .addColumn('created_at', 'timestamp', (col) => 
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'timestamp', (col) => 
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  // Add an index on user_id for faster lookups
  await db.schema.createIndex('workspace_preferences_user_id_idx')
    .on('workspace_preferences')
    .column('user_id')
    .execute();
}

export async function down(db: any) {
  await db.schema.dropTable('workspace_preferences').execute();
} 