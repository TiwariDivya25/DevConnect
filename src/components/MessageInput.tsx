import { useState, useRef, useEffect } from 'react';
import { useSendMessage, useTypingIndicator } from '../hooks/useMessaging';
import { Send, Paperclip, Image, Smile, X } from 'lucide-react';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';

interface MessageInputProps {
  conversationId: number;
  replyTo?: { id: number; content: string; sender: string } | null;
  onCancelReply?: () => void;
}

const MessageInput = ({ conversationId, replyTo, onCancelReply }: MessageInputProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sendMessage = useSendMessage();
  const { startTyping, stopTyping } = useTypingIndicator(conversationId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Typing indicator logic
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;
    
    if (message.trim()) {
      startTyping();
      
      typingTimeout = setTimeout(() => {
        stopTyping();
      }, 3000);
    } else {
      stopTyping();
    }
    
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      stopTyping();
    };
  }, [message, startTyping, stopTyping]);

  const handleSend = async () => {
    if (!message.trim() || sendMessage.isPending) return;
    
    const messageContent = message.trim();
    setMessage('');
    
    try {
      await sendMessage.mutateAsync({
        conversation_id: conversationId,
        content: messageContent,
        reply_to_id: replyTo?.id,
      });
      
      if (onCancelReply) onCancelReply();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessage(messageContent); // Restore message on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('message-files')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('message-files')
        .getPublicUrl(fileName);
      
      const messageType = file.type.startsWith('image/') ? 'image' : 'file';
      
      await sendMessage.mutateAsync({
        conversation_id: conversationId,
        content: messageType === 'image' ? '📷 Image' : `📎 ${file.name}`,
        message_type: messageType,
        file_url: publicUrl,
        file_name: file.name,
        reply_to_id: replyTo?.id,
      });
      
      if (onCancelReply) onCancelReply();
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const commonEmojis = [
    '😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', 
    '❤️', '🎉', '🔥', '💯', '👏', '🙏', '💪', '🎯'
  ];

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/50 p-4">
      {/* Reply Preview */}
      {replyTo && (
        <div className="mb-3 p-2 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-cyan-400 font-medium">Replying to {replyTo.sender}</p>
            <p className="text-sm text-gray-300 truncate">{replyTo.content}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-slate-700 rounded text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mb-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
          <div className="grid grid-cols-8 gap-2">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="p-2 hover:bg-slate-700 rounded transition text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-3">
        {/* File Upload */}
        <div className="flex gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.click();
              }
            }}
            disabled={isUploading}
            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
            title="Upload image"
          >
            <Image className="w-5 h-5" />
          </button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 resize-none min-h-[48px] max-h-32"
            rows={1}
          />
          
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-cyan-400 transition"
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || sendMessage.isPending || isUploading}
          className="p-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Uploading file...
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;