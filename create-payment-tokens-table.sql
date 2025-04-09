-- Create payment_tokens table to store token information separately
CREATE TABLE IF NOT EXISTS payment_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    participant_id INTEGER NOT NULL REFERENCES participants(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    used BOOLEAN DEFAULT FALSE
);