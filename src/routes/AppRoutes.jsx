import { Routes, Route } from 'react-router-dom';

// --- PAGES ---
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import PostProperty from '../pages/postProperty';
// import PostProperty from '../pages/PostProperty'; // Uncomment when you build the form page

// --- ROUTE GUARDS ---
// import ProtectedRoutes from './ProtectedRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🟢 PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      {/* If you want a separate login page later, add it here: */}
      <Route path="/login" element={<Login />} />

      {/* 🔴 PROTECTED ROUTES (Requires User to be Logged In) */}
      <Route path="/post-property" element={<PostProperty />} />
      {/* <Route element={<ProtectedRoutes />}>
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/favorites" element={<FavoritesDashboard />} />
      </Route> */}

      {/* ⚠️ 404 CATCH-ALL (If a user types a random URL) */}
      <Route path="*" element={
        <div className="flex h-screen items-center justify-center text-2xl font-bold text-slate-800">
          404 - Page Not Found
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;