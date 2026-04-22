import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus } from 'lucide-react';

const PostPropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full max-w-7xl mx-auto my-12 overflow-hidden bg-white rounded-3xl shadow-sm min-h-60 aspect-video md:h-112.5 md:aspect-auto">
      
      <img 
        src="/PostPropImg2.png" 
        alt="Modern skyscraper architecture perspective" 
        className="absolute inset-0 z-0 w-full h-full p-2 sm:p-3 md:p-0 object-contain md:object-cover object-center opacity-90" 
      />

      {/* Overlay Container: Changed to items-start and justify-end to pin the button to the top-right corner */}
      <div className="absolute inset-0 z-10 flex items-start justify-end p-6 md:p-16 lg:p-24">
        <button 
          onClick={() => navigate('/post-property')}
          className="inline-flex items-center justify-center gap-3.5 px-6 py-3 rounded-xl bg-[#001A33] text-white font-bold text-base md:gap-3 md:px-8 md:py-3.5 md:text-lg tracking-wide shadow-xl hover:bg-[#13304c] transition-all duration-300 transform hover:-translate-y-3 active:scale-95 group focus:ring-4 focus:ring-blue-900/40"
        >
          <Building size={20} className="group-hover:-translate-y-1.5 transition-transform" />
          <span className="flex items-center gap-2">
            Start Listing
            <Plus size={18} />
          </span>
        </button>
      </div>

    </section>
  );
};

export default PostPropertyBanner;