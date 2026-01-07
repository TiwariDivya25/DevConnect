import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const displayName = user.user_metadata?.full_name || user.user_metadata?.user_name || "Anonymous User";
  const createdAt = user.created_at ? format(new Date(user.created_at), "MMMM dd, yyyy") : "Unknown";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 h-32"></div>
          
          {/* Profile content */}
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {displayName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Welcome to your DevConnect profile
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Member since</p>
                    <p className="font-medium text-gray-900 dark:text-white">{createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="font-mono text-xs font-medium text-gray-900 dark:text-white">{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
