import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Github, Book, Code, Star, ExternalLink, User, RefreshCw, Globe, GraduationCap, FileText, Save, X as XIcon, Edit, Trash2, MessageSquare, Layout, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

interface FamousRepo {
  name: string;
  url: string;
  stars: number;
  description: string;
}

interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  github_url: string;
  repos_count: number;
  famous_repos: FamousRepo[];
  most_used_languages: string[];
  portfolio_url?: string;
  learning_now?: string;
  resume_url?: string;
}

interface UserPost {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  user_id: string;
}

const DUMMY_PROFILES: Record<string, Profile> = {
  sdras: {
    id: "sdras",
    full_name: "Sarah Drasner",
    username: "sdras",
    avatar_url: "https://github.com/sdras.png",
    bio: "VP of Developer Experience at Netlify. Vue Core Team member.",
    github_url: "https://github.com/sdras",
    repos_count: 142,
    famous_repos: [
      { name: "intro-to-vue", url: "https://github.com/sdras/intro-to-vue", stars: 4500, description: "Intro to Vue.js Workshop" },
      { name: "vue-sample-kanban", url: "https://github.com/sdras/vue-sample-kanban", stars: 1200, description: "A sample kanban board" }
    ],
    most_used_languages: ["Vue", "JavaScript", "CSS", "HTML"]
  },
  gaearon: {
    id: "gaearon",
    full_name: "Dan Abramov",
    username: "gaearon",
    avatar_url: "https://github.com/gaearon.png",
    bio: "Working on React at Meta. Co-author of Redux and Create React App.",
    github_url: "https://github.com/gaearon",
    repos_count: 280,
    famous_repos: [
      { name: "redux", url: "https://github.com/reduxjs/redux", stars: 60000, description: "Predictable state container for JavaScript apps" },
      { name: "react-hot-loader", url: "https://github.com/gaearon/react-hot-loader", stars: 12000, description: "Tweak React components in real time" }
    ],
    most_used_languages: ["JavaScript", "TypeScript", "React"]
  },
  addyosmani: {
    id: "addyosmani",
    full_name: "Addy Osmani",
    username: "addyosmani",
    avatar_url: "https://github.com/addyosmani.png",
    bio: "Engineering Manager at Google working on Chrome. Author of Learning JavaScript Design Patterns.",
    github_url: "https://github.com/addyosmani",
    repos_count: 350,
    famous_repos: [
      { name: "critical", url: "https://github.com/addyosmani/critical", stars: 9500, description: "Extract & Inline Critical-path CSS in HTML pages" },
      { name: "psi", url: "https://github.com/addyosmani/psi", stars: 3000, description: "PageSpeed Insights for Node" }
    ],
    most_used_languages: ["JavaScript", "HTML", "CSS"]
  }
};

