import React from 'react';
import ExploreCategories from '../ComponentPages/ExploreCategories';
import Footer from '../ComponentPages/Footer';
import Hero from '../ComponentPages/Hero';
import FeaturedList from '@/ComponentPages/FeaturedList';
import { Calculator } from 'lucide-react';
import MoreProperty from '@/ComponentPages/MoreProperty';



const Home = () => {
  return (
    <main className="w-full min-h-screen bg-white">
    <Hero/>
         <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        <FeaturedList/>
        <Calculator/>
        <MoreProperty/>

      </div>
      <Footer />
    </main>
  );
};

export default Home;