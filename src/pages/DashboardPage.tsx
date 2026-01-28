import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import {
  Users,
  Calendar,
  Code2,
  Plus,
  Activity,
  MessageCircle,
  ThumbsUp,
  Settings,
  ArrowRight,
  TrendingUp,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

// Interfaces based on the observed project structure
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  likes?: number;
}

interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
  member_count?: number;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'communities' | 'events'>('overview');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Fetch Summary Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (!user || !supabase) return { posts: 0, communities: 0, events: 0, created_communities: 0 };

      const [postsCount, membershipsCount, eventsCount, createdCommCount, votesCount, commentsCount] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('community_members').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('event_attendees').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('communities').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
        supabase.from('votes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      return {
        posts: postsCount.count || 0,
        communities: membershipsCount.count || 0,
        events: eventsCount.count || 0,
        created_communities: createdCommCount.count || 0,
        karma: (votesCount.count || 0) * 10 + (commentsCount.count || 0) * 5,
        contributions: (postsCount.count || 0) + (commentsCount.count || 0)
      };
    },
    enabled: !!user
  });

  // Fetch User Posts
  const { data: myPosts } = useQuery({
    queryKey: ['my-posts', user?.id],
    queryFn: async () => {
      if (!user || !supabase) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
    enabled: !!user && (activeTab === 'posts' || activeTab === 'overview')
  });

  // Fetch Joined Communities
  const { data: myCommunities } = useQuery({
    queryKey: ['my-communities', user?.id],
    queryFn: async () => {
      if (!user || !supabase) return [];
      const { data, error } = await supabase
        .from('community_members')
        .select('communities(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(item => item.communities) as unknown as Community[];
    },
    enabled: !!user && (activeTab === 'communities' || activeTab === 'overview')
  });

  // Fetch Created Communities
  const { data: createdCommunities } = useQuery({
    queryKey: ['created-communities', user?.id],
    queryFn: async () => {
      if (!user || !supabase) return [];
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Community[];
    },
    enabled: !!user && (activeTab === 'communities')
  });

  // Fetch Joined Events
  const { data: myEvents } = useQuery({
    queryKey: ['my-events', user?.id],
    queryFn: async () => {
      if (!user || !supabase) return [];
      const { data, error } = await supabase
        .from('event_attendees')
        .select('events(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(item => item.events) as unknown as Event[];
    },
    enabled: !!user && (activeTab === 'events' || activeTab === 'overview')
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono">
      {/* Dynamic Header */}
      <header className="bg-slate-900/40 border-b border-cyan-900/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <LayoutDashboard className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Command Center
                </h1>
                <p className="text-cyan-400/60 text-xs uppercase tracking-widest mt-0.5">
                  System.Admin.{user?.user_metadata?.full_name?.replace(/\s+/g, '.') || 'User'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/create"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Plus className="w-4 h-4" />
                INIT_POST
              </Link>
              <Link
                to="/profile"
                className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                title="Account Settings"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 border border-red-900/30 bg-red-900/10 rounded-lg hover:bg-red-900/20 transition-colors group"
                title="Terminate Session"
              >
                <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-400" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-6 mt-8">
            {[
              { id: 'overview', label: 'Dashboard', icon: Activity },
              { id: 'posts', label: 'My Code', icon: Code2 },
              { id: 'communities', label: 'Guilds', icon: Users },
              { id: 'events', label: 'Events', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'posts' | 'communities' | 'events')}
                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id
                  ? 'text-cyan-400'
                  : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label.toUpperCase()}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Posts', value: stats?.posts, icon: Code2, trend: 'Deployments', color: 'text-blue-400' },
                { label: 'Created Guilds', value: stats?.created_communities, icon: LayoutDashboard, trend: 'Owner', color: 'text-cyan-400' },
                { label: 'Joined Guilds', value: stats?.communities, icon: Users, trend: 'Member', color: 'text-green-400' },
                { label: 'Target Events', value: stats?.events, icon: Calendar, trend: 'Schedule', color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                    <stat.icon className="w-12 h-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 bg-slate-800 rounded-lg ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-1 rounded">
                        {stat.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {statsLoading ? '...' : stat.value}
                    </div>
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity Pulse */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Recent System Logs</h3>
                    </div>
                    <button className="text-[10px] text-cyan-400 hover:underline">VIEWAll.log</button>
                  </div>
                  <div className="p-4 space-y-3">
                    {/* Activity items simplified for brevity */}
                    {myPosts?.slice(0, 3).map(post => (
                      <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/40 border border-transparent hover:border-slate-700 transition-all">
                        <div className="p-2 bg-blue-500/10 rounded-md text-blue-400">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 truncate font-bold">{post.title}</p>
                          <p className="text-[10px] text-gray-500">CREATED::{new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                      </div>
                    ))}
                    {myCommunities?.slice(0, 2).map(comm => (
                      <div key={comm.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/40 border border-transparent hover:border-slate-700 transition-all">
                        <div className="p-2 bg-green-500/10 rounded-md text-green-400">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 truncate font-bold">{comm.name}</p>
                          <p className="text-[10px] text-gray-500">GUILD_AUTH_SUCCESS</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Profile */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-cyan-900/20 to-slate-900/40 border border-cyan-900/30 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 opacity-10">
                    <LayoutDashboard className="w-32 h-32 text-cyan-400" />
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="inline-block p-1 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-full mb-4">
                      <img
                        src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email}&background=0f172a&color=22d3ee`}
                        className="w-20 h-20 rounded-full border-2 border-slate-900"
                        alt="Core.User"
                      />
                    </div>
                    <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || 'Anonymous Developer'}</h2>
                    <p className="text-xs text-cyan-400/60 font-mono mb-6">{user?.email}</p>

                    <div className="mt-4 flex justify-center">
                      <div className="bg-slate-950/50 p-2 rounded border border-slate-800 w-full max-w-[120px]">
                        <p className="text-[10px] text-gray-500 uppercase">Rank</p>
                        <p className="text-xs text-green-400">Elite</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Social Reputation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">GitHub Repos</span>
                      <span className="text-blue-400 font-bold">
                        {user?.user_metadata?.github ? '12' : '0'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">GitHub Activity</span>
                      <span className="text-purple-400 font-bold">
                        {user?.user_metadata?.github ? '87%' : '0%'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">PRs Made</span>
                      <span className="text-orange-400 font-bold">
                        {user?.user_metadata?.github ? '42' : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Components */}
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPosts?.length ? myPosts.map(post => (
                <Link key={post.id} to={`/post/${post.id}`} className="block">
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-cyan-500/40 transition-all group h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors uppercase">{post.title}</h3>
                      <Code2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-6 font-mono leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 pt-4 border-t border-slate-800/50">
                      <span className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" /> {post.likes || 0}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" /> 2
                      </span>
                      <span className="ml-auto uppercase tracking-tighter">
                        TS.{new Date(post.created_at).getTime()}
                      </span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                  <Code2 className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest">No code repositories found</p>
                  <Link to="/create" className="text-cyan-400 text-xs hover:underline mt-2 inline-block italic">Initialize first post?</Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="space-y-8">
              {/* Created Communities */}
              <div>
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Created by Me
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {createdCommunities?.length ? createdCommunities.map(comm => (
                    <Link key={comm.id} to={`/communities/${comm.id}`} className="block">
                      <div className="bg-slate-900/60 border border-cyan-500/20 p-6 rounded-xl hover:border-cyan-500/50 transition-all group flex items-center gap-4 border-l-4 border-l-cyan-500">
                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                          <Users className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold uppercase group-hover:text-cyan-400 transition-colors">{comm.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{comm.description}</p>
                          <div className="flex items-center gap-2 mt-3 text-[10px]">
                            <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 uppercase font-black">ADMIN</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="col-span-full py-10 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                      <p className="text-gray-600 text-xs font-bold uppercase">No guilds founded yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Joined Communities */}
              <div>
                <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Enlisted Guilds
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myCommunities?.length ? myCommunities.map(comm => (
                    <Link key={comm.id} to={`/communities/${comm.id}`} className="block">
                      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-green-500/40 transition-all group flex items-center gap-4 border-l-4 border-l-slate-700">
                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                          <Users className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold uppercase group-hover:text-green-400 transition-colors">{comm.name}</h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{comm.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-tighter">MEMBER</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="col-span-full py-10 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                      <p className="text-gray-600 text-xs font-bold uppercase">No external guild records</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myEvents?.length ? myEvents.map(event => (
                <Link key={event.id} to={`/events/${event.id}`} className="block">
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-purple-500/40 transition-all group flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-purple-500/10 rounded-lg border border-purple-500/20 shrink-0">
                      <span className="text-xs font-bold text-purple-400 leading-none">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                      <span className="text-xl font-black text-white">{new Date(event.event_date).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase group-hover:text-purple-400 transition-colors">{event.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.location || 'Virtual Matrix'}
                      </p>
                    </div>
                    <ArrowRight className="ml-auto w-5 h-5 text-gray-700" />
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                  <Calendar className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest">No event logs detected</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}