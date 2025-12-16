import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, user, initialLoading } = useAuth();
  const location = useLocation();

  // Wait for auth to load from localStorage before checking
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[hsl(340,82%,45%)] border-r-transparent"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Role requirement check
  if (requireRole) {
    // If user doesn't have required role, redirect based on their actual role
    if (!user || user.role !== requireRole) {
      if (user?.role === 'admin') {
        // Admin trying to access non-admin protected route? Shouldn't happen, but redirect to admin
        return <Navigate to="/admin" replace />;
      }
      // Regular user trying to access admin route - redirect to home
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
