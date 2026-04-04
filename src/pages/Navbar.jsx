import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, LogOut, Menu, X } from 'lucide-react';
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
        navigate('/'); 
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
                            
                            {/* Actions */}
                            <div className='flex items-center gap-6 pr-6'>
                                <Link 
                                    to="/properties?mode=liked" 
                                    className='hover:text-red-500 transition'
                                >
                                    <Heart size={20} />
                                </Link>
                            </div>

                            {/* Profile + Logout */}
                            <div className='flex items-center gap-4 pl-6 border-l border-slate-200'>
                                
                                {/* 🔥 Profile Clickable */}
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
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl py-4 px-6 flex flex-col gap-4">
                    
                    {isAuthenticated ? (
                        <>
                            {/* User */}
                            <div 
                                onClick={() => { navigate('/profile'); closeMenu(); }}
                                className="flex items-center gap-3 pb-4 border-b cursor-pointer"
                            >
                                {user?.avatar ? (
                                    <img src={user.avatar} className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <User className='w-5 h-5 text-slate-500' />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold">{user?.name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                                </div>
                            </div>

                            {/* Links */}
                            <Link 
                                to="/properties?mode=liked" 
                                onClick={closeMenu}
                                className='flex items-center gap-3 font-bold text-slate-600'
                            >
                                <Heart size={20} /> Liked Properties
                            </Link>

                            {/* Logout */}
                            <button 
                                onClick={handleLogout}
                                className='flex items-center justify-center gap-2 w-full py-3 font-bold text-red-500 border bg-red-50 rounded-xl'
                            >
                                <LogOut size={18} /> Log out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { navigate('/login'); closeMenu(); }}>
                                Log in
                            </button>
                            <button onClick={() => { navigate('/signup'); closeMenu(); }}>
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