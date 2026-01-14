import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Code2, 
  Plus, 
  Star, 
  Clock, 
  Activity, 
  LogOut,
  GitBranch,
  User,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user activity
  const { data: recentActivity, isLoading, error } = useQuery({
    queryKey: ['user-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get user's recent activity from multiple sources
      if (!supabase) {
        throw new Error('Supabase client not available');
      }
      
      const { data: posts, error: postsError } = await supabase
        .from('Posts')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      const { data: comments, error: commentsError } = await supabase
        .from('Comments')
        .select('id, content, created_at, post_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      const { data: votes, error: votesError } = await supabase
        .from('Votes')
        .select('id, post_id, vote, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      const { data: communityMemberships, error: membershipError } = await supabase
        .from('CommunityMembers') // Assuming this table exists
        .select('id, community_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      // Define activity type
      type Activity = {
        id: string;
        action: string;
        title: string;
        time: string;
        icon: React.ReactNode;
        type: string;
      };
      
      // Combine and sort all activities by date
      const allActivities: Activity[] = [];
      
      posts?.forEach(post => {
        allActivities.push({
          id: `post-${post.id}`,
          action: 'Created post',
          title: post.title,
          time: post.created_at,
          icon: <Code2 className="w-4 h-4" />,
          type: 'post'
        });
      });
      
      comments?.forEach(comment => {
        allActivities.push({
          id: `comment-${comment.id}`,
          action: 'Added comment',
          title: comment.content.substring(0, 50) + '...',
          time: comment.created_at,
          icon: <MessageCircle className="w-4 h-4" />,
          type: 'comment'
        });
      });
      
      votes?.forEach(vote => {
        allActivities.push({
          id: `vote-${vote.id}`,
          action: vote.vote > 0 ? 'Liked post' : 'Disliked post',
          title: `Post #${vote.post_id}`,
          time: vote.created_at,
          icon: <ThumbsUp className="w-4 h-4" />,
          type: 'vote'
        });
      });
      
      communityMemberships?.forEach(membership => {
        allActivities.push({
          id: `membership-${membership.id}`,
          action: 'Joined community',
          title: `Community #${membership.community_id}`,
          time: membership.created_at,
          icon: <Users className="w-4 h-4" />,
          type: 'community'
        });
      });
      
      // Sort by most recent
      return allActivities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 8); // Return top 8 activities
    },
    enabled: !!user
  });

  const quickActions = [
    {
      title: 'Create Post',
      description: 'Share your thoughts with the community',
      icon: <Star className="w-6 h-6" />,
      link: '/create',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      title: 'Create Community',
      description: 'Start a new developer community',
      icon: <Users className="w-6 h-6" />,
      link: '/communities/create',
      color: 'bg-green-500/20 text-green-400'
    },
    {
      title: 'Create Event',
      description: 'Organize a developer event',
      icon: <Calendar className="w-6 h-6" />,
      link: '/events/create',
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      title: 'My Messages',
      description: 'Check your conversations',
      icon: <MessageSquare className="w-6 h-6" />,
      link: '/messages',
      color: 'bg-cyan-500/20 text-cyan-400'
    }
  ];

  const userStats = [
    { label: 'Communities Joined', value: '5', icon: <Users className="w-5 h-5" /> },
    { label: 'Posts Created', value: '12', icon: <Code2 className="w-5 h-5" /> },
    { label: 'Events Attended', value: '8', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Following', value: '15', icon: <GitBranch className="w-5 h-5" /> }
  ];

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user || !supabase) return;

    // Subscribe to Posts table
    const postsSubscription = supabase
      .channel('dashboard-posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'Posts',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['user-activity', user.id] });
      })
      .subscribe();

    // Subscribe to Comments table
    const commentsSubscription = supabase
      .channel('dashboard-comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'Comments',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['user-activity', user.id] });
      })
      .subscribe();

    // Subscribe to Votes table
    const votesSubscription = supabase
      .channel('dashboard-votes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'Votes',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['user-activity', user.id] });
      })
      .subscribe();

    // Subscribe to CommunityMembers table
    const membershipSubscription = supabase
      .channel('dashboard-memberships')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'CommunityMembers',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['user-activity', user.id] });
      })
      .subscribe();

    // Cleanup function
    return () => {
      if (supabase) {
        supabase.removeChannel(postsSubscription);
        supabase.removeChannel(commentsSubscription);
        supabase.removeChannel(votesSubscription);
        supabase.removeChannel(membershipSubscription);
      }
    };
  }, [user, queryClient]);

  const navigationItems = [
    { name: 'My Profile', icon: <User className="w-5 h-5" />, link: '/profile' },
    { name: 'My Communities', icon: <Users className="w-5 h-5" />, link: '/communities' },
    { name: 'My Events', icon: <Calendar className="w-5 h-5" />, link: '/events' },
    { name: 'My Messages', icon: <MessageSquare className="w-5 h-5" />, link: '/messages' },
    { name: 'Contributors', icon: <Code2 className="w-5 h-5" />, link: '/contributors' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950 border-b border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-mono">
                Dashboard
              </h1>
              <p className="text-gray-400 font-mono text-sm mt-1">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Developer'}!
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Last login</div>
              <div className="text-cyan-400 font-mono">Today, 10:30 AM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg text-cyan-400">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold font-mono mb-6 text-cyan-400">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-all duration-200 hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{action.title}</h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold font-mono mb-6 text-cyan-400">
                Recent Activity
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  <span className="ml-2 text-gray-400">Loading activity...</span>
                </div>
              ) : error ? (
                <div className="text-red-400 text-center py-4">
                  Error loading activity: {(error as Error).message}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-slate-800/50 rounded-lg transition-colors">
                        <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-300">
                            <span className="font-medium">{activity.action}</span>{' '}
                            <span className="text-cyan-400">{activity.title}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(activity.time).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No recent activity
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold font-mono mb-6 text-cyan-400">
                Navigation
              </h2>
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-mono text-sm">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold font-mono mb-4 text-cyan-400">
                Account Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Account Type</span>
                  <span className="text-white text-sm">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <span className="text-white text-sm">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}