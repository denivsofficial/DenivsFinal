import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomepageBannerURL } from '../utils/constants'
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Building2, Briefcase, Home as HomeIcon, Users, MapPin } from 'lucide-react' 

const Hero = () => {
  const navigate = useNavigate();
  
  // --- STATE FOR FILTERS ---
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedCategory, setSelectedCategory] = useState(''); 

  // --- HANDLERS ---
  const handleCategorySelect = (propertyTypeString) => {
    if (selectedCategory === propertyTypeString) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(propertyTypeString);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.append('search', searchInput.trim());
    if (selectedCategory) params.append('propertyType', selectedCategory);
    navigate(`/properties?${params.toString()}`);
  };

  // 🚀 NEW: Dummy location fetcher for the new UI button
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // For now, just visually indicate we got the location. 
          // Later, you can use a Geocoding API to convert lat/lng to a city name!
          setSearchInput("Current Location");
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className='w-full bg-slate-50'>

      {/* ── Hero Section ── */}
      <div className='relative w-full aspect-[9/16] max-h-[50vh] overflow-hidden bg-black'>
        <img
          src={HomepageBannerURL}
          className='w-full h-full object-cover opacity-90'
          alt="Find your perfect property"
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none' />
        <div className='absolute z-10 bottom-32 left-4 right-4 md:bottom-40 md:left-10 md:right-auto md:w-[60%]'>
          <h1 className='text-3xl sm:text-5xl md:text-6xl text-shadow-blue-900 font-bold leading-tight drop-shadow-md text-white'>
            Find Your Perfect Property
          </h1>
          <p className='text-base sm:text-xl md:text-2xl mt-2 md:mt-4 text-blue-100 font-semibold drop-shadow-sm'>
            Buy, Rent & Invest With Confidence
          </p>
        </div>
      </div>

      {/* ── Overlapping Search Form ── */}
      <div className='relative z-20 -mt-16 md:-mt-24 px-4 md:px-10 max-w-5xl mx-auto'>
        <div className='bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white/40'>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            {/* 🚀 FIX: Modified spacing (gap-1 sm:gap-4), added justify-between for mobile, and reduced padding/text-size slightly on mobile (px-3, text-[13px]) so "Commercial" fits perfectly */}
            <TabsList className='w-full flex flex-nowrap overflow-x-auto no-scrollbar justify-between sm:justify-center gap-1 sm:gap-4 bg-transparent mb-4 pb-1'>
              <TabsTrigger value="buy" className='shrink-0 text-[13px] sm:text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 sm:px-5 py-2 transition-all'>Buy</TabsTrigger>
              <TabsTrigger value="rent" className='shrink-0 text-[13px] sm:text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 sm:px-5 py-2 transition-all'>Rent</TabsTrigger>
              <TabsTrigger value="pg" className='shrink-0 text-[13px] sm:text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 sm:px-5 py-2 transition-all'>PG/Co-living</TabsTrigger>
              <TabsTrigger value="commercial" className='shrink-0 text-[13px] sm:text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 sm:px-5 py-2 transition-all'>Commercial</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Form wrapper */}
          <form onSubmit={handleSearchSubmit}>
            
            {/* Inline Search Bar with Location Pin */}
            <div className='flex flex-row items-center shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white mb-6 p-1.5'>
              
              {/* Location Button */}
              <button 
                type="button"
                onClick={handleGetLocation}
                className='p-2 md:p-3 text-slate-400 hover:text-[#001A33] transition shrink-0'
                title="Use current location"
              >
                <MapPin size={20} className="md:w-6 md:h-6" />
              </button>

              {/* Vertical Divider */}
              <div className="w-[1px] h-6 bg-slate-200 mx-1 shrink-0"></div>

              {/* Input Field */}
              <input
                type='text'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder='City, Locality, Project'
                className='bg-transparent flex-1 px-3 py-2 md:py-3 text-sm md:text-base text-slate-700 focus:outline-none min-w-0'
              />
              
              {/* Search Button */}
              <button
                type='submit'
                className='bg-[#001A33] hover:bg-[#13304c] transition text-white px-5 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-bold whitespace-nowrap rounded-lg shrink-0 shadow-sm'
              >
                Search
              </button>
            </div>

            {/* ── Category Filters ── */}
            <div className='flex items-start sm:justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar px-2 pb-2'>
              
              <div onClick={() => handleCategorySelect('House,Land')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[70px] shrink-0'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'House,Land' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <HomeIcon className='w-6 h-6' />
                </div>
                <span className={`text-[11px] md:text-xs font-bold transition ${selectedCategory === 'House,Land' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>Residential</span>
              </div>

              <div onClick={() => handleCategorySelect('Apartment')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[70px] shrink-0'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'Apartment' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <Building2 className='w-6 h-6' />
                </div>
                <span className={`text-[11px] md:text-xs font-bold transition ${selectedCategory === 'Apartment' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>Apartments</span>
              </div>

              <div onClick={() => handleCategorySelect('Office,Shop')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[70px] shrink-0'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'Office,Shop' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <Briefcase className='w-6 h-6' />
                </div>
                <span className={`text-[11px] md:text-xs font-bold transition ${selectedCategory === 'Office,Shop' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>Commercial</span>
              </div>

              <div onClick={() => handleCategorySelect('PG')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[70px] shrink-0'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'PG' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <Users className='w-6 h-6' />
                </div>
                <span className={`text-[11px] md:text-xs font-bold transition ${selectedCategory === 'PG' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>PG/Hostels</span>
              </div>

            </div>
          </form>

        </div>
      </div>

    </div>
  )
}

export default Hero