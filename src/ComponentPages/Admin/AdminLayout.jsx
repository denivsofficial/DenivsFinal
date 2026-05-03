import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Clock, AlertCircle, Users, CheckCircle, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useAdminStore from '../../store/useAdminStore';

const NAV = [
  {
    label: 'Main',
    items: [
      { name: 'Overview', path: '/admin', end: true, icon: <LayoutDashboard size={18} /> },
      { name: 'Pending Review', path: '/admin/pending', badgeKey: 'pendingCount', icon: <Clock size={18} /> },
      { name: 'Incomplete Leads', path: '/admin/leads', badgeKey: 'incompleteCount', icon: <AlertCircle size={18} /> },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'All Users', path: '/admin/users', icon: <Users size={18} /> },
      { name: 'Verified Listings', path: '/admin/verified', icon: <CheckCircle size={18} /> },
    ],
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { stats, fetchStats } = useAdminStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]); // Close menu on route change

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const pageTitle = () => {
    const p = location.pathname;
    if (p === '/admin' || p === '/admin/') return 'Dashboard Overview';
    if (p.includes('pending')) return 'Pending Approvals';
    if (p.includes('leads')) return 'Incomplete Leads';
    if (p.includes('users')) return 'User Management';
    if (p.includes('verified')) return 'Verified Listings';
    return 'Admin';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center font-bold">D</div>
            <div>
              <div className="font-bold text-sm tracking-wide">DENIVS</div>
              <div className="text-[10px] text-white/50 tracking-widest uppercase">Admin Console</div>
            </div>
          </div>
          <button className="lg:hidden text-white/70" onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
          {NAV.map(section => (
            <div key={section.label}>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-3">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? 'bg-rose-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    {item.icon}
                    <span className="flex-1">{item.name}</span>
                    {item.badgeKey && stats[item.badgeKey] > 0 && (
                      <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                        {stats[item.badgeKey]}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-white/50 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{pageTitle()}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_0_3px_rgba(225,29,72,0.2)] animate-pulse" />
            <span className="text-xs font-medium text-slate-500">Live</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;