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
  }, [fetchProperties]);

  const skeletonCards = [1, 2, 3, 4];

  const nonFeaturedProperties = properties
    .filter((item) => item?.featuredRank === 0 || item?.featuredRank === undefined);

  return (
    <section className="py-8 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Explore More Properties</h2>
          <p className="text-slate-500 mt-1">Discover additional properties that match your interests</p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible md:snap-none no-scrollbar">
          
          {isLoading ? (
            skeletonCards.map((n) => (
              <div key={n} className="shrink-0 w-[80vw] sm:w-72 md:w-full md:shrink bg-white rounded-3xl shadow-lg overflow-hidden h-80 animate-pulse snap-start md:snap-none"></div>
            ))
          ) : nonFeaturedProperties.length === 0 ? (
            <div className="w-full py-12 text-center col-span-full">
              <h3 className="text-xl font-bold text-slate-700">No additional properties available.</h3>
              <p className="text-slate-500 mt-2">Check back later for new listings!</p>
            </div>
          ) : (
            nonFeaturedProperties.map((item) => {
              const isLiked = likedPropertyIds.includes(item.id);
              
              const isRent = item.tags?.includes('Rent') || item.tags?.includes('RENT');

              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/property/${item.id}`)}
                  className="shrink-0 w-[80vw] sm:w-72 md:w-full md:shrink bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group snap-start md:snap-none"
                >
                  <div className="relative w-full h-56 overflow-hidden rounded-t-3xl bg-slate-200">
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
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                    >
                      <Heart
                        size={18}
                        className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-[#001A33] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                      {item.location}
                    </p>

                    <p className="font-bold text-lg text-[#001A33] flex items-end gap-1">
                      ₹ {item.price}
                      {isRent && item.price !== 'Price on Request' && (
                        <span className="text-xs font-semibold text-slate-500 mb-0.75">/ month</span>
                      )}
                    </p>
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