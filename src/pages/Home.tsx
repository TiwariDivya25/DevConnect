import PostList from '../components/PostList';
import { Plus, Users, MessageSquare, Zap, Code2, Rocket, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

const Home = () => {
    const text =
    "Share ideas, build together, connect with developers worldwide...";

      const [displayText, setDisplayText] = useState("");
      const [index, setIndex] = useState(0);
      const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      let timeout = null;

      if (!isDeleting && index < text.length) {
    // Typing
        timeout = setTimeout(() => {
                  setDisplayText(text.slice(0, index + 1));
                  setIndex((prev) => prev + 1);
                }, 55);
        } else if (!isDeleting && index === text.length) {
    // Pause after typing
            timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1200);
      } else if (isDeleting && index > 0) {
    // Deleting
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
      {/* Hero Section */}
      <div className="relative bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-cyan-900/20 pt-32 pb-32 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold font-mono text-white leading-tight">
                  <span className="text-cyan-400">Dev</span>Connect
                </h1>
                <p className="text-2xl sm:text-3xl lg:text-4xl text-gray-300 font-mono leading-relaxed min-h-[2em]">
                  {displayText}
                  <span className="animate-pulse text-cyan-400">|</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/create"
                  className="group flex items-center justify-center gap-3 px-10 py-5 text-lg bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/50 rounded-xl text-white font-mono font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-100"
                >
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  create post
                </Link>
                <Link 
                  to="/communities"
                  className="group flex items-center justify-center gap-3 px-10 py-5 text-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-600/50 rounded-xl text-gray-200 font-mono font-semibold transition-all duration-300 hover:shadow-lg hover:border-slate-500"
                >
                  explore communities
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative bg-linear-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-cyan-900/30 rounded-2xl p-10 font-mono text-base lg:text-lg text-gray-300 backdrop-blur-sm shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500">
                <div className="absolute -top-4 left-8 px-4 py-2 bg-slate-800 border border-cyan-900/30 rounded-lg text-sm text-cyan-400">
                  index.js
                </div>
                <div className="space-y-3">
                  <div className="text-green-400 opacity-80">// Connect with developers</div>
                  <div className="text-cyan-400 mt-4">const developer = <span className="text-emerald-400">{'{}'}</span></div>
                  <div className="ml-4 text-gray-400 leading-relaxed">skills: <span className="text-emerald-400">['web', 'mobile', 'ml']</span>,</div>
                  <div className="ml-4 text-gray-400 leading-relaxed">ideas: <span className="text-emerald-400">['innovative', 'scalable']</span>,</div>
                  <div className="ml-4 text-gray-400 leading-relaxed">passion: <span className="text-yellow-400">'unstoppable'</span></div>
                  <div className="text-cyan-400 mt-4">share<span className="text-emerald-400">.</span>build<span className="text-emerald-400">.</span>grow()<span className="text-gray-500">;</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-28 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-mono text-white">
              <span className="text-cyan-400">~/</span>what_we_offer
            </h2>
            <p className="text-xl lg:text-2xl text-gray-400 font-mono max-w-3xl mx-auto leading-relaxed">
              everything you need to collaborate, learn, and grow as a developer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature Card 1 */}
            <div className="group bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-900/30 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-xl mb-8 group-hover:bg-cyan-500/20 transition-colors duration-300">
                <Users className="w-9 h-9 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-4 leading-tight">
                Join Communities
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Connect with like-minded developers in communities focused on specific technologies and interests
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-900/30 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-xl mb-8 group-hover:bg-blue-500/20 transition-colors duration-300">
                <MessageSquare className="w-9 h-9 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-4 leading-tight">
                Real-time Messaging
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Stay connected with instant messaging, discuss ideas, and collaborate on projects in real-time
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-900/30 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500/10 rounded-xl mb-8 group-hover:bg-purple-500/20 transition-colors duration-300">
                <Code2 className="w-9 h-9 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-4 leading-tight">
                Share & Learn
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Post code snippets, ask questions, share knowledge, and learn from experienced developers
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-900/30 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-xl mb-8 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Zap className="w-9 h-9 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-4 leading-tight">
                Discover Events
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Find hackathons, meetups, and tech events to expand your network and showcase your skills
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="group bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-900/30 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-xl mb-8 group-hover:bg-orange-500/20 transition-colors duration-300">
                <Rocket className="w-9 h-9 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-4 leading-tight">
                Build Projects
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Collaborate on open source projects, find team members, and bring your innovative ideas to life
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="group bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-cyan-900/30 rounded-2xl p-10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-pink-500/10 rounded-xl mb-8 group-hover:bg-pink-500/20 transition-colors duration-300">
                <Globe className="w-9 h-9 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-4 leading-tight">
                Global Network
              </h3>
              <p className="text-lg text-gray-400 leading-relaxed">
                Connect with developers from around the world and build a diverse professional network
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="relative py-28 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-mono text-white">
              <span className="text-cyan-400">~/</span>recent_posts
            </h2>
            <p className="text-xl lg:text-2xl text-gray-400 font-mono max-w-3xl mx-auto leading-relaxed">
              latest updates and insights from the community
            </p>
          </div>
          <PostList />
        </div>
      </div>
    </div>
  )
}

export default Home
