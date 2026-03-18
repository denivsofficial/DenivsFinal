import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Search, User, Bell, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore'; // Import the store

const Navbar = () => {
    const navigate = useNavigate();
    
    // Grab state from Zustand
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Send them home after logging out
    };

    return (
        <nav className='bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-100'>
            {/* 1. Logo Section */}
            <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer'>
                <div className='bg-blue-600 p-1.5 rounded-lg'>
                    <div className='w-5 h-5 border-2 border-white rounded-sm'></div>
                </div>
                <span className='font-bold text-xl tracking-tight text-slate-800'>DENIVS</span>
            </div>

            {/* 2. Navigation Links */}
            <div className='hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600'>
                <Link to="/buy" className='hover:text-blue-600 transition'>Buy</Link>
                <Link to="/rent" className='hover:text-blue-600 transition'>Rent</Link>
                <Link to="/pg" className='hover:text-blue-600 transition'>PG/Co-living</Link>
                <Link to="/commercial" className='hover:text-blue-600 transition'>Commercial</Link>
            </div>

            {/* 3. Action Icons & Auth State */}
            <div className='flex items-center space-x-5 text-slate-500'>
                <Search className='w-5 h-5 cursor-pointer hover:text-blue-600 transition' />
                <Heart className='w-5 h-5 cursor-pointer hover:text-red-500 transition' />
                
                {isAuthenticated ? (
                    // IF LOGGED IN: Show user info and Logout button
                    <>
                        <div className='relative'>
                            <Bell className='w-5 h-5 cursor-pointer hover:text-blue-600 transition' />
                            <span className='absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white'></span>
                        </div>
                        
                        <div className='flex items-center gap-4 pl-4 border-l border-gray-200'>
                            {/* Make the profile section clickable to route to Settings */}
                            <Link to="/profile/settings" className="flex items-center gap-2 hover:text-[#001A33] transition cursor-pointer">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full" />
                                ) : (
                                    <User className='w-5 h-5 hover:text-blue-600 transition' />
                                )}
                                <span className="text-sm font-bold text-slate-700 hidden sm:block">
                                    {/* Fallback to firstName if updated, otherwise use name */}
                                    {user?.firstName || user?.name?.split(' ')[0] || 'Profile'}
                                </span>
                            </Link>
                            
                            <LogOut 
                                onClick={handleLogout}
                                className='w-5 h-5 cursor-pointer text-slate-400 hover:text-red-500 transition' 
                                title="Logout"
                            />
                        </div>
                    </>
                ) : (
                    // IF NOT LOGGED IN: Show Signup/Login button
                    <div className='flex items-center gap-4 pl-4 border-l border-gray-200'>
                        <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-[#001A33] transition">
                            Log in
                        </Link>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="text-sm font-bold bg-[#001A33] text-white px-4 py-2 rounded-lg hover:bg-[#13304c] transition"
                        >
                            Sign up
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;