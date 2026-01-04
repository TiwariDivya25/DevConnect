import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Upload, X as XIcon } from 'lucide-react';

interface PostUpdateInput {
  title: string;
  content: string;
  image_url?: string;
}

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (post && !hasLoadedInitialData) {
      setTitle(post.title);
      setContent(post.content);
      setImagePreview(post.image_url);
      setHasLoadedInitialData(true);
      
      // Safety check: ensure only the owner can edit
      if (user && post.user_id !== user.id) {
        navigate(`/post/${id}`);
      }
    }
  }, [post, user, id, navigate, hasLoadedInitialData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (updates: PostUpdateInput) => {
      let finalUpdates = { ...updates };

      if (imageFile) {
        setIsUploading(true);
        const filePath = `updated-${Date.now()}-${imageFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: publicUrl } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
        
        finalUpdates.image_url = publicUrl.publicUrl;
      }

      const { error } = await supabase
        .from('posts')
        .update(finalUpdates)
        .eq('id', Number(id));
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', id] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTimeout(() => {
        navigate(`/profile/${user?.id}`);
      }, 1500);
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    updateMutation.mutate({ title, content });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse">Loading post data...</div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-900/30 p-8 rounded-2xl text-center max-w-md">
          <AlertCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Post</h2>
          <p className="text-gray-400 mb-6">We couldn't find the post you're looking for or you don't have permission to edit it.</p>
          <Link to="/" className="text-cyan-400 hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-8 font-mono">Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2 uppercase tracking-wider">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition"
                placeholder="Enter a catchy title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2 uppercase tracking-wider">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition resize-none"
                placeholder="What's on your mind?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2 uppercase tracking-wider">
                Post Image
              </label>
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(post?.image_url || null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-cyan-400 mb-2" />
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 font-mono">
                      {imageFile ? imageFile.name : 'Click to upload new image'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-gray-400 font-mono font-bold py-4 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending || isUploading}
                className="flex-[2] bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {updateMutation.isPending || isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isUploading ? 'Uploading Image...' : 'Saving Changes...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Post</span>
                  </>
                )}
              </button>
            </div>

            {updateMutation.isSuccess && (
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm justify-center animate-bounce">
                <CheckCircle className="w-4 h-4" />
                <span>Post updated successfully! Redirecting...</span>
              </div>
            )}

            {updateMutation.isError && (
              <div className="flex items-center gap-2 text-red-400 font-mono text-sm justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>Error: {updateMutation.error instanceof Error ? updateMutation.error.message : 'Failed to update post'}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
