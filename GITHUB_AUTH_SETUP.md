# GitHub Authentication Setup Guide

This guide will walk you through setting up GitHub OAuth authentication for DevConnect.

## Prerequisites
- A GitHub account
- A Supabase account (free tier works fine)

---

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: DevConnect (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is fine
5. Click **"Create new project"** and wait for it to initialize (takes ~2 minutes)

---

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)
4. **Keep this page open** - you'll need these values soon!

---

## Step 3: Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the application details:

   **Application name**: `DevConnect Local` (or any name you prefer)
   
   **Homepage URL**: `http://localhost:5174`
   
   **Application description**: `DevConnect - Developer Social Platform` (optional)
   
   **Authorization callback URL**: This is **CRITICAL** - use your Supabase project URL:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_ID` with your actual Supabase project ID (from the Project URL in Step 2)
   
   Example: If your Supabase URL is `https://abcdefghijk.supabase.co`, then use:
   ```
   https://abcdefghijk.supabase.co/auth/v1/callback
   ```

5. Click **"Register application"**
6. You'll see your **Client ID** - copy this!
7. Click **"Generate a new client secret"** and copy the secret immediately (you won't see it again!)

---

## Step 4: Configure GitHub OAuth in Supabase

1. Go back to your Supabase project dashboard
2. Click **Authentication** in the left sidebar
3. Click **Providers** tab
4. Find **GitHub** in the list and toggle it **ON**
5. Paste your GitHub OAuth credentials:
   - **Client ID**: (from Step 3)
   - **Client Secret**: (from Step 3)
6. Click **"Save"**

---

## Step 5: Update Your .env File

1. Open the `.env` file in your DevConnect project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NzIwMDAsImV4cCI6MjAwNTE0ODAwMH0.example_signature_here
```

⚠️ **Important**: Do NOT add quotes around the values!

---

## Step 6: Set Up Database Tables (Required!)

Your Supabase project needs the proper database schema. Run these SQL commands in Supabase:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy and paste the SQL from the repository's README or use the provided schema files:
   - `create-votes-table.sql`
   - `database-schema-messaging.sql`
   - `fix-rls-policies.sql`

**Minimum required tables:**
- Posts
- Comments
- Communities
- Votes
- Events
- EventAttendees
- Users (auto-created by Supabase)

---

## Step 7: Set Up Storage Buckets

1. In Supabase, go to **Storage** in the left sidebar
2. Create these buckets:
   - **post-images** (make it **public**)
   - **event-images** (make it **public**)
   - **message-files** (keep it **private**)

To make a bucket public:
- Click the bucket name
- Click **"Policies"** tab
- Add a policy to allow public read access

---

## Step 8: Restart Your Development Server

1. Stop the current dev server (Ctrl+C in terminal)
2. Restart it:
```bash
npm run dev
```

3. Open `http://localhost:5174` in your browser
4. Click **"Continue with GitHub"**
5. You should be redirected to GitHub to authorize the app
6. After authorization, you'll be redirected back to DevConnect, logged in! 🎉

---

## Troubleshooting

### "Authentication is disabled in demo mode"
- Make sure your `.env` file has valid Supabase credentials
- Restart the dev server after updating `.env`
- Check that there are no typos in the URL or key

### "Invalid OAuth callback URL"
- Double-check the callback URL in your GitHub OAuth app settings
- It must match: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

### "Could not find the table in schema cache"
- You need to create the database tables (Step 6)
- Run the SQL schema files in Supabase SQL Editor

### GitHub redirects but doesn't log in
- Check your Supabase Authentication logs (Authentication → Logs)
- Verify the GitHub OAuth credentials are correct in Supabase
- Make sure Row Level Security (RLS) policies are set up correctly

---

## Production Deployment

When deploying to production (e.g., Netlify, Vercel):

1. Create a **new GitHub OAuth App** for production
2. Use your production URL as the homepage
3. Use your Supabase callback URL as the authorization callback
4. Update your production environment variables with the production credentials

---

## Security Notes

- ✅ Never commit your `.env` file to Git (it's in `.gitignore`)
- ✅ Never share your Supabase anon key publicly (though it's safe for client-side use)
- ✅ Never share your GitHub OAuth client secret
- ✅ Use different OAuth apps for development and production

---

## Need Help?

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [DevConnect Repository Issues](https://github.com/TiwariDivya25/DevConnect/issues)
