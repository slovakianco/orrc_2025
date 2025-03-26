# Database Documentation for Trail Running Competition Platform

This document provides information on how to access and manage both PostgreSQL and Supabase databases used by the Trail Running Competition platform.

## Database Overview

The application uses a hybrid storage approach:

- **Supabase:** Used for participant data storage
- **In-memory storage:** Used for other entities (races, FAQs, program events, etc.)
- **PostgreSQL:** Available as a secondary option (configured but not actively used)

## Supabase Configuration

The application uses Supabase for storing participant data. You'll need to have the following environment variables set:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key (safe to use in browser code)

### Setting up Supabase

1. Create a free Supabase account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Get your URL and anon key from the project settings
4. Set the environment variables in your development environment

### Required Tables in Supabase

For the participant functionality to work, you need to create these tables in your Supabase project:

1. `races` table:
   ```sql
   CREATE TABLE races (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     "nameRo" TEXT NOT NULL,
     "nameFr" TEXT NOT NULL,
     "nameDe" TEXT NOT NULL,
     description TEXT NOT NULL,
     "descriptionRo" TEXT NOT NULL,
     "descriptionFr" TEXT NOT NULL,
     "descriptionDe" TEXT NOT NULL,
     distance NUMERIC NOT NULL,
     elevation NUMERIC NOT NULL,
     difficulty TEXT NOT NULL,
     date TEXT NOT NULL,
     price NUMERIC NOT NULL,
     "imageUrl" TEXT,
     "raceMap" TEXT
   );
   ```

2. `participants` table:
   ```sql
   CREATE TABLE participants (
     id SERIAL PRIMARY KEY,
     "firstName" TEXT NOT NULL,
     "lastName" TEXT NOT NULL,
     email TEXT NOT NULL,
     "phoneNumber" TEXT NOT NULL,
     country TEXT NOT NULL,
     "birthDate" TEXT NOT NULL,
     "raceId" INTEGER NOT NULL REFERENCES races(id),
     "bibNumber" TEXT,
     status TEXT NOT NULL DEFAULT 'pending',
     "medicalInfo" TEXT,
     "registrationDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     gender TEXT NOT NULL,
     age INTEGER NOT NULL
   );
   ```

### Testing Supabase Connection

You can test your Supabase connection by:

1. Running the application and checking the logs for Supabase connection status
2. Verifying tables are created correctly in the Supabase dashboard
3. Submitting a test registration form and checking if the data appears in Supabase

The application is designed to handle Supabase connection failures gracefully by falling back to in-memory storage.

## PostgreSQL Connection Information (Legacy/Alternative)

If needed, you can also configure a direct PostgreSQL connection using these environment variables:

- `DATABASE_URL`: The connection string for the database
- `PGDATABASE`: Database name
- `PGUSER`: Database user
- `PGPASSWORD`: Database password
- `PGHOST`: Database host
- `PGPORT`: Database port

## Accessing the Databases

### 1. Accessing Supabase

The easiest way to access and manage your Supabase database is through the Supabase dashboard:

1. Log in to your Supabase account
2. Select your project
3. Go to the "Table Editor" section to view and modify data
4. Use the SQL Editor to run custom queries

### 2. Using the Command Line (PostgreSQL)

You can connect to the PostgreSQL database using the `psql` command-line tool:

```bash
psql $DATABASE_URL
```

Or with individual parameters:

```bash
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE
```

When prompted, enter the password stored in `$PGPASSWORD`.

### 3. Using Database UI Tools

You can use database UI tools like:
- Supabase dashboard (recommended for Supabase)
- pgAdmin
- DBeaver
- TablePlus

Connect using the parameters from the environment variables.

## Database Schema

### Users Table

```sql
SELECT * FROM users;
```

### Races Table

```sql
SELECT * FROM races;
```

### Participants Table

```sql
SELECT * FROM participants;
```

### Contact Inquiries Table

```sql
SELECT * FROM contact_inquiries;
```

### FAQs Table

```sql
SELECT * FROM faqs;
```

### Program Events Table

```sql
SELECT * FROM program_events;
```

### Sponsors Table

```sql
SELECT * FROM sponsors;
```

## Common Database Operations

### List All Participants

```sql
SELECT * FROM participants ORDER BY id;
```

### Find Participants by Race

```sql
SELECT * FROM participants WHERE race_id = 1;
```

### Count Participants by Country

```sql
SELECT country, COUNT(*) 
FROM participants 
GROUP BY country 
ORDER BY COUNT(*) DESC;
```

### Check Registration Status

```sql
SELECT status, COUNT(*) 
FROM participants 
GROUP BY status;
```

