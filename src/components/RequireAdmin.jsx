import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RequireAdmin({ children }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/account" replace />;

  return children;
}

export default RequireAdmin;
