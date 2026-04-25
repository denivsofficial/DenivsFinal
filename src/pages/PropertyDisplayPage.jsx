import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Maximize2, ArrowLeft, Phone, CheckCircle,
  Heart, Share2, X, Loader2, Shield, Tag, Layers,
  Sofa, BadgeCheck, FlipHorizontal, DoorOpen, IndianRupee,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { apiClient } from '../store/useAuthStore';
import usePropertyStore from '../store/usePropertyStore';

// ─── Utility helpers ──────────────────────────────────────────────────────────

function formatINR(val) {
  if (!val) return 'Price on Request';
  const n = Number(val);
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} Lakh`;
  return `₹${n.toLocaleString('en-IN')}`;
}

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

// ─── Swipe-only Image Gallery ─────────────────────────────────────────────────

function Gallery({ images }) {
  const [active, setActive]         = useState(0);
  const [lightbox, setLightbox]     = useState(false);
  const [dragging, setDragging]     = useState(false);
  const [offset, setOffset]         = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const touchStartX  = useRef(null);
  const dragStartX   = useRef(null);
  const containerRef = useRef(null);

  const fallback = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900';
  const imgs = images?.length ? images : [fallback];
  const count = imgs.length;

  // Track container width for pixel-perfect slide positioning
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const goTo = useCallback((idx) => {
    setActive(Math.max(0, Math.min(idx, count - 1)));
    setOffset(0);
  }, [count]);

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  // ── Touch events ──
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setOffset(0);
  };
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    // Resist at edges
    if ((active === 0 && dx > 0) || (active === count - 1 && dx < 0)) {
      setOffset(dx * 0.25);
    } else {
      setOffset(dx);
    }
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - (touchStartX.current ?? 0);
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    } else {
      setOffset(0);
    }
    touchStartX.current = null;
  };

  // ── Mouse drag events ──
  const onMouseDown = (e) => {
    dragStartX.current = e.clientX;
    setDragging(true);
    setOffset(0);
  };
  const onMouseMove = (e) => {
    if (!dragging || dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if ((active === 0 && dx > 0) || (active === count - 1 && dx < 0)) {
      setOffset(dx * 0.25);
    } else {
      setOffset(dx);
    }
  };
  const onMouseUp = (e) => {
    if (!dragging) return;
    const dx = e.clientX - (dragStartX.current ?? e.clientX);
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    } else if (Math.abs(dx) < 5) {
      setLightbox(true); // tap to open lightbox
    } else {
      setOffset(0);
    }
    setDragging(false);
    dragStartX.current = null;
  };
  const onMouseLeave = () => {
    if (dragging) {
      setDragging(false);
      setOffset(0);
      dragStartX.current = null;
    }
  };

  // ── Keyboard in lightbox ──
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

  // Use ref width so each slide = exactly 1 container width
  const translateX = `${-active * containerWidth + offset}px`;
  const transition = dragging || touchStartX.current !== null ? 'none' : 'transform 0.32s cubic-bezier(0.4,0,0.2,1)';

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Swipeable strip */}
        <div
          ref={containerRef}
          className="relative aspect-4/3 md:aspect-video bg-slate-100 overflow-hidden select-none"
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Slide strip — each slide is exactly containerWidth px wide */}
          <div
            className="absolute top-0 left-0 h-full flex"
            style={{
              transform: `translateX(${translateX})`,
              transition,
              width: `${count * (containerWidth || 100)}px`,
            }}
          >
            {imgs.map((img, i) => (
              <div
                key={i}
                className="relative h-full flex-none"
                style={{ width: `${containerWidth || 100}px` }}
              >
                <img
                  src={img}
                  alt={`Property photo ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Photo counter pill */}
          {count > 1 && (
            <div className="absolute top-3 right-3 bg-black/55 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
              {active + 1} / {count}
            </div>
          )}

          {/* Dot indicators */}
          {count > 1 && count <= 12 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-250 ${
                    i === active ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Swipe hint on first load — fades after 2s */}
          {count > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none animate-[fadeOut_2s_1.5s_forwards_ease-in]">
              <div className="flex items-center gap-1.5 bg-black/40 text-white text-[10px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm whitespace-nowrap opacity-0 md:opacity-100">
                ← Swipe to browse →
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail strip — desktop */}
        {count > 1 && (
          <div className="hidden md:flex gap-2 p-3 overflow-x-auto no-scrollbar border-t border-slate-100">
            {imgs.map((img, i) => (
              <button
                key={i}
                onMouseDown={(e) => { e.stopPropagation(); goTo(i); }}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  active === i ? 'border-[#001A33]' : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-100 bg-black/93 flex items-center justify-center select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>

          {/* Strip in lightbox */}
          <div
            className="w-full flex items-center justify-center overflow-hidden"
            style={{ height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex h-full"
              style={{
                transform: `translateX(calc(${-active * 100}vw + ${offset}px))`,
                transition: touchStartX.current !== null ? 'none' : 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
                width: `${count * 100}vw`,
              }}
            >
              {imgs.map((img, i) => (
                <div key={i} className="flex items-center justify-center" style={{ width: '100vw', height: '90vh', flexShrink: 0 }}>
                  <img
                    src={img}
                    alt=""
                    className="max-h-full max-w-[92vw] object-contain"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {count > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === active ? 'w-5 h-1.5 bg-white' : 'w-2 h-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

// ─── Contact modal ────────────────────────────────────────────────────────────

function ContactModal({ isOpen, onClose, propertyId, sellerName }) {
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
        message:       msg || 'I am interested in this property.',
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setForm({ name: '', phone: '', message: '', wantVisit: false, agreeTerms: false });
        }, 2500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Contact seller</h3>
            {sellerName && <p className="text-xs text-slate-400 mt-0.5">Listing by {sellerName}</p>}
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="p-5">
          {success ? (
            <div className="py-8 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-500" strokeWidth={2} />
              </div>
              <p className="text-base font-bold text-slate-900">Request sent!</p>
              <p className="text-sm text-slate-500">The seller will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">{error}</div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full name</label>
                <input
                  required type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#001A33]/20 focus:border-[#001A33] placeholder:text-slate-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Mobile number</label>
                <div className="flex gap-2">
                  <div className="h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-500 font-medium shrink-0">🇮🇳 +91</div>
                  <input
                    required type="tel" maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="98765 43210"
                    className="flex-1 h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#001A33]/20 focus:border-[#001A33] placeholder:text-slate-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Message (optional)</label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Any specific questions for the seller?"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#001A33]/20 focus:border-[#001A33] placeholder:text-slate-300 resize-none transition-all"
                />
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { key: 'wantVisit',  label: 'I am interested in scheduling a site visit' },
                  { key: 'agreeTerms', label: 'I agree to the Terms & Conditions', required: true },
                ].map(({ key, label, required }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        required={required}
                        checked={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md bg-white checked:bg-[#001A33] checked:border-[#001A33] transition cursor-pointer"
                      />
                      <CheckCircle size={13} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 leading-snug">{label}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#13304c] transition-all disabled:opacity-60 mt-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Send inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Collapsible description ──────────────────────────────────────────────────

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

// ─── Main Page ────────────────────────────────────────────────────────────────

const PropertyDisplayPage = () => {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const likedPropertyIds = usePropertyStore((s) => s.likedPropertyIds);
  const toggleFavorite   = usePropertyStore((s) => s.toggleFavorite);
  const fetchFavorites   = usePropertyStore((s) => s.fetchFavorites);

  const [property,  setProperty]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLiked = likedPropertyIds.includes(id);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get(`/api/properties/${id}`);
        if (res.data.success) setProperty(res.data.data);
        else setError('Property not found.');
      } catch { setError('Failed to load property.'); }
      finally  { setLoading(false); }
    };
    if (id) load();
    fetchFavorites();
  }, [id]);

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

  // ── Loading / error states ─────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-[#001A33]" strokeWidth={2} />
        <p className="text-sm text-slate-400">Loading property…</p>
      </div>
    </div>
  );

  if (error || !property) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 font-semibold mb-3">{error || 'Property not found'}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-[#001A33] underline">Go back</button>
      </div>
    </div>
  );

  // ── Destructure schema ─────────────────────────────────────────────────────
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

  // Build spec cells per type
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
    if (cd.floorNumber != null) specs.push({ icon: Layers,      label: 'Floor',        value: cd.totalFloors ? `${cd.floorNumber} / ${cd.totalFloors}` : cd.floorNumber });
    if (cd.washrooms)         specs.push({ icon: DoorOpen,       label: 'Washrooms',   value: cd.washrooms });
    if (cd.furnishingStatus)  specs.push({ icon: Sofa,           label: 'Furnishing',  value: cd.furnishingStatus });
  }

  const displayTitle = title || `${propertyType} for ${transactionType} in ${location?.city || ''}`;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Mobile sticky topbar ── */}
      <div className="sticky top-14 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 py-2.5 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <p className="text-sm font-bold text-slate-800 truncate max-w-45">{displayTitle}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
          >
            <Share2 size={17} strokeWidth={2} />
          </button>
          <button
            onClick={() => toggleFavorite(id)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition
              ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Heart size={17} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8 pb-28 lg:pb-8">

        {/* ── Desktop back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#001A33] transition mb-5"
        >
          <ArrowLeft size={16} strokeWidth={2} /> Back to listings
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

        {/* ── 2-column layout ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_340px] gap-5">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5 min-w-0">

            {/* 1. Gallery — FIRST thing users want to see */}
            <Gallery images={images} />

            {/* 2. Mobile title + price card */}
            <div className="md:hidden bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="navy">{propertyType}</Badge>
                {isVerified && <Badge variant="green"><BadgeCheck size={11} /> Verified</Badge>}
                {isResaleProperty === false && <Badge variant="blue">New</Badge>}
                {isResaleProperty === true  && <Badge variant="amber">Resale</Badge>}
              </div>
              <h1 className="text-xl font-black text-slate-900 leading-tight mb-3">{displayTitle}</h1>

              {/* Price prominent */}
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

            {/* 3. Key specs — second most important info */}
            {specs.length > 0 && (
              <SectionBlock title="Property highlights">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {specs.map((s, i) => <SpecCell key={i} {...s} />)}
                </div>
              </SectionBlock>
            )}

            {/* 4. Pricing details — what users care about */}
            <SectionBlock title="Pricing">
              <div className="divide-y divide-slate-100">
                <InfoRow
                  label={isRent ? 'Monthly rent' : 'Expected price'}
                  value={formatINR(price?.value)}
                />
                {isRent && price?.securityDeposit && (
                  <InfoRow label="Security deposit" value={formatINR(price.securityDeposit)} />
                )}
                {isRent && (
                  <InfoRow
                    label="Maintenance"
                    value={price?.maintenanceIncluded ? 'Included in rent' : 'Charged separately'}
                  />
                )}
                <InfoRow label="Negotiable" value={price?.isNegotiable ? 'Yes' : 'No'} />
              </div>
            </SectionBlock>

            {/* 5. Description */}
            {description && (
              <SectionBlock title="About this property">
                <ExpandableText text={description} maxLines={5} />
              </SectionBlock>
            )}

            {/* 6. Amenities */}
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

            {/* 7. Property details table */}
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

            {/* 8. Location */}
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

              {/* Price */}
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

              {/* Quick spec strip */}
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

              {/* CTAs */}
              <div className="p-4 flex flex-col gap-2.5">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#13304c] transition-all active:scale-[0.98]"
                >
                  <Phone size={16} strokeWidth={2} /> Contact seller
                </button>
                {sellerPhone && (
                  <a
                    href={`tel:+91${sellerPhone}`}
                    className="w-full h-11 border-2 border-[#001A33] text-[#001A33] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#001A33]/5 transition-all"
                  >
                    <Phone size={15} strokeWidth={2} /> Call directly
                  </a>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(id)}
                    className={`flex-1 h-10 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]
                      ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    <Heart size={15} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} />
                    {isLiked ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center gap-1.5 hover:border-slate-300 transition-all"
                  >
                    <Share2 size={15} strokeWidth={2} /> Share
                  </button>
                </div>
              </div>

              {/* Seller info */}
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

            {/* Safety tips */}
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

          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex gap-3 z-40 lg:hidden">
        <button
          onClick={() => toggleFavorite(id)}
          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition shrink-0 active:scale-[0.95]
            ${isLiked ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 text-slate-500'}`}
        >
          <Heart size={20} strokeWidth={2} className={isLiked ? 'fill-red-500' : ''} />
        </button>
        {sellerPhone && (
          <a
            href={`tel:+91${sellerPhone}`}
            className="w-12 h-12 rounded-xl border-2 border-slate-200 flex items-center justify-center text-[#001A33] shrink-0 transition hover:bg-slate-50 active:scale-[0.95]"
          >
            <Phone size={18} strokeWidth={2} />
          </a>
        )}
        <button
          onClick={() => setModalOpen(true)}
          className="flex-1 h-12 bg-[#001A33] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#13304c] transition-all active:scale-[0.98]"
        >
          <Phone size={18} strokeWidth={2} /> Contact seller
        </button>
      </div>

      {/* Contact modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        propertyId={id}
        sellerName={sellerName}
      />
    </div>
  );
};

export default PropertyDisplayPage;