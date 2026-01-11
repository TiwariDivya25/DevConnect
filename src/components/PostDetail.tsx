import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { MessageCircle, Send, Bookmark, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';

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
    
    const { data: post, error, isLoading } = useQuery<Post, Error>({
        queryKey: ["post", postId],
        queryFn: () => fetchPost(postId)
    });

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
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 transition"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
            </button>

            {/* Post Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Header: Avatar and Title */}
                <div className="flex items-center p-4 border-b border-gray-200">
                    {post.avatar_url ? (
                        <img 
                            src={post.avatar_url} 
                            alt="User avatar"
                            className="w-10 h-10 rounded-full mr-3 shrink-0 object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-linear-to-br from-purple-400 via-pink-500 to-orange-400 rounded-full mr-3 shrink-0"></div>
                    )}
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">{post.title}</h1>
                        <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                    </div>
                </div>

                {/* Image */}
                {post.image_url && (
                    <div className="w-full bg-gray-100">
                        <img 
                            src={post.image_url} 
                            alt={post.title} 
                            className="w-full h-auto object-contain max-h-[600px]"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <LikeButton postId={postId} onLikeCountChange={setLikeCount} />
                        <MessageCircle className="w-7 h-7 cursor-pointer hover:text-blue-500 transition-colors" />
                        <Send className="w-7 h-7 cursor-pointer hover:text-blue-500 transition-colors" />
                    </div>
                    <Bookmark className="w-7 h-7 cursor-pointer hover:text-blue-500 transition-colors" />
                </div>

                {/* Likes Count */}
                <div className="px-4 pb-3">
                    <p className="text-sm font-semibold text-gray-900">
                        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                    </p>
                </div>

                {/* Full Content */}
                <div className="px-4 pb-4">
                    <div className="text-sm text-gray-900">
                        <span className="font-semibold mr-2">{post.title}</span>
                        <span className="text-gray-700 whitespace-pre-wrap">{post.content}</span>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="px-4 pb-4 border-t border-gray-200">
                    <CommentSection postId={postId} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;