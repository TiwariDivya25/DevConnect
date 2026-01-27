import PostList from '../components/PostList';
import GlobalSearch from '../components/GlobalSearch';
import { Plus } from 'lucide-react';
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
      <div className="bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-cyan-900/30 pt-12 md:pt-20 pb-10 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center m-2">
            <div>
              <h1 className="text-6xl font-bold font-mono mb-6 text-white leading-tight text-center md:text-left">
                <span className="text-cyan-400">Dev</span>Connect
              </h1>
              <p className="text-xl text-gray-400 font-mono mb-8">
                {displayText}
                <span className="animate-pulse text-cyan-400">|</span>
              </p>

              {/* Global Search - Hero Feature */}
              <div className="mb-8">
                <label className="block text-sm font-mono text-cyan-400 mb-3 tracking-wide">
                  🔍 Search communities and developers
                </label>
                <GlobalSearch />
              </div>

              <div className="flex gap-4">
                <Link
                  to="/create"
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono font-bold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <Plus className="w-5 h-5" />
                  create post
                </Link>
                <Link
                  to="/communities"
                  className="px-6 py-3 text-center bg-slate-800/50 hover:bg-slate-800 border border-gray-600/30 rounded-lg text-gray-300 font-mono font-bold transition-all duration-300"
                >
                  explore communities
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-900/30 rounded-lg p-8 font-mono text-sm text-gray-300">
                <div className="text-green-400">// Connect with developers</div>
                <div className="text-cyan-400 mt-2">const developer = <span className="text-emerald-400">{'{}'}</span></div>
                <div className="ml-4 text-gray-400 mt-1">skills: <span className="text-emerald-400">['web', 'mobile', 'ml']</span></div>
                <div className="ml-4 text-gray-400">ideas: <span className="text-emerald-400">['innovative', 'scalable']</span></div>
                <div className="text-cyan-400 mt-2">share<span className="text-emerald-400">.</span>build<span className="text-emerald-400">.</span>grow()</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold font-mono text-white mb-5">
            <span className="text-cyan-400">~/</span>recent_posts
          </h2>
          <p className="text-gray-400 font-mono text-sm mb-10">
            latest updates from the community
          </p>
          <PostList />
        </div>
      </div>
    </div>
  )
}

export default Home