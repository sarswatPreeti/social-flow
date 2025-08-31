const { Pool } = require('pg');
const MigrationRunner = require('./migration-runner');
require('dotenv').config();

class DatabaseSetup {
  constructor() {
    // Connect to default postgres database to create our database
    this.defaultPool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/postgres',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async createDatabase() {
    const dbName = 'social_flow_db';
    let client;
    
    try {
      console.log('🗄️  Creating database...');
      client = await this.defaultPool.connect();
      
      // Check if database already exists
      const checkQuery = `
        SELECT 1 FROM pg_database WHERE datname = $1
      `;
      const exists = await client.query(checkQuery, [dbName]);
      
      if (exists.rows.length === 0) {
        // Create database
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Database '${dbName}' created successfully`);
      } else {
        console.log(`✅ Database '${dbName}' already exists`);
      }
      
    } catch (error) {
      console.error('❌ Failed to create database:', error.message);
      
      // Try alternative methods
      console.log('🔄 Trying alternative database creation methods...');
      
      try {
        // Method 1: Using createdb command
        const { execSync } = require('child_process');
        execSync(`createdb ${dbName}`, { stdio: 'inherit' });
        console.log(`✅ Database '${dbName}' created using createdb command`);
      } catch (cmdError) {
        console.error('❌ createdb command failed:', cmdError.message);
        
        // Method 2: Try with different user
        try {
          await client.query(`CREATE DATABASE ${dbName} OWNER postgres`);
          console.log(`✅ Database '${dbName}' created with postgres owner`);
        } catch (ownerError) {
          console.error('❌ All database creation methods failed');
          console.log('💡 Please create the database manually:');
          console.log(`   createdb ${dbName}`);
          console.log(`   or psql -c "CREATE DATABASE ${dbName};"`);
          throw ownerError;
        }
      }
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async setupDatabase() {
    try {
      // Step 1: Create database
      await this.createDatabase();
      
      // Step 2: Update DATABASE_URL to point to our database
      const dbName = 'social_flow_db';
      const baseUrl = process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432';
      const newUrl = baseUrl.replace(/\/[^\/]+$/, `/${dbName}`);
      
      // Temporarily set the DATABASE_URL for migrations
      process.env.DATABASE_URL = newUrl;
      
      console.log('🔗 Updated DATABASE_URL for migrations');
      
      // Step 3: Run migrations
      console.log('🔄 Running migrations...');
      const runner = new MigrationRunner();
      await runner.runMigrations();
      await runner.close();
      
      console.log('🎉 Database setup completed successfully!');
      console.log('');
      console.log('📊 Database connection details:');
      console.log(`   URL: ${newUrl}`);
      console.log('');
      console.log('🔗 Add this to your .env file:');
      console.log(`   DATABASE_URL=${newUrl}`);
      
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      throw error;
    } finally {
      await this.defaultPool.end();
    }
  }
}

// CLI interface
if (require.main === module) {
  const setup = new DatabaseSetup();
  
  setup.setupDatabase()
    .then(() => {
      console.log('🚀 Database setup process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup process failed:', error.message);
      process.exit(1);
    });
}

module.exports = DatabaseSetup;
