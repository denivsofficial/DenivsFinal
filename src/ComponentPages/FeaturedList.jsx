import React from 'react';
import { Bed, Bath, Maximize, Heart } from 'lucide-react';

const featuredProperties = [
  {
    id: 1,
    title: "Shivneri Heights",
    location: "CIDCO N-7, Sambhajinagar, Maharashtra, India",
    price: "35,00,000",
    tags: ["SALE", "LAND"],
    specs: { bed: 2, bath: 2, area: "78.5 m²" },
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800"
  },
  {
    id: 2,
    title: "Gajanan Residency",
    location: "Aurangpura, Sambhajinagar, Maharashtra, India",
    price: "45,00,000",
    tags: ["RENT", "HOUSE"],
    specs: { bed: 4, bath: 2, area: "120 m²" },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800"
  },
  {
    id: 3,
    title: "Sahyadri Chambers",
    location: "Jalna Road, near MGM, Sambhajinagar, Maharashtra, India",
    price: "30,00,000",
    tags: ["COMMERCIAL", "DUPLEX"],
    specs: { bed: 3, bath: 3, area: "95 m²" },
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800"
  },
  {
    id: 4,
    title: "Marathwada Villa",
    location: "Waluj MIDC, Sambhajinagar, Maharashtra, India",
    price: "55,00,000",
    tags: ["SALE", "VILLA"],
    specs: { bed: 5, bath: 4, area: "210 m²" },
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800"
  },
  {
    id: 5,
    title: "Ajanta View Apartments",
    location: "Paithan Road, Sambhajinagar, Maharashtra, India",
    price: "28,50,000",
    tags: ["RENT", "FLAT"],
    specs: { bed: 2, bath: 1, area: "65 m²" },
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800"
  },
  {
    id: 6,
    title: "Ellora Residency",
    location: "Railway Station Area, Sambhajinagar, Maharashtra, India",
    price: "42,00,000",
    tags: ["SALE", "HOUSE"],
    specs: { bed: 3, bath: 2, area: "110 m²" },
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800"
  }
];

const FeaturedList = () => {
  return (
    <section className="py-12 px-4 md:px-10 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Featured Listing</h2>
          <p className="text-slate-500 mt-1">Your trusted real estate partner in every transaction.</p>
        </div>

        {/* Horizontal Scrollable Container */}
        {/* snap-x snap-mandatory ensures the scroll 'locks' onto each card */}
        <div className="flex overflow-x-auto gap-6 pb-10 no-scrollbar snap-x snap-mandatory scroll-smooth">
          {featuredProperties.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[300px] md:min-w-[350px] max-w-[350px] snap-center bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-xl"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedList;