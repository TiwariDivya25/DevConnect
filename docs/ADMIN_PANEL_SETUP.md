# Admin Panel Setup Guide

## Overview

The Admin Panel is a comprehensive moderation system for managing community posts before they go live. This document provides setup instructions and usage guidelines.

## Features

- ✅ Role-based access control (Admin/Moderator)
- ✅ Post status management (Pending/Approved/Rejected)
- ✅ Bulk moderation actions
- ✅ Search and filter capabilities
- ✅ Detailed rejection reasons
- ✅ Activity logging and audit trail
- ✅ Real-time post statistics dashboard
- ✅ Responsive UI with dark theme

## Database Setup

### 1. Run the Migration Script

Execute the SQL migration to set up admin functionality:

```bash
# In Supabase SQL Editor, run:
database-schema-migration.sql
```

This will create:
- `role` column in `Profiles` table
- `status` column in `Posts` table
- `AdminActions` table for audit logging
- Necessary indexes and RLS policies

### 2. Make a User an Admin

To promote a user to admin status:

```sql
-- Update user role to admin
UPDATE Profiles
SET role = 'admin'
WHERE id = 'user-uuid-here';

-- Or for moderator role
UPDATE Profiles
SET role = 'moderator'
WHERE id = 'user-uuid-here';
```

**Find your user UUID:**
```sql
SELECT id, full_name FROM Profiles WHERE full_name LIKE '%your_name%';
```

## File Structure

```
src/
├── components/
│   ├── AdminRoute.tsx              # Protected admin route wrapper
│   └── AdminPostManagement.tsx     # Post management interface
├── pages/
│   └── AdminDashboardPage.tsx      # Main admin dashboard
├── types/
│   └── admin.ts                    # Admin-related TypeScript types
└── utils/
    └── adminApi.ts                 # Admin API functions

Database/
├── admin-schema-migration.sql      # Database schema updates
└── database-schema-messaging.sql   # Full schema reference
```

## API Functions

The admin system provides these key functions:

### Post Management

```typescript
// Fetch pending posts for review
await fetchPendingPosts(): Promise<PostWithAuthor[]>

// Fetch all posts (admin view)
await fetchAllPostsForAdmin(): Promise<PostWithAuthor[]>

// Approve a post
await approvePost(postId: number): Promise<void>

// Reject a post with reason
await rejectPost(postId: number, reason: string): Promise<void>

// Delete a post
await deletePost(postId: number): Promise<void>

// Bulk approve posts
await bulkApprovePosts(postIds: number[]): Promise<void>

// Bulk reject posts
await bulkRejectPosts(postIds: number[], reason: string): Promise<void>
```

### Statistics & Monitoring

```typescript
// Get moderation statistics
await fetchModerationStats(): Promise<PostModerationStats>

// Fetch admin activity log
await fetchAdminActions(limit: number): Promise<AdminAction[]>

// Check if user is admin
await isUserAdmin(userId: string): Promise<boolean>

// Get user role
await getCurrentUserRole(userId: string): Promise<string | null>
```

## Routes

### Protected Admin Routes

- `/admin` - Main admin dashboard (requires admin/moderator role)

### Components Used

- `<AdminRoute>` - Wrapper component for protected admin routes
- `<AdminPostManagement>` - Post moderation interface
- `<AdminDashboardPage>` - Full dashboard page

## Usage Guide

### Accessing the Admin Panel

1. Only users with `admin` or `moderator` role can access `/admin`
2. A shield icon (⚔️) in the navbar links to the admin panel
3. Non-admin users are redirected to home page

### Managing Posts

#### Review Posts

1. Navigate to Admin Dashboard → Post Management tab
2. View pending posts with full content and images
3. Click the eye icon to expand post details

#### Approve a Post

1. Click "Approve" button on a pending post
2. Post status changes to "approved"
3. Post becomes visible to all users

#### Reject a Post

1. Click "Reject" button on a pending post
2. Enter rejection reason in the modal
3. Reason is displayed to post author
4. Post status changes to "rejected"

#### Delete a Post

1. Click "Delete" button to permanently remove a post
2. Action is logged in the admin activity log

#### Bulk Actions

1. Select multiple posts using checkboxes
2. Click "Approve All" or "Delete All" buttons
3. All selected posts are updated simultaneously

### Filtering & Search

