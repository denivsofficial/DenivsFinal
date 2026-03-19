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
    <section className="py-12 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Browse by Category</h2>
            <p className="text-slate-500 mt-1">Explore properties tailored to your specific lifestyle and needs.</p>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 no-scrollbar">
          
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.query)}
              // 🚀 FIX: Reduced from 70vw to 60vw so they are noticeably narrower
              className="min-w-[60vw] sm:min-w-[40vw] md:min-w-0 snap-center shrink-0 bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              {/* 🚀 FIX: Reduced height to h-48 to match the narrower width */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-slate-200">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-[#001A33] text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider shadow-sm">
                    {cat.tag}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <button className="bg-[#001A33] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Explore Category
                    </button>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-5 md:p-6">
                <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-1 md:mb-2 group-hover:text-[#001A33] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed line-clamp-2">
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