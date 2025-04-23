-- Add GitHub integration fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS github_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS github_default_branch TEXT;

-- Create github_tokens table
CREATE TABLE IF NOT EXISTS github_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
