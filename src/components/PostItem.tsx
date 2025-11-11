import { Link } from 'react-router-dom';
import type { Post } from './PostList';
import { MessageCircle, Send, Bookmark } from 'lucide-react';
import LikeButton from './LikeButton';
import { useState, useEffect } from 'react';

interface Props {
    post: Post;
}

const PostItem = ({ post }: Props) => {
    const [likeCount, setLikeCount] = useState(0);

    return (
        <div className="bg-white border border-gray-200 w-full max-w-md mx-auto">
            <Link to={`/post/${post.id}`} className="block">
                {/* Header: Avatar and Username */}
                <div className="flex items-center p-3">
                    {post.avatar_url ? (
                        <img 
                            src={post.avatar_url} 
                            alt="User avatar"
                            className="w-8 h-8 rounded-full mr-3 flex-shrink-0 object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 rounded-full mr-3 flex-shrink-0"></div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900">
                        {post.title}
                    </h3>
                </div>

                {/* Image - Square 1:1 */}
                {post.image_url && (
                    <div className="w-full aspect-square bg-gray-100">
                        <img 
                            src={post.image_url} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                    <LikeButton postId={post.id} onLikeCountChange={setLikeCount} />
                    <Link to={`/post/${post.id}`}>
                        <MessageCircle className="w-6 h-6 cursor-pointer hover:text-gray-500 transition-colors" />
                    </Link>
                    <Send className="w-6 h-6 cursor-pointer hover:text-gray-500 transition-colors" />
                </div>
                <Bookmark className="w-6 h-6 cursor-pointer hover:text-gray-500 transition-colors" />
            </div>

            {/* Likes Count */}
            <div className="px-3 pb-2">
                <p className="text-sm font-semibold text-gray-900">
                    {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                </p>
            </div>

            <Link to={`/post/${post.id}`} className="block">
                {/* Caption */}
                <div className="px-3 pb-3">
                    <p className="text-sm text-gray-900">
                        <span className="font-semibold mr-2">{post.title}</span>
                        <span className="text-gray-700">
                            {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
                        </span>
                    </p>
                </div>

                {/* Timestamp */}
                <div className="px-3 pb-3">
                    <p className="text-xs text-gray-400 uppercase">2 hours ago</p>
                </div>
            </Link>
        </div>
    );
}

export default PostItem;