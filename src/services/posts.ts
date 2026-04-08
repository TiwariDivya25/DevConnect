import { supabase } from "../supabase-client";

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export const updatePost = async (postId: number, title: string, content: string, userId: string): Promise<Post> => {
  // First check if the user owns the post
  const { data: existingPost, error: checkError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (checkError) {
    throw new Error('Failed to verify post ownership');
  }

  if (existingPost?.user_id !== userId) {
    throw new Error('You can only edit your own posts');
  }

  // Update the post
  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update post: ' + error.message);
  }

  return data;
};

export const deletePost = async (postId: number, userId: string): Promise<void> => {
  // First check if the user owns the post
  const { data: existingPost, error: checkError } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (checkError) {
    throw new Error('Failed to verify post ownership');
  }

  if (existingPost?.user_id !== userId) {
    throw new Error('You can only delete your own posts');
  }

  // Delete the post
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to delete post: ' + error.message);
  }
};