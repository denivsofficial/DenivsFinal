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
    // Changed py-8 to pt-8 pb-2 to significantly reduce bottom space
    <section className="pt-8 pb-2 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
          
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-5 pb-4 md:pb-2 pt-2 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:overflow-visible md:snap-none no-scrollbar">
          
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.query)}
              className="shrink-0 w-[55vw] sm:w-52 md:w-full md:shrink bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group snap-start md:snap-none flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-36 sm:h-40 overflow-hidden rounded-t-3xl bg-slate-200 shrink-0">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Tag Badge */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[#001A33] text-[10px] sm:text-xs px-2.5 py-1 sm:py-1.5 rounded-full font-bold tracking-wide shadow-sm">
                    {cat.tag}
                  </span>
                </div>

                {/* Hover Overlay (Desktop Only) */}
                <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <button className="bg-[#001A33] text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        Explore Category
                    </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3 sm:p-4 flex flex-col justify-center grow">
                <h3 className="font-bold text-base text-slate-800 mb-0.5 group-hover:text-[#001A33] transition-colors line-clamp-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
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