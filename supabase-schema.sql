-- SQL commands to create tables in Supabase

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  email TEXT,
  "isAdmin" BOOLEAN DEFAULT FALSE
);

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

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  "questionRo" TEXT NOT NULL,
  "questionFr" TEXT NOT NULL,
  "questionDe" TEXT NOT NULL,
  answer TEXT NOT NULL,
  "answerRo" TEXT NOT NULL,
  "answerFr" TEXT NOT NULL,
  "answerDe" TEXT NOT NULL,
  order_index INTEGER NOT NULL
);

-- Create program_events table
CREATE TABLE IF NOT EXISTS program_events (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT,
  title TEXT NOT NULL,
  "titleRo" TEXT NOT NULL,
  "titleFr" TEXT NOT NULL,
  "titleDe" TEXT NOT NULL,
  description TEXT NOT NULL,
  "descriptionRo" TEXT NOT NULL,
  "descriptionFr" TEXT NOT NULL,
  "descriptionDe" TEXT NOT NULL,
  location TEXT NOT NULL,
  order_index INTEGER NOT NULL
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  "descriptionRo" TEXT NOT NULL,
  "descriptionFr" TEXT NOT NULL,
  "descriptionDe" TEXT NOT NULL,
  "logoPlaceholder" TEXT NOT NULL,
  website TEXT NOT NULL,
  level TEXT NOT NULL,
  order_index INTEGER NOT NULL
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