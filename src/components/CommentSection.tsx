import React from 'react'
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentItem } from './CommentItem';

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  author: string;
  created_at: string;
  parent_comment_id: number | null;
  user_id: string;
  avatar_url?: string;
  children?: Comment[];
}

interface CommentSectionProps {
  postId: number;
}

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('Comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

const createComment = async (
  content: string,
  postId: number,
  userId?: string,
  author?: string,
  avatarUrl?: string
) => {
  if (!userId || !author) {
    throw new Error('You must be logged in to comment.');
  }

  const { error } = await supabase.from('Comments').insert({
    post_id: postId,
    content: content,
    user_id: userId,
    author: author,
    avatar_url: avatarUrl || null,
  });

  if (error) throw new Error(error.message);
};

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [newComment, setNewComment] = React.useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['Comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (content: string) => {
      const author = user?.user_metadata?.user_name || user?.user_metadata?.full_name || user?.email || 'Anonymous';
      const avatarUrl = user?.user_metadata?.avatar_url || null;
      return createComment(content, postId, user?.id, author, avatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Comments', postId] });
      setNewComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    mutate(newComment);
  };

  // Build comment tree structure
  const buildCommentTree = (comments: Comment[]): Comment[] => {
    const map = new Map<number, Comment>();
    const roots: Comment[] = [];

    comments.forEach(comment => {
      map.set(comment.id, { ...comment, children: [] });
    });

    comments.forEach(comment => {
      const node = map.get(comment.id)!;
      if (comment.parent_comment_id === null) {
        roots.push(node);
      } else {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mt-8">
      <h3 className="font-mono text-lg font-bold text-cyan-300 mb-6">// comments</h3>
      
      {/* Comment Input */}
      {user ? (
        <form className="mb-6" onSubmit={handleSubmit}>
          <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-4">
            <div className="flex gap-4">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full ring-2 ring-cyan-400/50 shrink-0 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 shrink-0"></div>
              )}
              <div className="flex-1">
                <textarea
                  className="w-full bg-slate-800 border border-cyan-900/30 rounded p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none font-mono placeholder-gray-600"
                  style={{color: '#fff'}}
                  placeholder="$ write your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setNewComment('')}
                    className="px-4 py-1 text-sm font-mono text-gray-400 hover:text-gray-300 hover:bg-slate-700/50 rounded transition"
                  >
                    cancel
                  </button>
                  <button
                    className="px-4 py-1 text-sm font-mono font-bold text-white bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 rounded transition disabled:opacity-50"
                    type="submit"
                    disabled={isPending || !newComment.trim()}
                  >
                    {isPending ? 'posting...' : 'post'}
                  </button>
                </div>
                {isError && <p className="text-red-400 text-xs mt-2 font-mono">error: {error?.message}</p>}
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-900 border border-cyan-900/30 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm font-mono">login required to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-0">
        {isLoading ? (
          <div className="text-gray-500 text-center py-4 font-mono">loading comments...</div>
        ) : commentTree.length === 0 ? (
          <div className="text-gray-500 text-center py-4 font-mono">no comments yet</div>
        ) : (
          commentTree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} formatTime={formatTime} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;