-- DevConnect Database Schema
-- Includes messaging system and user profiles
-- Add these tables to your Supabase database

-- User profiles table for extended user information
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

-- Enable Row Level Security for Profiles
ALTER TABLE Profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy for Profiles: Users can only view and update their own profile
CREATE POLICY "Users can view own profile" ON Profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON Profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON Profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.Profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Real-time Messaging System Database Schema

-- Conversations table (for both direct messages and group chats)
CREATE TABLE Conversations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT, -- null for direct messages, group name for group chats
  type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
  description TEXT,
  is_private BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE ConversationParticipants (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id BIGINT NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE Messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id BIGINT NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image')),
  file_url TEXT,
  file_name TEXT,
  reply_to_id BIGINT REFERENCES Messages(id),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Message reactions
CREATE TABLE MessageReactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_id BIGINT NOT NULL REFERENCES Messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- User presence/status
CREATE TABLE UserPresence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Typing indicators
CREATE TABLE TypingIndicators (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id BIGINT NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Pinned messages
CREATE TABLE PinnedMessages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id BIGINT NOT NULL REFERENCES Conversations(id) ON DELETE CASCADE,
  message_id BIGINT NOT NULL REFERENCES Messages(id) ON DELETE CASCADE,
  pinned_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(conversation_id, message_id)
);

-- Community members table
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

-- Enable Row Level Security for CommunityMembers
ALTER TABLE CommunityMembers ENABLE ROW LEVEL SECURITY;

-- RLS Policy for CommunityMembers
CREATE POLICY "Users can view own community memberships" ON CommunityMembers
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM Communities WHERE Communities.id = CommunityMembers.community_id AND Communities.created_by = auth.uid()
  ));

CREATE POLICY "Users can manage own community memberships" ON CommunityMembers
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_conversations_type ON Conversations(type);
CREATE INDEX idx_conversation_participants_user_id ON ConversationParticipants(user_id);
CREATE INDEX idx_conversation_participants_conversation_id ON ConversationParticipants(conversation_id);
CREATE INDEX idx_messages_conversation_id ON Messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON Messages(sender_id);
CREATE INDEX idx_messages_created_at ON Messages(created_at DESC);
CREATE INDEX idx_message_reactions_message_id ON MessageReactions(message_id);
CREATE INDEX idx_user_presence_status ON UserPresence(status);
CREATE INDEX idx_typing_indicators_conversation_id ON TypingIndicators(conversation_id);

-- Enable Row Level Security (RLS)
ALTER TABLE Conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ConversationParticipants ENABLE ROW LEVEL SECURITY;
ALTER TABLE Messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE MessageReactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE UserPresence ENABLE ROW LEVEL SECURITY;
ALTER TABLE TypingIndicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE PinnedMessages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Conversations: Users can only see conversations they're part of
CREATE POLICY "Users can view conversations they participate in" ON Conversations
  FOR SELECT USING (
    id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations" ON Conversations
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can update conversations" ON Conversations
  FOR UPDATE USING (
    id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ConversationParticipants policies
CREATE POLICY "Users can view participants of their conversations" ON ConversationParticipants
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage participants" ON ConversationParticipants
  FOR ALL USING (
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON Messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations" ON Messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit their own messages" ON Messages
  FOR UPDATE USING (sender_id = auth.uid());

-- MessageReactions policies
CREATE POLICY "Users can view reactions in their conversations" ON MessageReactions
  FOR SELECT USING (
    message_id IN (
      SELECT id FROM Messages WHERE conversation_id IN (
        SELECT conversation_id FROM ConversationParticipants 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can react to messages" ON MessageReactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    message_id IN (
      SELECT id FROM Messages WHERE conversation_id IN (
        SELECT conversation_id FROM ConversationParticipants 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can remove their own reactions" ON MessageReactions
  FOR DELETE USING (user_id = auth.uid());

-- UserPresence policies
CREATE POLICY "Users can view all user presence" ON UserPresence
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own presence" ON UserPresence
  FOR ALL USING (user_id = auth.uid());

-- TypingIndicators policies
CREATE POLICY "Users can view typing indicators in their conversations" ON TypingIndicators
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own typing indicators" ON TypingIndicators
  FOR ALL USING (user_id = auth.uid());

-- PinnedMessages policies
CREATE POLICY "Users can view pinned messages in their conversations" ON PinnedMessages
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage pinned messages" ON PinnedMessages
  FOR ALL USING (
    conversation_id IN (
      SELECT conversation_id FROM ConversationParticipants 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for message files
INSERT INTO storage.buckets (id, name, public) VALUES ('message-files', 'message-files', false);

-- Storage policies for message files
CREATE POLICY "Users can upload message files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'message-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view message files in their conversations" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'message-files' AND
    name IN (
      SELECT file_url FROM Messages WHERE conversation_id IN (
        SELECT conversation_id FROM ConversationParticipants 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Functions for real-time features
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Conversations 
  SET updated_at = NOW() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON Messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- Function to clean up old typing indicators
CREATE OR REPLACE FUNCTION cleanup_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM TypingIndicators 
  WHERE created_at < NOW() - INTERVAL '10 seconds';
END;
$$ LANGUAGE plpgsql;