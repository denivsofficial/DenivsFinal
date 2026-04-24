import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. If the user is NOT logged in, send them to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If specific roles are required, check if the user has permission
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If a normal buyer tries to access the dashboard, kick them to home
    return <Navigate to="/" replace />; 
  }

  // 3. If they pass the checks, render the child route!
  return <Outlet />;
};

export default ProtectedRoutes;