- **Search:** Filter by title, content, or author name
- **Status Filter:** View pending, approved, or rejected posts
- **Statistics:** Dashboard shows real-time post counts

## Post Lifecycle

```
User Creates Post
        ↓
    PENDING (awaiting admin review)
        ↓
    ┌───┴───┐
    ↓       ↓
APPROVED  REJECTED
    ↓       ↓
 VISIBLE   HIDDEN
```

## Security Features

### Row Level Security (RLS)

- Users can only view approved posts
- Post authors can view their own posts (any status)
- Admins can view all posts
- Only admins can update post status

### Audit Logging

All moderation actions are logged:
- Who performed the action (admin_id)
- What action was taken (approve/reject/delete)
- When it was performed (timestamp)
- Why it was performed (reason/rejection_reason)

### Authentication

- Admin route checks role before granting access
- Session-based authentication via Supabase
- Automatic redirect for unauthorized access

## Post Status Flow

### Pending (⏳ Yellow)
- New posts awaiting review
- Not visible to regular users
- Author can view their own post

### Approved (✅ Green)
- Post has been reviewed and accepted
- Visible to all users
- Can be searched and shared

### Rejected (❌ Red)
- Post does not meet quality standards
- Only visible to post author and admins
- Shows rejection reason to author

## Moderation Best Practices

1. **Be Consistent:** Apply same standards to all posts
2. **Provide Feedback:** Always include rejection reasons
3. **Be Fair:** Consider context before rejecting
4. **Document:** Use the activity log as reference
5. **Communicate:** Inform authors of decisions
6. **Quality Over Quantity:** It's better to review fewer posts carefully

## Common Rejection Reasons

- "Does not follow community guidelines"
- "Contains spam or promotional content"
- "Low quality or incomplete content"
- "Off-topic for this community"
- "Missing or broken images"
- "Inappropriate language or content"
- "Duplicate post already published"

## Troubleshooting

### Can't access admin panel?

1. Check user role:
   ```sql
   SELECT role FROM Profiles WHERE id = auth.uid();
   ```

2. Ensure role is 'admin' or 'moderator'

3. Clear browser cache and refresh

### Posts not appearing in pending queue?

1. Check posts have `status = 'pending'` in database
2. Verify RLS policies are enabled
3. Check user has admin role with correct permissions

### Bulk actions not working?

1. Ensure posts are selected
2. Check network connectivity
3. Try single action first
4. Check browser console for errors

## Admin Panel Structure

### Header
- Dashboard title and description
- Navigation tabs (Overview, Posts, Activity)

### Overview Tab
- Post statistics cards
- Moderation guidelines
- Quick action buttons

### Post Management Tab
- Search bar and filters
- Statistics dashboard
- Post list with inline actions
- Expandable post details
- Rejection reason modal

### Activity Log Tab
- Coming soon: Detailed admin activity history
- Filter by action type and date range

## Performance Optimization

- Posts are auto-refreshed every 30 seconds
- Search and filtering are client-side optimized
- Bulk actions reduce API calls
- Indexes on status column for fast queries

## Future Enhancements

- [ ] Batch scheduling for bulk approvals
- [ ] Post flagging by community members
- [ ] Appeal system for rejected posts
- [ ] Analytics dashboard
- [ ] Custom moderation rules
- [ ] Team collaboration features
- [ ] Automated post categorization
- [ ] AI-powered content filtering

## Support

For issues or questions about the admin panel:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Supabase logs for database errors
4. Verify RLS policies and permissions

## Database Schema Reference

### Profiles Table
```sql
ALTER TABLE Profiles ADD role TEXT DEFAULT 'user';
-- Values: 'user', 'admin', 'moderator'
```

### Posts Table
```sql
ALTER TABLE Posts ADD status TEXT DEFAULT 'pending';
ALTER TABLE Posts ADD rejection_reason TEXT;
ALTER TABLE Posts ADD reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE Posts ADD reviewed_at TIMESTAMP;
-- status Values: 'pending', 'approved', 'rejected'
```

### AdminActions Table
```sql
CREATE TABLE AdminActions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT, -- 'approve', 'reject', 'delete', 'edit'
  target_type TEXT, -- 'post', 'comment', 'community'
  target_id BIGINT,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Version History

- **v1.0** - Initial admin panel release
  - Post moderation (approve/reject/delete)
  - Bulk actions
  - Search and filtering
  - Statistics dashboard
