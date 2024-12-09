import postgres from 'postgres'

async function verifyConnection() {
  const connectionString = process.env.POSTGRES_URL
  if (!connectionString) {
    throw new Error('POSTGRES_URL is not defined')
  }

  const sql = postgres(connectionString)
  try {
    const result = await sql`SELECT version()`
    console.log('✅ Successfully connected to database')
    console.log('Database version:', result[0].version)
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
  } finally {
    await sql.end()
  }
}

verifyConnection() 