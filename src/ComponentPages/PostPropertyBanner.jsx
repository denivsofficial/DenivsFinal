import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const PostPropertyBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto my-12 px-4 md:px-10">
      
      {/* Clean, solid-color container with a very subtle top-right highlight for depth */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#001A33] shadow-lg flex flex-col md:flex-row items-center justify-between p-8 sm:p-10 md:p-14 lg:p-16 gap-8">
        
        {/* Minimalist faint gradient just to prevent the dark blue from looking completely flat */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/6 to-transparent pointer-events-none"></div>

        {/* Content Section */}
        <div className="relative z-10 w-full md:w-2/3 text-center md:text-left">
          
          <span className="text-blue-300 font-bold tracking-widest text-xs sm:text-sm uppercase mb-3 block">
            For Owners & Brokers
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Ready to sell or rent your property?
          </h2>
          
          <p className="text-blue-100/80 text-base md:text-lg max-w-xl mx-auto md:mx-0 font-medium">
            List your property in just a few clicks. Reach thousands of genuine buyers and tenants instantly.
          </p>
          
        </div>

        {/* CTA Button Section */}
        <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end shrink-0">
          <button 
            onClick={() => navigate('/post-property')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-[#001A33] font-bold text-base md:text-lg hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300 active:scale-95 shadow-md"
          >
            <Plus size={20} strokeWidth={2.5} />
            Post Property Free
          </button>
        </div>

      </div>
    </section>
  );
};

export default PostPropertyBanner;