import postgres from 'postgres'

async function verifyConnection() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) {
    throw new Error('Database connection URL is not defined')
  }

  const sql = postgres(connectionString, {
    ssl: true,
    connection: {
      options: `--cluster=ep-late-king-a2e5jfa6-pooler`
    }
  })
  
  try {
    const result = await sql`SELECT version()`
    console.log('✅ Successfully connected to database')
    console.log('Database version:', result[0].version)
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

verifyConnection()