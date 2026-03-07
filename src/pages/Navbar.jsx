import React from 'react';
import { Heart, Search, User, Bell } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className='bg-transparent z-10 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-100'>
            {/* 1. Logo Section */}
            <div className='flex items-center gap-2 cursor-pointer'>
                <div className='bg-blue-600 p-1.5 rounded-lg'>
                    <div className='w-5 h-5 border-2 border-white rounded-sm'></div>
                </div>
                <span className='font-bold text-xl tracking-tight text-slate-800'>DENIVS</span>
            </div>

            {/* 2. Navigation Links (Hidden on mobile, flex on desktop) */}
            <div className='hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600'>
                <button className='hover:text-blue-600 transition'>Buy</button>
                <button className='hover:text-blue-600 transition'>Rent</button>
                <button className='hover:text-blue-600 transition'>PG/Co-living</button>
                <button className='hover:text-blue-600 transition'>Commercial</button>
            </div>

            {/* 3. Action Icons */}
            <div className='flex items-center space-x-5 text-slate-500'>
                <Search className='w-5 h-5 cursor-pointer hover:text-blue-600 transition' />
                <Heart className='w-5 h-5 cursor-pointer hover:text-red-500 transition' />
                <div className='relative'>
                    <Bell className='w-5 h-5 cursor-pointer hover:text-blue-600 transition' />
                    <span className='absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white'></span>
                </div>
                <div className='flex items-center gap-2 pl-2 border-l border-gray-200'>
                    <User className='w-5 h-5 cursor-pointer hover:text-blue-600 transition' />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;