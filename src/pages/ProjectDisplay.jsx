import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, CheckCircle, Shield, Phone, FileText, 
  Building2, Calendar, Maximize, Home, Download, 
  ChevronRight, Map, ArrowLeft, Heart, Share2, Info, X, Loader2,
  PlayCircle, Bath, DoorOpen, Bed, Maximize2, Tag, Layers, Sofa, BadgeCheck, FlipHorizontal
} from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore';
import { apiClient } from '../store/useAuthStore';

// ─── Utility Helpers ─────────────────────────────────────────────────────────
function formatINR(val) {
  if (!val) return 'Price on Request';
  const n = Number(val);
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function getPriceRange(configs, basePrice) {
  if (!configs || configs.length === 0) return formatINR(basePrice);
  const prices = configs.map(c => c.priceValue).filter(p => p > 0);
  if (prices.length === 0) return formatINR(basePrice);
  if (prices.length === 1) return `Starts from ${formatINR(prices[0])}`;
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return `₹${formatINR(min).replace('₹', '')} - ${formatINR(max)}`;
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

function fullAddress(loc) {
  if (!loc) return '';
  return [loc.address, loc.city, loc.state, loc.pincode].filter(Boolean).join(', ');
}

// ─── Small reusable pieces ────────────────────────────────────────────────────
function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    blue:    'bg-blue-50  text-blue-700  border-blue-200',
    green:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    navy:    'bg-[#001A33] text-white border-[#001A33]',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
}

function SpecCell({ icon: Icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <Icon size={18} className="text-[#001A33]" strokeWidth={1.8} />
      <span className="text-[11px] text-slate-500 font-medium text-center leading-tight">{label}</span>
      <span className="text-[13px] font-bold text-slate-800 text-center">{value}</span>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value && value !== false) return null;
  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0 gap-4">
      <span className="text-sm text-slate-500 font-medium shrink-0">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right">{String(value)}</span>
    </div>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function ExpandableText({ text, maxLines = 4 }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped]   = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      setClamped(ref.current.scrollHeight > ref.current.clientHeight + 2);
    }
  }, [text]);

  return (
    <div>
      <p
        ref={ref}
        className="text-sm text-slate-600 leading-relaxed whitespace-pre-line transition-all"
        style={expanded ? {} : { display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
      >
        {text}
      </p>
      {(clamped || expanded) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-xs font-bold text-[#001A33] hover:opacity-70 transition"
        >
          {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Read more</>}
        </button>
      )}
    </div>
  );
}

// ─── Smart Contact Modal with Success Callback ────────────────────────────────
function ContactModal({ isOpen, onClose, propertyId, sellerName, onSuccessCallback }) {
  const [form, setForm]     = useState({ name: '', phone: '', message: '', wantVisit: false, agreeTerms: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let msg = form.message || '';
      if (form.wantVisit) msg = `[Site Visit Requested] ${msg}`.trim();
      const res = await apiClient.post('/leads', {
        propertyId,
        name:          form.name,
        contactNumber: form.phone,
        message:       msg || 'I am interested in this project.',
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setForm({ name: '', phone: '', message: '', wantVisit: false, agreeTerms: false });
          if (onSuccessCallback) onSuccessCallback(); 
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Contact Builder</h3>
            {sellerName && <p className="text-xs text-slate-400 mt-0.5">{sellerName}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="p-5">
          {success ? (
            <div className="py-8 flex flex-col items-center text-center gap-3 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-500" strokeWidth={2} />
              </div>
              <p className="text-base font-bold text-slate-900">Request Sent Successfully!</p>
              <p className="text-sm text-slate-500">Unlocking requested details...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">{error}</div>}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full name</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#001A33] outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Mobile number</label>
                <div className="flex gap-2">
                  <div className="h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-500 font-medium shrink-0">🇮🇳 +91</div>
                  <input required type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} placeholder="98765 43210" className="flex-1 h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#001A33] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Message (optional)</label>
                <textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any specific questions?" className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#001A33] outline-none resize-none" />
              </div>
              <div className="space-y-2.5 pt-1">
                {[
                  { key: 'wantVisit',  label: 'I am interested in scheduling a site visit' },
                  { key: 'agreeTerms', label: 'I agree to the Terms & Conditions', required: true },
                ].map(({ key, label, required }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5 shrink-0">
                      <input type="checkbox" required={required} checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-[#001A33] checked:border-[#001A33] transition cursor-pointer" />
                      <CheckCircle size={13} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 leading-snug">{label}</span>
                  </label>
                ))}
              </div>
              <button type="submit" disabled={loading} className="w-full h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#13304c] transition-all disabled:opacity-60 mt-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Unlock Details'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Swipe-only Image Gallery ────────────────────────────────────────────────
function Gallery({ images }) {
  const [active, setActive]         = useState(0);
  const [lightbox, setLightbox]     = useState(false);
  const [dragging, setDragging]     = useState(false);
  const [offset, setOffset]         = useState(0);

  const touchStartX  = useRef(null);
  const dragStartX   = useRef(null);

  const fallback = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&q=80';
  const imgs = images?.length ? images : [fallback];
  const count = imgs.length;

  const goTo = useCallback((idx) => { setActive(Math.max(0, Math.min(idx, count - 1))); setOffset(0); }, [count]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setOffset(0); };
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    if ((active === 0 && dx > 0) || (active === count - 1 && dx < 0)) setOffset(dx * 0.25);
    else setOffset(dx);
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - (touchStartX.current ?? 0);
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    else setOffset(0);
    touchStartX.current = null;
  };

  const onMouseDown = (e) => { dragStartX.current = e.clientX; setDragging(true); setOffset(0); };
  const onMouseMove = (e) => {
    if (!dragging || dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if ((active === 0 && dx > 0) || (active === count - 1 && dx < 0)) setOffset(dx * 0.25);
    else setOffset(dx);
  };
  const onMouseUp = (e) => {
    if (!dragging) return;
    const dx = e.clientX - (dragStartX.current ?? e.clientX);
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    else if (Math.abs(dx) < 5) setLightbox(true);
    else setOffset(0);
    setDragging(false);
    dragStartX.current = null;
  };
  const onMouseLeave = () => { if (dragging) { setDragging(false); setOffset(0); dragStartX.current = null; } };

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  const slidePercent = 100 / count;
  const translateValue = offset !== 0 ? `calc(${-active * slidePercent}% + ${offset}px)` : `${-active * slidePercent}%`;
  const transition = dragging || touchStartX.current !== null ? 'none' : 'transform 0.32s cubic-bezier(0.4,0,0.2,1)';

  return (
    <>
      <div className="bg-white lg:rounded-2xl border-b lg:border border-slate-200 overflow-hidden shadow-sm">
        <div
          className="relative aspect-[4/3] md:aspect-[21/9] bg-slate-900 overflow-hidden select-none"
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          <div className="absolute top-0 left-0 h-full flex" style={{ transform: `translateX(${translateValue})`, transition, width: `${count * 100}%` }}>
            {imgs.map((img, i) => (
              <div key={i} className="relative h-full flex-none" style={{ width: `${slidePercent}%` }}>
                <img src={img} alt={`Gallery ${i + 1}`} className="absolute inset-0 w-full h-full object-cover md:object-contain opacity-90" draggable={false} />
              </div>
            ))}
          </div>
          {count > 1 && (
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-none">
              {active + 1} / {count} Photos
            </div>
          )}
          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              {imgs.map((_, i) => (
                <span key={i} className={`rounded-full transition-all duration-300 shadow-sm ${i === active ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center select-none"
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onClick={() => setLightbox(false)}
        >
          <div className="w-full h-full overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-[110]" onClick={() => setLightbox(false)}>
              <X size={24} strokeWidth={2} />
            </button>
            <div className="flex h-full absolute top-0 left-0" style={{ width: `${count * 100}vw`, transform: `translateX(calc(${-active * 100}vw + ${offset}px))`, transition: touchStartX.current !== null ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {imgs.map((img, i) => (
                <div key={i} className="w-[100vw] h-full flex items-center justify-center flex-shrink-0 p-2 md:p-12">
                  {/* FIXED: Changed to w-full h-full to make image grow properly */}
                  <img src={img} alt="" className="w-full h-full object-contain" draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Simple Image Lightbox for Plans ──────────────────────────────────────────
function ImageLightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <button className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
        <X size={24} />
      </button>
      {/* FIXED: Changed to w-full h-[90vh] to make image grow properly */}
      <img src={src} className="w-full h-[90vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()} alt="Plan View" />
    </div>
  );
}

// ─── Single Unit Display Component ─────────────────────────────────────────────
export const SingleUnitDisplay = ({ property, adminMode, onAdminClose, adminActions: AdminActions }) => {
  const navigate         = useNavigate();
  const likedPropertyIds = usePropertyStore((s) => s.likedPropertyIds);
  const toggleFavorite   = usePropertyStore((s) => s.toggleFavorite);

  const [modalOpen, setModalOpen] = useState(false);
  const isLiked = likedPropertyIds.includes(property._id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || 'Property on DENIVS',
          text:  'Check out this property!',
          url:   window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const {
    title, propertyType, transactionType, description,
    location, images, price, amenities = [],
    residentialDetails: rd, plotDetails: pd, commercialDetails: cd,
    listedBy, isVerified, isResaleProperty,
  } = property;

  const isRent        = transactionType === 'Rent';
  const isResidential = propertyType === 'Apartment' || propertyType === 'House';
  const isLand        = propertyType === 'Land';
  const isCommercial  = propertyType === 'Office' || propertyType === 'Shop';
  const sellerName    = listedBy?.name || 'Seller';
  const sellerType    = listedBy?.sellerType;
  const sellerPhone   = listedBy?.contactNumber;

  const specs = [];
  if (isResidential && rd) {
    if (rd.bedrooms)          specs.push({ icon: Bed,            label: 'Bedrooms',    value: `${rd.bedrooms} BHK` });
    if (rd.bathrooms)         specs.push({ icon: Bath,           label: 'Bathrooms',   value: rd.bathrooms });
    if (rd.carpetArea)        specs.push({ icon: Maximize2,      label: 'Carpet area', value: `${rd.carpetArea} sq.ft` });
    if (rd.floorNumber != null) specs.push({ icon: Layers,       label: 'Floor',       value: rd.totalFloors ? `${rd.floorNumber} / ${rd.totalFloors}` : rd.floorNumber });
    if (rd.furnishingStatus)  specs.push({ icon: Sofa,           label: 'Furnishing',  value: rd.furnishingStatus });
  }
  if (isLand && pd) {
    if (pd.plotArea)          specs.push({ icon: Maximize2,      label: 'Plot area',   value: `${pd.plotArea} ${pd.areaUnit || 'sq.ft'}` });
    if (pd.facing)            specs.push({ icon: FlipHorizontal, label: 'Facing',      value: pd.facing });
    if (pd.gatedCommunity != null) specs.push({ icon: Shield,   label: 'Gated',       value: pd.gatedCommunity ? 'Yes' : 'No' });
  }
  if (isCommercial && cd) {
    if (cd.carpetArea)        specs.push({ icon: Maximize2,      label: 'Carpet area', value: `${cd.carpetArea} ${cd.areaUnit || 'sq.ft'}` });
    if (cd.floorNumber != null) specs.push({ icon: Layers,       label: 'Floor',        value: cd.totalFloors ? `${cd.floorNumber} / ${cd.totalFloors}` : cd.floorNumber });
    if (cd.washrooms)         specs.push({ icon: DoorOpen,       label: 'Washrooms',   value: cd.washrooms });
    if (cd.furnishingStatus)  specs.push({ icon: Sofa,           label: 'Furnishing',  value: cd.furnishingStatus });
  }

  const displayTitle = title || `${propertyType} for ${transactionType} in ${location?.city || ''}`;

  return (
    <div className={adminMode ? "bg-slate-50 h-full pb-20" : "min-h-screen bg-slate-50"}>
      {/* ── Mobile sticky topbar ── */}
      <div className="sticky top-0 sm:top-14 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 py-2.5 md:hidden">
        <button
          onClick={() => adminMode ? onAdminClose() : navigate(-1)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          {adminMode ? <X size={18} strokeWidth={2} /> : <ArrowLeft size={18} strokeWidth={2} />}
        </button>
        <p className="text-sm font-bold text-slate-800 truncate max-w-45">{displayTitle}</p>
        <div className="flex items-center gap-2">
          {!adminMode && (
            <>
              <button onClick={handleShare} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">
                <Share2 size={17} strokeWidth={2} />
              </button>
              <button onClick={() => toggleFavorite(property._id)} className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Heart size={17} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8 pb-28 lg:pb-8">
        {/* ── Desktop back button ── */}
        <button
          onClick={() => adminMode ? onAdminClose() : navigate(-1)}
          className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#001A33] transition mb-5"
        >
          {adminMode ? <X size={16} strokeWidth={2} /> : <ArrowLeft size={16} strokeWidth={2} />} 
          {adminMode ? 'Close Review' : 'Back to listings'}
        </button>

        {/* ── Desktop title row ── */}
        <div className="hidden md:flex items-start justify-between gap-6 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="navy">{propertyType}</Badge>
              {isVerified && <Badge variant="green"><BadgeCheck size={11} /> Verified</Badge>}
              {isResaleProperty === false && <Badge variant="blue">New</Badge>}
              {isResaleProperty === true  && <Badge variant="amber">Resale</Badge>}
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{displayTitle}</h1>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
              <MapPin size={14} strokeWidth={2} className="shrink-0 text-[#001A33]" />
              {fullAddress(location)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-black text-[#001A33]">{formatINR(price?.value)}</p>
            {isRent && <p className="text-sm text-slate-400 font-medium">per month</p>}
            {price?.isNegotiable && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <Tag size={11} className="text-emerald-500" strokeWidth={2} />
                <p className="text-xs text-emerald-600 font-semibold">Negotiable</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-5">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5 min-w-0">
            <Gallery images={images} />

            <div className="md:hidden bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="navy">{propertyType}</Badge>
                {isVerified && <Badge variant="green"><BadgeCheck size={11} /> Verified</Badge>}
                {isResaleProperty === false && <Badge variant="blue">New</Badge>}
                {isResaleProperty === true  && <Badge variant="amber">Resale</Badge>}
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-tight mb-3">{displayTitle}</h1>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-black text-[#001A33]">{formatINR(price?.value)}</p>
                  {isRent && <p className="text-xs text-slate-400 mt-0.5">per month</p>}
                  {price?.isNegotiable && (
                    <div className="flex items-center gap-1 mt-1">
                      <Tag size={11} className="text-emerald-500" strokeWidth={2} />
                      <span className="text-xs text-emerald-600 font-semibold">Negotiable</span>
                    </div>
                  )}
                </div>
                {isRent && price?.securityDeposit && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Security deposit</p>
                    <p className="text-sm font-bold text-slate-700">{formatINR(price.securityDeposit)}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <MapPin size={13} strokeWidth={2} className="shrink-0 text-[#001A33]" />
                {fullAddress(location)}
              </div>
            </div>

            {specs.length > 0 && (
              <SectionBlock title="Property highlights">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map((s, i) => <SpecCell key={i} {...s} />)}
                </div>
              </SectionBlock>
            )}

            <SectionBlock title="Pricing">
              <div className="divide-y divide-slate-100">
                <InfoRow label={isRent ? 'Monthly rent' : 'Expected price'} value={formatINR(price?.value)} />
                {isRent && price?.securityDeposit && <InfoRow label="Security deposit" value={formatINR(price.securityDeposit)} />}
                {isRent && <InfoRow label="Maintenance" value={price?.maintenanceIncluded ? 'Included in rent' : 'Charged separately'} />}
                <InfoRow label="Negotiable" value={price?.isNegotiable ? 'Yes' : 'No'} />
              </div>
            </SectionBlock>

            {description && (
              <SectionBlock title="About this property">
                <ExpandableText text={description} maxLines={5} />
              </SectionBlock>
            )}

            {amenities.length > 0 && (
              <SectionBlock title={`Amenities (${amenities.length})`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                  {amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                      <span className="text-sm text-slate-700 font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            )}

            <SectionBlock title="Property details">
              <div className="divide-y divide-slate-100">
                {isResidential && rd && (
                  <>
                    <InfoRow label="Bedrooms"    value={rd.bedrooms ? `${rd.bedrooms} BHK` : null} />
                    <InfoRow label="Bathrooms"   value={rd.bathrooms} />
                    <InfoRow label="Carpet area" value={rd.carpetArea ? `${rd.carpetArea} sq.ft` : null} />
                    <InfoRow label="Floor"       value={rd.floorNumber != null ? `${rd.floorNumber}${rd.totalFloors ? ` of ${rd.totalFloors}` : ''}` : null} />
                    <InfoRow label="Furnishing"  value={rd.furnishingStatus} />
                  </>
                )}
                {isLand && pd && (
                  <>
                    <InfoRow label="Plot area"       value={pd.plotArea ? `${pd.plotArea} ${pd.areaUnit || 'sq.ft'}` : null} />
                    <InfoRow label="Facing"          value={pd.facing} />
                    <InfoRow label="Gated community" value={pd.gatedCommunity != null ? (pd.gatedCommunity ? 'Yes' : 'No') : null} />
                  </>
                )}
                {isCommercial && cd && (
                  <>
                    <InfoRow label="Carpet area" value={cd.carpetArea ? `${cd.carpetArea} ${cd.areaUnit || 'sq.ft'}` : null} />
                    <InfoRow label="Floor"       value={cd.floorNumber != null ? `${cd.floorNumber}${cd.totalFloors ? ` of ${cd.totalFloors}` : ''}` : null} />
                    <InfoRow label="Washrooms"   value={cd.washrooms} />
                    <InfoRow label="Furnishing"  value={cd.furnishingStatus} />
                  </>
                )}
                <InfoRow label="For" value={isResaleProperty === false ? 'New Property' : isResaleProperty === true ? 'Resale' : null} />
              </div>
            </SectionBlock>

            {location && (
              <SectionBlock title="Location">
                <div className="divide-y divide-slate-100">
                  {location.address && <InfoRow label="Address" value={location.address} />}
                  {location.city    && <InfoRow label="City"    value={location.city} />}
                  {location.state   && <InfoRow label="State"   value={location.state} />}
                  {location.pincode && <InfoRow label="Pincode" value={location.pincode} />}
                </div>
              </SectionBlock>
            )}
          </div>

          {/* ── RIGHT COLUMN (sticky sidebar) ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden lg:sticky lg:top-24">
              <div className="p-5 border-b border-slate-100">
                <p className="text-2xl font-black text-[#001A33]">{formatINR(price?.value)}</p>
                {isRent && <p className="text-xs text-slate-400 font-medium mt-0.5">per month</p>}
                {price?.isNegotiable && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Tag size={12} className="text-emerald-500" strokeWidth={2} />
                    <span className="text-xs text-emerald-600 font-semibold">Price is negotiable</span>
                  </div>
                )}
                {isRent && price?.securityDeposit && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    + <span className="font-semibold">{formatINR(price.securityDeposit)}</span> security deposit
                  </p>
                )}
                {isRent && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maintenance: {price?.maintenanceIncluded ? 'Included' : 'Extra'}
                  </p>
                )}
              </div>

              {specs.slice(0, 3).length > 0 && (
                <div className="flex divide-x divide-slate-100 border-b border-slate-100">
                  {specs.slice(0, 3).map((s, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center py-3 px-2">
                      <s.icon size={15} className="text-slate-400 mb-1" strokeWidth={1.8} />
                      <span className="text-[11px] text-slate-500 leading-tight text-center">{s.label}</span>
                      <span className="text-[12px] font-bold text-slate-800 text-center mt-0.5">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {adminMode && AdminActions ? (
                <AdminActions property={property} />
              ) : (
                <div className="p-4 flex flex-col gap-2.5">
                  <button onClick={() => setModalOpen(true)} className="w-full h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#13304c] transition-all active:scale-[0.98]">
                    <Phone size={16} strokeWidth={2} /> Contact seller
                  </button>
                  {sellerPhone && (
                    <a href={`tel:+91${sellerPhone}`} className="w-full h-11 border-2 border-[#001A33] text-[#001A33] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#001A33]/5 transition-all">
                      <Phone size={15} strokeWidth={2} /> Call directly
                    </a>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => toggleFavorite(property._id)} className={`flex-1 h-10 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      <Heart size={15} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} /> {isLiked ? 'Saved' : 'Save'}
                    </button>
                    <button onClick={handleShare} className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center gap-1.5 hover:border-slate-300 transition-all">
                      <Share2 size={15} strokeWidth={2} /> Share
                    </button>
                  </div>
                </div>
              )}

              <div className="px-4 pb-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-[#001A33] flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-black">{sellerName[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{sellerName}</p>
                    <p className="text-xs text-slate-400">{sellerType || 'Property seller'}</p>
                  </div>
                  {isVerified && <BadgeCheck size={18} className="text-emerald-500 shrink-0" strokeWidth={2} />}
                </div>
              </div>
            </div>

            {!adminMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-amber-600 shrink-0" strokeWidth={2} />
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Safety tips</p>
                </div>
                <ul className="space-y-1.5">
                  {[
                    'Verify all property documents before payment',
                    'Never pay via wire transfer to unknown accounts',
                    'Visit the property in person before finalising',
                    'Confirm RERA registration for new projects',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-amber-700">
                      <span className="mt-0.5 shrink-0">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex gap-3 z-40 lg:hidden">
        {adminMode && AdminActions ? (
          <AdminActions property={property} mobile />
        ) : (
          <>
            <button onClick={() => toggleFavorite(property._id)} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition shrink-0 active:scale-[0.95] ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-500'}`}>
              <Heart size={20} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} />
            </button>
            {sellerPhone && (
              <a href={`tel:+91${sellerPhone}`} className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-[#001A33] shrink-0 transition hover:bg-slate-50 active:scale-[0.95]">
                <Phone size={18} strokeWidth={2} />
              </a>
            )}
            <button onClick={() => setModalOpen(true)} className="flex-1 h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#13304c] transition-all active:scale-[0.98]">
              <Phone size={18} strokeWidth={2} /> Contact seller
            </button>
          </>
        )}
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} propertyId={property._id} sellerName={sellerName} />
    </div>
  );
};


// ─── Main Component ───────────────────────────────────────────────────────────
const ProjectDisplay = ({ property, adminMode, onAdminClose, adminActions: AdminActions }) => {
  const navigate = useNavigate();
  const likedPropertyIds = usePropertyStore((s) => s.likedPropertyIds);
  const toggleFavorite   = usePropertyStore((s) => s.toggleFavorite);

  const [activeConfigTab, setActiveConfigTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCallback, setModalCallback] = useState(null); 
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [planLightboxSrc, setPlanLightboxSrc] = useState(null); 
  
  if (!property) return null;
  const isLiked = likedPropertyIds.includes(property._id);

  const {
    title, location, images, description, amenities = [],
    projectDetails = {}, reraId, listedBy, price
  } = property;

  const { 
    builderName, projectStatus, launchDate, possessionDate, 
    totalTowers, totalUnits, configurations = [], 
    masterPlanImage, brochureUrl, videoUrl 
  } = projectDetails;

  const sellerPhone = listedBy?.contactNumber;
  const ytEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  const configTypes = ['All', ...new Set(configurations.map(c => c.bhk).filter(Boolean))];
  const filteredConfigs = activeConfigTab === 'All' ? configurations : configurations.filter(c => c.bhk === activeConfigTab);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: title || 'Project on DENIVS', url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const triggerRevealPhone = () => {
    if (phoneRevealed) return;
    setModalCallback(() => () => setPhoneRevealed(true));
    setModalOpen(true);
  };

  const triggerDownloadBrochure = () => {
    setModalCallback(() => () => window.open(brochureUrl, '_blank'));
    setModalOpen(true);
  };

  return (
    <div className={adminMode ? "bg-slate-50 h-full pb-20" : "min-h-screen bg-slate-50 font-sans pb-24 lg:pb-8"}>
      
      {/* ── Mobile Topbar ── */}
      <div className="lg:hidden sticky top-0 sm:top-14 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button onClick={() => adminMode ? onAdminClose() : navigate(-1)} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">
          {adminMode ? <X size={18} strokeWidth={2} /> : <ArrowLeft size={18} strokeWidth={2} />}
        </button>
        <span className="font-bold text-sm text-slate-800 truncate max-w-[200px]">{title}</span>
        <div className="flex gap-2">
          {!adminMode && (
            <>
              <button onClick={handleShare} className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"><Share2 size={16} strokeWidth={2} /></button>
              <button onClick={() => toggleFavorite(property._id)} className={`w-9 h-9 rounded-full border flex items-center justify-center transition ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                <Heart size={16} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto lg:pt-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-4">
          <button onClick={() => adminMode ? onAdminClose() : navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#001A33] transition-colors">
            {adminMode ? <X size={16} strokeWidth={2} /> : <ArrowLeft size={16} strokeWidth={2} />} 
            {adminMode ? 'Close Review' : 'Back to search'}
          </button>
          {!adminMode && (
            <div className="flex items-center gap-3">
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <Share2 size={16} /> Share
              </button>
              <button onClick={() => toggleFavorite(property._id)} className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-bold transition-all shadow-sm ${isLiked ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : ''} /> {isLiked ? 'Saved' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <Gallery images={images} />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── LEFT COLUMN (Main Content) ── */}
          <div className="flex-1 min-w-0 space-y-6 lg:space-y-8">
            
            {/* Project Title Block */}
            <div className="bg-white lg:bg-transparent p-5 lg:p-0 rounded-2xl lg:rounded-none border lg:border-none border-slate-200 shadow-sm lg:shadow-none">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#001A33] text-white rounded text-[10px] font-bold uppercase tracking-wider">New Project</span>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${projectStatus === 'Ready to Move' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {projectStatus || 'Under Construction'}
                </span>
              </div>
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">{title}</h1>
              <p className="text-sm lg:text-base text-slate-500 mt-2 flex items-start lg:items-center gap-1.5 font-medium">
                <MapPin size={18} className="text-[#001A33] shrink-0 mt-0.5 lg:mt-0"/> 
                <span>By <span className="text-slate-800 font-bold">{builderName || listedBy?.name}</span> in {location?.address}, {location?.city}</span>
              </p>
              {/* Mobile Only Price Summary inside Title Block */}
              <div className="lg:hidden mt-4 pt-4 border-t border-slate-100">
                 <p className="text-2xl font-black text-[#001A33]">{getPriceRange(configurations, price?.value)}</p>
                 <p className="text-[11px] text-slate-400 mt-0.5">Govt. taxes & charges extra</p>
              </div>
            </div>

            {/* Quick Stats Grid (Updated for 99acres style) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <Building2 className="text-[#001A33] mb-2" size={24} strokeWidth={1.5} />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Scale</span>
                <span className="text-sm font-black text-slate-800">{totalTowers ? `${totalTowers} Towers` : 'N/A'}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <Home className="text-[#001A33] mb-2" size={24} strokeWidth={1.5} />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total Units</span>
                <span className="text-sm font-black text-slate-800">{totalUnits || 'N/A'}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <Calendar className="text-[#001A33] mb-2" size={24} strokeWidth={1.5} />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Launch Date</span>
                <span className="text-sm font-black text-slate-800">{formatDate(launchDate)}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <Calendar className="text-[#001A33] mb-2" size={24} strokeWidth={1.5} />
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Possession</span>
                <span className="text-sm font-black text-slate-800">{possessionDate ? formatDate(possessionDate) : 'Ready to Move'}</span>
              </div>
            </div>

            {/* Video Walkthrough */}
            {ytEmbedUrl && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-1">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 relative">
                  <iframe 
                    src={ytEmbedUrl} 
                    title="Project Walkthrough" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Configurations & Floor Plans */}
            {configurations?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 lg:px-6 py-4 lg:py-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900">Floor Plans & Pricing</h2>
                  <div className="hidden sm:flex gap-2">
                    {configTypes.map(type => (
                      <button 
                        key={type} 
                        onClick={() => setActiveConfigTab(type)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeConfigTab === type ? 'bg-[#001A33] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Tabs */}
                <div className="sm:hidden flex overflow-x-auto p-4 border-b border-slate-100 gap-2 no-scrollbar">
                  {configTypes.map(type => (
                    <button 
                      key={type} 
                      onClick={() => setActiveConfigTab(type)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${activeConfigTab === type ? 'bg-[#001A33] text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {filteredConfigs.map((config, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-[#001A33]/30 hover:shadow-md transition-all group bg-slate-50/50">
                        {/* Floor Plan Thumbnail */}
                        <div 
                          onClick={() => config.floorPlanImage ? setPlanLightboxSrc(config.floorPlanImage) : null}
                          className={`w-full sm:w-28 h-32 sm:h-auto bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200 relative flex items-center justify-center ${config.floorPlanImage ? 'cursor-pointer' : ''}`}
                        >
                          {config.floorPlanImage ? (
                            <>
                              <img src={config.floorPlanImage} alt={`${config.bhk} Plan`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Maximize size={12}/> View</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <Maximize size={20} className="text-slate-300 mx-auto mb-1" />
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">No Plan</p>
                            </div>
                          )}
                        </div>
                        {/* Config Details */}
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-black text-slate-800 text-lg mb-1">{config.bhk} <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 bg-slate-200/60 px-2 py-0.5 rounded">{config.configType}</span></h4>
                          
                          {/* Supercharged Specs Row */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium mb-3">
                            {config.carpetArea && (
                              <span className="flex items-center gap-1"><Maximize size={14} className="text-slate-400"/> {config.carpetArea} sq.ft</span>
                            )}
                            {config.bathrooms > 0 && (
                              <span className="flex items-center gap-1"><Bath size={14} className="text-slate-400"/> {config.bathrooms} Baths</span>
                            )}
                            {config.balconies > 0 && (
                              <span className="flex items-center gap-1"><DoorOpen size={14} className="text-slate-400"/> {config.balconies} Balconies</span>
                            )}
                          </div>

                          <div className="mt-auto">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Starting Price</p>
                            <p className="text-xl font-black text-[#001A33]">{formatINR(config.priceValue)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {description && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 lg:p-8">
                <h2 className="text-lg font-black text-slate-900 mb-3 lg:mb-4">About {title}</h2>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{description}</p>
              </div>
            )}

            {amenities?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 lg:px-6 py-4 lg:py-5 border-b border-slate-100">
                  <h2 className="text-lg font-black text-slate-900">Project Amenities</h2>
                </div>
                <div className="p-5 lg:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
                  {amenities.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <CheckCircle size={18} strokeWidth={2.5}/>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Master Plan & Brochure (Lead Gated) */}
            {(masterPlanImage || brochureUrl) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {masterPlanImage && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 mb-1">Master Plan</h3>
                      <p className="text-xs text-slate-500 mb-4">View the entire layout of the project, including open spaces and tower placements.</p>
                    </div>
                    <div 
                      onClick={() => setPlanLightboxSrc(masterPlanImage)}
                      className="h-32 sm:h-40 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-100"
                    >
                      <img src={masterPlanImage} alt="Master Plan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Map className="text-white mb-1" size={24} strokeWidth={2} />
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">Click to Expand</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {brochureUrl && (
                  <div className="bg-[#001A33] border border-[#001A33] rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                      <FileText size={32} className="text-blue-400 mb-3" strokeWidth={1.5} />
                      <h3 className="text-xl font-black mb-1">Official Brochure</h3>
                      <p className="text-xs text-slate-300 mb-6 leading-relaxed">Download the detailed project brochure including technical specifications and payment plans.</p>
                    </div>
                    {/* LEAD GATE FOR BROCHURE */}
                    <button 
                      onClick={triggerDownloadBrochure}
                      className="relative z-10 w-full py-3.5 px-4 bg-white text-[#001A33] rounded-xl font-black text-sm text-center flex items-center justify-center gap-2 hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg"
                    >
                      <Download size={18} strokeWidth={2.5}/> Download PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            {reraId && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:p-6 flex items-start gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-[#001A33] shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">RERA Registered Project</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mb-2 leading-relaxed">This project is registered under the Real Estate (Regulation and Development) Act, 2016.</p>
                  <div className="inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700">
                    ID: {reraId}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT COLUMN (Sticky Sidebar Contact Box) ── */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="sticky top-24 space-y-4">
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden hidden lg:block">
                <div className="bg-slate-50 border-b border-slate-200 p-6 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Project Price Range</p>
                  <h2 className="text-3xl font-black text-[#001A33]">{getPriceRange(configurations, price?.value)}</h2>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1"><Info size={12}/> Govt. taxes & charges extra</p>
                </div>

                {adminMode && AdminActions ? (
                  <AdminActions property={property} />
                ) : (
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 text-center">Interested in {title}?</h3>
                    <button 
                      onClick={() => { setModalCallback(null); setModalOpen(true); }}
                      className="w-full h-12 bg-[#001A33] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-[#001A33]/20 active:scale-[0.98]"
                    >
                      Request Call Back
                    </button>

                    {sellerPhone && (
                      <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500 mb-3">Or connect directly with the builder</p>
                        {/* LEAD GATE FOR PHONE NUMBER */}
                        {phoneRevealed ? (
                           <a href={`tel:+91${sellerPhone}`} className="w-full h-12 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
                             <Phone size={18} strokeWidth={2.5}/> {sellerPhone}
                           </a>
                        ) : (
                           <button onClick={triggerRevealPhone} className="w-full h-11 border-2 border-[#001A33] text-[#001A33] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                             <Phone size={16} strokeWidth={2.5}/> Show Contact Number
                           </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-sm hidden lg:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Developed by</p>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{builderName || listedBy?.name}</h4>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile Sticky Bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 lg:hidden z-40 flex gap-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {adminMode && AdminActions ? (
          <AdminActions property={property} mobile />
        ) : (
          <>
            <button 
              onClick={() => { setModalCallback(null); setModalOpen(true); }}
              className="flex-1 h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
            >
              Contact Builder
            </button>
            {sellerPhone && (
              phoneRevealed ? (
                <a href={`tel:+91${sellerPhone}`} className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Phone size={20} strokeWidth={2.5} />
                </a>
              ) : (
                <button onClick={triggerRevealPhone} className="w-12 h-12 bg-white text-[#001A33] border-2 border-[#001A33] rounded-xl flex items-center justify-center shrink-0 shadow-sm active:scale-[0.95] transition-transform">
                  <Phone size={20} strokeWidth={2.5}/>
                </button>
              )
            )}
          </>
        )}
      </div>

      {/* Modals & Lightboxes */}
      <ContactModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        propertyId={property._id} 
        sellerName={builderName || listedBy?.name} 
        onSuccessCallback={modalCallback} // <-- Executes the "Download" or "Show Number" action
      />

      <ImageLightbox src={planLightboxSrc} onClose={() => setPlanLightboxSrc(null)} />

    </div>
  );
};

export default ProjectDisplay;