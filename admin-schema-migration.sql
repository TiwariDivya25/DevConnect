-- Admin Panel Database Schema Migration
-- Add admin functionality and post moderation system
-- Run this script to enable the admin features

-- 1. Add role column to Profiles table for admin designation
ALTER TABLE Profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));

-- 2. Add status column to Posts table for moderation workflow
ALTER TABLE Posts
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- 3. Add admin-related metadata to Posts table
ALTER TABLE Posts
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE Posts
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE Posts
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- 4. Create index for better query performance on post status
CREATE INDEX IF NOT EXISTS idx_posts_status ON Posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_reviewed_at ON Posts(reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_reviewed_by ON Posts(reviewed_by);

-- 5. Create AdminActions table to track moderation activities
CREATE TABLE IF NOT EXISTS AdminActions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('approve', 'reject', 'delete', 'edit')),
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'community')),
  target_id BIGINT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON AdminActions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON AdminActions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON AdminActions(created_at DESC);

-- 6. Enable RLS on AdminActions
ALTER TABLE AdminActions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for AdminActions
CREATE POLICY IF NOT EXISTS "Only admins can view admin actions" ON AdminActions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM Profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY IF NOT EXISTS "Only admins can create admin actions" ON AdminActions
  FOR INSERT WITH CHECK (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM Profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 8. Update Posts RLS policies to account for moderation
-- Drop existing policies if they exist (be careful with this in production)
-- ALTER TABLE Posts DROP POLICY IF EXISTS "Everyone can view published posts" ON Posts;

-- Create new comprehensive RLS policy for Posts
CREATE POLICY IF NOT EXISTS "Posts are viewable based on status" ON Posts
  FOR SELECT USING (
    status = 'approved' OR
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM Profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

CREATE POLICY IF NOT EXISTS "Users can create posts with pending status" ON Posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own posts" ON Posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can update post status" ON Posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM Profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 9. Update Profiles RLS to allow admins to view all profiles
-- This is a permissive policy added to existing ones
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON Profiles
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM Profiles
      WHERE id = auth.uid() AND role IN ('admin', 'moderator')
    )
  );

-- 10. Create a view for pending posts (convenience view for admin panel)
CREATE OR REPLACE VIEW pending_posts AS
SELECT 
  p.id,
  p.title,
  p.content,
  p.image_url,
  p.avatar_url,
  p.user_id,
  p.community_id,
  p.created_at,
  p.updated_at,
  p.status,
  p.rejection_reason,
  p.reviewed_by,
  p.reviewed_at,
  prof.full_name AS author_name,
  c.name AS community_name
FROM Posts p
LEFT JOIN Profiles prof ON p.user_id = prof.id
LEFT JOIN Communities c ON p.community_id = c.id
WHERE p.status = 'pending'
ORDER BY p.created_at ASC;

-- Grant permissions (if using role-based access)
-- GRANT SELECT ON pending_posts TO authenticated;

-- 11. Create audit function to log all post status changes
CREATE OR REPLACE FUNCTION log_post_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO AdminActions (admin_id, action_type, target_type, target_id, reason)
    VALUES (
      auth.uid(),
      CASE 
        WHEN NEW.status = 'approved' THEN 'approve'
        WHEN NEW.status = 'rejected' THEN 'reject'
        ELSE 'edit'
      END,
      'post',
      NEW.id,
      NEW.rejection_reason
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for post status changes
DROP TRIGGER IF EXISTS trigger_log_post_status_change ON Posts;
CREATE TRIGGER trigger_log_post_status_change
  AFTER UPDATE ON Posts
  FOR EACH ROW
  EXECUTE FUNCTION log_post_status_change();
