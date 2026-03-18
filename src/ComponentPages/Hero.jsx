import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomepageBannerURL } from '../utils/constants'
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Building2, Briefcase, Home as HomeIcon, Users } from 'lucide-react'

const Hero = () => {
  const navigate = useNavigate();
  
  // --- STATE FOR FILTERS ---
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedCategory, setSelectedCategory] = useState(''); // 🚀 NEW: Holds the category until search is clicked

  // --- HANDLERS ---
  const handleCategorySelect = (propertyTypeString) => {
    // If they click the already selected category, deselect it. Otherwise, select it.
    if (selectedCategory === propertyTypeString) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(propertyTypeString);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Build the query URL based ONLY on what the user has selected
    const params = new URLSearchParams();
    
    if (searchInput.trim()) {
      params.append('search', searchInput.trim());
    }
    if (selectedCategory) {
      params.append('propertyType', selectedCategory);
    }
    
    // You can also pass the activeTab (Buy/Rent) if your backend uses it!
    // params.append('transactionType', activeTab === 'buy' ? 'Sale' : 'Rent');

    // 🚀 Navigate only when the Search button is clicked
    navigate(`/properties?${params.toString()}`);
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
            <TabsList className='w-full flex flex-nowrap overflow-x-auto no-scrollbar justify-start gap-2 bg-transparent mb-4'>
              <TabsTrigger value="buy" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>Buy</TabsTrigger>
              <TabsTrigger value="rent" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>Rent</TabsTrigger>
              <TabsTrigger value="pg" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>PG/Co-living</TabsTrigger>
              <TabsTrigger value="commercial" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>Commercial</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Form wrapper */}
          <form onSubmit={handleSearchSubmit}>
            <div className='flex flex-col sm:flex-row shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white mb-6'>
              <input
                type='text'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder='Enter City, Locality, Project'
                className='bg-transparent flex-1 px-4 py-3 md:py-4 text-sm md:text-base text-slate-700 focus:outline-none w-full'
              />
              <button
                type='submit'
                className='bg-blue-950 hover:bg-blue-800 transition text-white px-6 md:px-10 py-3 md:py-4 text-sm md:text-base font-bold whitespace-nowrap w-full sm:w-auto'
              >
                Search
              </button>
            </div>

            {/* ── Category Filters (Now acts as selectable toggles) ── */}
            <div className='flex items-center justify-between gap-5 overflow-x-auto no-scrollbar px-2'>
              
              <div onClick={() => handleCategorySelect('House,Land')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'House,Land' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <HomeIcon className='w-6 h-6' />
                </div>
                <span className={`text-xs font-bold transition ${selectedCategory === 'House,Land' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>Residential</span>
              </div>

              <div onClick={() => handleCategorySelect('Apartment')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'Apartment' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <Building2 className='w-6 h-6' />
                </div>
                <span className={`text-xs font-bold transition ${selectedCategory === 'Apartment' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>Apartments</span>
              </div>

              <div onClick={() => handleCategorySelect('Office,Shop')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'Office,Shop' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <Briefcase className='w-6 h-6' />
                </div>
                <span className={`text-xs font-bold transition ${selectedCategory === 'Office,Shop' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>Commercial</span>
              </div>

              <div onClick={() => handleCategorySelect('PG')} className='flex flex-col items-center gap-2 group cursor-pointer min-w-[80px]'>
                <div className={`w-12 h-12 flex justify-center items-center rounded-xl transition shadow-sm ${selectedCategory === 'PG' ? 'bg-[#001A33] text-white' : 'bg-blue-50 text-blue-950 group-hover:bg-blue-100'}`}>
                  <Users className='w-6 h-6' />
                </div>
                <span className={`text-xs font-bold transition ${selectedCategory === 'PG' ? 'text-[#001A33]' : 'text-slate-500 group-hover:text-blue-950'}`}>PG/Hostels</span>
              </div>

            </div>
          </form>

        </div>
      </div>

    </div>
  )
}

export default Hero