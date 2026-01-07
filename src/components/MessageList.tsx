import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMessageReactions } from '../hooks/useMessaging';
import { Reply, Edit, Trash2, Download, ExternalLink } from 'lucide-react';
import type { Message } from '../types/messaging';

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  const { user } = useAuth();
  const { addReaction, removeReaction } = useMessageReactions();
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (messageDate.getTime() === today.getTime() - 86400000) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === today.getTime() - 86400000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.created_at).toDateString();
    const previousDate = new Date(previousMessage.created_at).toDateString();
    
    return currentDate !== previousDate;
  };

  const handleReaction = async (messageId: number, emoji: string) => {
    const message = messages.find(m => m.id === messageId);
    const existingReaction = message?.reactions?.find(r => r.user_id === user?.id && r.emoji === emoji);
    
    if (existingReaction) {
      await removeReaction.mutateAsync({ messageId, emoji });
    } else {
      await addReaction.mutateAsync({ messageId, emoji });
    }
    
    setShowEmojiPicker(null);
  };

  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

  const renderFilePreview = (message: Message) => {
    if (message.message_type === 'image' && message.file_url) {
      return (
        <div className="mt-2">
          <img
            src={message.file_url}
            alt={message.file_name || 'Image'}
            className="max-w-sm max-h-64 rounded-lg border border-slate-700"
          />
        </div>
      );
    }
    
    if (message.message_type === 'file' && message.file_url) {
      return (
        <div className="mt-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-cyan-900/30 rounded">
            <Download className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{message.file_name}</p>
            <p className="text-gray-400 text-sm">Click to download</p>
          </div>
          <a
            href={message.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-slate-700 rounded transition"
          >
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      );
    }
    
    return null;
  };

  const renderReplyPreview = (message: Message) => {
    if (!message.reply_to) return null;
    
    return (
      <div className="mb-2 p-2 bg-slate-800/30 border-l-2 border-cyan-400 rounded-r">
        <p className="text-xs text-cyan-400 font-medium">
          Replying to {message.reply_to.sender?.user_metadata?.full_name || 'Unknown'}
        </p>
        <p className="text-sm text-gray-300 truncate">
          {message.reply_to.content}
        </p>
      </div>
    );
  };

  const renderReactions = (message: Message) => {
    if (!message.reactions || message.reactions.length === 0) return null;
    
    const reactionGroups = message.reactions.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = [];
      }
      acc[reaction.emoji].push(reaction);
      return acc;
    }, {} as Record<string, typeof message.reactions>);
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(reactionGroups).map(([emoji, reactions]) => {
          const hasUserReacted = reactions.some(r => r.user_id === user?.id);
          
          return (
            <button
              key={emoji}
              onClick={() => handleReaction(message.id, emoji)}
              className={`
                px-2 py-1 rounded-full text-xs flex items-center gap-1 transition
                ${hasUserReacted 
                  ? 'bg-cyan-900/50 border border-cyan-400/50 text-cyan-300' 
                  : 'bg-slate-800/50 border border-slate-700 text-gray-300 hover:bg-slate-700/50'
                }
              `}
            >
              <span>{emoji}</span>
              <span>{reactions.length}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isOwnMessage = message.sender_id === user?.id;
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
        
        return (
          <div key={message.id}>
            {/* Date Separator */}
            {showDateSeparator && (
              <div className="flex items-center justify-center my-6">
                <div className="bg-slate-800 px-3 py-1 rounded-full">
                  <span className="text-xs text-gray-400 font-medium">
                    {formatMessageDate(message.created_at)}
                  </span>
                </div>
              </div>
            )}
            
            {/* Message */}
            <div className={`flex gap-3 group ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              {!isOwnMessage && (
                <div className="flex-shrink-0">
                  {message.sender?.user_metadata?.avatar_url ? (
                    <img
                      src={message.sender.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full ring-2 ring-cyan-400/50"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">
                        {message.sender?.user_metadata?.full_name?.[0] || 
                         message.sender?.user_metadata?.user_name?.[0] || 
                         message.sender?.email?.[0] || '?'}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Message Content */}
              <div className={`flex-1 max-w-lg ${isOwnMessage ? 'text-right' : ''}`}>
                {/* Sender Name & Time */}
                {!isOwnMessage && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {message.sender?.user_metadata?.full_name || 
                       message.sender?.user_metadata?.user_name || 
                       message.sender?.email}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatMessageTime(message.created_at)}
                    </span>
                    {message.is_edited && (
                      <span className="text-xs text-gray-500 italic">(edited)</span>
                    )}
                  </div>
                )}
                
                {/* Message Bubble */}
                <div
                  className={`
                    relative p-3 rounded-lg break-words
                    ${isOwnMessage 
                      ? 'bg-cyan-900/30 border border-cyan-400/50 text-white' 
                      : 'bg-slate-800/50 border border-slate-700 text-white'
                    }
                  `}
                >
                  {/* Reply Preview */}
                  {renderReplyPreview(message)}
                  
                  {/* Message Content */}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* File Preview */}
                  {renderFilePreview(message)}
                  
                  {/* Own Message Time */}
                  {isOwnMessage && (
                    <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-400">
                      {message.is_edited && <span className="italic">(edited)</span>}
                      <span>{formatMessageTime(message.created_at)}</span>
                    </div>
                  )}
                  
                  {/* Message Actions */}
                  <div className={`
                    absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity
                    ${isOwnMessage ? 'left-2' : 'right-2'}
                  `}>
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                        className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition"
                        title="Add reaction"
                      >
                        😊
                      </button>
                      <button
                        onClick={() => console.log('Reply to:', message)}
                        className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition"
                        title="Reply"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                      {isOwnMessage && (
                        <>
                          <button
                            className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Emoji Picker */}
                {showEmojiPicker === message.id && (
                  <div className={`
                    mt-2 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg
                    ${isOwnMessage ? 'mr-0 ml-auto' : ''}
                  `}>
                    <div className="flex gap-1">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(message.id, emoji)}
                          className="p-1 hover:bg-slate-700 rounded transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reactions */}
                {renderReactions(message)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;