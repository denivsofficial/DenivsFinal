import Navbar from "./componts/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Navbar stays here so it shows on EVERY page */}
      <Navbar />
      
      <main className="pt-16"> 
        {/* All page switching happens inside AppRoutes */}
        
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;