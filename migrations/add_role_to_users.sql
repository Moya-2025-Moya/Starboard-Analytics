-- Migration: Add role field to users table
-- Date: 2025-11-30
-- Description: Adds role column to users table for admin access control

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Add updated_at column if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name IN ('role', 'updated_at')
ORDER BY ordinal_position;
