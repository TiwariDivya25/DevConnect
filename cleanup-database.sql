-- ============================================================
-- CLEANUP SCRIPT - Run this FIRST to remove existing tables
-- ============================================================
-- This will drop all existing tables and policies
-- Then you can run FIXED-database-setup.sql fresh
-- ============================================================

-- Drop tables in reverse order (to handle foreign key constraints)
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS community_members CASCADE;
DROP TABLE IF EXISTS communities CASCADE;

-- Also drop any PascalCase versions if they exist
DROP TABLE IF EXISTS EventAttendees CASCADE;
DROP TABLE IF EXISTS Events CASCADE;
DROP TABLE IF EXISTS Votes CASCADE;
DROP TABLE IF EXISTS Comments CASCADE;
DROP TABLE IF EXISTS Posts CASCADE;
DROP TABLE IF EXISTS Communities CASCADE;

-- Verification
SELECT 'All tables dropped successfully! Now run FIXED-database-setup.sql' as message;
