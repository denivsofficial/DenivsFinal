import { useEffect } from "react";
import Footer from "./ComponentPages/Footer";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./store/useAuthStore";
import usePropertyStore from "./store/usePropertyStore";

function App() {
  const checkAuthSession = useAuthStore((state) => state.checkAuthSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchFavorites = usePropertyStore((state) => state.fetchFavorites);

  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      // Clear liked state when logged out so it doesn't bleed into next user's session
      usePropertyStore.setState({ likedPropertyIds: [], likedPropertiesData: [] });
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      <Navbar />
      <main className="pt-16"> 
        <AppRoutes />
      </main>
      <Footer/>
    </div>
  );
}

export default App;