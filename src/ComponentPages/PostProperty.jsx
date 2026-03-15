import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Plus } from 'lucide-react';

const PostPropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full max-w-7xl mx-auto h-[400px] md:h-[450px] overflow-hidden bg-white rounded-3xl shadow-sm my-12">
      
      <img 
        src="/PostPropImg2.png" 
        alt="Modern skyscraper architecture perspective" 
        className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-90" 
      />

      {/* Overlay Container: Full coverage, centered vertically, pushed to the right */}
      <div className="absolute inset-0 flex items-center justify-end p-8 md:p-16 lg:p-24 z-10">
        <button 
          onClick={() => navigate('/post-property')}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-[#001A33] text-white font-bold text-lg tracking-wide shadow-xl hover:bg-[#13304c] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 group focus:ring-4 focus:ring-blue-900/40"
        >
          <Building size={20} className="group-hover:-translate-y-0.5 transition-transform" />
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