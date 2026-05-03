import React, { useEffect, useState } from 'react';
import useAdminStore from '../../store/useAdminStore';
import { Edit2, Trash2, X, Check, MapPin, Eye } from 'lucide-react';
import PropertyDisplayPage from '../../pages/PropertyDisplayPage';

// ─── Utility Helpers ─────────────────────────────────────────────────────────
function formatINR(val) {
  if (!val) return 'Price on Request';
  const n = Number(val);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakh`;
  return `₹${n.toLocaleString('en-IN')}`;
}

// ─── Advanced Edit Modal ─────────────────────────────────────────────────────
const EditPropertyModal = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price?.value || '',
    securityDeposit: property?.price?.securityDeposit || '',
    status: property?.status || 'Available',
    propertyType: property?.propertyType || 'Apartment',
    transactionType: property?.transactionType || 'Sale',
    city: property?.location?.city || '',
    address: property?.location?.address || '',
    bedrooms: property?.residentialDetails?.bedrooms || '',
    bathrooms: property?.residentialDetails?.bathrooms || property?.commercialDetails?.washrooms || '',
    area: property?.residentialDetails?.carpetArea || property?.commercialDetails?.carpetArea || property?.plotDetails?.plotArea || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      propertyType: formData.propertyType,
      transactionType: formData.transactionType,
      'price.value': Number(formData.price) || 0,
      'price.securityDeposit': Number(formData.securityDeposit) || 0,
      'location.city': formData.city,
      'location.address': formData.address,
    };

    if (['Apartment', 'House'].includes(formData.propertyType)) {
      payload['residentialDetails.bedrooms'] = Number(formData.bedrooms) || 0;
      payload['residentialDetails.bathrooms'] = Number(formData.bathrooms) || 0;
      payload['residentialDetails.carpetArea'] = Number(formData.area) || 0;
    } else if (formData.propertyType === 'Land') {
      payload['plotDetails.plotArea'] = Number(formData.area) || 0;
    } else if (['Office', 'Shop'].includes(formData.propertyType)) {
      payload['commercialDetails.carpetArea'] = Number(formData.area) || 0;
      payload['commercialDetails.washrooms'] = Number(formData.bathrooms) || 0;
    }

    onSave(property._id, payload);
  };

  const isResidential = ['Apartment', 'House'].includes(formData.propertyType);

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-200 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Edit Live Property</h3>
            <p className="text-xs text-slate-500">Refining listing for {property?.listedBy?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Property Type</label>
                  <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Transaction Type</label>
                  <select value={formData.transactionType} onChange={e => setFormData({...formData, transactionType: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Pricing & Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Asking Price (₹)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                {formData.transactionType === 'Rent' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Security Deposit (₹)</label>
                    <input type="number" value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Visibility Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isResidential && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Bedrooms</label>
                    <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                )}
                {formData.propertyType !== 'Land' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Bathrooms / Washrooms</label>
                    <input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Area (sq.ft)</label>
                  <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Address / Locality</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all">Cancel</button>
          {/* Prominent Save Button */}
          <button type="submit" form="edit-form" className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all">
            <Check size={16} strokeWidth={3} /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};


// ─── Main Component ──────────────────────────────────────────────────────────

const VerifiedListings = () => {
  const { verifiedProperties, fetchVerifiedProperties, updateProperty, deleteProperty, isLoading } = useAdminStore();
  
  const [viewingPropertyId, setViewingPropertyId] = useState(null); 
  const [editingProp, setEditingProp] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchVerifiedProperties(); }, []);

  const handleUpdate = async (id, data) => {
    const result = await updateProperty(id, data);
    if (result.success) {
      setEditingProp(null);
      await fetchVerifiedProperties(); 
      setRefreshKey(prev => prev + 1); // Forces PropertyDisplayPage to refetch the updated data
    } else {
      alert(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this listing?")) {
      const result = await deleteProperty(id);
      if (result.success) {
        setViewingPropertyId(null);
      } else {
        alert(result.message);
      }
    }
  };

  // Custom Actions mapped to the PropertyDisplayPage specifically for Verified Listings
  const VerifiedAdminActions = ({ property, mobile }) => {
    const containerClass = mobile ? "flex gap-3 w-full" : "p-5 flex flex-col gap-3";
    
    return (
      <div className={containerClass}>
        {/* Highly Prominent Edit Button */}
        <button 
          onClick={() => setEditingProp(property)} 
          className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all active:scale-[0.98]"
        >
          <Edit2 size={18} /> Edit Property
        </button>
        
        {mobile ? (
          <button onClick={() => handleDelete(property._id)} className="w-12 h-12 border-2 border-rose-100 text-rose-500 bg-white shadow-sm rounded-xl flex items-center justify-center shrink-0 active:scale-[0.95] transition-all" title="Delete">
            <Trash2 size={20} />
          </button>
        ) : (
          <button 
            onClick={() => handleDelete(property._id)} 
            className="flex-1 h-12 bg-white text-rose-600 border-2 border-rose-100 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-[0.98]"
          >
            <Trash2 size={18} /> Remove Listing
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Property Display Overlay */}
      {viewingPropertyId && (
        <div className="fixed inset-0 z-100 bg-white overflow-y-auto animate-in fade-in duration-200">
          <PropertyDisplayPage 
            propertyId={viewingPropertyId}
            adminMode={true}
            onAdminClose={() => setViewingPropertyId(null)}
            adminActions={VerifiedAdminActions}
            refreshKey={refreshKey}
          />
        </div>
      )}

      {/* Edit Modal */}
      {editingProp && (
        <EditPropertyModal 
          property={editingProp} 
          onClose={() => setEditingProp(null)} 
          onSave={handleUpdate} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Verified Listings</h2>
          <p className="text-sm text-slate-500">Manage all live properties on the platform.</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-200">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price & Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading...</td></tr>
              ) : verifiedProperties.length === 0 ? (
                <tr><td colSpan="4" className="p-12 text-center text-slate-500 font-medium">No verified listings available.</td></tr>
              ) : verifiedProperties.map((prop) => (
                <tr 
                  key={prop._id} 
                  onClick={() => setViewingPropertyId(prop._id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-slate-800 mb-1">{prop.title || 'Untitled'}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={12} className="text-[#001A33]" /> {prop.location?.city || 'No Location'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-slate-800">{prop.listedBy?.name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{prop.listedBy?.contactNumber || prop.listedBy?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm text-slate-800 font-mono">{formatINR(prop.price?.value)}</div>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${prop.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      
                      {/* Prominent Edit Button directly in the table row */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingProp(prop); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-[0.97]"
                        title="Edit Details"
                      >
                        <Edit2 size={14} /> Edit
                      </button>

                      {/* Explicit View Button so users know the row is clickable */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setViewingPropertyId(prop._id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-[0.97]"
                        title="Review Full Page"
                      >
                        <Eye size={14} /> View
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default VerifiedListings;