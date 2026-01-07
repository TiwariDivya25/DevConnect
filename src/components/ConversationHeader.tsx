import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Phone, Video, Settings, Users, Search, Pin, MoreVertical, UserPlus } from 'lucide-react';
import type { ConversationWithDetails } from '../types/messaging';

interface ConversationHeaderProps {
  conversation: ConversationWithDetails;
}

const ConversationHeader = ({ conversation }: ConversationHeaderProps) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const getConversationName = () => {
    if (conversation.name) return conversation.name;
    
    // For direct messages, show the other participant's name
    const otherParticipant = conversation.participants?.find(p => p.user_id !== user?.id);
    return otherParticipant?.user?.user_metadata?.full_name || 
           otherParticipant?.user?.user_metadata?.user_name || 
           otherParticipant?.user?.email || 
           'Unknown User';
  };

  const getConversationStatus = () => {
    if (conversation.type === 'group') {
      const memberCount = conversation.participants?.length || 0;
      return `${memberCount} members`;
    }
    
    // For direct messages, show online status
    return 'Online'; // This would be dynamic based on presence
  };

  const getConversationAvatar = () => {
    if (conversation.type === 'group') {
      return (
        <div className="w-10 h-10 bg-cyan-900/30 border border-cyan-400/50 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-cyan-400" />
        </div>
      );
    }
    
    // For direct messages, show the other participant's avatar
    const otherParticipant = conversation.participants?.find(p => p.user_id !== user?.id);
    if (otherParticipant?.user?.user_metadata?.avatar_url) {
      return (
        <div className="relative">
          <img
            src={otherParticipant.user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-10 h-10 rounded-full ring-2 ring-cyan-400/50"
          />
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
        </div>
      );
    }
    
    return (
      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
        <span className="text-sm text-gray-300">
          {getConversationName()[0]?.toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 border-b border-slate-800 p-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Conversation Info */}
        <div className="flex items-center gap-3">
          {getConversationAvatar()}
          
          <div>
            <h2 className="font-semibold text-white">{getConversationName()}</h2>
            <p className="text-sm text-gray-400">{getConversationStatus()}</p>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Voice Call */}
          <button
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
            title="Voice call"
          >
            <Phone className="w-5 h-5" />
          </button>

          {/* Video Call */}
          <button
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
            title="Video call"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Search Messages */}
          <button
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
            title="Search messages"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Group Actions */}
          {conversation.type === 'group' && (
            <>
              {/* Add Member */}
              <button
                className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                title="Add member"
              >
                <UserPlus className="w-5 h-5" />
              </button>

              {/* Pinned Messages */}
              <button
                className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
                title="Pinned messages"
              >
                <Pin className="w-5 h-5" />
              </button>
            </>
          )}

          {/* More Options */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-slate-800 hover:text-white transition">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4" />
                      Conversation Settings
                    </div>
                  </button>
                  
                  {conversation.type === 'group' && (
                    <>
                      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-slate-800 hover:text-white transition">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4" />
                          Manage Members
                        </div>
                      </button>
                      
                      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-slate-800 hover:text-white transition">
                        <div className="flex items-center gap-3">
                          <Pin className="w-4 h-4" />
                          View Pinned Messages
                        </div>
                      </button>
                    </>
                  )}
                  
                  <div className="border-t border-slate-700 my-1" />
                  
                  <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-800 transition">
                    {conversation.type === 'group' ? 'Leave Group' : 'Block User'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group Members Preview */}
      {conversation.type === 'group' && conversation.participants && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex -space-x-2">
            {conversation.participants.slice(0, 5).map((participant) => (
              <div key={participant.id} className="relative">
                {participant.user?.user_metadata?.avatar_url ? (
                  <img
                    src={participant.user.user_metadata.avatar_url}
                    alt=""
                    className="w-6 h-6 rounded-full ring-2 ring-slate-900"
                    title={participant.user.user_metadata.full_name || participant.user.user_metadata.user_name}
                  />
                ) : (
                  <div 
                    className="w-6 h-6 bg-slate-600 rounded-full ring-2 ring-slate-900 flex items-center justify-center"
                    title={participant.user?.user_metadata?.full_name || participant.user?.user_metadata?.user_name}
                  >
                    <span className="text-xs text-gray-300">
                      {participant.user?.user_metadata?.full_name?.[0] || 
                       participant.user?.user_metadata?.user_name?.[0] || '?'}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {conversation.participants.length > 5 && (
              <div className="w-6 h-6 bg-slate-700 rounded-full ring-2 ring-slate-900 flex items-center justify-center">
                <span className="text-xs text-gray-300">+{conversation.participants.length - 5}</span>
              </div>
            )}
          </div>
          
          <span className="text-xs text-gray-400 ml-2">
            {conversation.participants.length} members
          </span>
        </div>
      )}
    </div>
  );
};

export default ConversationHeader;