## Database Maintenance

### Backup the Database

```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Restore from Backup

```bash
psql $DATABASE_URL < backup-file.sql
```

## Troubleshooting

### Supabase Issues

1. **"relation does not exist" errors:** This means the required tables haven't been created in your Supabase project. Create them using the SQL provided in the "Required Tables" section.

2. **Connection issues:** Verify your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct.

3. **Data not appearing:** Check the application logs. It might be using the fallback in-memory storage due to connection issues.

4. **Table permissions:** Ensure the anon/public role has proper permissions on the tables in Supabase's Auth Policies section.

### PostgreSQL Issues

1. If you encounter connection issues, verify your environment variables are correctly set.
2. Ensure the database server is running and accessible from your current network.
3. Check if there are any firewall rules blocking the connection.

## Graceful Fallback System

The application is designed to be resilient to database connection issues:

1. It first attempts to connect to Supabase for participant operations
2. If Supabase tables don't exist or connection fails, it automatically falls back to in-memory storage
3. All other data (races, FAQs, etc.) are always stored in memory regardless of database status

This ensures the application remains functional even when database services are unavailable.

## Supabase SQL Commands

Here are helpful SQL commands you can run in the Supabase SQL Editor:

### Create Required Tables

```sql
-- Create races table
CREATE TABLE IF NOT EXISTS races (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "nameRo" TEXT NOT NULL,
  "nameFr" TEXT NOT NULL,
  "nameDe" TEXT NOT NULL,
  description TEXT NOT NULL,
  "descriptionRo" TEXT NOT NULL,
  "descriptionFr" TEXT NOT NULL,
  "descriptionDe" TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  elevation NUMERIC NOT NULL,
  difficulty TEXT NOT NULL,
  date TEXT NOT NULL,
  price NUMERIC NOT NULL,
  "imageUrl" TEXT,
  "raceMap" TEXT
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  email TEXT NOT NULL,
  "phoneNumber" TEXT NOT NULL,
  country TEXT NOT NULL,
  "birthDate" TEXT NOT NULL,
  "raceId" INTEGER NOT NULL REFERENCES races(id),
  "bibNumber" TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  "medicalInfo" TEXT,
  "registrationDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gender TEXT NOT NULL,
  age INTEGER NOT NULL
);

-- Insert sample races
INSERT INTO races (name, "nameRo", "nameFr", "nameDe", description, "descriptionRo", "descriptionFr", "descriptionDe", distance, elevation, difficulty, date, price, "imageUrl")
VALUES 
('Trail Run 33K', 'Traseu 33K', 'Trail 33K', 'Trail 33K', 
 'A challenging mountain trail running through scenic forests and ridges.', 
 'Un traseu montan provocator care străbate păduri și creste pitorești.', 
 'Un sentier de montagne stimulant traversant des forêts et des crêtes pittoresques.', 
 'Ein anspruchsvoller Bergpfad, der durch malerische Wälder und Bergrücken führt.', 
 33, 1200, 'advanced', '2025-05-15', 40, '/images/race33k.jpg'),
 
('Trail Run 11K', 'Traseu 11K', 'Trail 11K', 'Trail 11K', 
 'An exciting shorter trail with beautiful mountain views.', 
 'Un traseu mai scurt, dar plin de adrenalină, cu priveliști montane superbe.', 
 'Un sentier plus court mais passionnant avec de magnifiques vues sur la montagne.', 
 'Ein aufregender kürzerer Weg mit schönen Bergblicken.', 
 11, 350, 'beginner', '2025-05-15', 30, '/images/race11k.jpg');
```

### View Tables and Data

```sql
-- View all races
SELECT * FROM races;

-- View all participants
SELECT * FROM participants;

-- View race details
SELECT * FROM races WHERE id = 1;

-- View participants for a specific race
SELECT * FROM participants WHERE "raceId" = 1;

-- View participants by registration status
SELECT * FROM participants WHERE status = 'pending';
```

### Manage Table Data

```sql
-- Update race price
UPDATE races SET price = 45 WHERE id = 1;

-- Update participant status
UPDATE participants SET status = 'confirmed' WHERE id = 1;

-- Delete a participant (use with caution!)
DELETE FROM participants WHERE id = 1;
```

## Development vs. Production

- In development, the application uses a hybrid storage approach where participants are intended to be stored in Supabase and other entities are kept in memory.
- In production, the same approach is used to ensure consistency between environments.
- When Supabase tables are properly set up, participant data will persist between application restarts.
- To test the full functionality, create the required tables in your Supabase project as described above.