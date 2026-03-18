import React, { useState } from 'react';
// ✅ FIX 1: Make sure we import apiClient alongside useAuthStore
import useAuthStore, { apiClient } from '../../store/useAuthStore'; 

const ProfileUpdateForm = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    contactNumber: currentUser?.contactNumber || '',
    sellerType: currentUser?.sellerType || 'Owner',
  });
  
  const [status, setStatus] = useState({ loading: false, error: null, success: false });
  const checkAuthSession = useAuthStore((state) => state.checkAuthSession);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await apiClient.put('/api/profile/update', formData);

      if (response.data.success) {
        setStatus({ loading: false, error: null, success: true });
        await checkAuthSession(); // Refresh the UI with new data
      } else {
        setStatus({ loading: false, error: response.data.message, success: false });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Network error occurred.';
      setStatus({ loading: false, error: errorMsg, success: false });
    }
  };

  // ✅ FIX 2: We need the actual return statement to tell React what to draw on the screen!
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 mt-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
        
        <div>
          <label className="text-sm font-medium text-slate-700">First Name</label>
          <input 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleChange} 
            placeholder="First Name" 
            className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
          />
        </div>

        <div>
           <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleChange} 
            placeholder="Last Name" 
             className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
          />
        </div>

        <div>
           <label className="text-sm font-medium text-slate-700">Phone Number</label>
          <input 
            name="contactNumber" 
            value={formData.contactNumber} 
            onChange={handleChange} 
            placeholder="Phone Number" 
             className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
          />
        </div>
        
        {currentUser?.role === 'seller' && (
          <div>
            <label className="text-sm font-medium text-slate-700">Seller Type</label>
            <select 
              name="sellerType" 
              value={formData.sellerType} 
              onChange={handleChange} 
               className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-[#001A33] focus:outline-none"
            >
              <option value="Owner">Owner</option>
              <option value="Agent">Agent</option>
              <option value="Builder">Builder</option>
            </select>
          </div>
        )}

        <button type="submit" disabled={status.loading} className="w-fit h-10 px-6 bg-[#001A33] text-white rounded-md font-medium hover:bg-[#13304c] disabled:opacity-50 mt-4">
          {status.loading ? 'Updating...' : 'Save Changes'}
        </button>

        {status.success && <p className="text-sm font-medium text-green-600 mt-2">Profile updated successfully!</p>}
        {status.error && <p className="text-sm font-medium text-red-600 mt-2">{status.error}</p>}
      </form>
    </div>
  );
};

export default ProfileUpdateForm;