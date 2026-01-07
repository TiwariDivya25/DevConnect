import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Users, Lock, Globe } from 'lucide-react';
import type { Conversation, ConversationWithDetails } from '../types/messaging';

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList = ({ conversations, selectedConversation, onSelectConversation }: ConversationListProps) => {
  const { user } = useAuth();

  const getConversationName = (conversation: ConversationWithDetails) => {
    if (conversation.name) return conversation.name;
    
    // For direct messages, show the other participant's name
    const otherParticipant = conversation.participants?.find(p => p.user_id !== user?.id);
    return otherParticipant?.user?.user_metadata?.full_name || 
           otherParticipant?.user?.user_metadata?.user_name || 
           otherParticipant?.user?.email || 
           'Unknown User';
  };

  const getConversationAvatar = (conversation: ConversationWithDetails) => {
    if (conversation.type === 'group') {
      return (
        <div className="w-12 h-12 bg-cyan-900/30 border border-cyan-400/50 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-cyan-400" />
        </div>
      );
    }
    
    // For direct messages, show the other participant's avatar
    const otherParticipant = conversation.participants?.find(p => p.user_id !== user?.id);
    if (otherParticipant?.user?.user_metadata?.avatar_url) {
      return (
        <img
          src={otherParticipant.user.user_metadata.avatar_url}
          alt="Avatar"
          className="w-12 h-12 rounded-full ring-2 ring-cyan-400/50"
        />
      );
    }
    
    return (
      <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
        <MessageCircle className="w-6 h-6 text-gray-400" />
      </div>
    );
  };

  const formatLastMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      return `${Math.floor(diffInMinutes / 1440)}d`;
    } catch {
      return '';
    }
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?.id === conversation.id;
        const hasUnread = (conversation.unread_count || 0) > 0;
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-200 group
              ${isSelected 
                ? 'bg-cyan-900/30 border border-cyan-400/50' 
                : 'hover:bg-slate-800/50 border border-transparent'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative">
                {getConversationAvatar(conversation)}
                
                {/* Online indicator for direct messages */}
                {conversation.type === 'direct' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full" />
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                      {getConversationName(conversation)}
                    </h3>
                    
                    {/* Conversation Type Icons */}
                    <div className="flex items-center gap-1">
                      {conversation.type === 'group' && (
                        <Users className="w-3 h-3 text-gray-400" />
                      )}
                      {conversation.is_private ? (
                        <Lock className="w-3 h-3 text-gray-400" />
                      ) : (
                        <Globe className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  {conversation.last_message && (
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatLastMessageTime(conversation.last_message.created_at)}
                    </span>
                  )}
                </div>

                {/* Last Message */}
                <div className="flex items-center justify-between">
                  <p className={`text-sm truncate ${hasUnread ? 'text-white font-medium' : 'text-gray-400'}`}>
                    {conversation.last_message ? (
                      <>
                        {conversation.last_message.sender_id === user?.id && (
                          <span className="text-cyan-400">You: </span>
                        )}
                        {conversation.last_message.message_type === 'image' ? (
                          <span className="italic">📷 Image</span>
                        ) : conversation.last_message.message_type === 'file' ? (
                          <span className="italic">📎 File</span>
                        ) : (
                          truncateMessage(conversation.last_message.content)
                        )}
                      </>
                    ) : (
                      <span className="italic">No messages yet</span>
                    )}
                  </p>

                  {/* Unread Count */}
                  {hasUnread && (
                    <div className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0">
                      {conversation.unread_count! > 99 ? '99+' : conversation.unread_count}
                    </div>
                  )}
                </div>

                {/* Group Members Preview */}
                {conversation.type === 'group' && conversation.participants && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {conversation.participants.length} members
                    </span>
                    <div className="flex -space-x-1">
                      {conversation.participants.slice(0, 3).map((participant) => (
                        <div key={participant.id} className="relative">
                          {participant.user?.user_metadata?.avatar_url ? (
                            <img
                              src={participant.user.user_metadata.avatar_url}
                              alt=""
                              className="w-4 h-4 rounded-full ring-1 ring-slate-900"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-slate-600 rounded-full ring-1 ring-slate-900" />
                          )}
                        </div>
                      ))}
                      {conversation.participants.length > 3 && (
                        <div className="w-4 h-4 bg-slate-700 rounded-full ring-1 ring-slate-900 flex items-center justify-center">
                          <span className="text-[8px] text-gray-300">+</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;