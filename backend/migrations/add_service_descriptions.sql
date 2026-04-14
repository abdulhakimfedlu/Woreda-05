-- Migration to add description fields to services table
-- Run this SQL script in your PostgreSQL database

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS description_am TEXT;

-- Update existing services to have empty descriptions if needed
UPDATE services 
SET description = '', description_am = '' 
WHERE description IS NULL OR description_am IS NULL;