import { sql } from 'drizzle-orm';
import { pgTable, serial, integer, json, timestamp, foreignKey, unique } from 'drizzle-orm/pg-core';

export async function up(db) {
  await db.execute(sql`
    ALTER TABLE workspace_preferences 
    ADD CONSTRAINT workspace_preferences_user_id_workspace_id_unique 
    UNIQUE (user_id, workspace_id);
  `);
}

export async function down(db) {
  await db.execute(sql`
    ALTER TABLE workspace_preferences 
    DROP CONSTRAINT workspace_preferences_user_id_workspace_id_unique;
  `);
} 