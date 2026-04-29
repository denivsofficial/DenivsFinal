import AboutUs from "../ComponentPages/AboutUs";
import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from "./ProtectedRoutes";
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import PostProperty from '../pages/postProperty';
import PropertyDisplayPage from '../pages/PropertyDisplayPage';
import PropertyListPage from '../pages/PropertyListPage';
import ProfileSection from '@/ComponentPages/profile/ProfileSection';
import AppPrivacy from "@/ComponentPages/AppPrivacy";
import TermsConditions from "@/ComponentPages/leagalPages/TermsConditions";
import MasterDisclaimer from "@/ComponentPages/leagalPages/MasterDisclaimer";
import NoBrokerageDeclaration from "@/ComponentPages/leagalPages/NoBrokerageDeclaration"; 
import ReraDisclaimer from "@/ComponentPages/leagalPages/ReraDisclaimer";
import RefundPolicy from "@/ComponentPages/leagalPages/RefundPolicy";
import AppCookie from "@/ComponentPages/leagalPages/AppCookie";
import ListingPolicy from "@/ComponentPages/leagalPages/ListingPolicy";
import SellerDashboard from "@/ComponentPages/SellerDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🟢 PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/properties" element={<PropertyListPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy-policy" element={<AppPrivacy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/disclaimer" element={<MasterDisclaimer />} />
      <Route path="/no-brokerage" element={<NoBrokerageDeclaration />} />
      <Route path="/rera-disclaimer" element={<ReraDisclaimer />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/cookie-policy" element={<AppCookie />} />
      <Route path="/listing-policy" element={<ListingPolicy />} />
      <Route path="/property/:id" element={<PropertyDisplayPage />} />


      {/* 🔴 GENERAL PROTECTED ROUTES (Requires ANY User to be Logged In) */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/profile" element={<ProfileSection />} />
      </Route>

      {/* 🟡 STRICT ROLE PROTECTED ROUTES (Requires User AND Seller/Admin Role) */}
      <Route element={<ProtectedRoutes allowedRoles={['seller', 'admin']} />}>
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
      </Route>
      
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