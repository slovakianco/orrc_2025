# Database Documentation for Trail Running Competition Platform

This document provides information on how to access and manage the PostgreSQL database used by the Trail Running Competition platform.

## Database Overview

The application uses a PostgreSQL database to store:

- Participants (stored persistently in the database)
- Other data (stored in memory but managed through the same API interface)

## Database Connection Information

The database connection information is stored in environment variables:

- `DATABASE_URL`: The connection string for the database
- `PGDATABASE`: Database name
- `PGUSER`: Database user
- `PGPASSWORD`: Database password
- `PGHOST`: Database host
- `PGPORT`: Database port

## Accessing the Database

### 1. Using the Command Line

You can connect to the database using the `psql` command-line tool:

```bash
psql $DATABASE_URL
```

Or with individual parameters:

```bash
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE
```

When prompted, enter the password stored in `$PGPASSWORD`.

### 2. Using Database UI Tools

You can use database UI tools like:
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

1. If you encounter connection issues, verify your environment variables are correctly set.
2. Ensure the database server is running and accessible from your current network.
3. Check if there are any firewall rules blocking the connection.

## Development vs. Production

- In development, the application uses a hybrid storage approach where participants are stored in the database and other entities are kept in memory.
- In production, the same approach is used to ensure consistency between environments.
- The database schema is automatically initialized when the application starts in both environments.