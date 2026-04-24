import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { ShieldAlert, ArrowLeft, Home, Loader2 } from 'lucide-react';

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  // 1. Wait for the auth check to finish to prevent false redirects
  if (isCheckingAuth) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 2. If the user is NOT logged in, send them to login WITH their intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If specific roles are required, check if the user has permission
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Show an "Access Denied" screen instead of a confusing redirect
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
          
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            Access Denied
          </h1>
          
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            This area is restricted to <span className="font-semibold text-slate-700">Seller</span> or <span className="font-semibold text-slate-700">Admin</span> accounts.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              to="/"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-[#001A33] text-white text-sm font-bold hover:bg-[#13304c] transition-all"
            >
              <Home size={18} />
              Return to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 4. If they pass the checks, render the child route!
  return <Outlet />;
};

export default ProtectedRoutes;