import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useAuthStore((s) => s.user);
  const isAuth    = useAuthStore((s) => s.isAuthenticated);
  const logout    = useAuthStore((s) => s.logout);

  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    window.location.href = '/';
  };

  const fullName  = user?.name || 'Account';
  const firstName = fullName.split(' ')[0];
  const initial   = firstName[0]?.toUpperCase() ?? '?';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ─── Navbar ─────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300
          ${scrolled ? 'border-b border-slate-200 shadow-sm' : 'border-b border-slate-100'}`}
      >
        <div className="w-full flex items-center justify-between px-5 md:px-10 h-14.5">

          <button
            onClick={() => navigate('/')}
            className="font-black text-[28px] tracking-[0.04em] leading-none flex items-center"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <span className="text-[#0A1F44]">DE</span>
            <span className="text-[#2F6BFF]">NIVS</span>
          </button>

          {/* ── Desktop right ── */}
          <div className="hidden md:flex items-center gap-2">
            {isAuth ? (
              <>
                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <Link
                    to="/seller-dashboard"
                    className="h-9 px-5 rounded-full border-[1.5px] border-slate-200 text-[13px] font-bold text-[#555]
                      inline-flex items-center
                      hover:border-[#001A33] hover:text-[#001A33] transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/properties?mode=liked"
                  className="h-9 px-5 rounded-full border-[1.5px] border-slate-200 text-[13px] font-bold text-[#555]
                    inline-flex items-center
                    hover:border-[#001A33] hover:text-[#001A33] transition-all"
                >
                  Saved
                </Link>

                <button
                  onClick={() => navigate('/post-property')}
                  className="h-9 pl-5 pr-2 rounded-full bg-[#001A33] text-white text-[13px] font-bold
                    flex items-center gap-2 hover:bg-[#13304c] active:scale-[.97] transition-all"
                >
                  List property
                  <span className="bg-[#E8FF47] text-[#1A1A00] text-[9px] font-black tracking-[.08em] uppercase px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </button>

                <div className="w-px h-5 bg-[#E0DED8] mx-1" />

                <button
                  onClick={() => navigate('/profile')}
                  className="h-9 pl-1.5 pr-4 rounded-full border-[1.5px] border-slate-200 flex items-center gap-2
                    hover:border-[#001A33] transition-all"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#001A33] flex items-center justify-center">
                      <span className="text-[10px] font-black text-white" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                        {initial}
                      </span>
                    </div>
                  )}
                  <span className="text-[13px] font-bold text-[#0D0D0D]">{firstName}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/post-property')}
                  className="h-9 pl-5 pr-2 rounded-full border-[1.5px] border-slate-200 text-[13px] font-bold text-[#555]
                    flex items-center gap-2 hover:border-[#001A33] hover:text-[#001A33] transition-all"
                >
                  List property
                  <span className="bg-[#E8FF47] text-[#1A1A00] text-[9px] font-black tracking-[.08em] uppercase px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </button>

                <div className="w-px h-5 bg-[#E0DED8] mx-1" />

                <Link
                  to="/login"
                  className="h-9 px-5 rounded-full text-[13px] font-bold text-[#555]
                    inline-flex items-center
                    hover:text-[#001A33] hover:bg-slate-50 transition-all"
                >
                  Log in
                </Link>

                <button
                  onClick={() => navigate('/signup')}
                  className="h-9 px-5 rounded-full bg-[#001A33] text-white text-[13px] font-bold
                    hover:bg-[#13304c] active:scale-[.97] transition-all"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden w-9 h-9 rounded-full border-[1.5px] border-slate-200 bg-white flex flex-col items-center justify-center gap-1.25 transition-all hover:border-[#001A33]"
          >
            <span className={`block h-[1.5px] bg-[#001A33] rounded-full transition-all duration-300 ${open ? 'w-4 rotate-45 translate-y-[6.5px]' : 'w-4'}`} />
            <span className={`block h-[1.5px] bg-[#001A33] rounded-full transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-2.5 self-end mr-0.75'}`} />
            <span className={`block h-[1.5px] bg-[#001A33] rounded-full transition-all duration-300 ${open ? 'w-4 -rotate-45 -translate-y-[6.5px]' : 'w-4'}`} />
          </button>

        </div>
      </nav>

      {/* ─── Backdrop ───────────────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ─── Right-side drawer (dark) ────────────────────────────── */}
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-70 bg-[#001A33] flex flex-col
          transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[.07]">
          <span
            className="text-white font-black text-[17px] tracking-[.06em]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            DENIVS
          </span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">

          {isAuth ? (
            <>
              <button
                onClick={() => { navigate('/profile'); setOpen(false); }}
                className="flex items-center gap-3 px-6 py-4 border-b border-white/[.07] text-left hover:bg-white/4 active:bg-white/6 transition-colors"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-black text-[#001A33]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                      {initial}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-[14px] truncate">
                    {fullName}
                  </p>
                  <p className="text-white/40 text-[11px] mt-0.5 capitalize">
                    {user?.role || 'Member'} · View profile
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeOpacity=".2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>

              <nav className="flex-1 px-4 py-4 flex flex-col gap-0.5">
                {[
                  { label: 'Home',              to: '/'                       },
                  ...(user?.role === 'seller' || user?.role === 'admin' ? [{ label: 'Dashboard', to: '/seller-dashboard' }] : []),
                  { label: 'Saved properties',  to: '/properties?mode=liked'  },
                  { label: 'My listings',       to: '/my-listings'            },
                ].map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors
                      ${isActive(to)
                        ? 'bg-white/6'
                        : 'hover:bg-white/4'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors
                      ${isActive(to) ? 'bg-[#E8FF47]' : 'bg-white/20'}`}
                    />
                    <span className={`text-[14px] font-semibold transition-colors
                      ${isActive(to) ? 'text-white' : 'text-white/60'}`}>
                      {label}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mx-4 mb-4 rounded-2xl bg-[#E8FF47] p-5 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-16 border-[#0D0D0D]/6" />
                <p className="text-[9px] font-black tracking-[.12em] uppercase text-[#1A1A00]/60 mb-1">It's completely free</p>
                <p
                  className="text-[#0D0D0D] font-black text-[18px] leading-[1.15] mb-4"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  List your<br />property today
                </p>
                <button
                  onClick={() => { navigate('/post-property'); setOpen(false); }}
                  className="w-full h-10 rounded-full bg-white text-[#001A33] text-[12px] font-black tracking-[.03em]
                    hover:bg-slate-100 active:scale-[.97] transition-all"
                >
                  List now →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-6 py-8 flex flex-col gap-3">
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-2">Get started</p>
                <button
                  onClick={() => { navigate('/signup'); setOpen(false); }}
                  className="w-full h-12 rounded-full bg-white text-[#001A33] text-[14px] font-black
                    hover:bg-white/90 active:scale-[.97] transition-all"
                >
                  Create account
                </button>
                <button
                  onClick={() => { navigate('/login'); setOpen(false); }}
                  className="w-full h-12 rounded-full border border-white/12 text-white text-[14px] font-bold
                    hover:border-white/30 hover:bg-white/4 active:scale-[.97] transition-all"
                >
                  Log in
                </button>
              </div>

              <div className="mx-4 mb-4 rounded-2xl bg-[#E8FF47] p-5 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-16 border-[#0D0D0D]/6" />
                <p className="text-[9px] font-black tracking-[.12em] uppercase text-[#1A1A00]/60 mb-1">It's completely free</p>
                <p
                  className="text-[#0D0D0D] font-black text-[18px] leading-[1.15] mb-4"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  List your<br />property today
                </p>
                <button
                  onClick={() => { navigate('/post-property'); setOpen(false); }}
                  className="w-full h-10 rounded-full bg-white text-[#001A33] text-[12px] font-black tracking-[.03em]
                    hover:bg-slate-100 active:scale-[.97] transition-all"
                >
                  List now →
                </button>
              </div>
            </>
          )}
        </div>

        {isAuth && (
          <div className="px-4 pb-6 border-t border-white/[.07] pt-4">
            <button
              onClick={handleLogout}
              className="w-full h-11 rounded-full border border-red-500/30 text-[13px] font-bold text-red-400
                hover:bg-red-500/10 hover:border-red-500/50 active:scale-[.97] transition-all"
            >
              Log out
            </button>
          </div>
        )}
      </div>

    </>
  );
}