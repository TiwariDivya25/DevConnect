import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AdminPostManagement from '../components/AdminPostManagement';
import { isUserAdmin } from '../utils/adminApi';
import {
  ShieldAlert,
  BarChart3,
  FileText,
  AlertCircle,
  Activity,
  Users,
} from 'lucide-react';

type AdminTab = 'overview' | 'posts' | 'activity';

const AdminDashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && user) {
        const adminStatus = await isUserAdmin(user.id);
        setIsAdmin(adminStatus);
        if (!adminStatus) {
          navigate('/');
        }
      } else if (!loading && !user) {
        navigate('/login');
      }
      setCheckingAuth(false);
    };

    checkAdminStatus();
  }, [user, loading, navigate]);

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-300 mb-2">
              Access Denied
            </h2>
            <p className="text-red-400 mb-4">
              You do not have permission to access the admin panel.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">
            Manage community posts, reviews, and moderation settings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
              activeTab === 'posts'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <FileText className="w-5 h-5" />
            Post Management
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition border-b-2 ${
              activeTab === 'activity'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Activity className="w-5 h-5" />
            Activity Log
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Dashboard Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stat Card 1 */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        Pending Review
                      </p>
                      <p className="text-3xl font-bold text-yellow-400 mt-2">
                        0
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Posts awaiting review
                      </p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-yellow-400/50" />
                  </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-green-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        Approved
                      </p>
                      <p className="text-3xl font-bold text-green-400 mt-2">
                        0
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Published posts
                      </p>
                    </div>
                    <FileText className="w-12 h-12 text-green-400/50" />
                  </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        Rejected
                      </p>
                      <p className="text-3xl font-bold text-red-400 mt-2">
                        0
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Rejected posts
                      </p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-red-400/50" />
                  </div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        Total Posts
                      </p>
                      <p className="text-3xl font-bold text-blue-400 mt-2">
                        0
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        All posts combined
                      </p>
                    </div>
                    <Users className="w-12 h-12 text-blue-400/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Moderation Guidelines */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-cyan-400" />
                  Moderation Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      Review posts for quality, relevance, and community
                      guidelines
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      Provide clear rejection reasons for transparency
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Ensure all approved posts meet quality standards</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      Document all moderation actions in the activity log
                    </span>
                  </li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition text-sm">
                    View Pending Posts
                  </button>
                  <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition text-sm">
                    View Activity Log
                  </button>
                  <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition text-sm">
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && <AdminPostManagement />}

        {activeTab === 'activity' && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Activity Log
            </h3>
            <p className="text-gray-400">
              Admin activity log coming soon. Track all moderation actions and
              changes here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
