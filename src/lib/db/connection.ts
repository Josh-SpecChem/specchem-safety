/**
 * Database Connection - Drizzle ORM Setup
 * 
 * Centralized database connection using Drizzle ORM with PostgreSQL
 * Includes schema and relations for type-safe queries
 */

import * as relations from '@/contracts/relations';
import * as schema from '@/contracts/schema.app';
import { ConfigurationService } from '@/lib/configuration';
import { sql } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';

// Create PostgreSQL connection
let client: Sql | null = null;
let db: PostgresJsDatabase<typeof schema & typeof relations> | null = null;

// Only initialize database connection at runtime, not during build
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test' && process.env.DATABASE_URL) {
  try {
    const connectionString = ConfigurationService.getDatabaseConfig().url;
    
    if (connectionString) {
      client = postgres(connectionString, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
      });
      
      // Create Drizzle database instance with schema and relations
      db = drizzle(client, {
        schema: {
          ...schema,
          ...relations,
        },
      });
    }
  } catch (error) {
    console.warn('Database connection not available:', error);
    // Create a mock database for build time
    db = null;
  }
}

// Ensure db is never undefined
if (!db) {
  db = null;
}

// Export database instance
export { db };

// Export the database instance as default
export default db;

// Create a database manager for health checks and utilities
export const dbManager = {
  async healthCheck(): Promise<boolean> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }
      await db.execute(sql`SELECT 1`);
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  },
  
  getDatabase() {
    if (!db) {
      throw new Error('Database not initialized');
    }
    return db;
  }
};

// Helper function to ensure db is not null
export function getDb(): NonNullable<typeof db> {
  if (!db) {
    throw new Error('Database not initialized. Make sure DATABASE_URL is set and the database is running.');
  }
  return db;
}

// Export types for use in other files
export type Database = PostgresJsDatabase<typeof schema & typeof relations>;
export type DatabaseTransaction = Parameters<Parameters<NonNullable<typeof db>['transaction']>[0]>[0];