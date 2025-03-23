import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Use ESM compatible import for pg
const { Pool } = pkg;

// Create a PostgreSQL connection pool instead of using neon directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create a drizzle instance
export const db = drizzle(pool);

// Export database connection for use in storage.ts