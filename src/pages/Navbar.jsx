import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Menu, X, Home, Building2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore'; 

const Navbar = () => {
    const navigate = useNavigate();
    
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsMenuOpen(false);
        window.location.href = '/';
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className='bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100'>
            <div className='flex items-center justify-between px-6 py-3'>
                
                {/* Logo */}
                <div 
                    onClick={() => { navigate('/'); closeMenu(); }} 
                    className='flex items-center cursor-pointer z-50'
                >
                    <span 
                        className='font-bold text-xl tracking-tight text-slate-800'
                        style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                        DENIVS
                    </span>
                </div>

                {/* Desktop */}
                <div className='hidden md:flex items-center text-slate-500'>
                    {isAuthenticated ? (
                        <div className='flex items-center'>
                            <div className='flex items-center gap-6 pr-6'>
                                <Link 
                                    to="/properties?mode=liked" 
                                    className='hover:text-red-500 transition'
                                >
                                    <Heart size={20} />
                                </Link>
                            </div>
                            <div className='flex items-center gap-4 pl-6 border-l border-slate-200'>
                                <div 
                                    onClick={() => navigate('/profile')}
                                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                >
                                    {user?.avatar ? (
                                        <img 
                                            src={user.avatar} 
                                            alt="Profile" 
                                            className="w-8 h-8 rounded-full border border-slate-200" 
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                            <User className='w-4 h-4 text-slate-500' />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-slate-700">
                                        {user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>
                                <LogOut 
                                    onClick={handleLogout}
                                    className='w-5 h-5 cursor-pointer text-slate-400 hover:text-red-500 transition ml-2' 
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Link to="/login" className="text-sm font-bold text-slate-600">
                                Log in
                            </Link>
                            <button 
                                onClick={() => navigate('/signup')}
                                className="text-sm font-bold bg-[#001A33] text-white px-5 py-2 rounded-xl"
                            >
                                Sign up
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu — full-screen overlay style */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl">
                    
                    {isAuthenticated ? (
                        <div className="flex flex-col">

                            {/* User card */}
                            <div 
                                onClick={() => { navigate('/profile'); closeMenu(); }}
                                className="flex items-center gap-4 px-6 py-5 bg-slate-50 border-b border-slate-100 cursor-pointer active:bg-slate-100 transition"
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="avatar" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#001A33] flex items-center justify-center shadow-md">
                                        <User className='w-5 h-5 text-white' />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.role || 'Member'} · View profile →</p>
                                </div>
                            </div>

                            {/* Nav links */}
                            <div className="flex flex-col px-4 py-3 gap-1">

                                <Link 
                                    to="/"
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 active:bg-slate-100 transition"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Home size={17} className="text-slate-500" />
                                    </div>
                                    Home
                                </Link>

                                <Link 
                                    to="/properties?mode=liked" 
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 font-semibold hover:bg-red-50 active:bg-red-100 transition"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                                        <Heart size={17} className="text-red-500" />
                                    </div>
                                    Saved Properties
                                </Link>

                                <Link 
                                    to="/post-property"
                                    onClick={closeMenu}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 font-semibold hover:bg-blue-50 active:bg-blue-100 transition"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Building2 size={17} className="text-blue-600" />
                                    </div>
                                    Post a Property
                                </Link>

                            </div>

                            {/* Logout */}
                            <div className="px-4 pb-5 pt-2">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2.5 w-full py-3.5 font-bold text-red-500 bg-red-50 rounded-2xl border border-red-100 active:bg-red-100 transition text-sm"
                                >
                                    <LogOut size={17} />
                                    Log out
                                </button>
                            </div>

                        </div>
                    ) : (
                        /* Logged-out mobile menu */
                        <div className="flex flex-col px-4 py-5 gap-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 mb-1">Get Started</p>
                            
                            <button 
                                onClick={() => { navigate('/login'); closeMenu(); }}
                                className="w-full py-3.5 rounded-2xl border-2 border-slate-200 font-bold text-slate-700 text-sm hover:bg-slate-50 active:bg-slate-100 transition"
                            >
                                Log in
                            </button>

                            <button 
                                onClick={() => { navigate('/signup'); closeMenu(); }}
                                className="w-full py-3.5 rounded-2xl bg-[#001A33] font-bold text-white text-sm active:opacity-90 transition shadow-lg shadow-slate-900/20"
                            >
                                Create an account
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;