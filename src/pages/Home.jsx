import React from 'react';
import ExploreCategories from './ExploreCategories';
import Footer from './Footer';
import Hero from './Hero';



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