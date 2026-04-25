import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Building, Home, MapPin, Briefcase, Store,
  UploadCloud, ChevronLeft, ChevronRight,
  CheckCircle2, X, User, Handshake, HardHat,
  Phone, Lock,
} from "lucide-react";
import useAuthStore, { apiClient } from "../store/useAuthStore";

// ─── Constants ────────────────────────────────────────────────────────────────

// Replaced emojis with Lucide React components
const SELLER_TYPES = [
  { id: "Owner",   icon: User,      label: "Owner",   desc: "I own this property"     },
  { id: "Agent",   icon: Handshake, label: "Agent",   desc: "Licensed broker / agent" },
  { id: "Builder", icon: HardHat,   label: "Builder", desc: "Developer or firm"       },
];

const PROPERTY_TYPES = [
  { id: "Apartment", icon: Building,  label: "Apartment / Flat",    desc: "Flat in a multi-storey building", accent: "border-blue-400 bg-blue-50",     iconColor: "text-blue-500" },
  { id: "House",     icon: Home,      label: "Independent House",   desc: "Villa, bungalow or row house",    accent: "border-emerald-400 bg-emerald-50", iconColor: "text-emerald-500" },
  { id: "Land",      icon: MapPin,    label: "Land / Plot",         desc: "Open plot, NA plot or farmland",  accent: "border-amber-400 bg-amber-50",     iconColor: "text-amber-500" },
  { id: "Office",    icon: Briefcase, label: "Office Space",        desc: "Commercial office or co-working", accent: "border-purple-400 bg-purple-50",   iconColor: "text-purple-500" },
  { id: "Shop",      icon: Store,     label: "Shop / Showroom",     desc: "Retail unit, shop or godown",     accent: "border-rose-400 bg-rose-50",       iconColor: "text-rose-500" },
];

const AMENITIES = [
  "Lift", "Parking", "Security", "CCTV", "Gym",
  "Swimming Pool", "Club House", "Garden", "Power Backup",
  "Intercom", "Rain Water Harvesting", "Children Play Area",
  "Fire Safety", "Piped Gas", "Visitor Parking",
];

const CITIES = [
  "Pune", "Chh. Sambhajinagar", "Mumbai",
  "Nashik", "Nagpur", "Thane",
];

const STEP_LABELS = ["Who & What", "Location", "Details", "Pricing & Photos"];

// ─── Small reusable pieces ────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
      {children}
      {required && <span className="text-amber-500 ml-1">*</span>}
    </label>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <AlertTriangle size={12} /> {msg}
    </p>
  );
}

function InputBase({ className = "", ...props }) {
  return (
    <input
      className={`w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800
        bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1628]/20 focus:border-[#0A1628]
        placeholder:text-slate-300 transition-all ${className}`}
      {...props}
    />
  );
}

