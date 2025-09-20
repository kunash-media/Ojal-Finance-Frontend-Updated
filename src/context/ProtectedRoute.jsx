import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  console.log('ProtectedRoute check:', { isAuthenticated }); // Debug log
  return isAuthenticated ? children : <Navigate to="/" replace />;
}
export default ProtectedRoute;