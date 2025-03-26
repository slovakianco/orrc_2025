import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Use ESM compatible import for pg
const { Pool } = pkg;

// Log database connection details (without exposing credentials)
console.log(`Connecting to PostgreSQL database at ${process.env.PGHOST || 'using DATABASE_URL'}`);

// Create a PostgreSQL connection pool
const pool = new Pool({
  // First try to use the individual connection parameters, fall back to DATABASE_URL
  host: process.env.PGHOST,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  // If individual parameters are not available, use the connection string
  connectionString: !process.env.PGHOST ? process.env.DATABASE_URL : undefined,
  // Connection timeout - fail fast if unable to connect
  connectionTimeoutMillis: 10000,
  // Add a statement timeout to prevent long-running queries
  statement_timeout: 10000,
  // Enable SSL for production environment
  ssl: {
    // Required for most cloud PostgreSQL providers
    rejectUnauthorized: false
  }
});

// Set up error handler for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
pool.query('SELECT NOW()')
  .then(() => console.log('Successfully connected to PostgreSQL database'))
  .catch(err => {
    console.error('Failed to connect to PostgreSQL database:', err);
    // Don't exit the process, as we still want the application to run even if the database is not available
  });

// Create a drizzle instance
export const db = drizzle(pool);

// Export database connection for use in storage.ts