function SelectBase({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full h-11 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800
        bg-white focus:outline-none focus:ring-2 focus:ring-[#0A1628]/20 focus:border-[#0A1628]
        transition-all cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function Callout({ type = "info", children }) {
  const styles = {
    info:    "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };
  const icons = { info: "ℹ️", warning: "⚠️", success: "✅" };
  return (
    <div className={`flex gap-2.5 items-start p-3.5 rounded-xl border text-xs leading-relaxed ${styles[type]}`}>
      <span className="mt-px shrink-0">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? "bg-[#0A1628]" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`}
      />
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PostProperty() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Step 1+2 (merged)
  const [transactionType, setTransactionType] = useState("Sale"); 
  const [sellerType,    setSellerType]    = useState("");
  const [agentReraId,   setAgentReraId]   = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactLocked, setContactLocked] = useState(false);
  const [propertyType,  setPropertyType]  = useState("");

  // Step 2 — Location
  const [city,     setCity]     = useState("");
  const [locality, setLocality] = useState("");
  const [stateName,setStateName]= useState("Maharashtra");
  const [pincode,  setPincode]  = useState("");
  const [project,  setProject]  = useState("");

  // Step 3 — Details (dynamic)
  const [bedrooms,    setBedrooms]    = useState("");
  const [bathrooms,   setBathrooms]   = useState("");
  const [furnishing,  setFurnishing]  = useState("Unfurnished");
  const [carpetArea,  setCarpetArea]  = useState("");
  const [floorNo,     setFloorNo]     = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [plotArea,    setPlotArea]    = useState("");
  const [facing,      setFacing]      = useState("");
  const [isGated,     setIsGated]     = useState(false);
  const [commArea,    setCommArea]    = useState("");
  const [commFloor,   setCommFloor]   = useState("");
  const [washrooms,   setWashrooms]   = useState("");
  const [commFurnish, setCommFurnish] = useState("Bare Shell");
  const [amenities,   setAmenities]   = useState([]);

  // Step 4 — Pricing & Photos
  const [price,           setPrice]           = useState("");
  const [securityDeposit, setSecurityDeposit] = useState(""); 
  const [maintenanceIncluded, setMaintenanceIncluded] = useState(false); 
  const [isNegotiable,    setIsNegotiable]    = useState(false);
  const [isResale,        setIsResale]        = useState(null);
  const [reraId,          setReraId]          = useState("");
  const [propTitle,       setPropTitle]       = useState("");
  const [description,     setDescription]     = useState("");
  const [images,          setImages]          = useState([]);

  // App state
  const [step,       setStep]       = useState(1);
  const [propertyId, setPropertyId] = useState(null);
  const [isLoading,  setIsLoading]  = useState(false);
  const [errors,     setErrors]     = useState({});

  // ── Auto-fill contact from user profile ──────────────────────────────────────
  useEffect(() => {
    if (user?.contactNumber) {
      setContactNumber(user.contactNumber);
      setContactLocked(true);
    }
  }, [user]);

  // ── Computed flags ───────────────────────────────────────────────────────────
  const isResidential = propertyType === "Apartment" || propertyType === "House";
  const isLand        = propertyType === "Land";
  const isCommercial  = propertyType === "Office" || propertyType === "Shop";
  const isRent        = transactionType === "Rent";

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (forStep) => {
    const e = {};
    if (forStep === 1) {
      if (!sellerType)                                  e.sellerType    = "Please select how you are listing.";
      if (!propertyType)                                e.propertyType  = "Please select a property type.";
      if (!contactNumber || !/^\d{10}$/.test(contactNumber))
                                                        e.contactNumber = "Enter a valid 10-digit mobile number.";
      if (sellerType === "Agent" && !agentReraId.trim()) e.agentReraId  = "Agent RERA ID is required.";
    }
    if (forStep === 2) {
      if (!city)            e.city     = "Please select a city.";
      if (!locality.trim()) e.locality = "Please enter the locality / area.";
    }
    if (forStep === 3) {
      if (isResidential) {
        if (!bedrooms)   e.bedrooms   = "Please select number of bedrooms.";
        if (!carpetArea) e.carpetArea = "Please enter carpet area.";
      }
      if (isLand      && !plotArea)  e.plotArea  = "Please enter plot area.";
      if (isCommercial && !commArea) e.commArea  = "Please enter carpet area.";
    }
    if (forStep === 4) {
      if (!price) {
        e.price = isRent ? "Please enter monthly rent." : "Please enter the expected price.";
      }
      if (!isRent) {
        if (isResale === null)  e.isResale = "Please indicate if this is a resale property.";
        if (isResale === false && !reraId.trim()) e.reraId = "Project RERA ID is required for new properties.";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ───────────────────────────────────────────────────────────────
  const handleNext = async () => {
    if (!validate(step)) return;

    if (step === 1) {
      setIsLoading(true);
      try {
        const res = await apiClient.post("/api/properties", {
          propertyType,
          transactionType, 
          contactNumber,
          sellerType,
          ...(sellerType === "Agent" && { agentReraId }),
        });
        if (res.data.success) {
          setPropertyId(res.data.data._id);
          toast.success("Draft saved! You can always come back to continue.");
          setStep(2);
        } else {
          toast.error(res.data.message || "Failed to save. Please try again.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => { setErrors({}); setStep((s) => s - 1); };

  // ── Final submit ───────────────────────────────────
  const handleSubmit = async () => {
    if (!validate(4)) return;
    if (!propertyId) { toast.error("Draft not found. Please restart."); return; }

    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("location", JSON.stringify({ city, address: locality, state: stateName, pincode }));

      if (isResidential) {
        fd.append("residentialDetails", JSON.stringify({
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms) || undefined,
          furnishingStatus: furnishing,
          carpetArea: parseInt(carpetArea),
          floorNumber: parseInt(floorNo) || undefined,
          totalFloors: parseInt(totalFloors) || undefined,
        }));
      } else if (isLand) {
        fd.append("plotDetails", JSON.stringify({ plotArea: parseInt(plotArea), facing: facing || undefined, gatedCommunity: isGated }));
      } else if (isCommercial) {
        fd.append("commercialDetails", JSON.stringify({
          carpetArea: parseInt(commArea),
          floorNumber: parseInt(commFloor) || undefined,
          washrooms: parseInt(washrooms) || 0,
          furnishingStatus: commFurnish,
        }));
      }

      const priceObj = { value: parseInt(price), currency: "INR", isNegotiable };
      if (isRent) {
        if (securityDeposit) priceObj.securityDeposit = parseInt(securityDeposit);
        priceObj.maintenanceIncluded = maintenanceIncluded;
      }
      fd.append("price", JSON.stringify(priceObj));

      if (propTitle)        fd.append("title",            propTitle);
      if (description)      fd.append("description",      description);
      if (project)          fd.append("project",          project);
      if (amenities.length) fd.append("amenities",        JSON.stringify(amenities));
      
      if (!isRent) {
        fd.append("isResaleProperty", String(isResale));
        if (isResale === false && reraId) fd.append("reraId", reraId.toUpperCase());
      }
      
      fd.append("formStep",   "4");
      fd.append("formStatus", "published");
      images.forEach((img) => fd.append("images", img.file));

      const res = await apiClient.put(`/api/properties/${propertyId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) setStep(5);
      else toast.error(res.data.message || "Submission failed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const r = new FileReader();
      r.onload = (ev) => setImages((prev) => [...prev, { file, preview: ev.target.result }]);
      r.readAsDataURL(file);
    });
  };
  const removeImage    = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const toggleAmenity  = (name) =>
    setAmenities((prev) => prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]);

  const formatINR = (val) => {
    const n = parseInt(val);
    if (!n || isNaN(n)) return null;
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
    if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} Lakh`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-start justify-center py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full max-w-xl">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#0A1628] rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
              <div className="w-4 h-4 border-2 border-white rounded-sm" />
            </div>
            <span className="text-[#0A1628] text-lg font-bold tracking-tight">DENIVS</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">

          {/* Progress bar */}
          {step < 5 && (
            <div className="px-6 pt-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-0">
                {STEP_LABELS.map((label, i) => {
                  const n    = i + 1;
                  const done = n < step;
                  const curr = n === step;
                  return (
                    <div key={n} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-300
                          ${done ? "bg-amber-400 text-white shadow-sm shadow-amber-200" : ""}
                          ${curr ? "bg-[#0A1628] text-white shadow-md shadow-slate-900/20" : ""}
                          ${!done && !curr ? "bg-slate-100 text-slate-400 border border-slate-200" : ""}`}>
                          {done ? "✓" : n}
                        </div>
                        <span className={`text-[9px] font-medium uppercase tracking-wide whitespace-nowrap
                          ${done ? "text-amber-500" : curr ? "text-[#0A1628]" : "text-slate-300"}`}>
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className={`flex-1 h-px mx-1.5 mb-4 transition-colors duration-300 ${done ? "bg-amber-300" : "bg-slate-100"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              STEP 1 — Who are you + What are you listing
          ═══════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-slate-900">List your property</h2>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Fill in the details below. We'll save a draft the moment you continue.
              </p>

              {/* Transaction Type Toggle (Sell / Rent) */}
              <div className="bg-slate-100 p-1.5 rounded-xl flex items-center mb-8">
                <button
                  type="button"
                  onClick={() => setTransactionType("Sale")}
                  className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                    transactionType === "Sale" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("Rent")}
                  className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                    transactionType === "Rent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Rent
                </button>
              </div>

              {/* User profile chip */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A1628] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-slate-900/20">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                {contactLocked && (
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs font-semibold shrink-0">
                    <Lock size={10} /> Verified
                  </div>
                )}
              </div>

              {/* Contact number */}
              <div className="mb-5">
                <FieldLabel required>Contact number for this listing</FieldLabel>
                {contactLocked ? (
                  <div className="flex gap-2 items-center">
                    <div className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-500 font-medium shrink-0">
                      🇮🇳 +91
                    </div>
                    <div className="flex-1 h-11 border border-emerald-200 bg-emerald-50 rounded-xl px-3.5 flex items-center gap-2">
                      <Phone size={14} className="text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{contactNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setContactLocked(false); setContactNumber(""); }}
                      className="text-xs text-slate-400 hover:text-slate-700 underline underline-offset-2 shrink-0 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <div className="h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-500 font-medium shrink-0">
                        🇮🇳 +91
                      </div>
                      <InputBase
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                    {!user?.contactNumber && (
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        This will also be saved to your profile.
                      </p>
                    )}
                  </>
                )}
                <FieldError msg={errors.contactNumber} />
              </div>

              <Divider label="I am listing as" />

              {/* Seller type */}
              <div className="grid grid-cols-3 gap-3 mb-1">
                {SELLER_TYPES.map(({ id, icon: Icon, label, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setSellerType(id); setErrors((e) => ({ ...e, sellerType: "" })); }}
                    className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 text-center transition-all duration-200
                      ${sellerType === id
                        ? "border-[#0A1628] bg-[#0A1628]/5 shadow-sm"
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                  >
                    <div className={`mb-1 transition-colors ${sellerType === id ? "text-[#0A1628]" : "text-slate-400"}`}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${sellerType === id ? "text-[#0A1628]" : "text-slate-700"}`}>{label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <FieldError msg={errors.sellerType} />

              {/* Agent RERA block */}
              {sellerType === "Agent" && (
                <div className="mt-4 space-y-3">
                  <Callout type="warning">
                    As a licensed agent, your RERA ID is mandatory and will be verified before any listing goes live.
                  </Callout>
                  <div>
                    <FieldLabel required>Your agent RERA ID</FieldLabel>
                    <InputBase
                      placeholder="e.g. A52100012345"
                      value={agentReraId}
                      onChange={(e) => setAgentReraId(e.target.value.toUpperCase())}
                      className="uppercase tracking-widest font-mono"
                    />
                    <FieldError msg={errors.agentReraId} />
                  </div>
                </div>
              )}

              <Divider label="Property type" />

              {/* Property type grid */}
              <div className="grid grid-cols-2 gap-3 mb-1">
                {PROPERTY_TYPES.map(({ id, icon: Icon, label, desc, accent, iconColor }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setPropertyType(id); setErrors((e) => ({ ...e, propertyType: "" })); }}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200
                      ${propertyType === id
                        ? `${accent} shadow-sm`
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                  >
                    <div className={`shrink-0 transition-colors ${propertyType === id ? iconColor : "text-slate-400"}`}>
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate">{label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <FieldError msg={errors.propertyType} />

              <div className="mt-6">
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="w-full h-12 bg-[#0A1628] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1B3A5C] transition-all disabled:opacity-60 shadow-lg shadow-slate-900/10"
                >
                  {isLoading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving draft…</>
                    : <>Continue <ChevronRight size={16} /></>
                  }
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              STEP 2 — Location
          ═══════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Where is it?</h2>
                <p className="text-sm text-slate-400">Location is the biggest factor for buyers.</p>
              </div>

              <div>
                <FieldLabel required>City</FieldLabel>
                <SelectBase value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </SelectBase>
                <FieldError msg={errors.city} />
              </div>

              <div>
                <FieldLabel required>Locality / Area</FieldLabel>
                <InputBase
                  placeholder="e.g. Cidco N-4, Baner, Wakad"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
                <FieldError msg={errors.locality} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>State</FieldLabel>
                  <InputBase value={stateName} onChange={(e) => setStateName(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Pincode</FieldLabel>
                  <InputBase
                    placeholder="431001"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Project / Society / Building</FieldLabel>
                <InputBase
                  placeholder="e.g. Godrej Hill, Prestige Towers (optional)"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              STEP 3 — Property details (dynamic per type)
          ═══════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Tell us about it</h2>
                <p className="text-sm text-slate-400">More detail = more serious {isRent ? 'renters' : 'buyers'}.</p>
              </div>

              {/* Residential */}
              {isResidential && (
                <>
                  <div>
                    <FieldLabel required>Bedrooms</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setBedrooms(String(n))}
                          className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                            ${bedrooms === String(n)
                              ? "bg-[#0A1628] text-white border-[#0A1628]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                        >
                          {n === 5 ? "5+ BHK" : `${n} BHK`}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.bedrooms} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Bathrooms</FieldLabel>
                      <SelectBase value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
                        <option value="">Select</option>
                        {[1, 2, 3, "4+"].map((n) => <option key={n}>{n}</option>)}
                      </SelectBase>
                    </div>
                    <div>
                      <FieldLabel>Furnishing</FieldLabel>
                      <SelectBase value={furnishing} onChange={(e) => setFurnishing(e.target.value)}>
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Furnished">Fully Furnished</option>
                      </SelectBase>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel required>Carpet area</FieldLabel>
                      <div className="relative">
                        <InputBase
                          type="number"
                          placeholder="850"
                          value={carpetArea}
                          onChange={(e) => setCarpetArea(e.target.value)}
                          className="pr-14"
                        />
                        <span className="absolute right-3.5 top-3 text-xs text-slate-400 pointer-events-none">sq.ft</span>
                      </div>
                      <FieldError msg={errors.carpetArea} />
                    </div>
                    <div>
                      <FieldLabel>Floor no.</FieldLabel>
                      <InputBase type="number" placeholder="4" value={floorNo} onChange={(e) => setFloorNo(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Total floors in building</FieldLabel>
                    <InputBase type="number" placeholder="12" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} />
                  </div>
                </>
              )}

              {/* Land */}
              {isLand && (
                <>
                  <div>
                    <FieldLabel required>Plot area</FieldLabel>
                    <div className="relative">
                      <InputBase type="number" placeholder="2400" value={plotArea} onChange={(e) => setPlotArea(e.target.value)} className="pr-14" />
                      <span className="absolute right-3.5 top-3 text-xs text-slate-400 pointer-events-none">sq.ft</span>
                    </div>
                    <FieldError msg={errors.plotArea} />
                  </div>
                  <div>
                    <FieldLabel>Facing direction</FieldLabel>
                    <SelectBase value={facing} onChange={(e) => setFacing(e.target.value)}>
                      <option value="">Select direction</option>
                      {["North","South","East","West","North-East","North-West","South-East","South-West"].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </SelectBase>
                  </div>
                  <div>
                    <FieldLabel>Gated community</FieldLabel>
                    <div className="flex gap-2">
                      {[true, false].map((v) => (
                        <button key={String(v)} type="button" onClick={() => setIsGated(v)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                            ${isGated === v
                              ? (v ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-blue-50 border-blue-400 text-blue-700")
                              : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                          {v ? "Yes" : "No"}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Commercial */}
              {isCommercial && (
                <>
                  <div>
                    <FieldLabel required>Carpet area</FieldLabel>
                    <div className="relative">
                      <InputBase type="number" placeholder="1200" value={commArea} onChange={(e) => setCommArea(e.target.value)} className="pr-14" />
                      <span className="absolute right-3.5 top-3 text-xs text-slate-400 pointer-events-none">sq.ft</span>
                    </div>
                    <FieldError msg={errors.commArea} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Floor no.</FieldLabel>
                      <InputBase type="number" placeholder="2" value={commFloor} onChange={(e) => setCommFloor(e.target.value)} />
                    </div>
                    <div>
                      <FieldLabel>Washrooms</FieldLabel>
                      <InputBase type="number" placeholder="1" value={washrooms} onChange={(e) => setWashrooms(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Furnishing</FieldLabel>
                    <SelectBase value={commFurnish} onChange={(e) => setCommFurnish(e.target.value)}>
                      <option value="Bare Shell">Bare Shell</option>
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Furnished">Furnished</option>
                    </SelectBase>
                  </div>
                </>
              )}

              {/* Amenities */}
              <Divider label="Amenities" />
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all
                      ${amenities.includes(a)
                        ? "bg-[#0A1628] text-white border-[#0A1628]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              STEP 4 — Pricing, RERA, Photos
          ═══════════════════════════════════════════════════ */}
          {step === 4 && (
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Set price & photos</h2>
                <p className="text-sm text-slate-400">Almost there — {isRent ? 'set the rent' : 'price it right'} and add photos.</p>
              </div>

              {/* Price / Rent */}
              <div className={isRent ? "grid grid-cols-2 gap-3" : ""}>
                <div>
                  <FieldLabel required>{isRent ? "Monthly Rent" : "Expected price"}</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-500 font-semibold text-sm pointer-events-none">₹</span>
                    <InputBase type="number" placeholder={isRent ? "20000" : "4500000"} value={price} onChange={(e) => setPrice(e.target.value)} className="pl-7" />
                  </div>
                  {!isRent && price && (
                    <div className="mt-2 px-3.5 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm flex items-center gap-2">
                      <span className="font-bold text-amber-800">{formatINR(price)}</span>
                      <span className="text-amber-600 text-xs">(₹{parseInt(price || 0).toLocaleString("en-IN")})</span>
                    </div>
                  )}
                  <FieldError msg={errors.price} />
                </div>

                {isRent && (
                  <div>
                    <FieldLabel>Security Deposit</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-slate-500 font-semibold text-sm pointer-events-none">₹</span>
                      <InputBase type="number" placeholder="50000" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} className="pl-7" />
                    </div>
                  </div>
                )}
              </div>

              {/* Negotiable & Maintenance */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Price is negotiable</p>
                    <p className="text-xs text-slate-400 mt-0.5">Allow {isRent ? 'renters' : 'buyers'} to make offers</p>
                  </div>
                  <Toggle checked={isNegotiable} onChange={setIsNegotiable} />
                </div>
                
                {isRent && (
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Maintenance included</p>
                      <p className="text-xs text-slate-400 mt-0.5">Rent includes society maintenance fees</p>
                    </div>
                    <Toggle checked={maintenanceIncluded} onChange={setMaintenanceIncluded} />
                  </div>
                )}
              </div>

              {/* Resale / RERA - ONLY SHOW IF SELLING */}
              {!isRent && (
                <>
                  <Divider label="Property age" />
                  <div>
                    <FieldLabel required>Is this a resale property?</FieldLabel>
                    <div className="flex gap-2">
                      {[
                        { val: true,  label: "Yes, resale",                cls: "bg-emerald-50 border-emerald-400 text-emerald-700" },
                        { val: false, label: "No, new / under construction", cls: "bg-blue-50 border-blue-400 text-blue-700" },
                      ].map(({ val, label, cls }) => (
                        <button key={String(val)} type="button" onClick={() => setIsResale(val)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all
                            ${isResale === val ? cls : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.isResale} />
                  </div>

                  {isResale === false && (
                    <div className="space-y-3 mt-4">
                      <Callout type="warning">
                        New properties require a project RERA ID before the listing goes live. Check MahaRERA for your project's ID.
                      </Callout>
                      <div>
                        <FieldLabel required>Project RERA ID</FieldLabel>
                        <InputBase
                          placeholder="e.g. P52100047378"
                          value={reraId}
                          onChange={(e) => setReraId(e.target.value.toUpperCase())}
                          className="uppercase tracking-widest font-mono"
                        />
                        <FieldError msg={errors.reraId} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Title + description */}
              <Divider label="Listing details (optional)" />
              <div>
                <FieldLabel>Headline / Title</FieldLabel>
                <InputBase
                  placeholder="e.g. Spacious 2 BHK with parking in Cidco"
                  maxLength={100}
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                />
                <p className="text-right text-[10px] text-slate-300 mt-1">{propTitle.length}/100</p>
              </div>
              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder="Highlight key features, nearby landmarks, unique selling points…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-800 bg-white
                    focus:outline-none focus:ring-2 focus:ring-[#0A1628]/20 focus:border-[#0A1628]
                    placeholder:text-slate-300 resize-none transition-all"
                />
              </div>

              {/* Photos */}
              <Divider label="Photos" />
              <label htmlFor="imgUpload"
                className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer hover:border-[#0A1628]/40 hover:bg-slate-50 transition-all">
                <div className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-slate-900/10">
                  <UploadCloud size={22} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Upload property photos</p>
                <p className="text-xs text-slate-400">Drag & drop or click — JPG, PNG, WEBP</p>
              </label>
              <input id="imgUpload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />

              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-900/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════
              STEP 5 — Success
          ═══════════════════════════════════════════════════ */}
          {step === 5 && (
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-200/80">
                <CheckCircle2 size={38} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Property submitted!</h2>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8">
                Your listing is now under review. We'll verify the details and publish it shortly.
                You'll get a notification once it's live.
              </p>
              <div className="flex gap-3 w-full max-w-xs">
                <button onClick={() => navigate("/seller-dashboard")}
                  className="flex-1 h-11 bg-[#0A1628] text-white rounded-xl text-sm font-semibold hover:bg-[#1B3A5C] transition-all shadow-lg shadow-slate-900/10">
                  Dashboard
                </button>
                <button onClick={() => navigate("/")}
                  className="flex-1 h-11 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
                  Back to home
                </button>
              </div>
            </div>
          )}

          {/* Footer nav (steps 2–4) */}
          {step >= 2 && step <= 4 && (
            <div className="px-6 pb-6 pt-2 flex gap-3 border-t border-slate-100">
              <button onClick={handleBack}
                className="h-12 px-5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-all">
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={step === 4 ? handleSubmit : handleNext}
                disabled={isLoading}
                className="flex-1 h-12 bg-[#0A1628] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1B3A5C] transition-all disabled:opacity-60 shadow-lg shadow-slate-900/10"
              >
                {isLoading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {step === 4 ? "Publishing…" : "Saving…"}</>
                  : step === 4 ? <><CheckCircle2 size={16} /> Post property</> : <>Continue <ChevronRight size={16} /></>
                }
              </button>
            </div>
          )}
        </div>

        {/* Page footer */}
        {step < 5 && (
          <p className="text-center text-xs text-slate-400 mt-5 pb-4">
            DENIV Services ·{" "}
            <Link to="/terms" className="hover:text-slate-600 underline underline-offset-2">Terms</Link>
            {" · "}
            <Link to="/privacy-policy" className="hover:text-slate-600 underline underline-offset-2">Privacy</Link>
          </p>
        )}
      </div>
    </div>
  );
}