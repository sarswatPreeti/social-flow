const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Simple Database Setup for Social Flow...');

// Database name
const DB_NAME = 'social_flow_db';

// Function to run command and handle errors
function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}`);
    return false;
  }
}

// Function to check if database exists
function databaseExists() {
  try {
    execSync(`psql -d ${DB_NAME} -c "SELECT 1;"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Main setup process
async function setupDatabase() {
  console.log('🔍 Checking if database exists...');
  
  if (databaseExists()) {
    console.log(`✅ Database '${DB_NAME}' already exists`);
  } else {
    console.log(`📝 Creating database '${DB_NAME}'...`);
    
    // Try different methods to create database
    const methods = [
      {
        command: `createdb ${DB_NAME}`,
        description: 'Creating database using createdb command'
      },
      {
        command: `psql -c "CREATE DATABASE ${DB_NAME};"`,
        description: 'Creating database using psql command'
      },
      {
        command: `psql -U postgres -c "CREATE DATABASE ${DB_NAME};"`,
        description: 'Creating database with postgres user'
      }
    ];
    
    let created = false;
    for (const method of methods) {
      if (runCommand(method.command, method.description)) {
        created = true;
        break;
      }
    }
    
    if (!created) {
      console.log('❌ All database creation methods failed');
      console.log('');
      console.log('💡 Please create the database manually:');
      console.log(`   createdb ${DB_NAME}`);
      console.log(`   or psql -c "CREATE DATABASE ${DB_NAME};"`);
      console.log('');
      console.log('Then run this script again to apply the schema.');
      process.exit(1);
    }
  }
  
  // Apply schema
  console.log('📋 Applying database schema...');
  const schemaPath = path.join(__dirname, '001_initial_schema.sql');
  
  if (!fs.existsSync(schemaPath)) {
    console.log('❌ Schema file not found');
    process.exit(1);
  }
  
  const schemaCommands = [
    {
      command: `psql -d ${DB_NAME} -f "${schemaPath}"`,
      description: 'Applying schema using psql'
    },
    {
      command: `psql -U postgres -d ${DB_NAME} -f "${schemaPath}"`,
      description: 'Applying schema with postgres user'
    }
  ];
  
  let schemaApplied = false;
  for (const method of schemaCommands) {
    if (runCommand(method.command, method.description)) {
      schemaApplied = true;
      break;
    }
  }
  
  if (!schemaApplied) {
    console.log('❌ Failed to apply schema');
    console.log('');
    console.log('💡 Please apply the schema manually:');
    console.log(`   psql -d ${DB_NAME} -f migrations/001_initial_schema.sql`);
    process.exit(1);
  }
  
  console.log('');
  console.log('🎉 Database setup completed successfully!');
  console.log('');
  console.log('📊 Database connection details:');
  console.log(`   Database: ${DB_NAME}`);
  console.log(`   Host: localhost:5432`);
  console.log('');
  console.log('🔗 Add this to your .env file:');
  console.log(`   DATABASE_URL=postgresql://localhost:5432/${DB_NAME}`);
  console.log('');
  console.log('🚀 You can now start your backend server!');
}

// Run the setup
setupDatabase().catch(error => {
  console.error('💥 Setup failed:', error.message);
  process.exit(1);
});
