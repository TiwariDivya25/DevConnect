import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { supabase } from '../supabase-client';
import { Link } from 'react-router-dom';

export interface Community {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

const fetchCommunities = async (): Promise<Community[]> => {
    const { data, error } = await supabase.from('Communities').select('*').order('created_at', { ascending: false });
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
        return <div>Loading communities...</div>;
    }
    if (isError) {
        return <div>Error loading communities.</div>;
    }

  return (
    <div>
        
        <div>
            {data?.map((community, key) => (
                <div key={key} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">{community.name}</h3>
                    <p className="text-gray-600">{community.description}</p>
                    <Link to={`/communities/${community.id}`} className="text-blue-500 hover:underline mt-2 inline-block">View Community</Link>
                </div>
            ))}
        </div>
    </div>
  )
}

export default CommunityList
