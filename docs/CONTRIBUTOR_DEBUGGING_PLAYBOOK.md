# Contributor Debugging Playbook - DevConnect

> A developer-first guide for troubleshooting common issues in DevConnect - the social platform for developers

This playbook documents common development issues, debugging workflows, and troubleshooting steps to help new and existing contributors quickly identify and fix problems while working on the project.

## Table of Contents

1. [Environment Setup Issues](#environment-setup-issues)
2. [Dependency & Version Conflicts](#dependency--version-conflicts)
3. [Frontend Debugging Checklist](#frontend-debugging-checklist)
4. [Backend/Supabase Debugging](#backendsupabase-debugging)
5. [Real-Time Features Debugging](#real-time-features-debugging)
6. [API & Network Error Diagnosis](#api--network-error-diagnosis)
7. [Authentication Issues](#authentication-issues)
8. [Database & Query Issues](#database--query-issues)
9. [Common Mistakes by New Contributors](#common-mistakes-by-new-contributors)
10. [When to Open an Issue vs Fix Locally](#when-to-open-an-issue-vs-fix-locally)

---

## Environment Setup Issues

### Problem: `npm install` fails with permission errors

**Causes:**
- Incorrect Node.js/npm installation
- Global npm packages installed with `sudo`
- Node version mismatch (requires Node 16+)

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Check Node version (should be v16+)
node --version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port already in use (5173 for Vite)

**Causes:**
- Previous dev server still running
- Another application using port 5173

**Solution (Linux/Mac):**

```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 <PID>
```

**Solution (Windows):**

```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Problem: `.env.local` file not recognized or environment variables not loading

**Causes:**
- File not created in correct location (project root)
- Environment variables not loaded
- File not ignored by git

**Solution:**

- Create `.env.local` in project root
- Verify it contains required variables:
  ```
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
- Restart development server after changes
- Check `.gitignore` - `.env.local` should be ignored

### Problem: Cannot connect to Supabase

**Causes:**
- Incorrect Supabase URL or API key
- Network issues
- Supabase project not running

**Solution:**

```bash
# Verify credentials
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Check if keys are in .env.local
cat .env.local

# Test connectivity
curl https://your-project.supabase.co/rest/v1/
```

---

## Dependency & Version Conflicts

### Problem: Different package versions breaking builds

**Solution:**

```bash
# Use exact versions from package-lock.json
npm ci  # instead of npm install

# Check for deprecated packages
npm audit

# Update specific package
npm update <package-name>
```

### Problem: React/TypeScript version mismatches

**Causes:**
- Multiple versions installed
- Incompatible peer dependencies

**Solution:**

```bash
# View dependency tree
npm ls <package-name>

# Remove duplicates
rm -rf node_modules package-lock.json
npm install
```

---

## Frontend Debugging Checklist

- [ ] Check browser console (F12 → Console tab) for JS errors
- [ ] Look for red errors or yellow warnings
- [ ] Check Network tab for failed API requests (4xx, 5xx status)
- [ ] Verify component state using React DevTools extension
- [ ] Check CSS - use browser Inspector (F12 → Elements)
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Try incognito/private mode to exclude extensions
- [ ] Check if issue is in specific browser only

### Common Frontend Issues

**Blank page or white screen:**
- Check browser console for JS errors
- Verify index.html exists in project root
- Check if build completed successfully
- Verify AuthContext is wrapping App component

**Styling not applied:**
- CSS file not imported properly
- CSS specificity issues
- Tailwind CSS classes not recognized
- Browser caching - hard refresh (Ctrl+Shift+R)

**Components not rendering:**
- Check if component is properly exported
- Verify import path is correct
- Check prop types with React DevTools
- Look for TypeScript errors in console

**React Query data not loading:**
- Check network tab for API requests
- Verify QueryClientProvider wraps app
- Check query keys and dependencies
- Look for stale query errors

---

## Backend/Supabase Debugging

### Problem: "Could not find the table in schema cache" or "relation does not exist"

**Causes:**
- Table names are case-sensitive in Supabase
- Table doesn't exist in database
- Using wrong table name

**Solution:**

```bash
# Verify correct table names (case-sensitive)
# Use: Posts, Comments, Communities, Votes, Events, EventAttendees
# Not: posts, comments, communities

# Check Supabase console for table existence
# Tables → Look for your table name
```

### Problem: Row Level Security (RLS) blocking queries

**Causes:**
- RLS policies too restrictive
- User not authenticated
- User doesn't have permission

**Solution:**

```bash
# Check RLS policies in Supabase console
# Auth → Policies

# Verify user is authenticated
console.log(user) // in your auth context

# Check query response for policy errors
# Look for "new row violates row-level security policy"
```

### Problem: Images not uploading to storage

**Causes:**
- Storage bucket not created
- Bucket not set to public
- Wrong bucket name in code
- Wrong file path

**Solution:**

```bash
# Verify buckets exist in Supabase Storage:
# - post-images (public)
# - event-images (public)
# - message-files (private)

# Check storage permissions
# Storage → Buckets → Select bucket → Policies

# Verify code uses correct bucket names
# Check file paths are correct
```

### Problem: Database migrations not running

**Causes:**
- SQL not executed
- Syntax errors in SQL
- Missing foreign key references

**Solution:**

```bash
# Run migrations in Supabase SQL editor
# SQL Editor → Paste SQL from database-schema-messaging.sql

# Check for errors in response
# Verify tables created with correct columns
```

---

## Real-Time Features Debugging

### Problem: Messages not updating in real-time

**Causes:**
- Real-time not enabled on table
- Wrong table name in subscription
- User not authenticated

**Solution:**

```bash
# Enable real-time in Supabase console
# Database → Replication → Select table → Enable

# Verify subscription channel name matches table
# Check browser console for subscription errors
```

### Problem: Typing indicators not showing

**Causes:**
- Presence subscriptions not working
- Wrong user ID in updates
- Channel not properly initialized

**Solution:**

- Verify user is authenticated
- Check browser console for presence errors
- Verify presence updates include correct user ID

---

## API & Network Error Diagnosis

### HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|---------------|
| 400  | Bad Request | Invalid request format or missing fields |
| 401  | Unauthorized | Missing or invalid authentication token |
| 403  | Forbidden | User lacks required permissions or RLS policy blocks |
| 404  | Not Found | API endpoint doesn't exist or table not found |
| 409  | Conflict | Unique constraint violation |
| 500  | Server Error | Backend error - check Supabase logs |
| 503  | Service Unavailable | Supabase down or overloaded |

### Debugging Network Issues

**Using browser DevTools:**

1. Open DevTools (F12)
2. Go to Network tab
3. Reproduce the request
4. Click on request → View headers, payload, response
5. Check Status Code and error message

**Using Supabase Client in Console:**

```javascript
// Check if supabase client is initialized
console.log(supabase)

// Test a simple query
const { data, error } = await supabase
  .from('Posts')
  .select('*')
  .limit(1)

if (error) console.error('Error:', error)
else console.log('Data:', data)
```

---

## Authentication Issues

### Problem: GitHub OAuth not working

**Causes:**
- OAuth app credentials not added to Supabase
- Callback URL doesn't match
- Browser cookies disabled

**Solution:**

```bash
# Verify GitHub OAuth setup:
# 1. GitHub Settings → Developer settings → OAuth Apps
# 2. Check Authorization callback URL = http://localhost:5173/auth/callback
# 3. Supabase Console → Auth → Providers → GitHub
# 4. Add Client ID and Client Secret
```

### Problem: User not persisting after refresh

**Causes:**
- AuthContext not checking session on mount
- localStorage not saving session
- Supabase session expired

**Solution:**

```bash
# Check AuthContext useEffect runs on mount
# Verify it checks for existing session
# Check localStorage for supabase auth token
```

### Problem: "Invalid login credentials" even with correct password

**Causes:**
- User doesn't exist
- Password hash mismatch
- Email not confirmed

**Solution:**

- Verify user exists in Supabase Auth
- Try password reset
- Check if email needs verification

---

## Database & Query Issues

### Problem: Nested comments not loading

**Causes:**
- Missing recursive query logic
- parent_comment_id not set correctly
- Wrong join conditions

**Solution:**

```bash
# Verify Comments table has parent_comment_id column
# Check that comments are properly linked with parent_comment_id
# Test query manually in Supabase SQL editor
```

### Problem: Vote counts showing as 0

**Causes:**
- Votes not being inserted
- Query not counting correctly
- User_id not matching

**Solution:**

```bash
# Check Votes table has entries
# Verify post_id and user_id match correctly
# Test COUNT query in SQL editor
```

### Problem: Event attendees not showing

**Causes:**
- EventAttendees records not created
- Wrong event_id or user_id
- RLS policies blocking reads

**Solution:**

- Verify records exist in EventAttendees table
- Check RLS policies allow reading
- Verify foreign keys are correct

---

## Common Mistakes by New Contributors

1. **Not reading the README and project docs** - Start there for setup and contribution guidelines

2. **Modifying .env file instead of .env.local** - Use `.env.local` for local changes; `.env` should not be committed

3. **Committing node_modules** - Should be in `.gitignore`

4. **Not running database migrations** - New features may need schema changes

5. **Hardcoding API URLs or credentials** - Use environment variables

6. **Ignoring linting errors** - Fix ESLint warnings before PR

7. **Not testing real-time features locally** - Always test messaging/notifications before pushing

8. **Using incorrect table names (case sensitivity)** - Tables are: Posts, Comments, Communities, not posts, comments

9. **Opening PR without assigning issue** - Get assigned to issue first

10. **Forgetting to handle loading and error states** - Use React Query's isLoading and error flags

---

## When to Open an Issue vs Fix Locally

### Open an Issue When:

- Bug cannot be reproduced locally
- Requires discussion/decision from maintainers
- Affects core architecture (authentication, real-time, etc.)
- Needs input from multiple team members
- Unclear if it's a bug or feature request
- Requires database schema changes

### Fix Locally When:

- Clear reproduction steps
- Single component/file affected
- You understand the root cause
- Fix doesn't impact other features
- You're assigned to the issue
- It's a straightforward bug fix

---

## Getting Help

1. **Check this playbook first** - Many issues are documented here
2. **Search existing issues** - Your problem might already be solved
3. **Check PR comments** - Look for discussions about your issue
4. **Ask in discussions** - Use GitHub Discussions for questions
5. **Open an issue** - If truly stuck, provide:
   - Clear reproduction steps
   - Error messages/screenshots
   - Environment info (Node version, OS, etc.)
   - What you've already tried

---

## Contributing to This Playbook

Found a bug that's not documented? Found a solution?

Please open a PR or issue to help other contributors!

**Last Updated:** January 2026
