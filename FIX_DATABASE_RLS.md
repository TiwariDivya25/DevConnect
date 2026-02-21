# How to Fix Database Connection and Show Real Data

## 🔴 **Problem Identified**

Your database has **Row Level Security (RLS)** policies that are too restrictive:

1. **Profiles Table:** Only allows users to see their **own** profile
2. This prevents:
   - GlobalSearch from finding other users
   - Community features from showing member profiles
   - Profile discovery features

## ✅ **Solution: Update RLS Policies**

### **Step 1: Open Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project: `pqdlainkaqyssnsxkpha`
3. Click on **SQL Editor** in the left sidebar

### **Step 2: Run the Fix Script**

Copy and paste this SQL code into the SQL Editor:

```sql
-- Fix Profiles RLS to allow public viewing
DROP POLICY IF EXISTS "Users can view own profile" ON Profiles;

CREATE POLICY "Profiles are viewable by everyone" ON Profiles
  FOR SELECT USING (true);
```

Click **Run** or press `Ctrl+Enter`

### **Step 3: Verify the Fix**

Run this query to test:

```sql
SELECT id, full_name, avatar_url FROM Profiles LIMIT 5;
```

You should see all profiles in your database (not just your own).

### **Step 4: Check Communities (Should Already Work)**

Run this query:

```sql
SELECT id, name, description FROM Communities LIMIT 5;
```

You should see all communities.

### **Step 5: Check Posts (If You Have Posts Table)**

If you have a Posts table, run:

```sql
SELECT id, title, content FROM Posts LIMIT 5;
```

If this fails with an RLS error, run:

```sql
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON Posts;

CREATE POLICY "Posts are viewable by everyone" ON Posts
  FOR SELECT USING (true);
```

---

## 🔒 **Security Notes**

### **What This Changes:**
- ✅ Everyone can **VIEW** all profiles (for discovery and search)
- ✅ Everyone can **VIEW** all communities
- ✅ Everyone can **VIEW** all posts

### **What Stays Secure:**
- 🔒 Users can only **UPDATE** their own profile
- 🔒 Users can only **DELETE** their own content
- 🔒 Users can only **CREATE** content as themselves

### **This is Standard for Social Platforms:**
- GitHub, Twitter, LinkedIn all allow viewing other profiles
- Your app is a **developer community** - discovery is essential
- Private data should be in separate tables with stricter RLS

---

## 🧪 **After Fixing, Test Your App**

1. **Refresh your browser:** http://localhost:5174/
2. **Test GlobalSearch:**
   - Search for users by name
   - Search for communities
3. **Check Posts Page:**
   - Should show all posts from database
4. **Check Communities Page:**
   - Should show all communities

---

## 📊 **Alternative: Quick Fix via Supabase Dashboard**

If you prefer using the UI:

1. Go to **Authentication** → **Policies**
2. Find **Profiles** table
3. Find policy: **"Users can view own profile"**
4. Click **Edit**
5. Change the policy from:
   ```sql
   auth.uid() = id
   ```
   To:
   ```sql
   true
   ```
6. Save

---

## ⚠️ **If You Still Don't See Data**

### **Check 1: Do you have data in your database?**

Run in SQL Editor:
```sql
SELECT COUNT(*) FROM Profiles;
SELECT COUNT(*) FROM Communities;
SELECT COUNT(*) FROM Posts;
```

If counts are 0, you need to add data first.

### **Check 2: Is your Supabase URL correct?**

Your `.env` file shows:
```
VITE_SUPABASE_URL=https://pqdlainkaqyssnsxkpha.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_V9wudgjtPNV1A3OtPKZSAg_UpgoiEMb
```

Verify this matches your Supabase project settings.

### **Check 3: Browser Console Errors**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors like:
   - "new row violates row-level security policy"
   - "permission denied for table"

---

## 🎯 **Expected Result**

After fixing RLS policies:

✅ GlobalSearch shows real users from your database  
✅ Communities page shows real communities  
✅ Posts page shows real posts  
✅ Profile pages are viewable by everyone  
✅ Users can still only edit their own content  

---

**Run the SQL script in Supabase SQL Editor, then refresh your app!**
