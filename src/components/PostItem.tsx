import { Link } from 'react-router-dom';
import type { Post } from './PostList';
import { MessageCircle, Heart } from 'lucide-react';
import LikeButton from './LikeButton';
import { useState } from 'react';

interface Props {
    post: Post;
}

const PostItem = ({ post }: Props) => {
    const [likeCount, setLikeCount] = useState(0);

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
                <div className="p-6 space-y-4 grow">
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
                    <div className="space-y-2">
                        <p className="text-base text-gray-300 line-clamp-3 leading-relaxed">
                            {post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content}
                        </p>
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
                        </div>
                        <LikeButton postId={post.id} onLikeCountChange={setLikeCount} />
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PostItem;