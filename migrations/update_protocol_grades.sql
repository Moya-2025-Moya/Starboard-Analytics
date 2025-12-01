-- Migration: Update protocols table to use letter grades instead of numeric scores
-- Run this SQL in your Supabase SQL Editor after backing up your data

-- Step 1: Add new grade columns
ALTER TABLE protocols
ADD COLUMN IF NOT EXISTS founding_team_grade VARCHAR(1) DEFAULT 'A',
ADD COLUMN IF NOT EXISTS vc_track_record_grade VARCHAR(1) DEFAULT 'A',
ADD COLUMN IF NOT EXISTS business_model_grade VARCHAR(1) DEFAULT 'A';

-- Step 2: Migrate data from numeric scores to grades (if you want to preserve data)
-- This maps numeric scores to letter grades:
-- 90-100 = A
-- 80-89 = B
-- 70-79 = C
-- 60-69 = D
-- 50-59 = E
-- 0-49 = F

UPDATE protocols
SET founding_team_grade = CASE
    WHEN founding_team_score >= 90 THEN 'A'
    WHEN founding_team_score >= 80 THEN 'B'
    WHEN founding_team_score >= 70 THEN 'C'
    WHEN founding_team_score >= 60 THEN 'D'
    WHEN founding_team_score >= 50 THEN 'E'
    ELSE 'F'
END
WHERE founding_team_score IS NOT NULL;

UPDATE protocols
SET vc_track_record_grade = CASE
    WHEN vc_track_record_score >= 90 THEN 'A'
    WHEN vc_track_record_score >= 80 THEN 'B'
    WHEN vc_track_record_score >= 70 THEN 'C'
    WHEN vc_track_record_score >= 60 THEN 'D'
    WHEN vc_track_record_score >= 50 THEN 'E'
    ELSE 'F'
END
WHERE vc_track_record_score IS NOT NULL;

UPDATE protocols
SET business_model_grade = CASE
    WHEN business_model_score >= 90 THEN 'A'
    WHEN business_model_score >= 80 THEN 'B'
    WHEN business_model_score >= 70 THEN 'C'
    WHEN business_model_score >= 60 THEN 'D'
    WHEN business_model_score >= 50 THEN 'E'
    ELSE 'F'
END
WHERE business_model_score IS NOT NULL;

-- Step 3: Drop old columns (CAUTION: This removes data)
-- Only run this after verifying the new grades are correct
ALTER TABLE protocols
DROP COLUMN IF EXISTS ranking_score,
DROP COLUMN IF EXISTS founding_team_score,
DROP COLUMN IF EXISTS vc_track_record_score,
DROP COLUMN IF EXISTS business_model_score,
DROP COLUMN IF EXISTS airdrop_probability,
DROP COLUMN IF EXISTS listed_days;

-- Step 4: Update indexes
DROP INDEX IF EXISTS idx_protocols_ranking;

-- Step 5: Add constraint to ensure valid grades
ALTER TABLE protocols
ADD CONSTRAINT valid_founding_team_grade CHECK (founding_team_grade IN ('A', 'B', 'C', 'D', 'E', 'F')),
ADD CONSTRAINT valid_vc_track_record_grade CHECK (vc_track_record_grade IN ('A', 'B', 'C', 'D', 'E', 'F')),
ADD CONSTRAINT valid_business_model_grade CHECK (business_model_grade IN ('A', 'B', 'C', 'D', 'E', 'F'));
