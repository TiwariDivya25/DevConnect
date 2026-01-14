# Database Schema

This document describes the complete database schema for **DevConnect**, including all tables, relationships, constraints, and database-level logic.

---

## Authentication Tables

### Profiles Table
Stores extended user profile information including social media links and personal details.

```sql
CREATE TABLE Profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  twitter TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_full_name 
ON Profiles USING gin(full_name gin_trgm_ops);
CREATE INDEX idx_profiles_location 
ON Profiles USING gin(location gin_trgm_ops);
```

**Purpose:** Stores extended user profile information that goes beyond basic authentication data.

**Relationships:**
- `id → auth.users(id)` (1 user → 1 profile)

**Row Level Security:** Users can only view and update their own profile.

---

## Core Tables

### Posts Table
Stores all user-created posts with metadata.

```sql
CREATE TABLE Posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  avatar_url TEXT,
  community_id BIGINT REFERENCES Communities(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  like_count INTEGER DEFAULT 0
);

CREATE INDEX idx_posts_user_id ON Posts(user_id);
CREATE INDEX idx_posts_community_id ON Posts(community_id);
CREATE INDEX idx_posts_created_at ON Posts(created_at DESC);
```

**Purpose:** Main content table for all posts.

**Relationships:**
- `user_id → auth.users(id)` (1 user → many posts)
- `community_id → Communities(id)` (many posts → one community)

---

### Comments Table
Stores nested comments with parent-child relationships.

```sql
CREATE TABLE Comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES Posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  avatar_url TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id BIGINT REFERENCES Comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_parent_same_post
    FOREIGN KEY (post_id, parent_comment_id)
    REFERENCES Comments(post_id, id)
);

CREATE INDEX idx_comments_post_id ON Comments(post_id);
CREATE INDEX idx_comments_parent_id ON Comments(parent_comment_id);
CREATE INDEX idx_comments_user_id ON Comments(user_id);
```

**Purpose:** Nested comment system.

---

### Communities Table
Stores developer communities and interest groups.

```sql
CREATE TABLE Communities (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  member_count INTEGER DEFAULT 0
);

CREATE INDEX idx_communities_name 
ON Communities USING gin(name gin_trgm_ops);
```

---

### Votes Table
Tracks likes and interactions on posts.

```sql
CREATE TABLE Votes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES Posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote INTEGER DEFAULT 1 CHECK (vote IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_votes_post_id ON Votes(post_id);
CREATE INDEX idx_votes_user_id ON Votes(user_id);
```

---

## Messaging Tables

### Conversations Table
Stores chat threads (direct & group).

```sql
CREATE TABLE Conversations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  description TEXT,
  is_private BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_conversations_updated ON Conversations(updated_at DESC);
CREATE INDEX idx_conversations_type ON Conversations(type);
```

---

### ConversationParticipants Table
Many-to-many mapping of users to conversations.

```sql
CREATE TABLE ConversationParticipants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id BIGINT NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_participants_conversation ON ConversationParticipants(conversation_id);
CREATE INDEX idx_participants_user ON ConversationParticipants(user_id);
```

---

### Messages Table
Stores individual messages.

```sql
CREATE TABLE Messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id BIGINT NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  reply_to_id BIGINT REFERENCES Messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation 
ON Messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON Messages(sender_id);
CREATE INDEX idx_messages_reply ON Messages(reply_to_id);
```

---

### MessageReactions Table
Emoji reactions on messages.

```sql
CREATE TABLE MessageReactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_id BIGINT NOT NULL REFERENCES Messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(message_id, user_id, emoji)
);

CREATE INDEX idx_reactions_message ON MessageReactions(message_id);
CREATE INDEX idx_reactions_user ON MessageReactions(user_id);
```

---

### UserPresence Table
Tracks real-time user presence.

```sql
CREATE TABLE UserPresence (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'offline' 
    CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

CREATE INDEX idx_presence_status ON UserPresence(status);
CREATE INDEX idx_presence_last_seen ON UserPresence(last_seen);
```

---

## Storage Tables

### PostImages Table
Supports multiple images per post.

```sql
CREATE TABLE PostImages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES Posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_postimages_post ON PostImages(post_id);
```

### CommunityMembers Table
Tracks user membership in communities.

```sql
CREATE TABLE CommunityMembers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  community_id BIGINT NOT NULL REFERENCES Communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'moderator')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,

  UNIQUE(community_id, user_id)
);

CREATE INDEX idx_community_members_community ON CommunityMembers(community_id);
CREATE INDEX idx_community_members_user ON CommunityMembers(user_id);
CREATE INDEX idx_community_members_role ON CommunityMembers(role);
```

**Purpose:** Manages user membership in communities with roles and join dates.

**Relationships:**
- `community_id → Communities(id)` (1 community → many members)
- `user_id → auth.users(id)` (1 user → many communities)

**Row Level Security:** Users can only view and manage their own community memberships.

---

## Event Tables

### Events Table
Stores community events and meetups.

```sql
CREATE TABLE Events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  location TEXT,
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  max_attendees INTEGER,
  image_url TEXT,
  tags TEXT[],
  organizer_id UUID NOT NULL REFERENCES auth.users(id),
  community_id BIGINT REFERENCES Communities(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON Events(event_date);
CREATE INDEX idx_events_organizer ON Events(organizer_id);
CREATE INDEX idx_events_community ON Events(community_id);
```

**Purpose:** Manages community events with details like title, description, date, location, and organizer.

**Relationships:**
- `organizer_id → auth.users(id)` (1 user → many events)
- `community_id → Communities(id)` (1 community → many events, optional)

**Row Level Security:** Events are viewable by everyone, but only organizers can create events.

---

### EventAttendees Table
Tracks user registration for events.

```sql
CREATE TABLE EventAttendees (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id BIGINT NOT NULL REFERENCES Events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  registered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_event_attendees_event ON EventAttendees(event_id);
CREATE INDEX idx_event_attendees_user ON EventAttendees(user_id);
```

**Purpose:** Manages user attendance for events with status tracking.

**Relationships:**
- `event_id → Events(id)` (1 event → many attendees)
- `user_id → auth.users(id)` (1 user → many event registrations)

**Row Level Security:** Users can register for events they own.

---

## Row Level Security (RLS)
All tables enforce RLS:
- Public read access where applicable
- Users can modify only their own data
- Community admins have elevated permissions
- Private conversations restricted to participants

---

## Database Functions

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Update post like count
```sql
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE Posts 
    SET like_count = like_count + NEW.vote
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE Posts 
    SET like_count = like_count - OLD.vote
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## References
- Setup instructions: [SETUP.md](SETUP.md)
- Architecture overview: [ARCHITECTURE.md](ARCHITECTURE.md)
