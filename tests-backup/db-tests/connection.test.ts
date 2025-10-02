import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock pg Pool
vi.mock('pg', () => ({
  Pool: vi.fn().mockImplementation(() => ({
    query: vi.fn(),
    end: vi.fn(),
    on: vi.fn(),
    totalCount: 0,
    idleCount: 0,
    waitingCount: 0,
  })),
}));

// Mock drizzle
vi.mock('drizzle-orm/node-postgres', () => ({
  drizzle: vi.fn(() => ({})),
}));

describe('Database Connection Manager', () => {
  beforeEach(() => {
    // Reset modules
    vi.resetModules();
    
    // Mock environment variables
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create database manager instance', () => {
    const { dbManager } = require('../db/connection');
    
    expect(dbManager).toBeDefined();
    expect(dbManager.getDb).toBeDefined();
    expect(dbManager.healthCheck).toBeDefined();
    expect(dbManager.close).toBeDefined();
  });

  it('should provide database instance', () => {
    const { db } = require('../db/connection');
    
    expect(db).toBeDefined();
  });

  it('should perform health check', async () => {
    const { dbManager } = require('../db/connection');
    
    // Mock successful health check
    dbManager.pool.query = vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] });
    
    const result = await dbManager.healthCheck();
    expect(result).toBe(true);
  });

  it('should handle health check failure', async () => {
    const { dbManager } = require('../db/connection');
    
    // Mock failed health check
    dbManager.pool.query = vi.fn().mockRejectedValue(new Error('Connection failed'));
    
    const result = await dbManager.healthCheck();
    expect(result).toBe(false);
  });

  it('should provide pool statistics', () => {
    const { dbManager } = require('../db/connection');
    
    const stats = dbManager.getPoolStats();
    expect(stats).toHaveProperty('totalCount');
    expect(stats).toHaveProperty('idleCount');
    expect(stats).toHaveProperty('waitingCount');
  });

  it('should close database connections', async () => {
    const { dbManager } = require('../db/connection');
    
    await dbManager.close();
    expect(dbManager.pool.end).toHaveBeenCalled();
  });
});
