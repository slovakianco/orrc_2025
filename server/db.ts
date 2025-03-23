import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Create connection to Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL || '');
// @ts-ignore - Type issue with the neon-serverless package
export const db = drizzle(sql);

// Export database connection for use in storage.ts