# Skill Endorsement System

## Overview

The Skill Endorsement System allows developers to showcase their skills on their profiles and receive endorsements from other community members, building trust and credibility within the DevConnect platform.

## Features

- ✅ Add/remove skills to your profile
- ✅ Endorse skills of other developers
- ✅ View endorsement counts for each skill
- ✅ Prevent self-endorsements
- ✅ One endorsement per skill per user
- ✅ Real-time updates using TanStack Query

## Database Schema

### Tables

#### Skills Table
Stores user skills with unique constraint to prevent duplicate skills per user.

```sql
CREATE TABLE Skills (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);
```

#### SkillEndorsements Table
Tracks endorsements with unique constraint to prevent multiple endorsements.

```sql
CREATE TABLE SkillEndorsements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  skill_id BIGINT NOT NULL REFERENCES Skills(id) ON DELETE CASCADE,
  endorser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(skill_id, endorser_id)
);
```

### Relationships

- **Users** → **Skills** (1:N) - A user can have multiple skills
- **Skills** → **SkillEndorsements** (1:N) - A skill can have multiple endorsements
- **Users** → **SkillEndorsements** (1:N) - A user can endorse multiple skills

### Security

Row Level Security (RLS) policies ensure:
- Anyone can view skills and endorsements
- Users can only add/delete their own skills
- Users can only endorse others' skills (not their own)
- Users can remove their own endorsements

## Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# File: database-schema-skills.sql
```

This will create:
- Skills table
- SkillEndorsements table
- Indexes for performance
- RLS policies for security

### 2. Verify Tables

In Supabase Dashboard:
1. Go to Table Editor
2. Verify `Skills` and `SkillEndorsements` tables exist
3. Check that RLS is enabled on both tables

### 3. Test the Feature

1. Navigate to your profile at `/profile`
2. Click "Add Skill" to add a new skill
3. Visit another user's profile to endorse their skills
4. Click the thumbs-up icon to endorse/un-endorse

## Component Architecture

### SkillsSection Component

Main component for displaying and managing skills.

**Props:**
- `userId: string` - The profile owner's user ID
- `currentUserId?: string` - The logged-in user's ID
- `isOwnProfile: boolean` - Whether viewing own profile

**Features:**
- Add new skills (own profile only)
- Delete skills (own profile only)
- Endorse/un-endorse skills (other profiles only)
- Real-time endorsement counts

### Custom Hooks

#### useUserSkills(userId, currentUserId)
Fetches skills for a user with endorsement data.

**Returns:**
- Array of skills with endorsement counts
- Whether current user has endorsed each skill

#### useAddSkill()
Mutation hook to add a new skill.

#### useDeleteSkill()
Mutation hook to remove a skill.

#### useEndorseSkill()
Mutation hook to endorse a skill.

#### useRemoveEndorsement()
Mutation hook to remove an endorsement.

## Usage Examples

### Adding Skills to Profile

```typescript
const { mutateAsync: addSkill } = useAddSkill();

await addSkill({
  userId: user.id,
  skillName: 'React'
});
```

### Endorsing a Skill

```typescript
const { mutateAsync: endorseSkill } = useEndorseSkill();

await endorseSkill({
  skillId: 123,
  endorserId: currentUser.id,
  profileUserId: profileOwner.id
});
```

### Fetching Skills

```typescript
const { data: skills } = useUserSkills(userId, currentUserId);

skills?.map(skill => (
  <div key={skill.id}>
    {skill.skill_name} - {skill.endorsement_count} endorsements
  </div>
));
```

## API Endpoints

All operations use Supabase client with the following patterns:

### Get User Skills
```typescript
supabase
  .from('Skills')
  .select('*')
  .eq('user_id', userId)
```

### Add Skill
```typescript
supabase
  .from('Skills')
  .insert({ user_id: userId, skill_name: skillName })
```

### Delete Skill
```typescript
supabase
  .from('Skills')
  .delete()
  .eq('id', skillId)
```

### Endorse Skill
```typescript
supabase
  .from('SkillEndorsements')
  .insert({ skill_id: skillId, endorser_id: endorserId })
```

### Remove Endorsement
```typescript
supabase
  .from('SkillEndorsements')
  .delete()
  .eq('skill_id', skillId)
  .eq('endorser_id', endorserId)
```

## TypeScript Types

```typescript
interface Skill {
  id: number;
  user_id: string;
  skill_name: string;
  created_at: string;
}

interface SkillEndorsement {
  id: number;
  skill_id: number;
  endorser_id: string;
  created_at: string;
}

interface SkillWithEndorsements extends Skill {
  endorsement_count: number;
  user_has_endorsed: boolean;
}
```

## Styling

The component uses Tailwind CSS with dark mode support:
- Skills displayed as rounded pills
- Blue highlight for endorsed skills
- Hover effects for interactive elements
- Responsive design

## Error Handling

The system handles common errors:
- Duplicate skill names (prevented by unique constraint)
- Self-endorsement attempts (prevented by RLS policy)
- Multiple endorsements (prevented by unique constraint)
- Unauthorized operations (handled by RLS)

## Performance Optimizations

- Indexed queries on user_id and skill_id
- Optimistic updates with TanStack Query
- Efficient cache invalidation
- Batch loading of endorsement counts

## Future Enhancements

Potential improvements:
- Skill categories/tags
- Trending skills
- Skill recommendations
- Endorsement notifications
- Skill verification badges
- Export skills to resume

## Troubleshooting

### Skills not appearing
- Check RLS policies are enabled
- Verify user is authenticated
- Check browser console for errors

### Cannot endorse skills
- Ensure you're not on your own profile
- Verify you're logged in
- Check database permissions

### Duplicate skill error
- Each user can only have one instance of each skill
- Try a different skill name or variation

## Contributing

When contributing to this feature:
1. Follow existing code patterns
2. Add TypeScript types for new data structures
3. Update documentation
4. Test with multiple users
5. Verify RLS policies work correctly

## License

This feature is part of DevConnect and follows the project's MIT License.
