import React, { useEffect, useState, useCallback } from 'react';
import useAdminStore from '../../store/useAdminStore';
import { Check, X, Trash2, MapPin, Eye, Edit2 } from 'lucide-react';
import PropertyDisplayPage from '../../pages/PropertyDisplayPage';
// ─── Utility Helpers ─────────────────────────────────────────────────────────
function formatINR(val) {
  if (!val) return 'Price on Request';
  const n = Number(val);
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakh`;
  return `₹${n.toLocaleString('en-IN')}`;
}

// ─── Modals ──────────────────────────────────────────────────────────────────

const RejectModal = ({ onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 bg-slate-900/60 z-200 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Reject Property</h3>
        <p className="text-sm text-slate-500 mb-4">Provide a reason to help the seller fix their listing.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Blurry photos, incomplete details, wrong pricing..."
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
          rows={4}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-lg">Cancel</button>
          <button 
            onClick={() => reason.trim() && onConfirm(reason.trim())} 
            disabled={!reason.trim()} 
            className="px-4 py-2 text-sm font-semibold bg-rose-500 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

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
            <h3 className="text-lg font-bold text-slate-800">Edit Property Details</h3>
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
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Property Type</label>
                  <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none">
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Transaction Type</label>
                  <select value={formData.transactionType} onChange={e => setFormData({...formData, transactionType: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none">
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none resize-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Pricing & Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Asking Price (₹)</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" required />
                </div>
                {formData.transactionType === 'Rent' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Security Deposit (₹)</label>
                    <input type="number" value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Visibility Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none">
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
                    <input type="number" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" />
                  </div>
                )}
                {formData.propertyType !== 'Land' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Bathrooms / Washrooms</label>
                    <input type="number" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Area (sq.ft)</label>
                  <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Address / Locality</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#001A33] outline-none" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all">Cancel</button>
          <button type="submit" form="edit-form" className="px-5 py-2.5 text-sm font-semibold bg-[#001A33] text-white hover:bg-slate-800 rounded-xl flex items-center gap-2 shadow-md transition-all">
            <Check size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const PendingProperties = () => {
  const { pendingProperties, fetchPendingProperties, verifyProperty, deleteProperty, updateProperty, isLoading } = useAdminStore();
  const [search, setSearch] = useState('');
  
  const [viewingPropertyId, setViewingPropertyId] = useState(null); 
  const [rejectTarget, setRejectTarget] = useState(null); 
  const [editingProp, setEditingProp] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { fetchPendingProperties(); }, []);

  const handleSearch = useCallback(() => fetchPendingProperties(1, search), [search]);

  // Main Handlers
  const handleApprove = async (id) => {
    if (!window.confirm('Approve and publish this property?')) return;
    const result = await verifyProperty(id, true);
    if (result.success) setViewingPropertyId(null); 
    else alert(result.message);
  };

  const confirmReject = async (reason) => {
    const result = await verifyProperty(rejectTarget, false, reason);
    if (result.success) {
      setRejectTarget(null);
      setViewingPropertyId(null); 
    } else alert(result.message);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    const result = await deleteProperty(id);
    if (result.success) {
      setViewingPropertyId(null);
    } else {
      alert(result.message);
    }
  };

  const handleUpdate = async (id, data) => {
    const result = await updateProperty(id, data);
    if (result.success) {
      setEditingProp(null);
      await fetchPendingProperties(); 
      setRefreshKey(prev => prev + 1); // Forces PropertyDisplayPage to refetch the updated data
    } else {
      alert(result.message);
    }
  };

  // Component passed into the reused PropertyDisplayPage
  const AdminActions = ({ property, mobile }) => {
    const containerClass = mobile ? "flex gap-2 w-full" : "p-4 flex flex-col gap-2.5";
    
    return (
      <div className={containerClass}>
        <button onClick={() => handleApprove(property._id)} className="w-full h-11 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all">
          <Check size={16} /> Approve
        </button>
        <div className="flex gap-2 w-full">
          <button onClick={() => setRejectTarget(property._id)} className="flex-1 h-11 bg-amber-50 text-amber-600 border-2 border-amber-200 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-all">
            <X size={15} /> Reject
          </button>
          <button onClick={() => setEditingProp(property)} className="flex-1 h-11 bg-blue-50 text-blue-600 border-2 border-blue-200 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-all">
            <Edit2 size={15} /> Edit
          </button>
        </div>
        {mobile ? (
          <button onClick={() => handleDelete(property._id)} className="w-11 h-11 border-2 border-rose-200 text-rose-500 bg-rose-50 rounded-xl flex items-center justify-center shrink-0" title="Delete">
            <Trash2 size={18} />
          </button>
        ) : (
          <button onClick={() => handleDelete(property._id)} className="w-full h-11 mt-1 text-rose-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 transition-all">
            <Trash2 size={15} /> Delete Permanently
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Reusing your beautiful PropertyDisplayPage inside a full-screen overlay */}
      {viewingPropertyId && (
        <div className="fixed inset-0 z-100 bg-white overflow-y-auto animate-in fade-in duration-200">
          <PropertyDisplayPage 
            propertyId={viewingPropertyId}
            adminMode={true}
            onAdminClose={() => setViewingPropertyId(null)}
            adminActions={AdminActions}
            refreshKey={refreshKey}
          />
        </div>
      )}
      
      {rejectTarget && (
        <RejectModal 
          onConfirm={confirmReject} 
          onCancel={() => setRejectTarget(null)} 
        />
      )}

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
          <h2 className="text-2xl font-bold text-slate-800">Pending Approvals</h2>
          <p className="text-sm text-slate-500">Click any row to review, edit, and verify submissions.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search properties..."
            className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#001A33] outline-none"
          />
          <button onClick={handleSearch} className="px-4 py-2 bg-[#001A33] text-white text-sm font-semibold rounded-xl">Search</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-225">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price & Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading properties...</td></tr>
              ) : pendingProperties.length === 0 ? (
                <tr><td colSpan="4" className="p-12 text-center text-slate-500 font-medium">No properties pending approval.</td></tr>
              ) : pendingProperties.map(prop => (
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
                    <div className="font-semibold text-sm text-slate-800">{prop.listedBy?.name}</div>
                    <div className="text-xs text-slate-500">{prop.listedBy?.contactNumber || prop.listedBy?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-sm text-slate-800 font-mono">
                      {formatINR(prop.price?.value)}
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider">
                      {prop.propertyType} • {prop.transactionType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg transition-colors" 
                        title="Review Full Details"
                      >
                        <Eye size={14} /> Review
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

export default PendingProperties;