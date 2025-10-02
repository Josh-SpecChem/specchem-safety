// Re-export from the new connection manager for backward compatibility
export { db, dbManager, getDb } from './connection';
// Schema and relations are available through the contracts system
// Import from @/contracts instead of re-exporting here to avoid duplicates