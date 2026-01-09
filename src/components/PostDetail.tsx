import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { MessageCircle, Send, Bookmark, ArrowLeft, Code, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import CopyButton from './CopyButton';
import { CodeBlock } from './CodeBlock';

interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string;
    avatar_url: string | null;
    created_at: string;
}

interface PostDetailProps {
    postId: number;
}

// Helper function to parse content and extract code blocks
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

// Helper function to count code blocks
const countCodeBlocks = (content: string): number => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const matches = content.match(codeBlockRegex);
  return matches ? matches.length : 0;
};

// Helper function to extract all code snippets for bulk copy
const extractAllCodeSnippets = (content: string): string => {
  const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
  const snippets: string[] = [];
  let match;
  
  codeBlockRegex.lastIndex = 0;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    snippets.push(match[1].trim());
  }
  
  return snippets.join('\n\n' + '-'.repeat(50) + '\n\n');
};

const fetchPost = async (postId: number): Promise<Post> => {
    const { data, error } = await supabase
        .from('Posts')
        .select('*')
        .eq('id', postId)
        .single();
    
    if (error) {
        throw new Error("Error fetching post: " + error.message);
    }
    return data as Post;
};

const PostDetail = ({ postId }: PostDetailProps) => {
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(0);
    const [showAllCode, setShowAllCode] = useState(false);
    
    const { data: post, error, isLoading } = useQuery<Post, Error>({
        queryKey: ["post", postId],
        queryFn: () => fetchPost(postId)
    });

    // Parse content for code blocks
    const contentParts = useMemo(() => 
        post ? parseContentWithCode(post.content) : [], 
        [post]
    );
    
    const hasCodeBlocks = useMemo(() => 
        contentParts.some(part => part.type === 'code'), 
        [contentParts]
    );
    
    const codeBlocksCount = useMemo(() => 
        post ? countCodeBlocks(post.content) : 0, 
        [post]
    );
    
    const allCodeSnippets = useMemo(() => 
        post ? extractAllCodeSnippets(post.content) : '', 
        [post]
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Loading post...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">Error loading post: {error.message}</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">Post not found</div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>

            {/* Post Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* Header: Avatar and Title */}
                <div className="flex items-center p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
                    {post.avatar_url ? (
                        <img 
                            src={post.avatar_url} 
                            alt="User avatar"
                            className="w-12 h-12 rounded-full mr-4 shrink-0 object-cover ring-2 ring-white shadow"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mr-4 shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">{post.title}</h1>
                        <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                    </div>
                    
                    {/* Code blocks indicator */}
                    {hasCodeBlocks && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-lg">
                            <Code className="w-4 h-4 text-cyan-600" />
                            <span className="text-sm font-medium text-cyan-700">
                                {codeBlocksCount} code snippet{codeBlocksCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Image */}
                {post.image_url && (
                    <div className="w-full bg-gradient-to-br from-gray-100 to-gray-200">
                        <img 
                            src={post.image_url} 
                            alt={post.title} 
                            className="w-full h-auto object-contain max-h-[600px] mx-auto p-4"
                        />
                    </div>
                )}

                {/* Copy All Code Button (if has code blocks) */}
                {hasCodeBlocks && allCodeSnippets && (
                    <div className="px-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Code className="w-5 h-5 text-cyan-600" />
                                <h3 className="font-semibold text-gray-900">Code Snippets</h3>
                                <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded">
                                    {codeBlocksCount} total
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowAllCode(!showAllCode)}
                                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
                                >
                                    {showAllCode ? 'Hide all code' : 'Show all code'}
                                </button>
                                <CopyButton 
                                    text={allCodeSnippets}
                                    size="md"
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-700"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Content with Code Blocks */}
                <div className="px-6 py-6">
                    <div className="space-y-6">
                        {contentParts.map((part, index) => {
                            if (part.type === 'code') {
                                return (
                                    <div key={index} className="space-y-4">
                                        <CodeBlock 
                                            code={part.content}
                                            language={part.language}
                                        />
                                        {showAllCode && index < contentParts.length - 1 && (
                                            <div className="border-t border-dashed border-gray-300 pt-4"></div>
                                        )}
                                    </div>
                                );
                            }
                            
                            // Render text content
                            if (part.content.trim() === '') return null;
                            
                            return (
                                <div key={index} className="space-y-4">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                                        {part.content}
                                    </p>
                                    {showAllCode && index < contentParts.length - 1 && part.type === 'text' && (
                                        <div className="border-t border-dashed border-gray-300 pt-4"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <LikeButton postId={postId} onLikeCountChange={setLikeCount} />
                            <span className="text-lg font-semibold text-gray-900">{likeCount}</span>
                        </div>
                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MessageCircle className="w-6 h-6 text-gray-600" />
                            <span className="text-gray-700 font-medium">Comment</span>
                        </button>
                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Send className="w-6 h-6 text-gray-600" />
                            <span className="text-gray-700 font-medium">Share</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        {hasCodeBlocks && (
                            <CopyButton 
                                text={allCodeSnippets}
                                size="sm"
                                className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200"
                            />
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Bookmark className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Likes Count */}
                <div className="px-6 py-3 border-t border-gray-200">
                    <p className="text-lg font-bold text-gray-900">
                        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                    </p>
                </div>

                {/* Comments Section */}
                <div className="px-6 py-6 border-t border-gray-200">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Comments</h3>
                        <p className="text-gray-600">Join the discussion about this post</p>
                    </div>
                    <CommentSection postId={postId} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;