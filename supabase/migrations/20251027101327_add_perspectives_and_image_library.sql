/*
  # Add Perspectives and Image Library Tables

  ## Overview
  Adds two new tables to support framework document management (perspectives) and image library management.

  ## New Tables

  ### `perspectives`
  - `id` (uuid, primary key) - Unique perspective document identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `title` (text) - Document title/name
  - `category` (text) - Document category (human-rights, sdg, sector, organizational, policy, other)
  - `description` (text) - Document description
  - `tags` (text[]) - Array of tags for categorization
  - `file_name` (text) - Original file name
  - `file_type` (text) - File MIME type
  - `file_url` (text) - File storage URL
  - `file_size` (bigint) - File size in bytes
  - `linked_projects` (text[]) - Array of project IDs linked to this perspective
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `image_library`
  - `id` (uuid, primary key) - Unique image identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `file_name` (text) - Original file name
  - `alt_text` (text) - Alt text for accessibility
  - `caption` (text) - Image caption
  - `image_type` (text) - Image type (profile, banner, event, general, other)
  - `copyright_info` (text) - Copyright information
  - `tags` (text[]) - Array of tags
  - `width` (integer) - Image width in pixels
  - `height` (integer) - Image height in pixels
  - `file_size` (bigint) - File size in bytes
  - `file_url` (text) - File storage URL
  - `linked_projects` (text[]) - Array of project IDs linked to this image
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated users to manage their own organization's data
*/

-- Create perspectives table
CREATE TABLE IF NOT EXISTS perspectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text DEFAULT 'other',
  description text,
  tags text[] DEFAULT '{}',
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  linked_projects text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create image_library table
CREATE TABLE IF NOT EXISTS image_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  alt_text text,
  caption text,
  image_type text DEFAULT 'general',
  copyright_info text,
  tags text[] DEFAULT '{}',
  width integer NOT NULL,
  height integer NOT NULL,
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  linked_projects text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE perspectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_library ENABLE ROW LEVEL SECURITY;

-- Create policies for perspectives
CREATE POLICY "Users can view own organization perspectives"
  ON perspectives
  FOR SELECT
  TO authenticated
  USING (auth.uid() = org_id);

CREATE POLICY "Users can insert own organization perspectives"
  ON perspectives
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can update own organization perspectives"
  ON perspectives
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = org_id)
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can delete own organization perspectives"
  ON perspectives
  FOR DELETE
  TO authenticated
  USING (auth.uid() = org_id);

-- Create policies for image_library
CREATE POLICY "Users can view own organization images"
  ON image_library
  FOR SELECT
  TO authenticated
  USING (auth.uid() = org_id);

CREATE POLICY "Users can insert own organization images"
  ON image_library
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can update own organization images"
  ON image_library
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = org_id)
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can delete own organization images"
  ON image_library
  FOR DELETE
  TO authenticated
  USING (auth.uid() = org_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_perspectives_org_id ON perspectives(org_id);
CREATE INDEX IF NOT EXISTS idx_perspectives_category ON perspectives(category);
CREATE INDEX IF NOT EXISTS idx_perspectives_created_at ON perspectives(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_image_library_org_id ON image_library(org_id);
CREATE INDEX IF NOT EXISTS idx_image_library_image_type ON image_library(image_type);
CREATE INDEX IF NOT EXISTS idx_image_library_created_at ON image_library(created_at DESC);
