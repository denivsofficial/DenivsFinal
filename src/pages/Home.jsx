import React from 'react'
import { HomepageBannerURL } from '../utils/constants'
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"

const Home = () => {
  return (
    <div className='w-full bg-white'>

      {/* ── Hero Section ── */}
      <div className='relative w-full'>

        {/* Banner image — shorter on mobile, full height on desktop */}
        <img
          src={HomepageBannerURL}
          className='w-full h-64 sm:h-80 md:h-[480px] object-cover'
          alt="Find your perfect property"
        />

        {/* Dark gradient so text is always readable over the image */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none' />

        {/* ── Overlay content: text + search (desktop) ── */}
        <div className='
          absolute z-10
          bottom-5 left-4 right-4
          md:bottom-10 md:left-10 md:right-auto md:w-[52%]
        '>
          {/* Headline */}
          <h1 className='text-2xl sm:text-4xl md:text-6xl text-white font-bold leading-tight drop-shadow-md'>
            Find Your Perfect Property
          </h1>
          <p className='text-sm sm:text-xl md:text-3xl mt-1 md:mt-3 text-blue-300 font-semibold drop-shadow-sm'>
            Buy, Rent &amp; Invest With Confidence
          </p>

          {/* Tabs + Search — visible on sm and above (overlaid on image) */}
          <div className='hidden sm:block mt-4 md:mt-10'>
            <Tabs defaultValue="buy" className='w-full md:w-[450px]'>
              <TabsList className='w-full md:w-[340px] bg-white/20 backdrop-blur-sm'>
                <TabsTrigger value="buy" className='text-white data-[state=active]:text-blue-950'>Buy</TabsTrigger>
                <TabsTrigger value="rent" className='text-white data-[state=active]:text-blue-950'>Rent</TabsTrigger>
                <TabsTrigger value="pg" className='text-xs text-white data-[state=active]:text-blue-950'>PG/Co-living</TabsTrigger>
                <TabsTrigger value="commercial" className='text-xs text-white data-[state=active]:text-blue-950'>Commercial</TabsTrigger>
              </TabsList>
            </Tabs>
            <form onSubmit={(e) => e.preventDefault()} className='flex mt-3 shadow-lg'>
              <input
                type='text'
                placeholder='Enter City, Locality, Project'
                className='bg-white flex-1 rounded-l-2xl p-4 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <button
                type='submit'
                className='bg-blue-950 hover:bg-blue-800 transition text-white rounded-r-2xl px-5 md:px-7 text-sm md:text-base font-semibold whitespace-nowrap'
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Mobile-only Search Bar (below image, clean card) ── */}
      <div className='sm:hidden w-full bg-white px-4 py-5 shadow-md border-t border-gray-100'>
        <Tabs defaultValue="buy" className='w-full'>
          <TabsList className='w-full grid grid-cols-4 h-auto'>
            <TabsTrigger value="buy" className='text-xs py-2'>Buy</TabsTrigger>
            <TabsTrigger value="rent" className='text-xs py-2'>Rent</TabsTrigger>
            <TabsTrigger value="pg" className='text-[10px] py-2 leading-tight'>PG/Co-living</TabsTrigger>
            <TabsTrigger value="commercial" className='text-[10px] py-2 leading-tight'>Commercial</TabsTrigger>
          </TabsList>
        </Tabs>
        <form onSubmit={(e) => e.preventDefault()} className='flex mt-3 shadow-sm rounded-2xl overflow-hidden border border-gray-200'>
          <input
            type='text'
            placeholder='Enter City, Locality, Project'
            className='bg-gray-50 flex-1 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:bg-white transition'
          />
          <button
            type='submit'
            className='bg-blue-950 hover:bg-blue-800 transition text-white px-5 text-sm font-semibold whitespace-nowrap'
          >
            Search
          </button>
        </form>
      </div>

    </div>
  )
}

export default Home
