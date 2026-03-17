import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If the user is NOT logged in, send them to the signup/login page
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  // If they ARE logged in, render whatever child route they were trying to visit
  return <Outlet />;
};

export default ProtectedRoutes;