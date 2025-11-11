import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  // This interface expects a 'communities' object with a 'name' property
  communities: { 
    name: string;
  };
}

// --- Data Fetching Function (CORRECTED SELECT) ---
export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("Posts")
    .select("*, Communities(name)") // ✅ FIX: Explicitly selecting 'name' from 'Communities'
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[]; 
};

// --- Component Logic (Revised for Safety) ---
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
  
  // ✅ Safety Check: Safely attempt to get the community name using optional chaining
  const communityName = data?.[0]?.communities?.name;

  return (
    <div>
      {/* Title Rendering: Displays fetched name or a fallback */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        {communityName ? `${communityName} Community Posts` : 'Community Posts'}
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts found in this community.
        </p>
      )}
    </div>
  );
};