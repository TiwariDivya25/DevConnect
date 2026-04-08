# 🗄️ Database Setup Guide

## Problem
You're seeing the error: **"Could not find the table 'public.Posts' in the schema cache"**

This means your Supabase database doesn't have the required tables yet.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **pqdlainkaqyssnsxkpha**
3. Click **SQL Editor** in the left sidebar (icon looks like `</>`)
4. Click **"+ New query"** button

### Step 2: Run the Database Setup Script

1. Open the file: `complete-database-setup.sql` (in your project root)
2. **Copy ALL the contents** of that file
3. **Paste** it into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify Success

You should see a success message showing:
- ✅ "Database setup complete! All tables created successfully."
- ✅ Table count: 6
- ✅ List of all created tables

### Step 4: Set Up Storage Buckets

1. In Supabase, click **Storage** in the left sidebar
2. Click **"New bucket"**
3. Create these 3 buckets:

   **Bucket 1: post-images**
   - Name: `post-images`
   - Public bucket: ✅ **YES** (toggle ON)
   - Click "Create bucket"

   **Bucket 2: event-images**
   - Name: `event-images`
   - Public bucket: ✅ **YES** (toggle ON)
   - Click "Create bucket"

   **Bucket 3: message-files**
   - Name: `message-files`
   - Public bucket: ❌ **NO** (keep private)
   - Click "Create bucket"

### Step 5: Set Storage Policies (for public buckets)

For **post-images** and **event-images** buckets:

1. Click on the bucket name
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Choose **"For full customization"**
5. Add this policy:

   **Policy name**: `Public Access`
   
   **Allowed operation**: SELECT
   
   **Policy definition**:
   ```sql
   true
   ```
   
6. Click **"Review"** then **"Save policy"**

7. Add another policy for INSERT (so users can upload):
   
   **Policy name**: `Authenticated users can upload`
   
   **Allowed operation**: INSERT
   
   **Policy definition**:
   ```sql
   auth.role() = 'authenticated'
   ```

### Step 6: Refresh Your App

1. Go back to your browser with DevConnect open
2. Press **Ctrl+R** to refresh the page
3. Try clicking "My Posts" again - it should work now! 🎉

---

## 📋 What Tables Were Created?

1. **Communities** - For developer communities
2. **Posts** - For user posts (this fixes your error!)
3. **Comments** - For post comments
4. **Votes** - For post likes/upvotes
5. **Events** - For community events
6. **EventAttendees** - For event registrations

All tables include:
- ✅ Proper indexes for performance
- ✅ Row Level Security (RLS) enabled
- ✅ Security policies configured
- ✅ Foreign key relationships

---

## 🐛 Troubleshooting

### "relation already exists" error
- This is fine! It means some tables were already created
- The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times

### "permission denied" error
- Make sure you're logged into the correct Supabase project
- Check that you have admin access to the project

### Still seeing "table not found" error
- Make sure you ran the SQL in the correct project
- Try refreshing the page (Ctrl+R)
- Check the table was created: Go to **Table Editor** in Supabase

### Images not showing
- Make sure you created the storage buckets (Step 4)
- Make sure `post-images` bucket is **public**
- Make sure storage policies are set (Step 5)

---

## 🎯 After Setup Checklist

- ✅ All 6 tables created in Supabase
- ✅ 3 storage buckets created (post-images, event-images, message-files)
- ✅ Storage policies configured for public buckets
- ✅ App refreshed and working
- ✅ "My Posts" section loads without errors
- ✅ Images display correctly

---

## 📚 Additional Resources

- [Supabase Table Editor](https://supabase.com/docs/guides/database/tables)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Check the main `GITHUB_AUTH_SETUP.md` file or the DevConnect repository issues.
