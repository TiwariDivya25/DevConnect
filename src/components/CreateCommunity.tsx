import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase
    .from("communities")
    .insert([community])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      setName("");
      setDescription("");
      setTimeout(() => {
        navigate("/communities");
      }, 1500);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }
    mutate({ name, description });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
        <h2 className="text-3xl font-semibold text-white mb-2">Create Community</h2>
        <p className="text-gray-400 mb-6">Build a space for developers to connect and collaborate</p>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Community created successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-red-400 font-semibold">Error creating community</p>
              <p className="text-red-300 text-sm">{error?.message || "Please try again"}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
            Community Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition"
            placeholder="e.g., React Developers, Python Community"
            required
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">Give your community a clear, descriptive name</p>
        </div>

        <div className="mb-8">
          <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition resize-none"
            placeholder="Describe what your community is about, who should join, and what topics you'll discuss..."
            rows={4}
            required
            disabled={isPending}
          />
          <p className="text-xs text-gray-500 mt-1">Be specific about the community's purpose</p>
        </div>

        <button
          type="submit"
          disabled={isPending || isSuccess}
          className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white font-semibold rounded-lg transition-colors duration-300"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating...
            </span>
          ) : isSuccess ? (
            "Community Created!"
          ) : (
            "Create Community"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCommunity;
