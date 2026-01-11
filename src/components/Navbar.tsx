import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Code2, Menu, X, MessageSquare, Calendar, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import MessageNotificationBadge from './MessageNotificationBadge';
import { showSuccess, showError } from "../utils/toast";


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { signOut, user } = useAuth();
    const navigate = useNavigate();


    const handleSignOut=async()=>{
      try{
        await signOut();
        showSuccess("Logged out successfully");
        navigate("/login");

      }
      catch{
        showError("Failed to log out");
      }
    }

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email;
    
  return (
    <nav className="bg-slate-950 border-b border-cyan-900/30 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-mono font-bold text-xl hover:text-cyan-400 transition group">
              <Code2 className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
              <span>Dev<span className="text-cyan-400">Connect</span></span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex gap-8">
                <Link to="/" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/home</Link>
                <Link to="/create" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/create</Link>
                <Link to="/communities" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/communities</Link>
                <Link to="/communities/create" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200">~/new-community</Link>
                <Link to="/events" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 relative flex items-center gap-1">
                    ~/events
                </Link>
                <Link to="/messages" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 relative flex items-center gap-1">
                    ~/messages
                    <MessageNotificationBadge />
                </Link>
                <Link to="/contributors"
                   className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200" >
                  ~/contributors
                 </Link>

            </div>

            {/*Desktop Auth*/}
            <div className="hidden md:flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 text-cyan-300 transition"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </button>
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 font-mono text-sm transition"
                        >
                            {user?.user_metadata?.avatar_url && (
                                <img 
                                    src={user.user_metadata.avatar_url}
                                    alt="User Avatar"
                                    className="w-6 h-6 rounded-full ring-2 ring-cyan-400/50"
                                />
                            )}
                            {displayName}
                        </button>
                        
                        <button 
                            onClick={handleSignOut} 
                            className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 font-mono text-sm transition"
                        >
                            logout
                        </button>
                        
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50">
                                <div className="p-2">
                                    <Link 
                                        to="/profile"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-lg transition"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                    <Link 
                                        to="/dashboard"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-lg transition"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            signOut();
                                            setIsUserMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-300 hover:bg-slate-700 rounded-lg transition"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (   
                    <>
                        <Link 
                            to="/login"
                            className="px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono text-sm transition"
                        >
                            sign in
                        </Link>
                        <Link 
                            to="/register"
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-slate-900 font-mono text-sm font-bold transition"
                        >
                            sign up
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="text-cyan-400 hover:text-cyan-300 p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
        </div>

        {/* Mobile nav links */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-cyan-900/30 bg-slate-900/50">
            <div className="flex flex-col gap-3">
              <Link to="/" className="block px-4 py-2 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition">~/home</Link>
              <Link to="/create" className="block px-4 py-2 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition">~/create</Link>
              <Link to="/communities" className="block px-4 py-2 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition">~/communities</Link>
              <Link to="/communities/create" className="block px-4 py-2 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition">~/new-community</Link>
              <Link to="/events" className="block px-4 py-2 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition relative flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                ~/events
              </Link>
              <Link to="/messages" className="flex px-4 py-2 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition relative items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                ~/messages
                <MessageNotificationBadge />
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Auth */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-cyan-900/30 bg-slate-900/50">
            <div className="flex flex-col gap-3 items-start px-4">
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 rounded-lg bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 text-cyan-300 font-mono text-sm transition flex items-center justify-center gap-2"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                    <>
                        <Moon className="w-4 h-4" />
                        Dark Mode
                    </>
                ) : (
                    <>
                        <Sun className="w-4 h-4" />
                        Light Mode
                    </>
                )}
              </button>
              {user ? (
                <div className="space-y-2">
                  <Link 
                    to="/profile"
                    className="w-full flex items-center gap-3 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono text-sm transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user?.user_metadata?.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        className="w-6 h-6 rounded-full ring-2 ring-cyan-400/50"
                      />
                    )}
                    {displayName}
                  </Link>
                  <Link 
                    to="/dashboard"
                    className="w-full flex items-center gap-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 font-mono text-sm transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 font-mono text-sm transition"
                  >
                    logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="w-full block text-center px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono text-sm transition"
                  >
                    sign in
                  </Link>
                  <Link 
                    to="/register"
                    className="w-full block text-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-slate-900 font-mono text-sm font-bold transition"
                  >
                    sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
        </div>
    </nav>
  )
}

export default Navbar