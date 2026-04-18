import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrowseByCategory = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'land',
      title: 'Plots & Land',
      subtitle: 'Build your dream project from the ground up',
      query: 'Land',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      tag: 'Investments'
    },
    {
      id: 'apartment',
      title: 'Flats & Apartments',
      subtitle: 'Modern living spaces in prime city locations',
      query: 'Apartment',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      tag: 'Popular'
    },
    {
      id: 'house',
      title: 'Residential Houses',
      subtitle: 'Spacious standalone homes for your family',
      query: 'House',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      tag: 'Family'
    },
    {
      id: 'commercial',
      title: 'Offices & Shops',
      subtitle: 'Premium workspaces and high-visibility retail',
      query: 'Office,Shop',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      tag: 'Business'
    }
  ];

  const handleCategoryClick = (query) => {
    navigate(`/properties?propertyType=${encodeURIComponent(query)}`);
    window.scrollTo(0, 0); 
  };

  return (
    <section className="py-3 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2">Browse by Category</h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-500">Explore properties tailored to your specific lifestyle and needs.</p>
        </div>

        {/* Mobile: Horizontal Scroll | Tablet+: Grid Layout */}
        <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible md:snap-none md:gap-4 lg:gap-5 no-scrollbar">
          
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.query)}
              className="shrink-0 w-[75%] snap-start md:w-full md:shrink bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-lg cursor-pointer active:scale-95 md:active:scale-100"
            >
              {/* Image Container - Compact Aspect Ratio */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-xl bg-slate-200">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Tag Badge */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[#001A33] text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold tracking-wide shadow-sm">
                    {cat.tag}
                  </span>
                </div>

                {/* Hover Overlay (Desktop Only) */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <button className="bg-[#001A33] text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-xs md:text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Explore Category
                    </button>
                </div>
              </div>

              {/* Card Content - Compact Padding */}
              <div className="p-3 sm:p-4">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1 group-hover:text-[#001A33] transition-colors line-clamp-1">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                  {cat.subtitle}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory;