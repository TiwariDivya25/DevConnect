import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { isUserAdmin } from '../utils/adminApi';
import { AlertCircle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading) {
        if (!user) {
          navigate('/login');
        } else {
          const adminStatus = await isUserAdmin(user.id);
          if (!adminStatus) {
            navigate('/');
          } else {
            setIsAdmin(true);
          }
        }
      }
      setCheckingAuth(false);
    };

    checkAdminAccess();
  }, [user, loading, navigate]);

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !user) {
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

  return <>{children}</>;
};

export default AdminRoute;
