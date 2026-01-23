import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Download,
} from 'lucide-react';
import { fetchPendingPosts, approvePost, rejectPost, deletePost } from '../utils/adminApi';
import { showSuccess, showError } from '../utils/toast';
import type { PostStatus } from '../types/admin';

interface AdminPostManagementProps {
  viewMode?: 'pending' | 'all';
  onlyPending?: boolean;
}

const AdminPostManagement: React.FC<AdminPostManagementProps> = () => {
  const queryClient = useQueryClient();
  const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<PostStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['pendingPosts'],
    queryFn: fetchPendingPosts,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const approveMutation = useMutation({
    mutationFn: (postId: number) => approvePost(postId),
    onSuccess: () => {
      showSuccess('Post approved successfully');
      queryClient.invalidateQueries({ queryKey: ['pendingPosts'] });
    },
    onError: (err) => {
      showError((err as Error).message || 'Failed to approve post');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (postId: number) => rejectPost(postId, rejectionReason),
    onSuccess: () => {
      showSuccess('Post rejected');
      queryClient.invalidateQueries({ queryKey: ['pendingPosts'] });
      setRejectModalOpen(null);
      setRejectionReason('');
    },
    onError: (err) => {
      showError((err as Error).message || 'Failed to reject post');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      showSuccess('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['pendingPosts'] });
    },
    onError: (err) => {
      showError((err as Error).message || 'Failed to delete post');
    },
  });

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author_name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [posts, filterStatus, searchTerm]);

  const selectedCount = selectedPosts.size;
  const pendingCount = posts.filter((p) => p.status === 'pending').length;
  const approvedCount = posts.filter((p) => p.status === 'approved').length;
  const rejectedCount = posts.filter((p) => p.status === 'rejected').length;

  const toggleSelectPost = (postId: number) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCount === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map((p) => p.id)));
    }
  };

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: PostStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
        <p>Error loading posts: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400/50" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-green-400">{approvedCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400/50" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-400">{rejectedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400/50" />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Posts</p>
              <p className="text-3xl font-bold text-cyan-400">
                {posts.length}
              </p>
            </div>
            <Download className="w-8 h-8 text-cyan-400/50" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as PostStatus | 'all')}
              className="bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center justify-between">
            <span className="text-cyan-300">
              {selectedCount} post{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  selectedPosts.forEach((id) => approveMutation.mutate(id));
                  setSelectedPosts(new Set());
                }}
                disabled={approveMutation.isPending}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-sm font-medium transition"
              >
                Approve All
              </button>
              <button
                onClick={() => {
                  selectedPosts.forEach((id) => deleteMutation.mutate(id));
                  setSelectedPosts(new Set());
                }}
                disabled={deleteMutation.isPending}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-sm font-medium transition"
              >
                Delete All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">No posts found</p>
          <p className="text-gray-500 text-sm mt-2">
            {searchTerm ? 'Try adjusting your search terms' : 'All posts are reviewed'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedCount === filteredPosts.length && filteredPosts.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
              <div className="flex-1 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-4">Title & Author</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Community</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {filteredPosts.map((post) => (
            <div key={post.id} className="space-y-2">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800 transition">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(post.id)}
                    onChange={() => toggleSelectPost(post.id)}
                    className="w-4 h-4 mt-1 accent-cyan-500 cursor-pointer"
                  />

                  <div className="flex-1 grid grid-cols-12 gap-4">
                    {/* Title & Author */}
                    <div className="col-span-4">
                      <p className="font-semibold text-white truncate">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        by {post.author_name || 'Anonymous'}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {getStatusIcon(post.status)}
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    </div>

                    {/* Community */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-300">
                        {post.community_name || '-'}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex gap-2 justify-end">
                      <button
                        onClick={() =>
                          setExpandedPostId(
                            expandedPostId === post.id ? null : post.id
                          )
                        }
                        title="View Details"
                        className="p-1 hover:bg-slate-700 rounded transition"
                      >
                        {expandedPostId === post.id ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                    {/* Post Image */}
                    {post.image_url && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="max-h-64 w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Post Content */}
                    <div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Rejection Reason */}
                    {post.status === 'rejected' && post.rejection_reason && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                        <p className="text-xs text-red-400 font-semibold">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-300 mt-1">
                          {post.rejection_reason}
                        </p>
                      </div>
                    )}

                    {/* Review Info */}
                    {post.reviewed_at && (
                      <div className="text-xs text-gray-500">
                        Reviewed on{' '}
                        {new Date(post.reviewed_at).toLocaleString()}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {post.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => approveMutation.mutate(post.id)}
                          disabled={approveMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-white font-medium transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => setRejectModalOpen(post.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>

                        <button
                          onClick={() => deleteMutation.mutate(post.id)}
                          disabled={deleteMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-lg text-white font-medium transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reject Modal */}
              {rejectModalOpen === post.id && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 space-y-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Rejection Reason:
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this post is being rejected..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setRejectModalOpen(null);
                        setRejectionReason('');
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (rejectionReason.trim()) {
                          rejectMutation.mutate(post.id);
                        }
                      }}
                      disabled={
                        rejectMutation.isPending || !rejectionReason.trim()
                      }
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-white font-medium transition"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPostManagement;
