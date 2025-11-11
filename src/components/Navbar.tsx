import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { signInWithGithub, signOut, user } = useAuth();

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.user_name || user?.email;
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center font-bold text-2xl hover:text-blue-400 transition">
              Dev<span className="text-blue-500">Connect</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex gap-8">
                <Link to="/" className="hover:text-blue-400 transition duration-200 font-medium">Home</Link>
                <Link to="/create" className="hover:text-blue-400 transition duration-200 font-medium">Create Post</Link>
                <Link to="/communities" className="hover:text-blue-400 transition duration-200 font-medium">Communities</Link>
                <Link to="/communities/create" className="hover:text-blue-400 transition duration-200 font-medium">Create Community</Link>
            </div>

            {/*Desktop Auth*/}
        <div className="hidden md:flex items-center gap-4">
            {user?.user_metadata?.avatar_url && (
                <img 
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
            )}
            {user ? (
                <>
                    <span className="font-medium">{displayName}</span>
                    <button onClick={signOut} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition">Sign Out</button>
                </>
            ) : (   
                <button onClick={signInWithGithub} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition">Sign in with Github</button>
            )}
        </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-gray-800 transition"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
        </div>

        {/* Mobile nav links */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-700">
            <div className="flex flex-col gap-3">
              <Link to="/" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium">Home</Link>
              <Link to="/create" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium">Create Post</Link>
              <Link to="/communities" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium">Communities</Link>
              <Link to="/communities/create" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition font-medium">Create Community</Link>
            </div>
          </div>
        )}

        {/* Mobile Auth */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-700">
            <div className="flex flex-col gap-3 items-start px-4">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              )}
              {user ? (
                <>
                  <span className="font-medium">{displayName}</span>
                  <button onClick={signOut} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition">Sign Out</button>
                </>
              ) : (
                <button onClick={signInWithGithub} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition">Sign in with Github</button>
              )}
            </div>
          </div>
        )}
        </div>
    </nav>
  )
}

export default Navbar