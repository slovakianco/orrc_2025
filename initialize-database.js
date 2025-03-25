// A simple script to initialize the database

const { exec } = require('child_process');
const path = require('path');

console.log('Initializing database schema...');

// Run the push-schema-force.ts script to create tables
exec('tsx server/push-schema-force.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing push-schema-force.ts: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`push-schema-force.ts stderr: ${stderr}`);
  }
  console.log(`push-schema-force.ts stdout: ${stdout}`);
  
  console.log('Database initialization complete!');
  console.log('You can now run the application with: npm run dev');
});