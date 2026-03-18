import { useEffect } from "react";
import Footer from "./ComponentPages/Footer";
import Navbar from "./pages/Navbar";
import AppRoutes from "./routes/AppRoutes";
import useAuthStore from "./store/useAuthStore"; 

function App() {
  const checkAuthSession = useAuthStore((state) => state.checkAuthSession);

  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

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