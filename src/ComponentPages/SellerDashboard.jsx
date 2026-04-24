import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Phone, Trash2, Calendar, 
  MapPin, AlertCircle, CheckCircle2, Clock, ChevronDown, MessageSquare, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- Added import
import usePropertyStore from '../store/usePropertyStore';

export default function SellerDashboard() {
  const navigate = useNavigate(); // <-- Added navigation hook
  const [activeTab, setActiveTab] = useState('listings');
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    dashboardStats, 
    myListings, 
    sellerLeads, 
    isDashboardLoading, 
    error,
    fetchSellerDashboard,
    deleteListing,
    updateLeadStatus
  } = usePropertyStore();

  useEffect(() => {
    fetchSellerDashboard();
  }, [fetchSellerDashboard]);

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;
    setIsDeleting(true);
    
    const result = await deleteListing(listingToDelete._id);
    if (!result.success) {
      alert(result.message);
    }
    
    setIsDeleting(false);
    setListingToDelete(null);
  };

  if (isDashboardLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your properties and connect with potential buyers.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<Building />} title="Active Listings" value={dashboardStats.activeListings} />
          <StatCard icon={<Users />} title="Total Leads" value={dashboardStats.totalLeads} />
          <StatCard 
            icon={<AlertCircle className="text-blue-600" />} 
            title="New Inquiries" 
            value={dashboardStats.newLeadsCount} 
            highlight 
          />
        </div>

        <div className="flex bg-slate-200/60 p-1 rounded-lg w-full max-w-sm">
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'listings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-md transition-all ${
              activeTab === 'leads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Leads
            {dashboardStats.newLeadsCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {dashboardStats.newLeadsCount}
              </span>
            )}
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.length === 0 ? (
                <EmptyState icon={<Building />} title="No listings found" message="You haven't posted any properties yet." />
              ) : (
                myListings.map(property => {
                  const formattedPrice = property.price?.value 
                    ? property.price.value.toLocaleString('en-IN') 
                    : 'Price on Request';
                  
                  const imgUrl = property.images?.length > 0 ? property.images[0] : '/fallback.jpg';

                  return (
                    <div 
                      key={property._id} 
                      onClick={() => navigate(`/property/${property._id}`)} // <-- Added onClick to route
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img src={imgUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                          {property.viewCount || 0} Views
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{property.title}</h3>
                        <div className="flex items-center text-slate-500 text-sm mt-1 mb-3">
                          <MapPin size={14} className="mr-1 shrink-0" /> 
                          <span className="truncate">{property.location?.address ? `${property.location.address}, ` : ''}{property.location?.city}</span>
                        </div>
                        <div className="text-xl font-extrabold text-[#001A33] mb-4">
                          {property.price?.currency === 'INR' ? '₹ ' : ''}{formattedPrice}
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                          <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                            <Users size={16} /> {property.leadsCount || 0} Leads
                          </span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // <-- Prevents the card click when deleting
                              setListingToDelete(property);
                            }}
                            className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sellerLeads.length === 0 ? (
                <EmptyState icon={<Users />} title="No leads yet" message="When buyers contact you, their details will appear here." />
              ) : (
                sellerLeads.map(lead => (
                  <div key={lead.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-4">
                      <img src={lead.propertyImage} alt={lead.propertyName} className="w-14 h-14 rounded-md object-cover shadow-sm border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Inquiry For</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{lead.propertyName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-500 flex items-center justify-end gap-1"><Calendar size={12}/> {lead.date}</p>
                        <p className="text-xs text-slate-500 flex items-center justify-end gap-1 mt-0.5"><Clock size={12}/> {lead.time}</p>
                      </div>
                    </div>

                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {lead.name}
                            {lead.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                          </h4>
                          <div className="mt-2 space-y-1.5">
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors w-fit">
                              <Phone size={14} /> {lead.phone}
                            </a>
                          </div>
                        </div>
                        <StatusDropdown status={lead.status} onChange={(newStatus) => updateLeadStatus(lead.id, newStatus)} />
                      </div>

                      {lead.message && (
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 relative">
                          <MessageSquare size={16} className="absolute top-3 left-3 text-slate-400" />
                          <p className="text-sm text-slate-700 italic pl-8 leading-relaxed">"{lead.message}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>

      {listingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600 w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Delete Listing</h2>
              <p className="text-sm text-slate-500 mt-2">
                Are you sure you want to delete <strong>{listingToDelete.title}</strong>? This action cannot be undone and will permanently remove this property from public view.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
              <button 
                disabled={isDeleting}
                onClick={() => setListingToDelete(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isDeleting ? 'Deleting...' : 'Yes, Delete Property'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const StatCard = ({ icon, title, value, highlight }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${highlight ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="col-span-full bg-white border border-slate-200 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    <p className="text-sm text-slate-500 mt-1 max-w-sm">{message}</p>
  </div>
);

const StatusDropdown = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    closed: { label: 'Closed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  };

  const current = statusConfig[status] || statusConfig.new;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 ${current.color}`}
      >
        {status === 'closed' ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />}
        {current.label}
        <ChevronDown size={14} className="opacity-50 ml-1" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-2">
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setIsOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors ${status === key ? 'text-slate-900 bg-slate-50/50' : 'text-slate-600'}`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};