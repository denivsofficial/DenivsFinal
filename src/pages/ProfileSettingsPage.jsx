import React from 'react';
import ProfileUpdateForm from '../ComponentPages/profile/ProfileUpdateForm';
import DeleteAccountSection from '../ComponentPages/profile/DeleteAccountSection';
import useAuthStore from '../store/useAuthStore'; // Import your store

const ProfileSettingsPage = () => {
  // Pull the current user and auth status directly from your global state
const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Optional: Add a quick guard if a guest tries to navigate here directly
  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center mt-10">Please log in to view settings.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      {/* Pass the globally stored user to the form */}
      <ProfileUpdateForm currentUser={user} />

      <hr className="my-8 border-gray-200" />

      <DeleteAccountSection />
    </div>
  );
};

export default ProfileSettingsPage;