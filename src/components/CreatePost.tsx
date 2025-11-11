import React, { type ChangeEvent } from 'react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';
import type { Community } from './CommunityList';

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
    const [communityId, setCommunityId] = useState<number | null>(null);
    const {user} = useAuth();

    // Fetch communities
    const { data: communities, isLoading: communitiesLoading, isError: communitiesError } = useQuery<Community[], Error>({
        queryKey: ['communities'],
        queryFn: fetchCommunities
    });

    const {mutate, isPending, error} = useMutation({
        mutationFn: (data: {post: PostInput, imageFile: File | null}) => {
            return uploadPost(data.post, data.imageFile);
        },
        onSuccess: () => {
            setTitle('');
            setContent('');
            setImageFile(null);
            setCommunityId(null);
            queryClient.invalidateQueries({queryKey: ['posts']});
            alert('Post created successfully!');
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            alert('You must be logged in to create a post');
            return;
        }
        
        if (!imageFile) {
            alert('Please select an image');
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
            setImageFile(e.target.files[0]);
        }
    }

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null);
    }

    return (
        <form className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
              onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold mb-6">Create a New Post</h2>
            
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error.message}</div>}
            
            {/* Show current user avatar for confirmation */}
            {(user?.user_metadata?.avatar_url || user?.identities?.[0]?.identity_data?.avatar_url) && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <img 
                        src={user?.user_metadata?.avatar_url || user?.identities?.[0]?.identity_data?.avatar_url} 
                        alt="Your avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Posting as</p>
                        <p className="text-sm text-gray-600">{user.user_metadata?.user_name || user.email}</p>
                    </div>
                </div>
            )}
            
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    placeholder="Enter post title"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                </label>
                <textarea
                    id="content"
                    value={content}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    rows={5}
                    placeholder="Enter post content"
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Community (optional)
                </label>
                <select
                    id="community"
                    value={communityId || ''}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    onChange={handleCommunityChange}
                    disabled={communitiesLoading}
                >
                    <option value="">
                        {communitiesLoading ? 'Loading communities...' : '-- Choose a community --'}
                    </option>
                    {communities?.map((community) => (
                        <option key={community.id} value={community.id}>
                            {community.name}
                        </option>
                    ))}
                </select>
                {communitiesError && (
                    <p className="text-sm text-red-600 mt-1">Error loading communities</p>
                )}
            </div>  

            <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                </label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="border border-gray-300 p-2 w-full rounded-md"
                    onChange={handleFileChange}
                    required
                /> 
            </div>

            <button 
                type="submit" 
                disabled={isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md text-white font-medium transition"
            >
                {isPending ? 'Creating...' : 'Create Post'}
            </button>
        </form>
    );
}

export default CreatePost