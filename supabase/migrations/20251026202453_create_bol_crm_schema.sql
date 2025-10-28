/*
  # BOL Communications CRM Database Schema

  ## Overview
  Creates a complete database schema for BOL - a Communications CRM for NGOs and CBOs.
  Supports organization profiles, projects, funders, context library, reports, and activity tracking.

  ## New Tables
  
  ### `organizations`
  - `id` (uuid, primary key) - Links to auth.users
  - `name` (text) - Organization name
  - `description` (text) - Organization description
  - `logo_url` (text) - Logo image URL
  - `contact_email` (text) - Primary contact email
  - `contact_phone` (text) - Contact phone number
  - `website` (text) - Organization website
  - `address` (text) - Physical address
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `projects`
  - `id` (uuid, primary key) - Unique project identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `name` (text) - Project name
  - `description` (text) - Project description
  - `status` (text) - Project status (active, completed, on-hold)
  - `start_date` (date) - Project start date
  - `end_date` (date) - Project end date
  - `budget` (numeric) - Project budget
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `funders`
  - `id` (uuid, primary key) - Unique funder identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `name` (text) - Funder name
  - `contact_name` (text) - Primary contact person
  - `contact_email` (text) - Contact email
  - `logo_url` (text) - Funder logo URL
  - `relationship_status` (text) - Relationship status
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `context_library`
  - `id` (uuid, primary key) - Unique file identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `file_name` (text) - Original file name
  - `file_type` (text) - File MIME type
  - `file_url` (text) - File storage URL
  - `file_size` (integer) - File size in bytes
  - `created_at` (timestamptz) - Upload timestamp

  ### `reports`
  - `id` (uuid, primary key) - Unique report identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `title` (text) - Report title
  - `report_type` (text) - Type (annual, funder, project, custom)
  - `status` (text) - Status (draft, in-review, complete)
  - `content` (jsonb) - Report content as structured data
  - `generated_url` (text) - Generated report file URL
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `activities`
  - `id` (uuid, primary key) - Unique activity identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `activity_type` (text) - Type of activity
  - `title` (text) - Activity title
  - `description` (text) - Activity description
  - `priority` (text) - Priority level (urgent, important, normal)
  - `due_date` (timestamptz) - Due date for action items
  - `completed` (boolean) - Completion status
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Policies ensure users can only access their own organization's data
  - Authenticated users can perform all operations on their own data
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  logo_url text,
  contact_email text,
  contact_phone text,
  website text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold')),
  start_date date,
  end_date date,
  budget numeric(12, 2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create funders table
CREATE TABLE IF NOT EXISTS funders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_name text,
  contact_email text,
  logo_url text,
  relationship_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create context_library table
CREATE TABLE IF NOT EXISTS context_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  report_type text NOT NULL CHECK (report_type IN ('annual', 'funder', 'project', 'custom')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'in-review', 'complete')),
  content jsonb DEFAULT '{}'::jsonb,
  generated_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'normal' CHECK (priority IN ('urgent', 'important', 'normal')),
  due_date timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE funders ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own organization"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (org_id = auth.uid());

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (org_id = auth.uid())
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (org_id = auth.uid());

-- RLS Policies for funders
CREATE POLICY "Users can view own funders"
  ON funders FOR SELECT
  TO authenticated
  USING (org_id = auth.uid());

CREATE POLICY "Users can insert own funders"
  ON funders FOR INSERT
  TO authenticated
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can update own funders"
  ON funders FOR UPDATE
  TO authenticated
  USING (org_id = auth.uid())
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can delete own funders"
  ON funders FOR DELETE
  TO authenticated
  USING (org_id = auth.uid());

-- RLS Policies for context_library
CREATE POLICY "Users can view own files"
  ON context_library FOR SELECT
  TO authenticated
  USING (org_id = auth.uid());

CREATE POLICY "Users can insert own files"
  ON context_library FOR INSERT
  TO authenticated
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can delete own files"
  ON context_library FOR DELETE
  TO authenticated
  USING (org_id = auth.uid());

-- RLS Policies for reports
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (org_id = auth.uid());

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (org_id = auth.uid())
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can delete own reports"
  ON reports FOR DELETE
  TO authenticated
  USING (org_id = auth.uid());

-- RLS Policies for activities
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (org_id = auth.uid());

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (org_id = auth.uid())
  WITH CHECK (org_id = auth.uid());

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (org_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_funders_org_id ON funders(org_id);
CREATE INDEX IF NOT EXISTS idx_context_library_org_id ON context_library(org_id);
CREATE INDEX IF NOT EXISTS idx_reports_org_id ON reports(org_id);
CREATE INDEX IF NOT EXISTS idx_activities_org_id ON activities(org_id);
CREATE INDEX IF NOT EXISTS idx_activities_due_date ON activities(due_date) WHERE completed = false;