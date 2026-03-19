import React, { useEffect, useState } from 'react';
import { Bed, Bath, Maximize, Heart, MapPin } from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore'; 
import { useNavigate } from 'react-router-dom'; 

const FeaturedList = () => {
  const navigate = useNavigate(); 
  
  const properties = usePropertyStore((state) => state.featuredProperties);
  const isLoading = usePropertyStore((state) => state.isLoading);
  const fetchProperties = usePropertyStore((state) => state.fetchProperties);
  const setLoading = usePropertyStore((state) => state.setLoading); // To trigger skeleton loaders
  
  const likedPropertyIds = usePropertyStore((state) => state.likedPropertyIds);
  const toggleFavorite = usePropertyStore((state) => state.toggleFavorite);

  // 🚀 NEW: UI state to show if properties are localized
  const [isLocalized, setIsLocalized] = useState(false);

  useEffect(() => {
    const loadPropertiesWithLocation = () => {
      // 1. Immediately show skeleton loaders while we wait for user to click "Allow Location"
      setLoading(true);

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // SUCCESS: User allowed location. Fetch properties within 50km!
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            fetchProperties({ lat, lng, radius: 50 });
            setIsLocalized(true);
          },
          (error) => {
            // ERROR: User clicked "Block" or GPS failed. Just fetch normally.
            console.warn("Location blocked or failed. Fetching normally.");
            fetchProperties();
          },
          { 
            // Give them 5 seconds to click "Allow". If they ignore it, fallback to normal fetch.
            timeout: 5000 
          }
        );
      } else {
        // Browser doesn't support GPS
        fetchProperties();
      }
    };

    loadPropertiesWithLocation();
  }, []); 

  const skeletonCards = [1, 2, 3, 4];

  return (
    <section className="pt-0 pb-12 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Listing</h2>
            <p className="text-slate-500 mt-1 flex items-center gap-1.5">
              Your trusted real estate partner 
              {isLocalized && <span className="flex items-center text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full text-xs ml-1"><MapPin size={12} className="mr-1"/> Near You</span>}
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-10 no-scrollbar snap-x snap-mandatory scroll-smooth">
          
          {isLoading ? (
            skeletonCards.map((n) => (
              <div key={`skeleton-${n}`} className="min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] max-w-[350px] snap-center bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
                <div className="h-56 bg-slate-200 animate-pulse w-full"></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 animate-pulse"></div>
                      <div className="w-16 h-3 bg-slate-200 animate-pulse rounded-full"></div>
                    </div>
                    <div className="w-20 h-6 bg-slate-200 animate-pulse rounded-md"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-slate-200 animate-pulse rounded-md mb-3 mt-4"></div>
                  <div className="w-full h-4 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                  <div className="w-5/6 h-4 bg-slate-200 animate-pulse rounded-md mb-6"></div>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                    <div className="w-12 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="w-12 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="w-16 h-5 bg-slate-200 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            ))
          ) : properties.length === 0 ? (
            // Just in case there are NO properties near them!
            <div className="w-full py-12 text-center">
              <h3 className="text-xl font-bold text-slate-700">No properties found near you.</h3>
              <p className="text-slate-500 mt-2">Try expanding your search on the Browse page.</p>
            </div>
          ) : (
            properties.map((item) => {
              const isLiked = likedPropertyIds.includes(item.id);

              return (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/property/${item.id}`)} 
                  className="min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] max-w-[350px] snap-center bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="bg-white/20 backdrop-blur-lg text-white text-[10px] px-3 py-1 rounded-full border border-white/30 font-bold tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        toggleFavorite(item.id);
                      }}
                      className={`absolute top-4 right-4 p-2 backdrop-blur-lg rounded-full border transition active:scale-90 ${isLiked ? 'bg-red-50/90 border-red-200 text-red-500' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                    >
                      <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                        <div className="bg-blue-950 text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            View Property
                        </div>
                    </div>
                  </div>

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
                    <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed h-8">{item.location}</p>

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
              );
            })
          )}

        </div>
      </div>
    </section>
  );
};

export default FeaturedList;