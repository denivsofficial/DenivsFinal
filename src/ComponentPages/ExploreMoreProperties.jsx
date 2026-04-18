import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore'; 
import { useNavigate } from 'react-router-dom'; 

const ExploreMoreProperties = () => {
  const navigate = useNavigate(); 
  
  const rawData = usePropertyStore((state) => state.featuredProperties);
  const isLoading = usePropertyStore((state) => state.isLoading);
  const fetchProperties = usePropertyStore((state) => state.fetchProperties);
  const likedPropertyIds = usePropertyStore((state) => state.likedPropertyIds);
  const toggleFavorite = usePropertyStore((state) => state.toggleFavorite);

  const properties = Array.isArray(rawData) ? rawData : rawData?.properties || [];

  useEffect(() => {
    fetchProperties();
  }, []);

  const skeletonCards = [1, 2, 3, 4];

  // Filter non-featured properties (featuredRank === 0)
  const nonFeaturedProperties = properties
    .filter((item) => item?.featuredRank === 0 || item?.featuredRank === undefined);

  return (
    <section className="py-3 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">Explore More Properties</h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500">Discover additional properties that match your interests</p>
        </div>

        {/* Mobile: Horizontal Scroll | Tablet+: Grid Layout */}
        <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible md:snap-none md:gap-4 lg:gap-5 no-scrollbar">
          
          {isLoading ? (
            skeletonCards.map((n) => (
              <div key={n} className="shrink-0 w-[75%] snap-start md:w-full md:shrink bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-64 animate-pulse"></div>
            ))
          ) : nonFeaturedProperties.length === 0 ? (
            <div className="w-full py-12 text-center">
              <h3 className="text-xl font-bold text-slate-700">No additional properties available.</h3>
              <p className="text-slate-500 mt-2">Check back later for new listings!</p>
            </div>
          ) : (
            nonFeaturedProperties.map((item) => {
              const isLiked = likedPropertyIds.includes(item.id);

              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/property/${item.id}`)}
                  className="shrink-0 w-[75%] snap-start md:w-full md:shrink bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-lg cursor-pointer active:scale-95 md:active:scale-100"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-200">
                    <img
                      src={item.image || "/fallback.jpg"}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition"
                    >
                      <Heart
                        size={16}
                        className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1 group-hover:text-[#001A33] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-1">
                      {item.location}
                    </p>
                    <p className="font-bold text-sm sm:text-base text-[#001A33]">₹ {item.price}</p>
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

export default ExploreMoreProperties;
