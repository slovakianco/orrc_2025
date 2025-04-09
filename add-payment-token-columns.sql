-- Add payment token columns to participants table
ALTER TABLE participants ADD COLUMN IF NOT EXISTS payment_token text;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS payment_token_used boolean DEFAULT false;