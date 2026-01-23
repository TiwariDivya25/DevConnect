export type PostStatus = 'pending' | 'approved' | 'rejected';
export type AdminRole = 'user' | 'admin' | 'moderator';
export type AdminActionType = 'approve' | 'reject' | 'delete' | 'edit';

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  avatar_url: string | null;
  user_id: string;
  community_id: number | null;
  created_at: string;
  updated_at: string;
  status: PostStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

export interface PostWithAuthor extends Post {
  author_name: string | null;
  community_name: string | null;
}

export interface AdminAction {
  id: number;
  admin_id: string;
  action_type: AdminActionType;
  target_type: 'post' | 'comment' | 'community';
  target_id: number;
  reason: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  role: AdminRole;
  email: string;
  avatar_url: string | null;
}

export interface PostModerationStats {
  total_pending: number;
  total_approved: number;
  total_rejected: number;
  pending_percentage: number;
}

export interface ModerationComment {
  status: PostStatus;
  reason?: string;
  reviewed_at: string;
}
