import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';

export interface Community {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

const fetchCommunities = async (): Promise<Community[]> => {
    const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        throw new Error("Error fetching communities: " + error.message);
    }
    return data as Community[];
}

const CommunityList = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['communities'],
        queryFn: fetchCommunities
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-400 font-mono">loading communities...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-red-400 font-mono">error loading communities</div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-400 font-mono">no communities yet</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {data.map((community) => (
                <Link 
                    key={community.id}
                    to={`/communities/${community.id}`}
                    className="group"
                >
                    <div className="bg-linear-to-br from-slate-900 to-slate-800 border border-cyan-900/30 rounded-lg p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-mono font-bold text-cyan-300 group-hover:text-cyan-200 transition mb-2">
                                    {community.name}
                                </h3>
                                <p className="text-sm text-gray-400 font-mono">
                                    {new Date(community.created_at).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/20 transition">
                                    <Users className="w-5 h-5 text-cyan-400" />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-6 grow font-mono line-clamp-3">
                            {community.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-cyan-900/20">
                            <span className="text-xs text-gray-500 font-mono">view community</span>
                            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default CommunityList;