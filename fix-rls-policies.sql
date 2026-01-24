-- Fix RLS Policies for GlobalSearch and Public Viewing
-- Run this in your Supabase SQL Editor

-- ============================================
-- FIX PROFILES TABLE RLS
-- ============================================

-- Drop the restrictive policy that only allows users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON Profiles;

-- Create a new policy that allows everyone to view all profiles (for search and discovery)
CREATE POLICY "Profiles are viewable by everyone" ON Profiles
  FOR SELECT USING (true);

-- Keep the update and insert policies (users can only edit their own profile)
-- These should already exist, but here they are for reference:
-- CREATE POLICY "Users can update own profile" ON Profiles
--   FOR UPDATE USING (auth.uid() = id);
-- CREATE POLICY "Users can insert own profile" ON Profiles
--   FOR INSERT WITH CHECK (auth.uid() = id);


-- ============================================
-- VERIFY COMMUNITIES TABLE RLS (Should already be correct)
-- ============================================

-- Communities should already have this policy:
-- CREATE POLICY "Communities are viewable by everyone" ON Communities
--   FOR SELECT USING (true);

-- If not, uncomment and run:
-- DROP POLICY IF EXISTS "Communities are viewable by everyone" ON Communities;
-- CREATE POLICY "Communities are viewable by everyone" ON Communities
--   FOR SELECT USING (true);


-- ============================================
-- FIX POSTS TABLE RLS (if you have Posts table)
-- ============================================

-- Check if Posts table exists and has RLS enabled
-- If yes, make sure it has a public view policy:

-- DROP POLICY IF EXISTS "Posts are viewable by everyone" ON Posts;
-- CREATE POLICY "Posts are viewable by everyone" ON Posts
--   FOR SELECT USING (true);


-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- After running the above, test these queries in SQL Editor:

-- 1. Check if you can see all profiles:
SELECT id, full_name, avatar_url FROM Profiles LIMIT 5;

-- 2. Check if you can see all communities:
SELECT id, name, description FROM Communities LIMIT 5;

-- 3. Check if you can see all posts (if Posts table exists):
-- SELECT id, title, content FROM Posts LIMIT 5;


-- ============================================
-- NOTES
-- ============================================

-- This change allows:
-- ✅ GlobalSearch to find and display all users
-- ✅ Users to discover other developers
-- ✅ Community features to work properly
-- ✅ Profile pages to be viewable by everyone

-- Security is maintained because:
-- ✅ Users can still only UPDATE their own profile
-- ✅ Users can still only INSERT their own profile
-- ✅ Sensitive data should be in separate tables with stricter RLS

-- If you want to hide certain profile fields from public view,
-- you can modify the policy to exclude specific columns:
-- CREATE POLICY "Profiles are viewable by everyone" ON Profiles
--   FOR SELECT USING (true);
-- And then use column-level security or separate tables for sensitive data.
