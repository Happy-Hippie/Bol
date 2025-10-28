/*
  # Update Projects and Organizations Schema

  ## Overview
  Updates existing tables to add new fields for project context and Indian address format.

  ## Changes

  ### `projects` table updates
  - Add `context` (text) - Thematic background, goals, and relevance of the project

  ### `organizations` table updates
  - Add `address_line1` (text) - First line of address (Flat/House No., Building Name)
  - Add `address_line2` (text) - Second line of address (Street, Area/Locality)
  - Add `city` (text) - City name
  - Add `state` (text) - Indian state or UT
  - Add `pin_code` (text) - 6-digit PIN code

  ## Notes
  - Uses IF NOT EXISTS checks to prevent errors if columns already exist
  - Maintains backward compatibility
*/

-- Add context field to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'context'
  ) THEN
    ALTER TABLE projects ADD COLUMN context text;
  END IF;
END $$;

-- Add Indian address fields to organizations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'address_line1'
  ) THEN
    ALTER TABLE organizations ADD COLUMN address_line1 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'address_line2'
  ) THEN
    ALTER TABLE organizations ADD COLUMN address_line2 text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'city'
  ) THEN
    ALTER TABLE organizations ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'state'
  ) THEN
    ALTER TABLE organizations ADD COLUMN state text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'pin_code'
  ) THEN
    ALTER TABLE organizations ADD COLUMN pin_code text;
  END IF;
END $$;

-- Add category field to context_library table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'context_library' AND column_name = 'category'
  ) THEN
    ALTER TABLE context_library ADD COLUMN category text DEFAULT 'other';
  END IF;
END $$;
