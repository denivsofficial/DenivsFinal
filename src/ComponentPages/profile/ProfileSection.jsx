import React, { useState, useEffect } from "react";
import useAuthStore, { apiClient } from "../../store/useAuthStore";
import usePropertyStore from "../../store/usePropertyStore";
import { Pencil, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSection = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
    if (!currentUser) {
      return (
        <div className="text-center py-20 text-gray-500">
          Loading profile...
        </div>
      );
    }
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    contactNumber: currentUser?.contactNumber || "",
    sellerType: currentUser?.sellerType || "Owner",
  });
  const [profileImage, setProfileImage] = useState(null);

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [deleteState, setDeleteState] = useState({
    password: "",
    loading: false,
    error: null,
  });

  const checkAuthSession = useAuthStore((state) => state.checkAuthSession);
  const logout = useAuthStore((state) => state.logout);

  const { myListings = [], fetchMyListings } = usePropertyStore();

  useEffect(() => {
    if (currentUser?.role === "seller") {
      fetchMyListings();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await apiClient.put("/api/profile/update", formData);

      if (response.data.success) {
        await checkAuthSession();
        setStatus({ loading: false, error: null, success: true });
        setIsEditing(false);
      }
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.message || "Update failed",
        success: false,
      });
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (
      !window.confirm(
        "Are you absolutely sure? This will delete all your properties and cannot be undone."
      )
    )
      return;

    setDeleteState({ ...deleteState, loading: true, error: null });

    try {
      const response = await apiClient.delete("/api/profile/delete", {
        data: { password: deleteState.password },
      });

      if (response.data.success) {
        await logout();
        window.location.href = "/login";
      } else {
        setDeleteState({
          ...deleteState,
          loading: false,
          error: response.data.message || "Incorrect password",
        });
      }
    } catch (error) {
      setDeleteState({
        ...deleteState,
        loading: false,
        error: error.response?.data?.message || "Network error",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">My Profile</h2>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-sm bg-slate-900 text-white px-4 py-2 rounded-md"
            >
              <Pencil size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-1 text-sm bg-green-600 text-white px-4 py-2 rounded-md"
              >
                <Save size={14} />
                {status.loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 text-sm bg-gray-200 px-4 py-2 rounded-md"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src={
                profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  currentUser?.name || "User"
                )}`
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border"
            />

            {isEditing && (
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) =>
                  setProfileImage(URL.createObjectURL(e.target.files[0]))
                }
              />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">{currentUser?.name}</h3>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
            <p className="text-xs text-gray-400 mt-1 capitalize">
              {currentUser?.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
            ) : (
              <p className="mt-1 font-medium">{currentUser?.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone</label>
            {isEditing ? (
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
            ) : (
              <p className="mt-1 font-medium">
                {currentUser?.contactNumber || "Not provided"}
              </p>
            )}
          </div>

          {currentUser?.role === "seller" && (
            <div>
              <label className="text-sm text-gray-600">Seller Type</label>
              {isEditing ? (
                <select
                  name="sellerType"
                  value={formData.sellerType}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md p-2"
                >
                  <option value="Owner">Owner</option>
                  <option value="Agent">Agent</option>
                  <option value="Builder">Builder</option>
                </select>
              ) : (
                <p className="mt-1 font-medium">
                  {currentUser?.sellerType}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600">Subscription</label>
            <p className="mt-1 font-medium capitalize">
              {currentUser?.subscription?.plan || "free"}
            </p>
          </div>
        </div>

        {status.success && (
          <p className="text-green-600 mt-4 text-sm">
            Profile updated successfully
          </p>
        )}
        {status.error && (
          <p className="text-red-600 mt-4 text-sm">{status.error}</p>
        )}
      </div>

      {currentUser?.role === "seller" && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
          <h2 className="text-xl font-semibold mb-6">My Listings</h2>

          {myListings.length === 0 ? (
            <p className="text-gray-500">No properties listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myListings.map((prop) => (
                <div
                  key={prop._id}
                  onClick={() => navigate(`/property/${prop._id}`)}
                  className="bg-white rounded-xl shadow cursor-pointer hover:shadow-md transition"
                >
                  <img
                    src={prop.images?.[0] || "/fallback.jpg"}
                    className="h-40 w-full object-cover rounded-t-xl"
                  />
                  <div className="p-3">
                    <h3 className="font-bold">{prop.title}</h3>
                    <p className="text-sm text-gray-500">
                      {prop.location?.city}
                    </p>
                    <p className="font-bold mt-2">
                      ₹ {prop.price?.value?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Danger Zone
        </h3>

        <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3">
          <input
            type="password"
            value={deleteState.password}
            onChange={(e) =>
              setDeleteState({ ...deleteState, password: e.target.value })
            }
            placeholder="Enter password to confirm"
            className="border border-red-300 p-2 rounded w-full max-w-md"
            required
          />

          <button
            type="submit"
            disabled={deleteState.loading || !deleteState.password}
            className="bg-red-600 text-white px-6 h-10 rounded w-fit"
          >
            {deleteState.loading ? "Deleting..." : "Delete Account"}
          </button>
        </form>

        {deleteState.error && (
          <p className="text-red-600 mt-2 text-sm">
            {deleteState.error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;