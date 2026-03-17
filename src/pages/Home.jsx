import React from 'react';
import ExploreCategories from '../ComponentPages/ExploreCategories';
import Footer from '../ComponentPages/Footer';
import Hero from '../ComponentPages/Hero';
import PostPropertyBanner from '../ComponentPages/PostPropertyBanner';

import FeaturedList from '@/ComponentPages/FeaturedList';
import { Calculator } from 'lucide-react';
import MoreProperty from '@/ComponentPages/MoreProperty';
import Calculators from '@/ComponentPages/Calculator';



const Home = () => {
  return (
    <main className="w-full min-h-screen bg-white">
    <Hero/>

        <div className="mt-[clamp(10px,8vw,90px)]">
          <FeaturedList/>
        </div>
        <Calculators/>
        <PostPropertyBanner/>
        <MoreProperty/>
      
      
      
    </main>
  );
};

export default Home;