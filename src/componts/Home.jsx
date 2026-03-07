import React from 'react'
import { HomepageBannerURL } from '../utils/constants'

const Home = () => {
  return (
    <div id="home-parent" className='relative w-full h-full bg-red-500 '>
      <div id="home-child1 ">
        {/* Image div  */}
        <img src={HomepageBannerURL}
          className='z-10 w-full h-120'
        ></img>
      </div>
      <div id="home=child2" className='z-20 ml-10  w-3/6 h-5/6 bg-black absolute bottom-7 left-1 rounded-2xl'>
        {/* Text and Location Form Div */}

        <div id="Banner Text " className='h-2/6 w-full'>
          <h1 className='text-6xl text-blue-950 font-semibold'>Find Your Perfect Property</h1>
          <h3 className='text-4xl mt-4  text-blue-600 font-semibold'>Buy,Rent & Invest With Confidence</h3>
        </div>
        <div id='homePageSearch'  ></div>
      </div>
    </div>
  )
}

export default Home 
