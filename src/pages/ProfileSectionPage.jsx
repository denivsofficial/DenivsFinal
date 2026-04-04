import React from 'react';
import useAuthStore from '../store/useAuthStore'; // Import your store
import ProfileSection from '../ComponentPages/profile/ProfileSection';

const ProfileSectionPage = () => {

const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || !user) {
    return <div className="p-8 text-center mt-10">Please log in to view settings.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <ProfileSection />

      <hr className="my-8 border-gray-200" />
    </div>
  );
};

export default ProfileSectionPage;