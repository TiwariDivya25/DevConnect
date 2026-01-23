import { supabase } from '../supabase-client';
import type { PostWithAuthor, PostStatus, AdminAction, PostModerationStats } from '../types/admin';

// Fetch all pending posts for moderation
export const fetchPendingPosts = async (): Promise<PostWithAuthor[]> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { data, error } = await supabase
    .from('pending_posts')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Error fetching pending posts: ${error.message}`);
  return data as PostWithAuthor[];
};

// Fetch all posts with any status (admin view)
export const fetchAllPostsForAdmin = async (): Promise<PostWithAuthor[]> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { data, error } = await supabase
    .from('Posts')
    .select(`
      *,
      Profiles!user_id(full_name),
      Communities(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Error fetching posts: ${error.message}`);
  
  return (data as any[]).map(post => ({
    ...post,
    author_name: post.Profiles?.full_name || null,
    community_name: post.Communities?.name || null,
  }));
};

// Update post status (approve/reject)
export const updatePostStatus = async (
  postId: number,
  status: PostStatus,
  rejectionReason?: string
): Promise<void> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { error } = await supabase
    .from('Posts')
    .update({
      status,
      rejection_reason: status === 'rejected' ? rejectionReason || null : null,
      reviewed_by: supabase.auth.getSession().then(({ data }) => data.session?.user.id),
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (error) throw new Error(`Error updating post status: ${error.message}`);
};

// Approve a post
export const approvePost = async (postId: number): Promise<void> => {
  await updatePostStatus(postId, 'approved');
};

// Reject a post
export const rejectPost = async (postId: number, reason: string): Promise<void> => {
  await updatePostStatus(postId, 'rejected', reason);
};

// Delete a post (soft delete via status)
export const deletePost = async (postId: number): Promise<void> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { error } = await supabase
    .from('Posts')
    .delete()
    .eq('id', postId);

  if (error) throw new Error(`Error deleting post: ${error.message}`);
};

// Fetch moderation statistics
export const fetchModerationStats = async (): Promise<PostModerationStats> => {
  if (!supabase) throw new Error('Supabase client not available');

  // Get all posts grouped by status
  const { data: allPosts, error } = await supabase
    .from('Posts')
    .select('status', { count: 'exact' });

  if (error) throw new Error(`Error fetching stats: ${error.message}`);

  const pending = allPosts?.filter(p => p.status === 'pending').length || 0;
  const approved = allPosts?.filter(p => p.status === 'approved').length || 0;
  const rejected = allPosts?.filter(p => p.status === 'rejected').length || 0;
  const total = allPosts?.length || 1;

  return {
    total_pending: pending,
    total_approved: approved,
    total_rejected: rejected,
    pending_percentage: Math.round((pending / total) * 100),
  };
};

// Fetch admin activity log
export const fetchAdminActions = async (limit: number = 50): Promise<AdminAction[]> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { data, error } = await supabase
    .from('AdminActions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Error fetching admin actions: ${error.message}`);
  return data as AdminAction[];
};

// Check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  // Demo mode: recognize demo admin user
  if (!supabase && userId === 'demo-admin-user-001') {
    return true;
  }
  
  if (!supabase) return false;

  const { data, error } = await supabase
    .from('Profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return data?.role === 'admin' || data?.role === 'moderator';
};

// Get current user's admin role
export const getCurrentUserRole = async (userId: string): Promise<string | null> => {
  // Demo mode: recognize demo admin user
  if (!supabase && userId === 'demo-admin-user-001') {
    return 'admin';
  }
  
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('Profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return data?.role || null;
};

// Bulk approve posts
export const bulkApprovePosts = async (postIds: number[]): Promise<void> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { error } = await supabase
    .from('Posts')
    .update({
      status: 'approved',
      reviewed_by: (await supabase.auth.getSession()).data.session?.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .in('id', postIds);

  if (error) throw new Error(`Error bulk approving posts: ${error.message}`);
};

// Bulk reject posts
export const bulkRejectPosts = async (postIds: number[], reason: string): Promise<void> => {
  if (!supabase) throw new Error('Supabase client not available');

  const { error } = await supabase
    .from('Posts')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      reviewed_by: (await supabase.auth.getSession()).data.session?.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .in('id', postIds);

  if (error) throw new Error(`Error bulk rejecting posts: ${error.message}`);
};
