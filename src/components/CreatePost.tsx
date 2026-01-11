import React, { type ChangeEvent } from 'react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';
import type { Community } from './CommunityList';
import { Upload} from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';

const MAX_CHARS = 500;

interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id: number | null;
}   

const fetchCommunities = async (): Promise<Community[]> => {
    const { data, error } = await supabase
        .from('Communities')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        throw new Error("Error fetching communities: " + error.message);
    }
    return data as Community[];
}

const CreatePost = () => {
    const queryClient = useQueryClient();
    
    const uploadPost = async (post: PostInput, imageFile: File | null) => {
        if (!imageFile) {
            throw new Error("Image file is required");
        }

        const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

        const {error: imageError} = await supabase.storage
            .from('post-images')
            .upload(filePath, imageFile);

        if (imageError) {
            throw new Error("Error uploading image: " + imageError.message);
        }

        const {data: publicUrl} = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

        const {data, error} = await supabase.from("Posts").insert({
            title: post.title,
            content: post.content,
            image_url: publicUrl.publicUrl,
            avatar_url: post.avatar_url,
            community_id: post.community_id
        }).select();

        if (error) {
            throw new Error("Error creating post: " + error.message);
        }
        return data;
    }

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [communityId, setCommunityId] = useState<number | null>(null);
    const {user} = useAuth();

    const { data: communities, isLoading: communitiesLoading, isError: communitiesError } = useQuery<Community[], Error>({
        queryKey: ['communities'],
        queryFn: fetchCommunities
    });

    const {mutate, isPending,  isSuccess} = useMutation({
        mutationFn: (data: {post: PostInput, imageFile: File | null}) => {
            return uploadPost(data.post, data.imageFile);
        },
        onSuccess: () => {
            showSuccess('Post created successfully!');

            setTitle('');
            setContent('');
            setImageFile(null);
            setImagePreview(null);
            setCommunityId(null);

            queryClient.invalidateQueries({queryKey: ['posts']});

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        },
        onError:(err:Error)=>{
            showError(err.message || "Failed To Create Post");
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            showError('You must be logged in to create a post');
            return;
        }
        
        if (!imageFile) {
            showError('Please select an image');
            return;
        }

        if (!title.trim() || !content.trim()) {
            showError('Please fill in all fields');
            return;
        }

        if (content.length > MAX_CHARS) {
            showError('Content exceeds character limit');
            return;
        }
        
        mutate({
            post: {
                title, 
                content, 
                avatar_url: user.user_metadata?.avatar_url || null,
                community_id: communityId
            }, 
            imageFile
        });
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null);
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-16">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Create a Post</h1>
                    <p className="text-gray-400">Share your ideas with the community</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-6">
        
                    

                    {user?.user_metadata?.avatar_url && (
                        <div className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                            <img 
                                src={user.user_metadata.avatar_url}
                                alt="Your avatar"
                                className="w-10 h-10 rounded-full ring-2 ring-cyan-500/50"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-300">Posting as</p>
                                <p className="text-sm text-gray-400">{user.user_metadata?.user_name || user.email}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"
                            placeholder="What's your post about?"
                            required
                            disabled={isPending}
                        />
                        <p className="text-xs text-gray-500 mt-1">Keep it short and descriptive</p>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-semibold text-white mb-2">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`w-full bg-slate-800/50 border ${content.length > MAX_CHARS ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-cyan-500/50 focus:ring-cyan-500/20'} rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition resize-none`}
                            rows={5}
                            placeholder="Share your thoughts, experiences, or insights..."
                            required
                            disabled={isPending}
                        />
                        <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">Write something meaningful</p>
                            <p className={`text-xs font-medium ${content.length > MAX_CHARS ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                {content.length} / {MAX_CHARS}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="community" className="block text-sm font-semibold text-white mb-2">
                            Community (Optional)
                        </label>
                        <select
                            id="community"
                            value={communityId || ''}
                            onChange={handleCommunityChange}
                            disabled={communitiesLoading || isPending}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"
                        >
                            <option value="">
                                {communitiesLoading ? 'Loading communities...' : 'Select a community (optional)'}
                            </option>
                            {communities?.map((community) => (
                                <option key={community.id} value={community.id}>
                                    {community.name}
                                </option>
                            ))}
                        </select>
                        {communitiesError && (
                            <p className="text-sm text-red-400 mt-1">Error loading communities</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-semibold text-white mb-2">
                            Cover Image
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isPending}
                                className="hidden"
                            />
                            <label 
                                htmlFor="image"
                                className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition"
                            >
                                <div className="text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-white">Click to upload image</p>
                                    <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                                </div>
                            </label>
                        </div>

                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                                <img 
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border border-slate-700"
                                />
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isPending || isSuccess || content.length > MAX_CHARS}
                        className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors duration-300 ${content.length > MAX_CHARS ? 'bg-red-600 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'} text-white disabled:opacity-50`}
                    >
                        {content.length > MAX_CHARS ? (
                            "Too Long to Post"
                        ) : isPending ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Creating...
                            </span>
                        ) : isSuccess ? (
                            "Post Created!"
                        ) : (
                            "Create Post"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;