const fetchProfile = async (id: string): Promise<Profile> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (DUMMY_PROFILES[id]) return DUMMY_PROFILES[id];
      throw new Error(error.message);
    }
    return data as Profile;
  } catch (err) {
    if (DUMMY_PROFILES[id]) return DUMMY_PROFILES[id];
    throw err;
  }
};

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, syncProfile } = useAuth();
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    portfolio_url: "",
    learning_now: "",
    resume_url: ""
  });

  const { data: profile, isLoading, error, refetch } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => fetchProfile(id!),
    enabled: !!id,
    onSuccess: (data) => {
      if (data) {
        setEditForm({
          portfolio_url: data.portfolio_url || "",
          learning_now: data.learning_now || "",
          resume_url: data.resume_url || ""
        });
      }
    }
  });

  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as UserPost[];
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["userPosts", id] });
      const previousPosts = queryClient.getQueryData(["userPosts", id]);
      queryClient.setQueryData(["userPosts", id], (old: UserPost[] | undefined) => 
        old?.filter(post => post.id !== postId)
      );
      return { previousPosts };
    },
    onError: (err: any, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["userPosts", id], context.previousPosts);
      }
      console.error("Deletion failed:", err);
      alert(`Deletion failed: ${err.message || "Unknown error"}. Check RLS policies.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDeletePost = (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(postId);
    }
  };

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSaveExtras = async () => {
    if (!user || user.id !== id) return;
    
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          portfolio_url: editForm.portfolio_url,
          learning_now: editForm.learning_now,
          resume_url: editForm.resume_url
        })
        .eq("id", user.id);

      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => {
        setIsEditing(false);
        setSaveStatus('idle');
      }, 1000);
      refetch();
    } catch (err: any) {
      console.error("Error saving profile extras:", err);
      setSaveStatus('error');
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleManualSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await syncProfile(user);
      await refetch();
    } catch (err: any) {
      console.error("Manual sync failed:", err);
      alert(`Sync failed: ${err.message || "Unknown error"}. Check if the 'profiles' table exists in Supabase.`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading || isSyncing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-cyan-400 font-mono text-xl animate-pulse">
            {isSyncing ? "Syncing GitHub data..." : "Loading developer profile..."}
          </div>
          <div className="w-48 h-1 bg-cyan-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    const isOwnProfile = user?.id === id;
    const isTableMissing = error instanceof Error && error.message.includes("profiles") && error.message.includes("not found");
    
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/50 border border-red-900/30 p-8 rounded-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <User className="text-red-500 w-8 h-8" />
          </div>
          
          {isTableMissing ? (
            <>
              <h2 className="text-xl font-bold text-white mb-2 font-mono text-red-400">Database Table Missing</h2>
              <p className="text-gray-400 font-mono text-sm mb-6 text-left">
                The <code className="text-cyan-400 bg-slate-950 px-1 rounded">profiles</code> table hasn't been created in your Supabase project yet. 
                <br /><br />
                Please run the SQL schema found in the README to enable developer profiles.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2 font-mono">Profile Sync Pending</h2>
              <p className="text-gray-400 font-mono text-sm mb-6">
                {isOwnProfile 
                  ? "We're still fetching your GitHub data. This can take a few seconds on your first visit." 
                  : "This developer profile hasn't been synced with GitHub yet."}
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            {isOwnProfile && !isTableMissing && (
                <button 
                    onClick={handleManualSync}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono py-2.5 rounded-lg transition font-bold"
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    Sync My Profile Now
                </button>
            )}
            <button 
                onClick={() => refetch()}
                className="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 font-mono py-2 rounded-lg transition text-sm"
            >
                Try Refreshing
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === id;

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <User size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img 
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=0D9488&color=fff`} 
                alt={profile.full_name} 
                className="w-32 h-32 rounded-full ring-4 ring-cyan-900/50 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-slate-900 p-2 rounded-full border border-slate-700">
                <Github className="text-cyan-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold text-white font-mono">
                    {profile.full_name}
                </h1>
                {isOwnProfile && (
                  <div className="flex gap-2">
                    <button 
                        onClick={handleManualSync}
                        className="inline-flex items-center gap-2 text-xs bg-cyan-950/50 text-cyan-400 hover:bg-cyan-900/50 px-2 py-1 rounded border border-cyan-900/30 transition w-fit"
                        title="Force sync from GitHub"
                    >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync Data
                    </button>
                    {!isEditing && (
                      <button 
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-2 text-xs bg-slate-800 text-gray-300 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 transition w-fit"
                      >
                          Edit Links
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-cyan-400 font-mono mb-4 text-lg">@{profile.username}</p>
              <p className="text-gray-400 max-w-2xl leading-relaxed mb-6 italic">
                "{profile.bio || 'This developer is too busy coding to write a bio.'}"
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a 
                  href={profile.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition border border-slate-700 group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:text-cyan-400" />
                  <span>GitHub Profile</span>
                </a>
                <div className="flex items-center gap-2 bg-cyan-950/30 text-cyan-400 px-4 py-2 rounded-lg border border-cyan-900/30">
                  <Book className="w-4 h-4" />
                  <span>{profile.repos_count} Repositories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content: Repos */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <div className="flex items-center gap-2 text-cyan-400 font-mono mb-6 uppercase tracking-widest text-sm">
                <Star className="w-4 h-4" />
                <span>Featured Projects</span>
              </div>
              
              <div className="grid gap-4">
                {profile.famous_repos && profile.famous_repos.length > 0 ? (
                  profile.famous_repos.map((repo, idx) => (
                    <a 
                      key={idx}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl hover:border-cyan-900/50 hover:bg-slate-900/60 transition group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition font-mono">
                          {repo.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <span>{repo.stars}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {repo.description || 'No description provided for this repository.'}
                      </p>
                      <div className="flex items-center text-cyan-500 text-xs font-mono">
                        <span>view_repository();</span>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-gray-500 font-mono italic p-8 border border-dashed border-slate-800 rounded-xl text-center">
                    No public repositories highlighted.
                  </div>
                )}
              </div>
            </section>
            
            {/* New Section: User's Posts */}
            <section>
              <div className="flex items-center gap-2 text-cyan-400 font-mono mb-6 uppercase tracking-widest text-sm">
                <Layout className="w-4 h-4" />
                <span>Dev Contributions</span>
              </div>

              <div className="space-y-4">
                {isLoadingPosts ? (
                  <div className="text-gray-500 font-mono animate-pulse">Fetching posts...</div>
                ) : userPosts && userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div 
                      key={post.id}
                      className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition flex flex-col sm:flex-row gap-6"
                    >
                      {post.image_url && (
                        <div className="w-full sm:w-32 h-32 flex-shrink-0">
                          <img 
                            src={post.image_url} 
                            alt={post.title} 
                            className="w-full h-full object-cover rounded-lg border border-slate-800"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/post/${post.id}`}>
                            <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition truncate pr-4">
                              {post.title}
                            </h3>
                          </Link>
                          {isOwnProfile && (
                            <div className="flex gap-2">
                              <Link 
                                to={`/edit-post/${post.id}`}
                                className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition"
                                title="Edit Post"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                disabled={deleteMutation.isPending}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Post"
                              >
                                {deleteMutation.isPending ? (
                                  <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>view_thread();</span>
                          </span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 font-mono italic p-12 border border-dashed border-slate-800 rounded-xl text-center">
                    <p className="mb-4">No posts created yet.</p>
                    {isOwnProfile && (
                      <Link 
                        to="/create" 
                        className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                      >
                        Create your first post
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Languages & Tech */}
          <div className="space-y-8">
            {/* New Section: Professional Links & Status */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-cyan-400 font-mono uppercase tracking-widest text-sm">
                  <User className="w-4 h-4" />
                  <span>Dev Status</span>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="text-red-400 hover:text-red-300">
                      <XIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSaveExtras}
                      disabled={saveStatus === 'saving'}
                      className="text-green-400 hover:text-green-300 disabled:opacity-50 transition flex items-center gap-1"
                    >
                      {saveStatus === 'saving' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : saveStatus === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl space-y-6">
                {/* Learning Now */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-2 uppercase">
                    <GraduationCap className="w-3 h-3" />
                    <span>Currently Learning</span>
                  </div>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editForm.learning_now}
                      onChange={(e) => setEditForm({...editForm, learning_now: e.target.value})}
                      placeholder="e.g. Rust, Advanced React..."
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-400 focus:outline-none focus:border-cyan-900/50"
                    />
                  ) : (
                    <p className="text-gray-300 font-mono text-sm">
                      {profile.learning_now || "Nothing specified yet."}
                    </p>
                  )}
                </div>

                {/* Portfolio */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-2 uppercase">
                    <Globe className="w-3 h-3" />
                    <span>Portfolio</span>
                  </div>
                  {isEditing ? (
                    <input 
                      type="url"
                      value={editForm.portfolio_url}
                      onChange={(e) => setEditForm({...editForm, portfolio_url: e.target.value})}
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-400 focus:outline-none focus:border-cyan-900/50"
                    />
                  ) : (
                    profile.portfolio_url ? (
                      <a 
                        href={profile.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline text-sm font-mono flex items-center gap-1"
                      >
                        {new URL(profile.portfolio_url).hostname}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-gray-500 italic text-sm font-mono">No portfolio link added.</p>
                    )
                  )}
                </div>

                {/* Resume */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-2 uppercase">
                    <FileText className="w-3 h-3" />
                    <span>Resume</span>
                  </div>
                  {isEditing ? (
                    <input 
                      type="url"
                      value={editForm.resume_url}
                      onChange={(e) => setEditForm({...editForm, resume_url: e.target.value})}
                      placeholder="Link to your PDF resume"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-cyan-400 focus:outline-none focus:border-cyan-900/50"
                    />
                  ) : (
                    profile.resume_url ? (
                      <a 
                        href={profile.resume_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-gray-300 px-3 py-2 rounded border border-slate-700 transition text-sm font-mono"
                      >
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>View Resume</span>
                      </a>
                    ) : (
                      <p className="text-gray-500 italic text-sm font-mono">No resume uploaded.</p>
                    )
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 text-cyan-400 font-mono mb-6 uppercase tracking-widest text-sm">
                <Code className="w-4 h-4" />
                <span>Top Languages</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {profile.most_used_languages && profile.most_used_languages.length > 0 ? (
                    profile.most_used_languages.map((lang, idx) => (
                      <span 
                        key={idx}
                        className="bg-slate-800 text-gray-300 px-3 py-1.5 rounded-md text-sm font-mono border border-slate-700"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">Data unavailable</span>
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 text-cyan-400 font-mono mb-6 uppercase tracking-widest text-sm">
                <Github className="w-4 h-4" />
                <span>Quick Links</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <a 
                  href={`https://github.com/${profile.username}?tab=repositories`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-slate-800 transition text-sm group"
                >
                  <span className="text-gray-300">All Repositories</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
                </a>
                <a 
                  href={`https://github.com/${profile.username}?tab=stars`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 hover:bg-slate-800 border-t border-slate-800 transition text-sm group"
                >
                  <span className="text-gray-300">Starred Projects</span>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
