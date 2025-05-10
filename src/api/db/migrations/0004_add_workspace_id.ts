import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Add workspace_id column
  await db.schema.alterTable('workspace_preferences')
    .addColumn('workspace_id', 'integer', (col) => 
      col.notNull().references('workspaces.id').onDelete('cascade')
    )
    .execute();

  // Add an index on workspace_id for faster lookups
  await db.schema.createIndex('workspace_preferences_workspace_id_idx')
    .on('workspace_preferences')
    .column('workspace_id')
    .execute();

  // Add a composite index for user_id and workspace_id
  await db.schema.createIndex('workspace_preferences_user_workspace_idx')
    .on('workspace_preferences')
    .columns(['user_id', 'workspace_id'])
    .execute();
}

export async function down(db: any) {
  // Remove indexes first
  await db.schema.dropIndex('workspace_preferences_workspace_id_idx').execute();
  await db.schema.dropIndex('workspace_preferences_user_workspace_idx').execute();
  
  // Remove the column
  await db.schema.alterTable('workspace_preferences')
    .dropColumn('workspace_id')
    .execute();
} 