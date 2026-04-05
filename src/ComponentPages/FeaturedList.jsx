import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore'; 
import { useNavigate } from 'react-router-dom'; 

const FeaturedList = () => {
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

  const featuredProperties = properties
    .filter((item) => item?.featuredRank > 0)
    .sort((a, b) => a.featuredRank - b.featuredRank);

  return (
    <section className="pt-0 pb-12 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Listing</h2>
            <p className="text-slate-500 mt-1">Your trusted real estate partner</p>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-10 no-scrollbar snap-x snap-mandatory scroll-smooth">
          
          {isLoading ? (
            skeletonCards.map((n) => (
              <div key={n} className="min-w-75 bg-white rounded-3xl shadow-md h-80 animate-pulse"></div>
            ))
          ) : featuredProperties.length === 0 ? (
            <div className="w-full py-12 text-center">
              <h3 className="text-xl font-bold text-slate-700">No featured properties available.</h3>
            </div>
          ) : (
            featuredProperties.map((item) => {
              const isLiked = likedPropertyIds.includes(item.id);

              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/property/${item.id}`)}
                  className="min-w-75 bg-white rounded-3xl shadow-md cursor-pointer overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={item.image || "/fallback.jpg"}
                      alt={item.title}
                      className="h-56 w-full object-cover rounded-t-3xl"
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
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.location}</p>
                    <p className="font-bold mt-2">₹ {item.price}</p>
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