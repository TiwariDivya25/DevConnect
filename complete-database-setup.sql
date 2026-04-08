-- ============================================================
-- DEVCONNECT DATABASE SCHEMA - COMPLETE SETUP
-- ============================================================
-- Run this entire script in your Supabase SQL Editor
-- This will create all required tables for DevConnect
-- ============================================================

-- 1. COMMUNITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Communities (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Communities
ALTER TABLE Communities ENABLE ROW LEVEL SECURITY;

-- Communities policies
CREATE POLICY "Communities are viewable by everyone" ON Communities
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create communities" ON Communities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update communities" ON Communities
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- 2. POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  avatar_url TEXT,
  community_id BIGINT REFERENCES Communities(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON Posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON Posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON Posts(created_at DESC);

-- Enable RLS for Posts
ALTER TABLE Posts ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Posts are viewable by everyone" ON Posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON Posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON Posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON Posts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 3. COMMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES Posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  avatar_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id BIGINT REFERENCES Comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON Comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON Comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON Comments(parent_comment_id);

-- Enable RLS for Comments
ALTER TABLE Comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON Comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON Comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON Comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON Comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 4. VOTES TABLE (for post likes)
-- ============================================================
CREATE TABLE IF NOT EXISTS Votes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES Posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for Votes
CREATE INDEX IF NOT EXISTS idx_votes_post_id ON Votes(post_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON Votes(user_id);

-- Enable RLS for Votes
ALTER TABLE Votes ENABLE ROW LEVEL SECURITY;

-- Votes policies
CREATE POLICY "Votes are viewable by everyone" ON Votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create votes" ON Votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON Votes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 5. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS Events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  max_attendees INTEGER,
  image_url TEXT,
  tags TEXT[],
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id BIGINT REFERENCES Communities(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for Events
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON Events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_community_id ON Events(community_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON Events(event_date);

-- Enable RLS for Events
ALTER TABLE Events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON Events
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON Events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update own events" ON Events
  FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete own events" ON Events
  FOR DELETE USING (auth.uid() = organizer_id);

-- ============================================================
-- 6. EVENT ATTENDEES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS EventAttendees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create indexes for EventAttendees
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON EventAttendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON EventAttendees(user_id);

-- Enable RLS for EventAttendees
ALTER TABLE EventAttendees ENABLE ROW LEVEL SECURITY;

-- EventAttendees policies
CREATE POLICY "Event attendees are viewable by everyone" ON EventAttendees
  FOR SELECT USING (true);

CREATE POLICY "Users can register for events" ON EventAttendees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registration" ON EventAttendees
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own registration" ON EventAttendees
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT 
  'Database setup complete! All tables created successfully.' as message,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('Communities', 'Posts', 'Comments', 'Votes', 'Events', 'EventAttendees');

-- List all created tables
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('Communities', 'Posts', 'Comments', 'Votes', 'Events', 'EventAttendees')
ORDER BY table_name;
