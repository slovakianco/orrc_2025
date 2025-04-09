-- SQL script to fix the participants table
-- This script will ensure all columns follow the lowercase naming convention
-- Run this script only once on your PostgreSQL/Supabase database

-- Step 1: Create a backup of the participants table
CREATE TABLE participants_backup AS SELECT * FROM participants;

-- Step 2: Update the participants table to ensure it has the correct column structure
-- If you already have the columns in the right format, these commands won't change anything

-- First, check if we need to add missing columns
DO $$
BEGIN
  -- Add tshirtsize if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'tshirtsize') THEN
    ALTER TABLE participants ADD COLUMN tshirtsize TEXT;
  END IF;

  -- Add emergencycontactname if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'emergencycontactname') THEN
    ALTER TABLE participants ADD COLUMN emergencycontactname TEXT;
  END IF;

  -- Add emergencycontactphone if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'emergencycontactphone') THEN
    ALTER TABLE participants ADD COLUMN emergencycontactphone TEXT;
  END IF;

  -- Add isemaparticipant if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'isemaparticipant') THEN
    ALTER TABLE participants ADD COLUMN isemaparticipant BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Step 3: Fix any inconsistent column names or capitalization issues
-- We'll try to rename columns if they exist with different capitalization
DO $$
BEGIN
  -- Check if RaceId exists instead of raceid
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'raceid') THEN
    -- Column already has correct name, do nothing
    RAISE NOTICE 'raceid column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'raceid') THEN
    ALTER TABLE participants RENAME COLUMN "raceid" TO raceid;
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'raceid') THEN
    ALTER TABLE participants RENAME COLUMN "RaceId" TO raceid;
  END IF;
  
  -- Similar checks for other important columns
  -- firstname to firstname
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'firstname') THEN
    RAISE NOTICE 'firstname column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'firstname') THEN
    ALTER TABLE participants RENAME COLUMN "firstname" TO firstname;
  END IF;
  
  -- lastname to lastname
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'lastname') THEN
    RAISE NOTICE 'lastname column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'lastname') THEN
    ALTER TABLE participants RENAME COLUMN "lastname" TO lastname;
  END IF;
  
  -- phoneNumber to phonenumber
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'phonenumber') THEN
    RAISE NOTICE 'phonenumber column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'phoneNumber') THEN
    ALTER TABLE participants RENAME COLUMN "phoneNumber" TO phonenumber;
  END IF;
  
  -- birthDate to birthdate
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'birthdate') THEN
    RAISE NOTICE 'birthdate column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'birthDate') THEN
    ALTER TABLE participants RENAME COLUMN "birthDate" TO birthdate;
  END IF;
  
  -- bibNumber to bibnumber
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'bibnumber') THEN
    RAISE NOTICE 'bibnumber column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'bibNumber') THEN
    ALTER TABLE participants RENAME COLUMN "bibNumber" TO bibnumber;
  END IF;
  
  -- medicalInfo to medicalinfo
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'medicalinfo') THEN
    RAISE NOTICE 'medicalinfo column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'medicalInfo') THEN
    ALTER TABLE participants RENAME COLUMN "medicalInfo" TO medicalinfo;
  END IF;
  
  -- registrationDate to registrationdate
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'registrationdate') THEN
    RAISE NOTICE 'registrationdate column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'registrationDate') THEN
    ALTER TABLE participants RENAME COLUMN "registrationDate" TO registrationdate;
  END IF;
  
  -- emergencyContactName to emergencycontactname
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'emergencycontactname') THEN
    RAISE NOTICE 'emergencycontactname column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'emergencyContactName') THEN
    ALTER TABLE participants RENAME COLUMN "emergencyContactName" TO emergencycontactname;
  END IF;
  
  -- emergencyContactPhone to emergencycontactphone
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'emergencycontactphone') THEN
    RAISE NOTICE 'emergencycontactphone column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'emergencyContactPhone') THEN
    ALTER TABLE participants RENAME COLUMN "emergencyContactPhone" TO emergencycontactphone;
  END IF;
  
  -- isEmaParticipant to isemaparticipant
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'isemaparticipant') THEN
    RAISE NOTICE 'isemaparticipant column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'isEmaParticipant') THEN
    ALTER TABLE participants RENAME COLUMN "isEmaParticipant" TO isemaparticipant;
  END IF;
  
  -- tshirtSize to tshirtsize
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'tshirtsize') THEN
    RAISE NOTICE 'tshirtsize column already exists with correct lowercase name';
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'participants' AND column_name = 'tshirtSize') THEN
    ALTER TABLE participants RENAME COLUMN "tshirtSize" TO tshirtsize;
  END IF;
END $$;

-- Final step: Confirm the structure is now correct
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'participants'
ORDER BY ordinal_position;