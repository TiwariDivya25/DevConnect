import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  description: string;
}
const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("Communities").insert(community);

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["communities"] });
    navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Community</h2>
        <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Community Name
            </label>
            <input
                type="text"
                id="name"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter community name"
                required
                onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
            </label>
            <textarea
                id="description"
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter community description"
                rows={4}
                required
                onChange={(e) => setDescription(e.target.value)}
            ></textarea>
        </div>
        <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
           {isPending ? 'Creating...' : 'Create Community'}
        </button>
        {isError && (
            <p className="text-red-600 mt-4">Error creating community. Please try again.</p>
        )}
    </form>
  )
}

export default CreateCommunity
