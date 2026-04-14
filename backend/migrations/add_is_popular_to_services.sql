-- Migration to add isPopular field to services table
-- Run this SQL script in your PostgreSQL database

ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT FALSE;

-- Update existing services to have isPopular = false if needed
UPDATE services 
SET is_popular = FALSE 
WHERE is_popular IS NULL;