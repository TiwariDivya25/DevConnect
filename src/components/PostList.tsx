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
    // Check if supabase client is available
    if (!supabase) {
        console.warn('Supabase client not available, using mock data');
        return [];
    }

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        throw new Error("Error fetching posts: " + error.message);
    }

    return data as Post[];
};

const PostList = () => {
    const { data, error, isLoading } = useQuery<Post[], Error>({
        queryKey: ["posts"],
        queryFn: fetchPosts
    });



    if (isLoading) {
        return <div className="text-center py-8 text-gray-400">Loading posts...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-400 font-mono mb-2">❌ Error loading posts</div>
                <div className="text-gray-500 text-sm">{error.message}</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 font-mono border border-dashed border-cyan-900/30 rounded-lg bg-slate-900/20 p-8">
                    <p className="text-xl mb-2">📭 No posts found</p>
                    <p className="text-sm text-gray-500">Your database is empty or Posts table doesn't exist</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    )
}

export default PostList
