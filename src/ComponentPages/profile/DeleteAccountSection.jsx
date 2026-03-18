import React, { useState } from 'react';
import useAuthStore, { apiClient } from '../../store/useAuthStore'; // Import your axios client

const DeleteAccountSection = () => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null });
  const logout = useAuthStore((state) => state.logout); // Pull logout to clear frontend state

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you absolutely sure? This will delete all your properties and cannot be undone.")) return;

    setStatus({ loading: true, error: null });

    try {
      // 🚀 Use apiClient instead of fetch!
      // Note: For axios DELETE requests with a body, you have to pass it inside a 'data' object
      const response = await apiClient.delete('/api/profile/delete', {
        data: { password }
      });

      if (response.data.success) {
        // Clear frontend state and redirect to login
        await logout();
        window.location.href = '/login'; 
      } else {
        setStatus({ loading: false, error: response.data.message || 'Incorrect password.' });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Network error occurred.';
      setStatus({ loading: false, error: errorMsg });
    }
  };

  return (
    <div className="bg-red-50 p-6 rounded-lg border border-red-200 mt-8">
      <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
      <p className="text-sm text-red-600 mb-4">Permanently delete your account and all associated properties.</p>
      
      <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3">
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter current password to confirm" 
          className="border border-red-300 p-2 rounded w-full max-w-md focus:ring-2 focus:ring-red-500 focus:outline-none"
          required 
        />
        <button type="submit" disabled={status.loading || !password} className="bg-red-600 text-white p-2 rounded w-fit hover:bg-red-700 font-medium px-6 h-10 disabled:opacity-50">
          {status.loading ? 'Deleting...' : 'Delete Account'}
        </button>
      </form>
      {status.error && <p className="text-red-600 mt-2 text-sm font-medium">{status.error}</p>}
    </div>
  );
};

export default DeleteAccountSection;