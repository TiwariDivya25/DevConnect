import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from '../hooks/useAuth';
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
  formatTime: (dateString: string) => string;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string,
  avatarUrl?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("Comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
    avatar_url: avatarUrl || null,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId, formatTime }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (replyContent: string) => {
      const author = user?.user_metadata?.user_name || user?.user_metadata?.full_name || user?.email || 'Anonymous';
      const avatarUrl = user?.user_metadata?.avatar_url || null;
      return createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        author,
        avatarUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    mutate(replyText);
  };

  const hasChildren = comment.children && comment.children.length > 0;

  return (
    <div className="border-l-2 border-gray-200 hover:border-gray-300 transition">
      <div className="pl-4 py-3">
        {/* Comment Header */}
        <div className="flex gap-3">
          {/* Sidebar with collapse */}
          {hasChildren && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="mt-1 p-0 hover:bg-gray-200 rounded"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-4"></div>}
          <div className="flex-1">
            {/* Meta info */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-900">{comment.author}</span>
              <span>•</span>
              <span>{formatTime(comment.created_at)}</span>
            </div>

            {/* Comment text */}
            <p className="mt-2 text-sm text-gray-900">{comment.content}</p>

            {/* Actions */}
            <div className="flex gap-4 mt-2 text-xs">
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-gray-500 hover:text-blue-500 font-medium transition"
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
            </div>

            {/* Reply Form */}
            {showReply && user && (
              <form onSubmit={handleReplySubmit} className="mt-3 bg-gray-50 rounded p-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:border-blue-500"
                  placeholder="What are your thoughts?"
                  rows={2}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowReply(false)}
                    className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded disabled:opacity-50"
                    disabled={isPending}
                  >
                    {isPending ? "Posting..." : "Reply"}
                  </button>
                </div>
                {isError && <p className="text-red-500 text-xs mt-2">Error: {error?.message}</p>}
              </form>
            )}

            {/* Replies */}
            {hasChildren && !isCollapsed && (
              <div className="mt-3 space-y-0">
                {comment.children!.map((child) => (
                  <CommentItem
                    key={child.id}
                    comment={child}
                    postId={postId}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}

            {/* Collapsed indicator */}
            {hasChildren && isCollapsed && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                <ChevronDown className="w-3 h-3" />
                {comment.children!.length} {comment.children!.length === 1 ? 'reply' : 'replies'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};