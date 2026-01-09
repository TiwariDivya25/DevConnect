import PostList from '../components/PostList';
import { Plus, Users, MessageSquare, Zap, Code2, Rocket, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

const Home = () => {
  const text = "Share ideas, build together, connect with developers worldwide...";
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout = null;

    if (!isDeleting && index < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, index + 1));
        setIndex((prev) => prev + 1);
      }, 55);
    } else if (!isDeleting && index === text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1200);
    } else if (isDeleting && index > 0) {
      timeout = setTimeout(() => {
        setDisplayText(text.slice(0, index - 1));
        setIndex((prev) => prev - 1);
      }, 35);
    } else if (isDeleting && index === 0) {
      setIsDeleting(false);
      setDisplayText("");
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [index, isDeleting, text]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section - Full Screen */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/5 via-transparent to-blue-900/5 animate-gradient-x"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-base font-mono mb-4">
                <Sparkles className="w-5 h-5" />
                Welcome to DevConnect
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    DevConnect
                  </span>
                </h1>
                <p className="text-2xl sm:text-3xl text-gray-300 leading-relaxed min-h-[2em] font-light">
                  {displayText}
                  <span className="animate-pulse text-cyan-400">|</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/create"
                  className="group flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white text-lg font-medium transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  Create Post
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
                <Link 
                  to="/communities"
                  className="group flex items-center justify-center gap-3 px-10 py-5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/30 rounded-xl text-gray-200 text-lg font-medium transition-all duration-300 backdrop-blur-sm"
                >
                  <Users className="w-6 h-6" />
                  Explore Communities
                </Link>
              </div>
            </div>
            
            {/* Code Card - Improved */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-900/20 border border-cyan-500/20 rounded-2xl p-10 backdrop-blur-sm shadow-2xl shadow-cyan-500/10">
                <div className="absolute -top-3 left-6 px-5 py-2.5 bg-slate-800 border border-cyan-500/30 rounded-lg text-base text-cyan-400 font-mono">
                  devconnect.js
                </div>
                
                <div className="space-y-4 pt-6">
                  <div className="text-green-400/80 font-mono text-base">
                    // Connect with developers worldwide
                  </div>
                  
                  <div className="space-y-2 font-mono text-base">
                    <div className="text-cyan-400">const <span className="text-white">developerNetwork</span> = <span className="text-emerald-400">{"{"}</span></div>
                    <div className="ml-4 text-gray-300">
                      <span className="text-cyan-400">skills</span>: <span className="text-yellow-300">[</span>
                      <span className="text-emerald-400">'React'</span>, 
                      <span className="text-emerald-400">'Node.js'</span>, 
                      <span className="text-emerald-400">'Python'</span>
                      <span className="text-yellow-300">]</span>,
                    </div>
                    <div className="ml-4 text-gray-300">
                      <span className="text-cyan-400">projects</span>: <span className="text-emerald-400">42</span>,
                    </div>
                    <div className="ml-4 text-gray-300">
                      <span className="text-cyan-400">connections</span>: <span className="text-emerald-400">128</span>,
                    </div>
                    <div className="text-cyan-400">{"}"}</div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-cyan-400 font-mono">
                      <span className="text-white">DevConnect</span>
                      <span className="text-emerald-400">.connect</span>()
                      <span className="text-gray-500">;</span>
                    </div>
                    <div className="text-blue-400 font-mono">
                      <span className="text-white">DevConnect</span>
                      <span className="text-emerald-400">.grow</span>()
                      <span className="text-gray-500">;</span>
                    </div>
                  </div>
                </div>
                
                {/* Terminal-like footer */}
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-mono">Connected to global developer network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section - Improved */}
      <div className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-cyan-400 text-sm font-mono">
                <MessageSquare className="w-4 h-4" />
                Community Feed
              </div>
              <h2 className="text-3xl font-bold text-white">
                Latest from the <span className="text-cyan-400">Community</span>
              </h2>
              <p className="text-gray-400">
                Insights, discussions, and updates from developers worldwide
              </p>
            </div>
            
            <Link 
              to="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-gray-200 transition-colors duration-300 group"
            >
              <span>View all posts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
          
          <PostList />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-br from-slate-900 to-cyan-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to <span className="text-cyan-400">Connect</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers who are already collaborating, learning, and growing together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30"
              >
                Get Started Free
              </Link>
              <Link 
                to="/features"
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-gray-200 font-medium transition-colors duration-300 backdrop-blur-sm"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home