import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-lg"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // key={location.pathname} forces a remount (and re-animation) on every route change
  return (
    <div key={location.pathname} className="page-fade-in">
      {children}
    </div>
  );
};

export default ProtectedRoute;
