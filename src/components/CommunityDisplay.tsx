import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";
import PostSkeleton from "./PostSkeleton"; // Import the skeleton component

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: { 
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("Posts")
    .select("*, Communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[]; 
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  // Skeleton loading state
  if (isLoading) {
    return (
      <div>
        {/* Skeleton header */}
        <div className="mb-10 text-center justify-center animate-pulse">
          <div className="h-10 bg-cyan-900/30 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-slate-700/30 rounded w-40 mx-auto"></div>
        </div>

        {/* Skeleton posts */}
        <div className="mx-auto flex flex-col gap-6">
          {[...Array(3)].map((_, index) => (
            <PostSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }
  
  if (error)
    return (
      <div className="text-center text-red-500 py-4">
        Error fetching data: {error.message}
      </div>
    );
  
  const communityName = data?.[0]?.communities?.name;

  return (
    <div>
      {/* Title is centered */}
      <div className="mb-10 text-center justify-center"> 
        <h2 className="text-4xl font-bold font-mono text-white mb-2">
            <span className="text-cyan-400">~/</span>{communityName ? communityName.toLowerCase().replace(/\s/g, '_') : 'community_feed'}
        </h2>
        <p className="text-gray-400 font-mono text-sm">
            posts from this community
        </p>
      </div>

      {data && data.length > 0 ? (
        <div className="mx-auto flex flex-col gap-6">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 font-mono py-12">
            No posts found in this community yet.
        </div>
      )}
    </div>
  );
};

export default CommunityDisplay;