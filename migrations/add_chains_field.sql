-- Migration: Add chains field to protocols table
-- Date: 2025-11-30
-- Description: Adds chains array field to store blockchain deployment information

-- Add chains column if it doesn't exist
ALTER TABLE protocols
ADD COLUMN IF NOT EXISTS chains TEXT[] DEFAULT '{}';

-- Optional: Add sample chains to existing protocols
-- Uncomment the following lines if you want to add default chains to existing protocols
/*
UPDATE protocols
SET chains = ARRAY['Ethereum', 'BSC', 'Polygon']
WHERE chains IS NULL OR chains = '{}';
*/

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'protocols' AND column_name = 'chains';
