import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Menu, X, Settings } from 'lucide-react';
import useAuthStore from '../store/useAuthStore'; 

const Navbar = () => {
    const navigate = useNavigate();
    
    // Grab state from Zustand
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    // Mobile menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsMenuOpen(false); // Close menu on logout
        navigate('/'); 
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className='bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100'>
            <div className='flex items-center justify-between px-6 py-3'>
                
                {/* 1. Logo Section - Updated to Text Only with Times New Roman */}
                <div onClick={() => { navigate('/'); closeMenu(); }} className='flex items-center cursor-pointer z-50'>
                    <span 
                        className='font-bold text-xl tracking-tight text-slate-800'
                        style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                        DENIVS
                    </span>
                </div>

                {/* 2. Desktop Auth & Action Section (Right Side) */}
                <div className='hidden md:flex items-center text-slate-500'>
                    {isAuthenticated ? (
                        <div className='flex items-center'>
                            
                            {/* Action Icons (Heart & Settings) */}
                            <div className='flex items-center gap-6 pr-6'>
                                <Link to="/properties?mode=liked" className='hover:text-red-500 transition' title="Liked Properties">
                                    <Heart size={20} />
                                </Link>
                                <Link to="/profile/settings" className='hover:text-[#001A33] transition' title="Profile Settings">
                                    <Settings size={20} />
                                </Link>
                            </div>

                            {/* User Profile & Logout (Separated by a border) */}
                            <div className='flex items-center gap-4 pl-6 border-l border-slate-200'>
                                <div className="flex items-center gap-2">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                            <User className='w-4 h-4 text-slate-500' />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-slate-700">
                                        {user?.firstName || user?.name?.split(' ')[0] || 'User'}
                                    </span>
                                </div>
                                
                                <LogOut 
                                    onClick={handleLogout}
                                    className='w-5 h-5 cursor-pointer text-slate-400 hover:text-red-500 transition ml-2' 
                                    title="Logout"
                                />
                            </div>

                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-[#001A33] transition">
                                Log in
                            </Link>
                            <button 
                                onClick={() => navigate('/signup')}
                                className="text-sm font-bold bg-[#001A33] text-white px-5 py-2 rounded-xl hover:bg-[#13304c] transition"
                            >
                                Sign up
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. Mobile Hamburger Button */}
                <button 
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* 4. Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    
                    {isAuthenticated ? (
                        <>
                            {/* Mobile User Info */}
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <User className='w-5 h-5 text-slate-500' />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-slate-800">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user?.role || 'Buyer'}</p>
                                </div>
                            </div>

                            {/* Mobile Links */}
                            <div className="flex flex-col gap-3 py-2">
                                <Link 
                                    to="/profile/settings" 
                                    onClick={closeMenu}
                                    className='flex items-center gap-3 font-bold text-slate-600 hover:text-[#001A33] p-2 rounded-lg hover:bg-slate-50 transition'
                                >
                                    <Settings size={20} /> Profile Settings
                                </Link>
                                <Link 
                                    to="/properties?mode=liked" 
                                    onClick={closeMenu}
                                    className='flex items-center gap-3 font-bold text-slate-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition'
                                >
                                    <Heart size={20} /> Liked Properties
                                </Link>
                            </div>

                            {/* Mobile Logout */}
                            <button 
                                onClick={handleLogout}
                                className='flex items-center justify-center gap-2 w-full mt-2 py-3 font-bold text-red-500 border border-red-100 bg-red-50 rounded-xl hover:bg-red-100 transition'
                            >
                                <LogOut size={18} /> Log out
                            </button>
                        </>
                    ) : (
                        /* Mobile Auth Options (Logged Out) */
                        <div className="flex flex-col gap-3 pt-2">
                            <button 
                                onClick={() => { navigate('/login'); closeMenu(); }}
                                className="w-full py-3 font-bold text-slate-700 bg-slate-100 rounded-xl transition"
                            >
                                Log in
                            </button>
                            <button 
                                onClick={() => { navigate('/signup'); closeMenu(); }}
                                className="w-full py-3 font-bold text-white bg-[#001A33] rounded-xl shadow-lg transition"
                            >
                                Sign up
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;