/*
  # Add Chat Conversations and Messages Tables

  ## Overview
  Adds tables to support AI chat functionality with conversation history and message storage.

  ## New Tables

  ### `chat_conversations`
  - `id` (uuid, primary key) - Unique conversation identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `title` (text) - Conversation title (auto-generated or user-defined)
  - `preview` (text) - First message preview
  - `message_count` (integer) - Number of messages in conversation
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last message timestamp

  ### `chat_messages`
  - `id` (uuid, primary key) - Unique message identifier
  - `conversation_id` (uuid, foreign key) - Links to chat_conversations
  - `role` (text) - Message role (user, assistant)
  - `content` (text) - Message content
  - `sources` (jsonb) - Source citations (documents, projects, images)
  - `feedback` (text) - User feedback (helpful, not_helpful, null)
  - `created_at` (timestamptz) - Message timestamp

  ### `chat_settings`
  - `id` (uuid, primary key) - Unique settings identifier
  - `org_id` (uuid, foreign key) - Links to organizations
  - `response_length` (text) - Response length preference (concise, detailed, comprehensive)
  - `show_sources` (boolean) - Show source citations
  - `include_visuals` (boolean) - Include visual content
  - `save_history` (boolean) - Save conversation history
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own organization's data
*/

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  preview text,
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  sources jsonb DEFAULT '[]',
  feedback text CHECK (feedback IN ('helpful', 'not_helpful', NULL)),
  created_at timestamptz DEFAULT now()
);

-- Create chat_settings table
CREATE TABLE IF NOT EXISTS chat_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL UNIQUE,
  response_length text DEFAULT 'detailed' CHECK (response_length IN ('concise', 'detailed', 'comprehensive')),
  show_sources boolean DEFAULT true,
  include_visuals boolean DEFAULT true,
  save_history boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_conversations
CREATE POLICY "Users can view own organization conversations"
  ON chat_conversations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = org_id);

CREATE POLICY "Users can insert own organization conversations"
  ON chat_conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can update own organization conversations"
  ON chat_conversations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = org_id)
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can delete own organization conversations"
  ON chat_conversations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = org_id);

-- Create policies for chat_messages
CREATE POLICY "Users can view messages from own conversations"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.org_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own conversations"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.org_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in own conversations"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.org_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.org_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from own conversations"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND chat_conversations.org_id = auth.uid()
    )
  );

-- Create policies for chat_settings
CREATE POLICY "Users can view own organization settings"
  ON chat_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = org_id);

CREATE POLICY "Users can insert own organization settings"
  ON chat_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Users can update own organization settings"
  ON chat_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = org_id)
  WITH CHECK (auth.uid() = org_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_org_id ON chat_conversations(org_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated_at ON chat_conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_settings_org_id ON chat_settings(org_id);

-- Create trigger to update message_count in conversations
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_conversations
    SET message_count = message_count + 1,
        updated_at = NEW.created_at
    WHERE id = NEW.conversation_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chat_conversations
    SET message_count = GREATEST(message_count - 1, 0),
        updated_at = now()
    WHERE id = OLD.conversation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_message_count
AFTER INSERT OR DELETE ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_message_count();
