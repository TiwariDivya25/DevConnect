import { supabase } from "../supabase-client";
import type { Post } from "../components/PostList";

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