import React from 'react'
import { HomepageBannerURL } from '../utils/constants'
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"

const Home = () => {
  return (
    <div className='w-full bg-slate-50 min-h-screen pb-20'>

      {/* ── Hero Section ── */}
      {/* 1. Changed to 9:16 aspect ratio */}
      <div className='relative w-full aspect-[9/16] max-h-[50vh] overflow-hidden bg-black'>
        
        <img
          src={HomepageBannerURL}
          className='w-full h-full object-cover opacity-90'
          alt="Find your perfect property"
        />

        {/* Dark gradient so text is always readable over the image */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none' />

        {/* ── Overlay content: text only ── */}
        <div className='
          absolute z-10
          bottom-32 left-4 right-4
          md:bottom-40 md:left-10 md:right-auto md:w-[60%]
        '>
          {/* Headline */}
          <h1 className='text-3xl sm:text-5xl md:text-6xl text-white font-bold leading-tight drop-shadow-md'>
            Find Your Perfect Property
          </h1>
          <p className='text-base sm:text-xl md:text-2xl mt-2 md:mt-4 text-blue-200 font-semibold drop-shadow-sm'>
            Buy, Rent &amp; Invest With Confidence
          </p>
        </div>
      </div>

      {/* ── Overlapping Search Form ── */}
      {/* 2. Negative margin (-mt-24) pulls the form up over the image */}
      <div className='relative z-20 -mt-24 px-4 md:px-10 max-w-5xl mx-auto'>
        <div className='bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-xl border border-white/40'>
          
          <Tabs defaultValue="buy" className='w-full'>
            <TabsList className='w-full sm:w-auto flex justify-between sm:justify-start bg-transparent mb-4'>
              <TabsTrigger value="buy" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>Buy</TabsTrigger>
              <TabsTrigger value="rent" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>Rent</TabsTrigger>
              <TabsTrigger value="pg" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>PG/Co-living</TabsTrigger>
              <TabsTrigger value="commercial" className='text-sm md:text-base font-medium data-[state=active]:text-blue-950 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2'>Commercial</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={(e) => e.preventDefault()} className='flex shadow-md rounded-xl overflow-hidden border border-gray-200 bg-white'>
            <input
              type='text'
              placeholder='Enter City, Locality, Project'
              className='bg-transparent flex-1 px-4 py-3 md:py-4 text-sm md:text-base text-slate-700 focus:outline-none w-full'
            />
            <button
              type='submit'
              className='bg-blue-950 hover:bg-blue-800 transition text-white px-6 md:px-10 py-3 md:py-4 text-sm md:text-base font-semibold whitespace-nowrap'
            >
              Search
            </button>
          </form>

        </div>
      </div>

    </div>
  )
}

export default Home