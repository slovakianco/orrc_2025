# Trail Running Competition Website Setup Guide

This document provides comprehensive instructions for setting up, configuring, and deploying the Trail Running Competition Website.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Database Configuration](#database-configuration)
5. [Frontend Setup](#frontend-setup)
6. [Email Configuration](#email-configuration)
7. [Development Workflow](#development-workflow)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

## Project Overview

The Trail Running Competition Website is a multilingual platform designed for managing and showcasing trail running events. It supports:

- Multiple languages (English, Romanian, French, German)
- Race information display
- Participant registration and listings
- Competition rules and program schedules
- Contact forms
- Sponsor information
- Interactive trail maps

## Prerequisites

Before starting, ensure you have:

- Node.js (v16+)
- npm or yarn
- Git
- A Supabase account (for database)
- A SendGrid account (for email notifications)

## Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd trail-running-website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the project root with the following variables:

   ```
   # PostgreSQL database connection (if using Neon.tech or other PostgreSQL provider)
   DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
   PGDATABASE=database_name
   PGUSER=database_user
   PGPASSWORD=database_password
   PGHOST=database_host
   PGPORT=database_port

   # Supabase configuration
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key

   # SendGrid configuration (for email functionality)
   SENDGRID_API_KEY=your-sendgrid-api-key
   ```

## Database Configuration

### Supabase Setup

1. **Create a Supabase project**:
   - Go to [Supabase](https://supabase.com/) and create a new project
   - Note your project URL and anon/public key

2. **Initialize database tables**:
   Run the following SQL commands in the Supabase SQL editor to create the required tables:

   ```sql
   -- Create participants table
   CREATE TABLE IF NOT EXISTS participants (
     id SERIAL PRIMARY KEY,
     firstName TEXT NOT NULL,
     lastName TEXT NOT NULL,
     email TEXT NOT NULL,
     phoneNumber TEXT NOT NULL,
     country TEXT NOT NULL,
     birthDate TEXT NOT NULL,
     raceId INTEGER NOT NULL,
     bibNumber TEXT,
     status TEXT NOT NULL DEFAULT 'pending',
     medicalInfo TEXT,
     registrationDate TIMESTAMP NOT NULL DEFAULT NOW(),
     gender TEXT NOT NULL,
     age INTEGER NOT NULL
   );

   -- Create races table
   CREATE TABLE IF NOT EXISTS races (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     nameRo TEXT NOT NULL,
     nameFr TEXT NOT NULL,
     nameDe TEXT NOT NULL,
     description TEXT NOT NULL,
     descriptionRo TEXT NOT NULL,
     descriptionFr TEXT NOT NULL,
     descriptionDe TEXT NOT NULL,
     distance INTEGER NOT NULL,
     elevation INTEGER NOT NULL,
     difficulty TEXT NOT NULL,
     date TEXT NOT NULL,
     price INTEGER NOT NULL,
     imageUrl TEXT,
     raceMap TEXT
   );

   -- Create additional tables (FAQs, program events, etc.)
   -- For more details, see the DATABASE_DOCUMENTATION.md file
   ```

3. **Verify the tables**:
   After executing the SQL commands, check that the tables have been created successfully in your Supabase dashboard.

See the `DATABASE_DOCUMENTATION.md` file for more detailed information about the database structure and sample queries.

## Frontend Setup

The frontend is built with React, TypeScript, and uses i18next for internationalization.

### Customization

1. **Update theme**:
   Edit `theme.json` to update the design theme:

   ```json
   {
     "primary": "#2E5B3E",
     "variant": "professional",
     "appearance": "light",
     "radius": 0.5
   }
   ```

2. **Configure languages**:
   The supported languages are configured in `client/src/lib/i18n.ts`:

   ```javascript
   const supportedLngs = ['en', 'ro', 'fr', 'de'];
   const defaultLng = 'en';
   ```

3. **Update translations**:
   Translations are stored in the `client/src/lib/translations` directory. Each language has its own file:
   - `en.json` (English)
   - `ro.json` (Romanian)
   - `fr.json` (French)
   - `de.json` (German)

## Email Configuration

The application uses SendGrid for sending email notifications (registration confirmations):

1. **Get a SendGrid API key**:
   - Sign up for [SendGrid](https://sendgrid.com/)
   - Create an API key with mail sending permissions
   - Add this key to your `.env` file as `SENDGRID_API_KEY`

2. **Configure email templates**:
   - Edit email templates in `server/email.ts`
   - The application supports multilingual email templates

## Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   Open your browser and navigate to `http://localhost:5000`

3. **Making changes**:
   - Frontend code is in the `client/src` directory
   - Backend code is in the `server` directory
   - Database schema is defined in `shared/schema.ts`

## Production Deployment

### Required Environment Variables

For production deployment, you must configure the following environment variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SENDGRID_API_KEY` | Your SendGrid API key (for emails) |

### Deployment Checklist

1. **Set Environment Variables**: Configure the required environment variables in your production hosting environment.

2. **Database Preparation**: Ensure your Supabase database tables are created using the SQL commands provided in the Database Configuration section.

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

### Verifying Production Setup

When your application starts in production, check the logs for:

- "Production Supabase initialized" - Indicates the production environment is detected
- "Found X participants in Supabase" - Confirms successful connection to your Supabase database

If you see errors about missing environment variables, you need to set these in your production environment.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. **Check environment variables**: Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correctly set.

2. **Verify Supabase tables**: Confirm that all required tables exist in your Supabase project.

3. **Check logs**: Look for specific error messages in your application logs.

4. **Fallback mechanism**: The application uses a hybrid storage approach and will fall back to in-memory storage if Supabase is unavailable. This ensures the application remains functional, but data won't persist between application restarts.

### Email Sending Issues

If emails are not being sent:

1. **Check SendGrid API key**: Verify that your `SENDGRID_API_KEY` is correctly set and valid.

2. **Check for rate limits**: SendGrid has rate limits for different plans.

3. **Check spam folders**: Test emails might be filtered as spam.

For more detailed troubleshooting, refer to the console logs and error messages in your application.