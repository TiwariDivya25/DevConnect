import { useQuery } from "@tanstack/react-query";
import PostItem from "./PostItem";
import { fetchCommunityPost } from "../utils/communityApi";

interface Props {
  communityId: number;
}

interface PostWithCommunity {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  avatar_url?: string;
  community_id?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  communities: { 
    name: string;
  };
}

const CommunityDisplay = ({ communityId }: Props) => {
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