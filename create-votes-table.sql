-- Create Votes Table for Post Likes
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS Votes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_post_id ON Votes(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON Votes(user_id);

-- Enable Row Level Security
ALTER TABLE Votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Votes

-- Allow everyone to view votes (for displaying like counts)
CREATE POLICY "Votes are viewable by everyone" ON Votes
  FOR SELECT USING (true);

-- Allow authenticated users to create votes (like posts)
CREATE POLICY "Users can create votes" ON Votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own votes (unlike posts)
CREATE POLICY "Users can delete own votes" ON Votes
  FOR DELETE USING (auth.uid() = user_id);

-- Verify the table was created
SELECT 'Votes table created successfully!' as message;
