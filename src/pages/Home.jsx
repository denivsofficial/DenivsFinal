import React from 'react';
import ExploreCategories from '../ComponentPages/ExploreCategories';
import Footer from '../ComponentPages/Footer';
import Hero from '../ComponentPages/Hero';



const Home = () => {
  return (
    <main className="w-full min-h-screen bg-white">
    <Hero/>
         <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        <ExploreCategories />

      </div>
      <Footer />
    </main>
  );
};

export default Home;