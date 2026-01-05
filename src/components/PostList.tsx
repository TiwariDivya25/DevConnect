import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client';
import PostItem from './PostItem';

export interface Post {
    id: number;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
    avatar_url: string;
    likes: number;
}

const fetchPosts = async (): Promise<Post[]> => {
    const {data, error} = await supabase.from('posts').select('*').order('created_at', {ascending: false});
    if (error) {
        throw new Error("Error fetching posts: " + error.message);
    }
    return data as Post[];
};

const PostList = () => {
    const {data, error, isLoading} = useQuery<Post[], Error>({
        queryKey: ["posts"], 
        queryFn: fetchPosts
    });

    // Mock data to use when no real data is available
    const mockPosts: Post[] = [
        {
            id: 1,
            title: "Getting Started with React Hooks",
            content: "React Hooks revolutionized how we write React components by allowing us to use state and other React features without writing a class. In this post, we'll explore the most commonly used hooks like useState, useEffect, and custom hooks.",
            image_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=400&fit=crop",
            created_at: "2024-01-15T10:30:00Z",
            avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
            likes: 24
        },
        {
            id: 2,
            title: "Advanced TypeScript Patterns",
            content: "TypeScript has become the go-to choice for large-scale JavaScript applications. Let's explore advanced patterns like conditional types, mapped types, and utility types that can make your code more robust and maintainable.",
            image_url: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=800&h=400&fit=crop",
            created_at: "2024-01-14T14:22:00Z",
            avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            likes: 18
        },
        {
            id: 3,
            title: "Building Scalable APIs with Node.js",
            content: "Creating APIs that can handle millions of requests requires careful planning and the right architecture. We'll look at how to structure your Node.js application for maximum scalability and performance.",
            image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
            created_at: "2024-01-13T09:15:00Z",
            avatar_url: "https://images.unsplash.com/photo-1578176603894-57973e5d7d65?w=100&h=100&fit=crop&crop=face",
            likes: 32
        },
        {
            id: 4,
            title: "CSS Grid vs Flexbox: When to Use Which",
            content: "Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes. Understanding when to use each one can significantly improve your UI development workflow.",
            image_url: "https://images.unsplash.com/photo-1633322594021-60a0b6c0a1a0?w=800&h=400&fit=crop",
            created_at: "2024-01-12T16:40:00Z",
            avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
            likes: 27
        },
        {
            id: 5,
            title: "State Management in Modern React Apps",
            content: "With the introduction of React 18 and new patterns, state management has evolved significantly. We'll compare different approaches from Context API to external libraries like Zustand and Jotai.",
            image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
            created_at: "2024-01-11T11:05:00Z",
            avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
            likes: 41
        },
        {
            id: 6,
            title: "Optimizing Web Performance",
            content: "Web performance is crucial for user experience and SEO. We'll explore techniques like lazy loading, code splitting, and image optimization to make your applications faster.",
            image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
            created_at: "2024-01-10T13:30:00Z",
            avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
            likes: 35
        }
    ];

    if (isLoading) {
        return <div className="text-center py-8 text-gray-400">Loading posts...</div>;
    }

    // Use real data if available and no error, otherwise use mock data
    const postsToDisplay = (data && data.length > 0 && !error) ? data : mockPosts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsToDisplay.map((post) => (
            <PostItem key={post.id} post={post}/>
        ))}
    </div>
  )
}

export default PostList
