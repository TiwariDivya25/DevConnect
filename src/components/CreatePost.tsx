import React, { type ChangeEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, normalizeApiError } from '../supabase-client';
import { useAuth } from '../context/AuthContext';
import type { Community } from './CommunityList';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id: number | null;
}

/* ===================== DATA ===================== */

const fetchCommunities = async (): Promise<Community[]> => {
    const { data, error } = await supabase
        .from('Communities')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw normalizeApiError(error, 'Failed to load communities');
    }

    return data as Community[];
};

const CreatePost = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    /* ===================== STATE ===================== */

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [communityId, setCommunityId] = useState<number | null>(null);

    /* ===================== UPLOAD LOGIC ===================== */

    const uploadPost = async (post: PostInput, imageFile: File | null) => {
        if (!imageFile) {
            throw normalizeApiError(null, 'Image file is required');
        }

        const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

        const { error: imageError } = await supabase.storage
            .from('post-images')
            .upload(filePath, imageFile);

        if (imageError) {
            throw normalizeApiError(imageError, 'Failed to upload image');
        }

        const { data: publicUrl } = supabase.storage
            .from('post-images')
            .getPublicUrl(filePath);

        const { data, error } = await supabase
            .from('Posts')
            .insert({
                title: post.title,
                content: post.content,
                image_url: publicUrl.publicUrl,
                avatar_url: post.avatar_url,
                community_id: post.community_id
            })
            .select();

        if (error) {
            throw normalizeApiError(error, 'Failed to create post');
        }

        return data;
    };

    /* ===================== QUERIES ===================== */

    const {
        data: communities,
        isLoading: communitiesLoading,
        isError: communitiesError
    } = useQuery<Community[], Error>({
        queryKey: ['communities'],
        queryFn: fetchCommunities
    });

    const {
        mutate,
        isPending,
        error,
        isSuccess
    } = useMutation({
        mutationFn: (data: { post: PostInput; imageFile: File | null }) =>
            uploadPost(data.post, data.imageFile),
        onSuccess: () => {
            setTitle('');
            setContent('');
            setImageFile(null);
            setImagePreview(null);
            setCommunityId(null);
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }
    });

    /* ===================== HANDLERS ===================== */

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to create a post');
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert('Please fill in all fields');
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
    };

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
    };

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null);
    };

    /* ===================== UI ===================== */

    return (
        <div className="min-h-screen bg-slate-950 pt-16">
            {/* Header */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Create a Post
                    </h1>
                    <p className="text-gray-400">
                        Share your ideas with the community
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-6"
                >
                    {/* Success Message */}
                    {isSuccess && (
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-green-400">
                                Post created successfully! Redirecting...
                            </span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-semibold">
                                    Error creating post
                                </p>
                                <p className="text-red-300 text-sm">
                                    {'message' in error
                                        ? error.message
                                        : 'Something went wrong'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* User Info */}
                    {user?.user_metadata?.avatar_url && (
                        <div className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Your avatar"
                                className="w-10 h-10 rounded-full ring-2 ring-cyan-500/50"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-300">
                                    Posting as
                                </p>
                                <p className="text-sm text-gray-400">
                                    {user.user_metadata?.user_name || user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white"
                            placeholder="What's your post about?"
                            required
                            disabled={isPending}
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label
                            htmlFor="content"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white resize-none"
                            rows={5}
                            required
                            disabled={isPending}
                        />
                    </div>

                    {/* Community */}
                    <div>
                        <label
                            htmlFor="community"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Community (Optional)
                        </label>
                        <select
                            id="community"
                            value={communityId || ''}
                            onChange={handleCommunityChange}
                            disabled={communitiesLoading || isPending}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white"
                        >
                            <option value="">
                                {communitiesLoading
                                    ? 'Loading communities...'
                                    : 'Select a community (optional)'}
                            </option>
                            {communities?.map((community) => (
                                <option key={community.id} value={community.id}>
                                    {community.name}
                                </option>
                            ))}
                        </select>
                        {communitiesError && (
                            <p className="text-sm text-red-400 mt-1">
                                Error loading communities
                            </p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label
                            htmlFor="image"
                            className="block text-sm font-semibold text-white mb-2"
                        >
                            Cover Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isPending}
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-4 w-full h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isPending || isSuccess}
                        className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg"
                    >
                        {isPending
                            ? 'Creating...'
                            : isSuccess
                            ? 'Post Created!'
                            : 'Create Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
