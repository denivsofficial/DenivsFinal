import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Phone, CheckCircle, Building, Heart, Share2, X } from 'lucide-react';
import { apiClient } from '../store/useAuthStore'; 
import usePropertyStore from '../store/usePropertyStore';

const PropertyDisplayPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- ZUSTAND STORE (FAVORITES) ---
  const likedPropertyIds = usePropertyStore(state => state.likedPropertyIds);
  const toggleFavorite = usePropertyStore(state => state.toggleFavorite);
  const fetchFavorites = usePropertyStore(state => state.fetchFavorites);

  const isLiked = likedPropertyIds.includes(id);

  // --- STATE ---
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [isBottomVisible, setIsBottomVisible] = useState(false); // 🚀 NEW: Tracks if user hit the footer

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    wantVisit: false,
    agreeTerms: false
  });

  // --- FETCH DATA & OBSERVER ---
  useEffect(() => {
    const fetchSingleProperty = async () => {
      try {
        const response = await apiClient.get(`/api/properties/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          setProperty(data);
          setMainImage(data.images?.length > 0 ? data.images[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800');
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchSingleProperty();
    }
    fetchFavorites(); 
  }, [id, fetchFavorites]);

  // 🚀 NEW: Intersection Observer to hide the bottom nav when reaching the footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the dummy div at the bottom is visible, hide the sticky bar
        setIsBottomVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Triggers when 10% of the target is visible
    );

    const bottomTarget = document.getElementById('bottom-page-marker');
    if (bottomTarget) {
      observer.observe(bottomTarget);
    }

    return () => {
      if (bottomTarget) observer.unobserve(bottomTarget);
    };
  }, [loading]); // Re-run when loading finishes so the div is in the DOM

  // --- HANDLERS ---
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setContactSuccess(false);
        setContactForm({ name: '', phone: '', wantVisit: false, agreeTerms: false });
      }, 2500);
    }, 1000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || 'Property on DENIVS',
          text: 'Check out this property!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading property details...</div>;
  if (error || !property) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-500">{error}</div>;

  return (
    // 🚀 FIX: Adjusted top padding (pt-[60px]) and removed mt-6 to eliminate the gap
    <div className="min-h-screen bg-slate-50 pt-2.5 md:pt-18 pb-10 lg:pb-12 px-4 md:px-10 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* --- MOBILE STICKY TOP NAV --- */}
        {/* 🚀 FIX: top-[60px] assumes your main navbar is ~60px tall. It will now sit flush against it. */}
        <div className="sticky top-15 z-40 bg-white/95 backdrop-blur-md py-3 flex justify-between items-center lg:hidden -mx-4 px-4 mb-6 border-b border-slate-200">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 rounded-full shadow-sm border border-slate-200 text-slate-700 transition active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <button onClick={() => toggleFavorite(id)} className={`p-2 rounded-full shadow-sm border transition active:scale-95 ${isLiked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
          </button>
        </div>

        {/* --- DESKTOP BACK BUTTON --- */}
        <button onClick={() => navigate(-1)} className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-[#001A33] font-bold mb-6 transition mt-6">
          <ArrowLeft size={20} /> Back to Listings
        </button>

        {/* --- MAIN CONTENT --- */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* IMAGE SECTION (Order 1 on Mobile) */}
          <div className="order-1 lg:order-0 lg:col-span-2">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="h-75 md:h-125 w-full rounded-xl overflow-hidden mb-4 bg-slate-100">
                <img src={mainImage} alt="Property" className="w-full h-full object-contain md:object-cover" />
              </div>
              
              {property.images && property.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {property.images.map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      onClick={() => setMainImage(img)}
                      className={`shrink-0 h-20 w-28 md:h-24 md:w-32 object-cover rounded-lg cursor-pointer border-2 transition ${mainImage === img ? 'border-[#001A33]' : 'border-transparent hover:border-slate-300'}`}
                    />
                  ))}
                </div>
              )}

              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 px-2">
                <button onClick={() => toggleFavorite(id)} className={`flex items-center gap-2 font-bold transition group ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}>
                  <div className={`p-2 rounded-full transition ${isLiked ? 'bg-red-50' : 'bg-slate-50 group-hover:bg-red-50'}`}>
                    <Heart size={20} className={isLiked ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500'} />
                  </div>
                  {isLiked ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleNativeShare} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition group">
                  <div className="p-2 bg-slate-50 rounded-full group-hover:bg-blue-50 transition"><Share2 size={20} /></div>Share
                </button>
              </div>
            </div>
          </div>

          {/* SALE CARD (Order 2 on Mobile, sits below Image) */}
          <div className="order-2 lg:order-0 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 lg:sticky lg:top-24">
              
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    For {property.transactionType}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {property.propertyType}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1 leading-tight">
                  {property.title || property.project || `${property.propertyType} in ${property.location?.city || ''}`}
                </h1>

                <h2 className="text-2xl font-bold text-blue-950 mt-2">
                  ₹ {property.price?.value?.toLocaleString('en-IN') || property.price?.toString() || 'Price on Request'}
                </h2>
                
                <p className="flex items-start gap-2 text-slate-500 mt-3 font-medium text-sm leading-tight">
                  <MapPin size={18} className="shrink-0 mt-0.5" /> 
                  <span>{property.location?.address || property.locality || ''}, {property.location?.city || property.city || ''}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 mb-6">
                <div className="flex flex-col gap-1"><div className="flex items-center gap-2 text-slate-500"><Bed size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Bedrooms</span></div><span className="font-extrabold text-slate-900">{property.residentialDetails?.bedrooms || parseInt(property.bedrooms) || 'N/A'}</span></div>
                <div className="flex flex-col gap-1"><div className="flex items-center gap-2 text-slate-500"><Bath size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Bathrooms</span></div><span className="font-extrabold text-slate-900">{property.residentialDetails?.bathrooms || '2'}</span></div>
                <div className="flex flex-col gap-1"><div className="flex items-center gap-2 text-slate-500"><Maximize size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Carpet Area</span></div><span className="font-extrabold text-slate-900">{property.residentialDetails?.carpetArea ? `${property.residentialDetails.carpetArea} sqft` : 'N/A'}</span></div>
                <div className="flex flex-col gap-1"><div className="flex items-center gap-2 text-slate-500"><Building size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Floor</span></div><span className="font-extrabold text-slate-900">{property.residentialDetails?.floorNumber || property.floor || 'N/A'}</span></div>
              </div>

              <button onClick={() => setIsModalOpen(true)} className="hidden lg:flex w-full h-12 bg-[#001A33] text-white rounded-xl font-bold hover:bg-[#13304c] transition justify-center items-center gap-2">
                <Phone size={18} /> Contact Seller
              </button>
            </div>
          </div>

          {/* OVERVIEW SECTION (Order 3 on Mobile, sits below Sale Card) */}
          <div className="order-3 lg:order-0 lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Overview</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description || `Beautiful ${property.propertyType} available for ${property.transactionType}. Located in the prime area of ${property.location?.city || 'the city'}. Contact the seller for full details and viewing arrangements.`}
              </p>
              
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle size={16} className="text-green-500" /><span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 🚀 NEW: Invisible marker for the Intersection Observer */}
        <div id="bottom-page-marker" className="h-1 w-full mt-4"></div>

      </div>

      {/* --- MOBILE STICKY BOTTOM NAV --- */}
      {/* 🚀 FIX: Uses transform to slide down completely out of view when the footer is reached */}
      <div 
        className={`fixed left-0 right-0 bg-white p-3 border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] flex gap-3 z-40 lg:hidden transition-all duration-300 ease-in-out ${isBottomVisible ? '-bottom-25 opacity-0 pointer-events-none' : 'bottom-0 opacity-100'}`}
      >
        <button onClick={handleNativeShare} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold rounded-xl py-3.5 transition active:scale-95">
          <Share2 size={18} /> Share
        </button>
        <button onClick={() => setIsModalOpen(true)} className="flex-1 flex items-center justify-center gap-2 bg-[#001A33] text-white font-bold rounded-xl py-3.5 transition active:scale-95">
          <Phone size={18} /> Contact
        </button>
      </div>

      {/* --- CONTACT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Contact Seller</h2>
              <p className="text-sm text-slate-500 mb-6">Leave your details and the seller will reach out to you.</p>
              {contactSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle size={48} className="text-green-500" /><h3 className="text-xl font-bold text-slate-900">Request Sent!</h3><p className="text-sm text-slate-500">The seller has received your details and will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div><label className="text-sm font-semibold text-slate-700 block mb-1">Full Name</label><input type="text" required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} placeholder="e.g. John Doe" className="w-full h-11 border border-slate-300 rounded-lg px-3 focus:ring-2 focus:ring-[#001A33] focus:outline-none" /></div>
                  <div><label className="text-sm font-semibold text-slate-700 block mb-1">Contact Number</label><input type="tel" required value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} placeholder="e.g. 9876543210" className="w-full h-11 border border-slate-300 rounded-lg px-3 focus:ring-2 focus:ring-[#001A33] focus:outline-none" /></div>
                  <div className="pt-2 space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5"><input type="checkbox" checked={contactForm.wantVisit} onChange={(e) => setContactForm({...contactForm, wantVisit: e.target.checked})} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-[#001A33] checked:border-[#001A33] transition-colors cursor-pointer" /><CheckCircle size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} /></div><span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition">I am interested in a site visit</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5"><input type="checkbox" required checked={contactForm.agreeTerms} onChange={(e) => setContactForm({...contactForm, agreeTerms: e.target.checked})} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-[#001A33] checked:border-[#001A33] transition-colors cursor-pointer" /><CheckCircle size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} /></div><span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition">I agree to the <span className="text-blue-600 hover:underline">Terms & Conditions</span></span>
                    </label>
                  </div>
                  <button type="submit" disabled={isSubmittingContact} className="w-full h-12 bg-[#001A33] text-white rounded-xl font-bold hover:bg-[#13304c] transition mt-6 disabled:opacity-70">{isSubmittingContact ? 'Sending...' : 'Submit Request'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDisplayPage;