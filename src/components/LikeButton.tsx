import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../supabase-client';
import { useAuth } from '../hooks/useAuth';

interface Props {
    postId: number;
    onLikeCountChange?: (count: number) => void;
}

interface Vote {
    id: number;
    post_id: number;
    user_id: string;
    vote: number;
}

const like = async (likeValue: number, postId: number, userId: string) => {
    const { data: existingVote } = await supabase
        .from('Votes')
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();

    if (existingVote) {
        if (existingVote.vote === likeValue) {
            // User is unliking the post
            const { error } = await supabase
                .from('Votes')
                .delete()
                .eq("post_id", postId)
                .eq("user_id", userId);
            if (error) {
                throw new Error("Error unliking post: " + error.message);
            }
        }
    } else {
        const { error } = await supabase
            .from('Votes')
            .insert({ post_id: postId, user_id: userId, vote: likeValue });
        
        if (error) {
            throw new Error("Error liking post: " + error.message);
        }
    }
};

const fetchLikes = async (postId: number): Promise<Vote[]> => {
    const { data, error } = await supabase
        .from('Votes')
        .select('*')
        .eq('post_id', postId);
    if (error) {
        throw new Error("Error fetching likes: " + error.message);
    }
    return data || [];
};

const LikeButton = ({ postId, onLikeCountChange }: Props) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const { data: votes, isLoading } = useQuery({
        queryKey: ['votes', postId], 
        queryFn: () => fetchLikes(postId),
        refetchInterval: 5000,
    });

    const { mutate } = useMutation({
        mutationFn: (voteValue: number) => {
            if (!user) {
                throw new Error("User must be logged in to like a post");
            }
            return like(voteValue, postId, user.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['votes', postId] });
        }
    });

    const likeCount = votes ? votes.filter(vote => vote.vote === 1).length : 0;
    const userVote = votes?.find(vote => vote.user_id === user?.id)?.vote || 0;

    // Update parent component with like count using useEffect to avoid re-render loops
    useEffect(() => {
        if (onLikeCountChange && votes) {
            onLikeCountChange(likeCount);
        }
    }, [likeCount, onLikeCountChange, votes]);

    if (isLoading) {
        return (
            <div>
                <button className="flex items-center gap-1">
                    <Heart className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </button>
            </div>
        );
    }

    return (
        <div>
            <button 
                className="flex items-center gap-1 transition-all hover:scale-110" 
                onClick={() => {
                    if (!user) {
                        alert("Please log in to like posts");
                        return;
                    }
                    mutate(1);
                }}
            >
                <Heart 
                    className={`w-6 h-6 transition-colors ${
                        userVote === 1 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-900 hover:text-red-500 dark:text-red-500 dark:hover:text-red-600'
                    }`}
                />
            </button>
        </div>
    );
};

export default LikeButton;