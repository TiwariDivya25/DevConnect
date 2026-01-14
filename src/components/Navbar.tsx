import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth';
import { Code2, Menu, X, MessageSquare, Calendar } from 'lucide-react';
import MessageNotificationBadge from './MessageNotificationBadge';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { signOut, user } = useAuth();

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email;
    
    return (
        <nav className="bg-slate-950 border-b border-cyan-900/30 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 font-mono font-bold text-xl hover:text-cyan-400 transition group flex-shrink-0 ml-4" // 添加了 ml-4
                    >
                        <Code2 className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
                        <span className="xs:hidden">Dev<span className="text-cyan-400">Connect</span></span>
                    </Link>

                    {/* Desktop nav links - Center aligned */}
                    <div className="hidden md:flex items-center justify-center gap-6 flex-1 px-8">
                        {/* Home 链接添加了左边间距 */}
                        <Link to="/" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap ml-4">~/home</Link>
                        <Link to="/create" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap">~/create</Link>
                        <Link to="/communities" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap">~/communities</Link>
                        <Link to="/events" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap flex items-center gap-1">
                            ~/events
                        </Link>
                        <Link to="/messages" className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap flex items-center gap-1">
                            ~/messages
                            <MessageNotificationBadge />
                        </Link>
                        <Link 
                            to="/communities/create"
                            className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap"
                        >
                            ~/new-community
                        </Link>
                        {/* Contributors 链接 - 添加了右边间距 */}
                        <Link 
                            to="/contributors"
                            className="font-mono text-sm text-gray-300 hover:text-cyan-400 transition duration-200 whitespace-nowrap mr-4" // 添加了 mr-4
                        >
                            ~/contributors
                        </Link>
                    </div>

                    {/* Desktop Auth - Right aligned */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                       
                        {user ? (
                            <>
                                <Link 
                                    to="/profile" 
                                    className="font-mono text-sm text-cyan-300 hover:text-cyan-400 transition flex items-center gap-2 whitespace-nowrap"
                                >
                                    {user?.user_metadata?.avatar_url && (
                                        <img 
                                            src={user.user_metadata.avatar_url}
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full ring-2 ring-cyan-400/50 object-cover"
                                        />
                                    )}
                                    <span className="max-w-[120px] truncate">{displayName}</span>
                                </Link>
                                <button 
                                    onClick={signOut} 
                                    className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 font-mono text-sm transition whitespace-nowrap"
                                >
                                    logout
                                </button>
                            </>
                        ) : (   
                            <>
                                <Link 
                                    to="/login"
                                    className="px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono text-sm transition whitespace-nowrap"
                                >
                                    sign in
                                </Link>
                                <Link 
                                    to="/register"
                                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-slate-900 font-mono text-sm font-bold transition whitespace-nowrap"
                                >
                                    sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        {user && user?.user_metadata?.avatar_url && (
                            <Link to="/profile" className="md:hidden">
                                <img 
                                    src={user.user_metadata.avatar_url}
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full ring-2 ring-cyan-400/50 object-cover"
                                />
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="text-cyan-400 hover:text-cyan-300 p-2"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        {/* Mobile nav links */}
                        <div className="pb-4 pt-2 border-t border-cyan-900/30 bg-slate-900/95">
                            <div className="flex flex-col gap-2">
                                <Link 
                                    to="/" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition flex items-center gap-3 ml-4" // 添加了 ml-4
                                >
                                    ~/home
                                </Link>
                                <Link 
                                    to="/create" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition flex items-center gap-3"
                                >
                                    ~/create
                                </Link>
                                <Link 
                                    to="/communities" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition flex items-center gap-3"
                                >
                                    ~/communities
                                </Link>
                                <Link 
                                    to="/communities/create" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition flex items-center gap-3"
                                >
                                    ~/new-community
                                </Link>
                                <Link 
                                    to="/events" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition flex items-center gap-3"
                                >
                                    <Calendar className="w-4 h-4" />
                                    ~/events
                                </Link>
                                <Link 
                                    to="/messages" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition items-center gap-3"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    ~/messages
                                    <MessageNotificationBadge />
                                </Link>
                                {/* 添加的 contributors 链接 - 移动端 */}
                                <Link 
                                    to="/contributors" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 font-mono text-sm text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition flex items-center gap-3 mr-4" // 添加了 mr-4
                                >
                                    ~/contributors
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Auth */}
                        <div className="pb-4 pt-2 border-t border-cyan-900/30 bg-slate-900/95">
                            <div className="flex flex-col gap-3 px-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-cyan-900/30 border border-cyan-400/50 rounded-lg">
                                            {user?.user_metadata?.avatar_url && (
                                                <img
                                                    src={user.user_metadata.avatar_url}
                                                    alt="User Avatar"
                                                    className="w-8 h-8 rounded-full ring-2 ring-cyan-400/50 object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-mono text-sm text-cyan-300 truncate">{displayName}</p>
                                                <p className="font-mono text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link 
                                            to="/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-center px-4 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono text-sm transition"
                                        >
                                            View Profile
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                signOut();
                                                setIsMenuOpen(false);
                                            }} 
                                            className="w-full px-4 py-3 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 font-mono text-sm transition"
                                        >
                                            logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            to="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-center px-4 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 font-mono text-sm transition"
                                        >
                                            sign in
                                        </Link>
                                        <Link 
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full text-center px-4 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-slate-900 font-mono text-sm font-bold transition"
                                        >
                                            sign up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar