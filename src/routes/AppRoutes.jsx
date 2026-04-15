import AboutUs from "../ComponentPages/AboutUs";
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import PostProperty from '../pages/postProperty';
import PropertyDisplayPage from '../pages/PropertyDisplayPage';
import PropertyListPage from '../pages/PropertyListPage';
import ProfileSection from '@/ComponentPages/profile/ProfileSection';


const AppRoutes = () => {
  return (
    <Routes>
      {/* 🟢 PUBLIC ROUTES */}
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/properties" element={<PropertyListPage />} />
      {/* 🔴 PROTECTED ROUTES (Requires User to be Logged In) */}
      <Route path="/post-property" element={<PostProperty />} />
      <Route path="/profile" element={<ProfileSection />} />
      <Route path="/property/:id" element={<PropertyDisplayPage />} />
      
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