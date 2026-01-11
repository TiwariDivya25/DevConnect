import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';
import type { 
  Message, 
  ConversationWithDetails, 
  CreateConversationData, 
  SendMessageData,
  UserPresence,
  TypingIndicator
} from '../types/messaging';

// Hook for fetching conversations
export const useConversations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('Conversations')
        .select(`
          *,
          participants:ConversationParticipants(
            *,
            user:auth.users(id, email, user_metadata)
          ),
          last_message:Messages(
            *,
            sender:auth.users(id, email, user_metadata)
          )
        `)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ConversationWithDetails[];
    },
    enabled: !!user,
  });
};

// Hook for fetching messages in a conversation
export const useMessages = (conversationId: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Messages')
        .select(`
          *,
          sender:auth.users(id, email, user_metadata),
          reply_to:Messages(
            *,
            sender:auth.users(id, email, user_metadata)
          ),
          reactions:MessageReactions(
            *,
            user:auth.users(id, email, user_metadata)
          )
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user && !!conversationId,
  });
};

// Hook for creating conversations
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateConversationData) => {
      if (!user) throw new Error('User not authenticated');
      
      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('Conversations')
        .insert({
          name: data.name,
          type: data.type,
          description: data.description,
          is_private: data.is_private ?? true,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (convError) throw convError;
      
      // Add participants
      const participants = [
        { conversation_id: conversation.id, user_id: user.id, role: 'admin' },
        ...data.participant_ids.map(id => ({
          conversation_id: conversation.id,
          user_id: id,
          role: 'member' as const
        }))
      ];
      
      const { error: partError } = await supabase
        .from('ConversationParticipants')
        .insert(participants);
      
      if (partError) throw partError;
      
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Hook for sending messages
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: message, error } = await supabase
        .from('Messages')
        .insert({
          conversation_id: data.conversation_id,
          sender_id: user.id,
          content: data.content,
          message_type: data.message_type || 'text',
          file_url: data.file_url,
          file_name: data.file_name,
          reply_to_id: data.reply_to_id,
        })
        .select(`
          *,
          sender:auth.users(id, email, user_metadata)
        `)
        .single();
      
      if (error) throw error;
      return message;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ['messages', message.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

// Hook for real-time message updates
export const useRealtimeMessages = (conversationId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user || !conversationId) return;
    
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, queryClient]);
};

// Hook for user presence
export const useUserPresence = () => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  
  useEffect(() => {
    if (!user) return;
    
    // Update user status to online
    const updatePresence = async () => {
      await supabase
        .from('UserPresence')
        .upsert({
          user_id: user.id,
          status: 'online',
          last_seen: new Date().toISOString(),
        });
    };
    
    updatePresence();
    
    // Set up real-time subscription for presence updates
    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'UserPresence',
        },
        () => {
          // Refetch presence data
          fetchPresence();
        }
      )
      .subscribe();
    
    const fetchPresence = async () => {
      const { data } = await supabase
        .from('UserPresence')
        .select('*')
        .eq('status', 'online');
      
      if (data) setOnlineUsers(data);
    };
    
    fetchPresence();
    
    // Update presence every 30 seconds
    const interval = setInterval(updatePresence, 30000);
    
    // Set status to offline on unmount
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
      supabase
        .from('UserPresence')
        .update({ status: 'offline', last_seen: new Date().toISOString() })
        .eq('user_id', user.id);
    };
  }, [user]);
  
  return onlineUsers;
};

// Hook for typing indicators
export const useTypingIndicator = (conversationId: number) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  
  const startTyping = async () => {
    if (!user || !conversationId) return;
    
    await supabase
      .from('TypingIndicators')
      .upsert({
        conversation_id: conversationId,
        user_id: user.id,
      });
  };
  
  const stopTyping = async () => {
    if (!user || !conversationId) return;
    
    await supabase
      .from('TypingIndicators')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
  };
  
  useEffect(() => {
    if (!conversationId) return;
    
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'TypingIndicators',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async () => {
          const { data } = await supabase
            .from('TypingIndicators')
            .select(`
              *,
              user:auth.users(id, email, user_metadata)
            `)
            .eq('conversation_id', conversationId)
            .neq('user_id', user?.id || '');
          
          if (data) setTypingUsers(data);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);
  
  return { typingUsers, startTyping, stopTyping };
};

// Hook for message reactions
export const useMessageReactions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const addReaction = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: number; emoji: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('MessageReactions')
        .upsert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Get conversation_id from the message to invalidate the right query
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
  
  const removeReaction = useMutation({
    mutationFn: async ({ messageId, emoji }: { messageId: number; emoji: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('MessageReactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
  
  return { addReaction, removeReaction };
};