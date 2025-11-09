import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePoll } from '../context/PollContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { currentUser, userData, loading } = useAuth();
  const { setViewMode } = usePoll();

  useEffect(() => {
    if (!loading && !currentUser) {
      setViewMode('login');
    }
  }, [loading, currentUser, setViewMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (requireAdmin && userData?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button
            onClick={() => setViewMode('workspace')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600"
          >
            Go to Workspace
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

