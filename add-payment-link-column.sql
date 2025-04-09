-- Add payment_link column to participants table
ALTER TABLE participants ADD COLUMN IF NOT EXISTS payment_link TEXT;

-- Add payment_link_created_at column to track when the payment link was created
ALTER TABLE participants ADD COLUMN IF NOT EXISTS payment_link_created_at TIMESTAMP;

-- Add payment_link_expires_at column to track when the payment link expires
ALTER TABLE participants ADD COLUMN IF NOT EXISTS payment_link_expires_at TIMESTAMP;

-- Add index for faster queries by payment_link
CREATE INDEX IF NOT EXISTS participants_payment_link_idx ON participants (payment_link);