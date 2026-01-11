import { useState, useEffect } from 'react';
import { useCreateConversation } from '../hooks/useMessaging';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';
import { X, Search, Users, MessageCircle, Check } from 'lucide-react';
import type { Conversation } from '../types/messaging';
import { showSuccess,showError } from '../utils/toast';


interface CreateConversationModalProps {
  onClose: () => void;
  onConversationCreated: (conversation: Conversation) => void;
}

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    user_name?: string;
    avatar_url?: string;
  };
}

const CreateConversationModal = ({ onClose, onConversationCreated }: CreateConversationModalProps) => {
  const { user: currentUser } = useAuth();
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('direct');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const createConversation = useCreateConversation();

  // Fetch users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        
        // Filter out current user
        const filteredUsers = data.users.filter(u => u.id !== currentUser?.id);
        setUsers(filteredUsers as User[]);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = user.user_metadata?.full_name?.toLowerCase() || '';
    const userName = user.user_metadata?.user_name?.toLowerCase() || '';
    const email = user.email.toLowerCase();
    
    return fullName.includes(searchLower) || 
           userName.includes(searchLower) || 
           email.includes(searchLower);
  });

  const handleUserSelect = (user: User) => {
    if (conversationType === 'direct') {
      setSelectedUsers([user]);
    } else {
      setSelectedUsers(prev => {
        const isSelected = prev.some(u => u.id === user.id);
        if (isSelected) {
          return prev.filter(u => u.id !== user.id);
        } else {
          return [...prev, user];
        }
      });
    }
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) return;
    
    if (conversationType === 'group' && !groupName.trim()) {
      showError('Please enter a group name');
      return;
    }

    setIsLoading(true);
    
    try {
      const conversationData = {
        type: conversationType,
        name: conversationType === 'group' ? groupName.trim() : undefined,
        description: conversationType === 'group' ? groupDescription.trim() : undefined,
        is_private: isPrivate,
        participant_ids: selectedUsers.map(u => u.id),
      };

      const conversation = await createConversation.mutateAsync(conversationData);
     
      showSuccess(
         conversationType === 'group'
          ? "Group conversation created"
           : "Conversation started"
        );

      onConversationCreated(conversation);

    } catch (error) {
      console.error('Failed to create conversation:', error);
      showError('Failed to create conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDisplayName = (user: User) => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.user_name || 
           user.email;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Conversation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Conversation Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setConversationType('direct');
                  setSelectedUsers([]);
                }}
                className={`
                  flex-1 p-3 rounded-lg border transition flex items-center justify-center gap-2
                  ${conversationType === 'direct'
                    ? 'bg-cyan-900/30 border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700/50'
                  }
                `}
              >
                <MessageCircle className="w-4 h-4" />
                Direct Message
              </button>
              <button
                onClick={() => {
                  setConversationType('group');
                  setSelectedUsers([]);
                }}
                className={`
                  flex-1 p-3 rounded-lg border transition flex items-center justify-center gap-2
                  ${conversationType === 'group'
                    ? 'bg-cyan-900/30 border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-700/50'
                  }
                `}
              >
                <Users className="w-4 h-4" />
                Group Chat
              </button>
            </div>
          </div>

          {/* Group Settings */}
          {conversationType === 'group' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 resize-none"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-600 rounded focus:ring-cyan-400 focus:ring-2"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-300">
                  Private group (invite only)
                </label>
              </div>
            </div>
          )}

          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {conversationType === 'direct' ? 'Select User' : 'Add Members'}
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50"
              />
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-400 mb-2">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-cyan-900/30 border border-cyan-400/50 rounded-lg px-2 py-1"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt=""
                          className="w-4 h-4 rounded-full"
                        />
                      ) : (
                        <div className="w-4 h-4 bg-slate-600 rounded-full" />
                      )}
                      <span className="text-sm text-cyan-300">
                        {getUserDisplayName(user)}
                      </span>
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User List */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredUsers.map(user => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition flex items-center gap-3
                      ${isSelected
                        ? 'bg-cyan-900/30 border border-cyan-400/50'
                        : 'hover:bg-slate-800/50 border border-transparent'
                      }
                    `}
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        className="w-8 h-8 rounded-full ring-2 ring-cyan-400/50"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-300">
                          {getUserDisplayName(user)[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {getUserDisplayName(user)}
                      </p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    
                    {isSelected && (
                      <Check className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-4 text-gray-400">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0 || (conversationType === 'group' && !groupName.trim()) || isLoading}
            className="flex-1 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal;