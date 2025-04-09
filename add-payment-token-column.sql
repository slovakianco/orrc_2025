-- SQL script to add payment token column to participants table
ALTER TABLE participants 
ADD COLUMN payment_token TEXT DEFAULT NULL;

-- Add an index to the payment token for faster lookups
CREATE INDEX idx_participants_payment_token ON participants (payment_token);

-- Table for token tracking (optional - for more robust token management)
CREATE TABLE IF NOT EXISTS payment_tokens (
  token TEXT PRIMARY KEY,
  participant_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (participant_id) REFERENCES participants(id)
);

-- Create index on participant_id for lookups by participant
CREATE INDEX idx_payment_tokens_participant_id ON payment_tokens (participant_id);