import React from 'react';
import { Bed, Bath, Maximize, Heart } from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore'; // Adjust path if necessary

const FeaturedList = () => {
  // 1. Grab data and loading state from the Zustand store
  const properties = usePropertyStore((state) => state.featuredProperties);
  const isLoading = usePropertyStore((state) => state.isLoading);

  // Array to map over for our skeleton loading cards
  const skeletonCards = [1, 2, 3, 4];

  return (
    <section className="pt-0 pb-12 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Featured Listing</h2>
          <p className="text-slate-500 mt-1">Your trusted real estate partner in every transaction.</p>
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="flex overflow-x-auto gap-6 pb-10 no-scrollbar snap-x snap-mandatory scroll-smooth">
          
          {isLoading ? (
            /* --- SKELETON SHIMMER UI --- */
            skeletonCards.map((n) => (
              <div 
                key={`skeleton-${n}`} 
                className="min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] max-w-[350px] snap-center bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="h-56 bg-slate-200 animate-pulse w-full"></div>

                {/* Card Content Skeleton */}
                <div className="p-6">
                  {/* Top Row (Avatar & Price) */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="w-16 h-3 bg-slate-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="w-20 h-6 bg-slate-200 animate-pulse rounded-md"></div>
                  </div>

                  {/* Title & Location Skeleton */}
                  <div className="w-3/4 h-6 bg-slate-200 animate-pulse rounded-md mb-3 mt-4"></div>
                  <div className="w-full h-4 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                  <div className="w-5/6 h-4 bg-slate-200 animate-pulse rounded-md mb-6"></div>

                  {/* Specs Row Skeleton */}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="w-12 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="w-12 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="w-16 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* --- REAL PROPERTY DATA --- */
            properties.map((item) => (
              <div 
                key={item.id} 
                className="min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] max-w-[350px] snap-center bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-xl"
              >
                {/* Image Area */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="bg-white/20 backdrop-blur-lg text-white text-[10px] px-3 py-1 rounded-full border border-white/30 font-bold tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-lg rounded-full text-white border border-white/30 hover:bg-white/40">
                    <Heart size={18} />
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                      <button className="bg-blue-950 text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          View Property
                      </button>
                  </div>
                </div>

                {/* Card Content Area */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.title}`} alt="agent" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">+4 Images</span>
                    </div>
                    <span className="font-extrabold text-slate-900 text-lg">₹ {item.price}</span>
                  </div>

                  <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-blue-950 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed h-8">
                    {item.location}
                  </p>

                  {/* Specs Row */}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Bed size={18} className="text-blue-950/70" /> 
                      <span className="text-xs font-bold">{item.specs.bed}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Bath size={18} className="text-blue-950/70" /> 
                      <span className="text-xs font-bold">{item.specs.bath}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Maximize size={18} className="text-blue-950/70" /> 
                      <span className="text-xs font-bold">{item.specs.area}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
};

export default FeaturedList;