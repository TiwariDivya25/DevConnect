import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

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
    .from("posts")
    .select("*, communities(name)")
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

  if (isLoading)
    return <div className="text-center py-4">Loading posts...</div>;
  
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