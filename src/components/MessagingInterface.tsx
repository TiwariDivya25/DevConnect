import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useConversations, useMessages, useRealtimeMessages, useTypingIndicator } from '../hooks/useMessaging';
import { MessageSquare, Search, Plus } from 'lucide-react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationHeader from './ConversationHeader';
import CreateConversationModal from './CreateConversationModal';
import type { Conversation } from '../types/messaging';
import { showError } from '../utils/toast';

const MessagingInterface = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedConversation?.id || 0);
  const { typingUsers } = useTypingIndicator(selectedConversation?.id || 0);

  // Set up real-time updates
  useRealtimeMessages(selectedConversation?.id || 0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    if (conv.name) {
      return conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // For direct messages, search by participant names
    const participantNames = conv.participants
      ?.filter(p => p.user_id !== user?.id)
      .map(p => p.user?.user_metadata?.full_name || p.user?.user_metadata?.user_name || p.user?.email)
      .join(' ') || '';
    
    return participantNames.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to start messaging</h2>
          <p className="text-gray-400">Connect with other developers and build communities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              Messages
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-pulse">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <ConversationHeader conversation={selectedConversation} />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="text-center text-gray-400">
                  <div className="animate-pulse">Loading messages...</div>
                </div>
              ) : (
                <MessageList messages={messages} />
              )}
              
              {/* Typing Indicators */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>
                    {typingUsers.map(t => t.user?.user_metadata?.full_name || t.user?.user_metadata?.user_name).join(', ')} 
                    {typingUsers.length === 1 ? ' is' : ' are'} typing...
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput conversationId={selectedConversation.id} />
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-slate-900/20">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">Select a conversation</h2>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Conversation Modal */}
      {showCreateModal && (
        <CreateConversationModal
          onClose={() => setShowCreateModal(false)}
          onConversationCreated={(conversation) => {
            setSelectedConversation(conversation);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default MessagingInterface;