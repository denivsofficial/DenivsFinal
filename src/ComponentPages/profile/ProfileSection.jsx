import React, { useState, useEffect } from "react";
import useAuthStore, { apiClient } from "../../store/useAuthStore";
import { Pencil, Save, X, Phone, Mail, Shield, Crown, AlertTriangle, CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SectionCard({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  );
}

function ReadValue({ value, placeholder = "Not provided" }) {
  return (
    <p className="text-sm font-semibold text-slate-800">
      {value || <span className="text-slate-400 font-normal">{placeholder}</span>}
    </p>
  );
}

function FieldInput({ name, value, onChange, type = "text", placeholder, className = "" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-10 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800
        bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001A33]/15
        focus:border-[#001A33] placeholder:text-slate-300 transition-all ${className}`}
    />
  );
}

function FieldSelect({ name, value, onChange, children }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800
        bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001A33]/15
        focus:border-[#001A33] transition-all cursor-pointer"
    >
      {children}
    </select>
  );
}

function RoleBadge({ role }) {
  const map = {
    seller: { label: "Seller",    bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
    buyer:  { label: "Buyer",     bg: "bg-slate-100", text: "text-slate-600",  border: "border-slate-200"  },
    admin:  { label: "Admin",     bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  };
  const s = map[role] || map.buyer;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

function PlanBadge({ plan }) {
  const isPremium = plan && plan !== 'free';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border
      ${isPremium
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {isPremium ? <Crown size={9} strokeWidth={2.5} /> : <Shield size={9} strokeWidth={2} />}
      {isPremium ? plan : 'Free'}
    </span>
  );
}

function Avatar({ user }) {
  const initials = (user?.name || "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative w-20 h-20 shrink-0">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md shadow-slate-900/10"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-[#001A33] flex items-center justify-center border-2 border-white shadow-md shadow-slate-900/10">
          <span className="text-white text-xl font-black" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}

const ProfileSection = () => {
  const navigate  = useNavigate();
  const currentUser       = useAuthStore((s) => s.user);
  const checkAuthSession  = useAuthStore((s) => s.checkAuthSession);
  const logout            = useAuthStore((s) => s.logout);
  const [isEditing,   setIsEditing]   = useState(false);

  const [formData, setFormData] = useState({
    name: "", contactNumber: "", sellerType: "Owner", agentReraId: ""
  });

  const [status, setStatus] = useState({
    loading: false, error: null, success: false,
  });

  const [deleteState, setDeleteState] = useState({
    password: "", loading: false, error: null, confirmOpen: false,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name:          currentUser.name          || "",
        contactNumber: currentUser.contactNumber || "",
        sellerType:    currentUser.sellerType    || "Owner",
        agentReraId:   currentUser.agentReraId   || "",
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    if (formData.sellerType === "Agent" && !formData.agentReraId.trim()) {
      setStatus({ loading: false, error: "Agent RERA ID is required.", success: false });
      return;
    }

    setStatus({ loading: true, error: null, success: false });
    try {
      const payload = {
        name: formData.name,
        contactNumber: formData.contactNumber,
        sellerType: formData.sellerType,
        ...(formData.sellerType === "Agent" && { agentReraId: formData.agentReraId.toUpperCase() })
      };

      const res = await apiClient.put("/api/profile/update", payload);

      if (res.data.success) {
        await checkAuthSession();
        setStatus({ loading: false, error: null, success: true });
        setIsEditing(false);
        setTimeout(() => setStatus((s) => ({ ...s, success: false })), 3000);
      }
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || "Update failed. Please try again.",
        success: false,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name:          currentUser?.name          || "",
      contactNumber: currentUser?.contactNumber || "",
      sellerType:    currentUser?.sellerType    || "Owner",
      agentReraId:   currentUser?.agentReraId   || "",
    });
    setStatus({ loading: false, error: null, success: false });
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await apiClient.delete("/api/profile/delete", {
        data: { password: deleteState.password },
      });
      if (res.data.success) {
        await logout();
        window.location.href = "/login";
      } else {
        setDeleteState((s) => ({
          ...s, loading: false,
          error: res.data.message || "Incorrect password.",
        }));
      }
    } catch (err) {
      setDeleteState((s) => ({
        ...s, loading: false,
        error: err.response?.data?.message || "Network error. Please try again.",
      }));
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#001A33] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  const isSeller = currentUser.role === "seller";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

      <SectionCard>
        <SectionHeader
          title="My profile"
          action={
            !isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-red-200
                    bg-red-50 text-[12px] font-bold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all"
                >
                  <LogOut size={12} strokeWidth={2.5} /> Log out
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#001A33]
                    text-[12px] font-bold text-white hover:bg-[#13304c] transition-all"
                >
                  <Pencil size={12} strokeWidth={2.5} /> Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-slate-200
                    text-[12px] font-semibold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  <X size={12} strokeWidth={2.5} /> Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={status.loading}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#001A33]
                    text-[12px] font-bold text-white hover:bg-[#13304c] transition-all disabled:opacity-60"
                >
                  {status.loading
                    ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                    : <><Save size={12} strokeWidth={2.5} /> Save</>
                  }
                </button>
              </div>
            )
          }
        />

        <div className="p-5">
          <div className="flex items-center gap-4 mb-6">
            <Avatar user={currentUser} />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-slate-900 truncate"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <RoleBadge role={currentUser.role} />
                <PlanBadge plan={currentUser.subscription?.plan} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldRow label="Full name">
              {isEditing ? (
                <FieldInput name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />
              ) : (
                <ReadValue value={currentUser.name} />
              )}
            </FieldRow>

            <FieldRow label="Email address">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-slate-400 shrink-0" strokeWidth={2} />
                <ReadValue value={currentUser.email} />
              </div>
            </FieldRow>

            <FieldRow label="Phone number">
              {isEditing ? (
                <div className="flex gap-2">
                  <div className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-xs text-slate-500 font-medium shrink-0">
                    🇮🇳 +91
                  </div>
                  <FieldInput
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    type="tel"
                    placeholder="10-digit number"
                  />
                </div>
              ) : currentUser.contactNumber ? (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-slate-400 shrink-0" strokeWidth={2} />
                  <p className="text-sm font-semibold text-slate-800">{currentUser.contactNumber}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                  <Phone size={13} className="text-amber-500 shrink-0" strokeWidth={2} />
                  <p className="text-xs text-amber-700 font-medium flex-1">
                    No number added
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-amber-800 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Add now
                  </button>
                </div>
              )}
            </FieldRow>

            {isSeller && (
              <>
                <FieldRow label="Listing as">
                  {isEditing ? (
                    <FieldSelect name="sellerType" value={formData.sellerType} onChange={handleChange}>
                      <option value="Owner">Owner — I own this property</option>
                      <option value="Agent">Agent — Licensed broker</option>
                      <option value="Builder">Builder — Developer / firm</option>
                    </FieldSelect>
                  ) : (
                    <ReadValue value={currentUser.sellerType} />
                  )}
                </FieldRow>

                {(formData.sellerType === "Agent" || (!isEditing && currentUser.sellerType === "Agent")) && (
                  <FieldRow label="Agent RERA ID">
                    {isEditing ? (
                      <FieldInput 
                        name="agentReraId" 
                        value={formData.agentReraId} 
                        onChange={(e) => setFormData(prev => ({ ...prev, agentReraId: e.target.value.toUpperCase() }))} 
                        placeholder="e.g. A52100012345" 
                        className="uppercase tracking-widest font-mono" 
                      />
                    ) : (
                      <ReadValue value={currentUser.agentReraId} />
                    )}
                  </FieldRow>
                )}
              </>
            )}
          </div>

          {status.success && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
              <CheckCircle size={15} strokeWidth={2} />
              Profile updated successfully.
            </div>
          )}
          {status.error && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
              <AlertTriangle size={15} strokeWidth={2} />
              {status.error}
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard>
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscription</p>
            <div className="flex items-center gap-2">
              <PlanBadge plan={currentUser.subscription?.plan} />
              {(!currentUser.subscription?.plan || currentUser.subscription?.plan === 'free') && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-[11px] font-bold text-[#001A33] hover:underline underline-offset-2"
                >
                  Upgrade →
                </button>
              )}
            </div>
          </div>
          {currentUser.createdAt && (
            <div className="flex flex-col gap-0.5 text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member since</p>
              <p className="text-sm font-semibold text-slate-700">
                {new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      <div className="rounded-2xl border border-red-200 bg-red-50/50 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-red-100">
          <AlertTriangle size={14} className="text-red-500 shrink-0" strokeWidth={2} />
          <h2 className="text-[15px] font-bold text-red-700">Danger zone</h2>
        </div>

        <div className="p-5">
          <p className="text-xs text-red-600 mb-4 leading-relaxed">
            Deleting your account is permanent and cannot be undone. All your properties, saved searches, and data will be removed immediately.
          </p>

          {!deleteState.confirmOpen ? (
            <button
              type="button"
              onClick={() => setDeleteState((s) => ({ ...s, confirmOpen: true }))}
              className="h-9 px-4 rounded-full border border-red-300 text-xs font-bold text-red-600
                hover:bg-red-100 hover:border-red-400 transition-all"
            >
              Delete my account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-1.5">
                  Confirm with your password
                </label>
                <input
                  type="password"
                  value={deleteState.password}
                  onChange={(e) => setDeleteState((s) => ({ ...s, password: e.target.value }))}
                  placeholder="Enter your password to confirm"
                  required
                  className="w-full sm:max-w-sm h-10 border border-red-200 rounded-xl px-3.5 text-sm
                    bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-300
                    focus:border-red-400 placeholder:text-slate-300 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={deleteState.loading || !deleteState.password}
                  className="h-9 px-4 rounded-full bg-red-600 text-white text-xs font-bold
                    hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {deleteState.loading ? "Deleting…" : "Yes, delete my account"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteState((s) => ({ ...s, confirmOpen: false, password: "", error: null }))}
                  className="h-9 px-4 rounded-full border border-slate-200 text-xs font-semibold
                    text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>

              {deleteState.error && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertTriangle size={12} strokeWidth={2} />
                  {deleteState.error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProfileSection;