const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

class MigrationRunner {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
    
    this.migrationsPath = path.join(__dirname, 'migrations');
  }

  async connect() {
    try {
      const client = await this.pool.connect();
      console.log('✅ Connected to PostgreSQL');
      return client;
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL:', error.message);
      throw error;
    }
  }

  async createMigrationsTable(client) {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await client.query(createTableQuery);
      console.log('✅ Migrations table created/verified');
    } catch (error) {
      console.error('❌ Failed to create migrations table:', error.message);
      throw error;
    }
  }

  async getExecutedMigrations(client) {
    try {
      const result = await client.query('SELECT filename FROM migrations ORDER BY id');
      return result.rows.map(row => row.filename);
    } catch (error) {
      console.error('❌ Failed to get executed migrations:', error.message);
      return [];
    }
  }

  async getMigrationFiles() {
    try {
      const files = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
      return files;
    } catch (error) {
      console.error('❌ Failed to read migration files:', error.message);
      return [];
    }
  }

  async executeMigration(client, filename) {
    const filePath = path.join(this.migrationsPath, filename);
    
    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`📋 Executing migration: ${filename}`);
      
      await client.query(sql);
      await client.query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
      
      console.log(`✅ Migration executed: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to execute migration ${filename}:`, error.message);
      throw error;
    }
  }

  async runMigrations() {
    let client;
    
    try {
      client = await this.connect();
      await this.createMigrationsTable(client);
      
      const executedMigrations = await this.getExecutedMigrations(client);
      const migrationFiles = await this.getMigrationFiles();
      
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✅ All migrations are up to date');
        return;
      }
      
      console.log(`🔄 Found ${pendingMigrations.length} pending migrations`);
      
      for (const filename of pendingMigrations) {
        await this.executeMigration(client, filename);
      }
      
      console.log('🎉 All migrations completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async close() {
    await this.pool.end();
  }
}

// CLI interface
if (require.main === module) {
  const runner = new MigrationRunner();
  
  runner.runMigrations()
    .then(() => {
      console.log('🚀 Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error.message);
      process.exit(1);
    })
    .finally(() => {
      runner.close();
    });
}

module.exports = MigrationRunner;
