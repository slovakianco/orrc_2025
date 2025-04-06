import { db } from './db';

async function main() {
  try {
    console.log("Updating participants table schema...");

    // Array of columns to add if they don't exist
    const columnsToAdd = [
      {
        name: "emergencycontactname",
        type: "TEXT"
      },
      {
        name: "emergencycontactphone",
        type: "TEXT"
      },
      {
        name: "isemaparticipant",
        type: "BOOLEAN DEFAULT FALSE"
      },
      {
        name: "tshirtsize",
        type: "TEXT"
      }
    ];

    // Check for each column and add it if it doesn't exist
    for (const column of columnsToAdd) {
      // First check if the column exists
      const columnExists = await db.execute(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'participants' AND column_name = '${column.name}'
      `);

      // If column doesn't exist, add it
      if (!columnExists.rowCount) {
        console.log(`Adding column '${column.name}' to participants table...`);
        await db.execute(`
          ALTER TABLE participants 
          ADD COLUMN IF NOT EXISTS ${column.name} ${column.type}
        `);
        console.log(`Column '${column.name}' added successfully.`);
      } else {
        console.log(`Column '${column.name}' already exists, skipping.`);
      }
    }

    console.log("Participants table schema update complete!");
  } catch (error) {
    console.error("Error updating participants table schema:", error);
    process.exit(1);
  }
}

main();