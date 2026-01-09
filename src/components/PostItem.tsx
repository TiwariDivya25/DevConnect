import { Link } from 'react-router-dom';
import type { Post } from './PostList';
import { MessageCircle, Heart, Code } from 'lucide-react';
import LikeButton from './LikeButton';
import { useState, useMemo } from 'react';
import { CopyButton } from './CopyButton';
import { CodeBlock } from './CodeBlock';

interface Props {
  post: Post;
}

// Helper function to detect and extract code blocks from content
const parseContentWithCode = (content: string) => {
  // Regex to match code blocks with optional language specifier
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Reset regex lastIndex
  codeBlockRegex.lastIndex = 0;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    
    // Add code block
    parts.push({
      type: 'code',
      language: match[1] || '',
      content: match[2].trim()
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after last code block
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }
  
  // If no code blocks were found, return the entire content as text
  if (parts.length === 0) {
    return [{ type: 'text', content }];
  }
  
  return parts;
};

// Helper to extract first code snippet for preview
const extractFirstCodeSnippet = (content: string): string | null => {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/;
  const match = content.match(codeBlockRegex);
  return match ? match[1].trim().slice(0, 100) + (match[1].trim().length > 100 ? '...' : '') : null;
};

const PostItem = ({ post }: Props) => {
  const [likeCount, setLikeCount] = useState(0);
  
  // Parse content to detect code blocks
  const contentParts = useMemo(() => parseContentWithCode(post.content), [post.content]);
  
  // Check if content has code blocks
  const hasCodeBlocks = useMemo(() => 
    contentParts.some(part => part.type === 'code'), 
    [contentParts]
  );
  
  // Extract first code snippet for preview
  const firstCodeSnippet = useMemo(() => 
    extractFirstCodeSnippet(post.content), 
    [post.content]
  );

  return (
    <Link to={`/post/${post.id}`}>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
        {/* Image */}
        {post.image_url && (
          <div className="w-full aspect-video bg-linear-to-br from-slate-800 to-slate-900 overflow-hidden relative group">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4 flex-grow">
          {/* Header with Avatar */}
          <div className="flex items-center gap-4">
            {post.avatar_url ? (
              <img 
                src={post.avatar_url} 
                alt="User avatar"
                className="w-11 h-11 rounded-full ring-1 ring-slate-700 object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 shrink-0"></div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500">2h ago</p>
            </div>
          </div>

          {/* Title and Content Preview */}
          <div className="space-y-3">
            {/* Show code snippet preview if available */}
            {hasCodeBlocks && firstCodeSnippet && (
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono text-cyan-300">Code snippet</span>
                  </div>
                  <CopyButton 
                    text={firstCodeSnippet} 
                    size="sm"
                    className="opacity-70 hover:opacity-100"
                  />
                </div>
                <pre className="text-xs font-mono text-gray-400 overflow-x-auto whitespace-pre-wrap">
                  {firstCodeSnippet}
                </pre>
              </div>
            )}
            
            {/* Show text content preview */}
            {contentParts.filter(part => part.type === 'text').map((part, index) => {
              if (part.content.trim() === '') return null;
              
              const textContent = part.content.length > 150 
                ? part.content.slice(0, 150) + '...' 
                : part.content;
              
              return (
                <p key={index} className="text-base text-gray-300 leading-relaxed">
                  {textContent}
                </p>
              );
            })}
            
            {/* Show code block count badge */}
            {hasCodeBlocks && (
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-cyan-300">
                  {contentParts.filter(part => part.type === 'code').length} code snippet(s)
                </span>
              </div>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1 text-sm">
                <Heart className="w-5 h-5" />
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MessageCircle className="w-5 h-5" />
                <span>0</span>
              </div>
              {hasCodeBlocks && (
                <div className="flex items-center gap-1 text-sm">
                  <Code className="w-5 h-5" />
                  <span className="font-mono">Code</span>
                </div>
              )}
            </div>
            <LikeButton postId={post.id} onLikeCountChange={setLikeCount} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostItem;