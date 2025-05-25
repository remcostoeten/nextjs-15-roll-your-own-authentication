import chalk from 'chalk';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';

interface ColumnInfo {
	column_name: string;
	data_type: string;
	is_nullable: string;
	column_default: string | null;
	character_maximum_length: number | null;
}

interface TableInfo {
	table_name: string;
	columns: ColumnInfo[];
	constraints: {
		constraint_name: string;
		constraint_type: string;
		column_name: string;
		foreign_table?: string;
		foreign_column?: string;
	}[];
}

async function getTableInfo(pool: Pool, tableName: string): Promise<TableInfo> {
	// Get column information
	const columnResult = await pool.query(
		`
    SELECT
      column_name,
      data_type,
      is_nullable,
      column_default,
      character_maximum_length
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position;
  `,
		[tableName]
	);

	// Get constraint information
	const constraintResult = await pool.query(
		`
    SELECT
      tc.constraint_name,
      tc.constraint_type,
      kcu.column_name,
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.table_schema = 'public'
      AND tc.table_name = $1;
  `,
		[tableName]
	);

	return {
		table_name: tableName,
		columns: columnResult.rows,
		constraints: constraintResult.rows,
	};
}

async function validateSchema() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	try {
		// Get all tables from the database
		const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

		const dbTables = result.rows.map((row) => row.tablename);

		// Get all tables from the Drizzle schema
		const db = drizzle(pool, { schema });
		const drizzleTables = Object.values(schema)
			.filter((value) => typeof value === 'object' && 'name' in value)
			.map((table) => (table as { name: string }).name);

		// Compare table existence
		const missingTables = drizzleTables.filter((table) => !dbTables.includes(table));
		const extraTables = dbTables.filter((table) => !drizzleTables.includes(table));

		console.log(chalk.bold('\nSchema Validation Report'));
		console.log('========================\n');

		if (missingTables.length > 0) {
			console.log(chalk.red('❌ Missing tables in database:'));
			missingTables.forEach((table) => console.log(chalk.red(`   - ${table}`)));
		}

		if (extraTables.length > 0) {
			console.log(chalk.yellow('⚠️  Extra tables in database:'));
			extraTables.forEach((table) => console.log(chalk.yellow(`   - ${table}`)));
		}

		// Validate each table's structure
		for (const tableName of drizzleTables) {
			if (!dbTables.includes(tableName)) continue;

			console.log(chalk.bold(`\nValidating table: ${tableName}`));
			const tableInfo = await getTableInfo(pool, tableName);
			const drizzleTable = Object.values(schema).find(
				(value) => typeof value === 'object' && 'name' in value && value.name === tableName
			);

			if (!drizzleTable) {
				console.log(chalk.red(`❌ Could not find table ${tableName} in Drizzle schema`));
				continue;
			}

			// Compare columns
			const drizzleColumns = Object.entries(drizzleTable)
				.filter(([key]) => !['name', 'schema'].includes(key))
				.map(([key, value]) => ({
					name: key,
					...value,
				}));

			const dbColumns = tableInfo.columns;

			// Check for missing columns
			const missingColumns = drizzleColumns.filter(
				(col) => !dbColumns.find((dbCol) => dbCol.column_name === col.name)
			);

			// Check for extra columns
			const extraColumns = dbColumns.filter(
				(dbCol) => !drizzleColumns.find((col) => col.name === dbCol.column_name)
			);

			if (missingColumns.length > 0) {
				console.log(chalk.red('  ❌ Missing columns:'));
				missingColumns.forEach((col) => {
					console.log(chalk.red(`     - ${col.name}`));
				});
			}

			if (extraColumns.length > 0) {
				console.log(chalk.yellow('  ⚠️  Extra columns:'));
				extraColumns.forEach((col) => {
					console.log(chalk.yellow(`     - ${col.column_name} (${col.data_type})`));
				});
			}

			// Validate constraints
			const dbConstraints = tableInfo.constraints;
			console.log(chalk.blue('\n  ℹ️  Constraints:'));
			dbConstraints.forEach((constraint) => {
				console.log(
					chalk.blue(`     - ${constraint.constraint_type} on ${constraint.column_name}`)
				);
				if (constraint.foreign_table) {
					console.log(
						chalk.blue(
							`       References: ${constraint.foreign_table}(${constraint.foreign_column})`
						)
					);
				}
			});
		}

		if (missingTables.length === 0 && extraTables.length === 0) {
			console.log(chalk.green('\n✅ All tables match the schema definition'));
		}
	} catch (error) {
		console.error(chalk.red('Error validating schema:'), error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

// Run the script
validateSchema().catch((error) => {
	console.error(chalk.red('Failed to validate schema:'), error);
	process.exit(1);
});
