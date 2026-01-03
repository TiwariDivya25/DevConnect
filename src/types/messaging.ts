// Types for the real-time messaging system

export interface Conversation {
  id: number;
  name?: string;
  type: 'direct' | 'group';
  description?: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: number;
  conversation_id: number;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  last_read_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reply_to_id?: number;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
  reply_to?: Message;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: number;
  message_id: number;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: {
    id: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  updated_at: string;
}

export interface TypingIndicator {
  id: number;
  conversation_id: number;
  user_id: string;
  created_at: string;
  user?: {
    id: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
}

export interface PinnedMessage {
  id: number;
  conversation_id: number;
  message_id: number;
  pinned_by: string;
  created_at: string;
  message?: Message;
}

export interface CreateConversationData {
  name?: string;
  type: 'direct' | 'group';
  description?: string;
  is_private?: boolean;
  participant_ids: string[];
}

export interface SendMessageData {
  conversation_id: number;
  content: string;
  message_type?: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reply_to_id?: number;
}

export interface ConversationWithDetails extends Conversation {
  participants: ConversationParticipant[];
  last_message?: Message;
  unread_count: number;
  pinned_messages?: PinnedMessage[];
}