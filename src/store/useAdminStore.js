import { create } from 'zustand';
import { apiClient } from './useAuthStore';

const useAdminStore = create((set, get) => ({
  isLoading: false,
  error: null,

  // --- Data State ---
  incompleteLeads: [],
  pendingProperties: [],
  verifiedProperties: [],
  allUsers: [],
  stats: {
    totalUsers: 0,
    pendingCount: 0,
    activeListings: 0,
    incompleteCount: 0,
  },

  // ─────────────────────────────────────────────
  // STATS (Overview)
  // ─────────────────────────────────────────────
  fetchStats: async () => {
    try {
      const [usersRes, pendingRes, verifiedRes, leadsRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/properties/pending-verification'),
        apiClient.get('/properties/verified'),
        apiClient.get('/properties/incomplete'),
      ]);
      set({
        stats: {
          totalUsers: usersRes.data.count,
          pendingCount: pendingRes.data.totalCount,
          activeListings: verifiedRes.data.totalCount,
          incompleteCount: leadsRes.data.totalCount,
        },
        allUsers: usersRes.data.users,
        pendingProperties: pendingRes.data.properties,
        verifiedProperties: verifiedRes.data.properties,
        incompleteLeads: leadsRes.data.properties,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch stats' });
    }
  },

  // ─────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────
  fetchUsers: async (search = '') => {
    set({ isLoading: true, error: null });
    try {
      const params = search ? { search } : {};
      const response = await apiClient.get('/users', { params });
      set({ allUsers: response.data.users, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch users', isLoading: false });
    }
  },

  upgradeUser: async (userId, durationInMonths) => {
    try {
      const res = await apiClient.post(`/subscription/upgrade/${userId}`, { durationInMonths });
      // Refresh users
      await get().fetchUsers();
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Upgrade failed' };
    }
  },

  downgradeUser: async (userId) => {
    try {
      const res = await apiClient.post(`/subscription/downgrade/${userId}`);
      await get().fetchUsers();
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Downgrade failed' };
    }
  },

  // ─────────────────────────────────────────────
  // PENDING PROPERTIES
  // ─────────────────────────────────────────────
  fetchPendingProperties: async (page = 1, search = '') => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      const response = await apiClient.get('/properties/pending-verification', { params });
      set({ pendingProperties: response.data.properties, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch pending properties', isLoading: false });
    }
  },

  verifyProperty: async (propertyId, isVerified, rejectionReason = '') => {
    try {
      await apiClient.put(`/properties/${propertyId}/verify`, {
        isVerified,
        ...(rejectionReason && { rejectionReason }),
      });
      set({
        pendingProperties: get().pendingProperties.filter(p => p._id !== propertyId),
        stats: {
          ...get().stats,
          pendingCount: Math.max(0, get().stats.pendingCount - 1),
          activeListings: isVerified ? get().stats.activeListings + 1 : get().stats.activeListings,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Verification failed' };
    }
  },

  // ─────────────────────────────────────────────
  // VERIFIED PROPERTIES
  // ─────────────────────────────────────────────
  fetchVerifiedProperties: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/properties/verified', { params: { page, limit: 20 } });
      set({ verifiedProperties: response.data.properties, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch verified properties', isLoading: false });
    }
  },

  // ─────────────────────────────────────────────
  // DELETE / UPDATE
  // ─────────────────────────────────────────────
  deleteProperty: async (propertyId) => {
    try {
      await apiClient.delete(`/properties/${propertyId}`);
      set({
        pendingProperties: get().pendingProperties.filter(p => p._id !== propertyId),
        verifiedProperties: get().verifiedProperties.filter(p => p._id !== propertyId),
        incompleteLeads: get().incompleteLeads.filter(p => p._id !== propertyId),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Deletion failed' };
    }
  },

  updateProperty: async (propertyId, updates) => {
    try {
      const res = await apiClient.patch(`/properties/${propertyId}`, updates);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Update failed' };
    }
  },

  // ─────────────────────────────────────────────
  // INCOMPLETE LEADS
  // ─────────────────────────────────────────────
  fetchIncompleteLeads: async (page = 1, wasContacted) => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, limit: 20 };
      if (wasContacted !== undefined) params.wasContacted = wasContacted;
      const response = await apiClient.get('/properties/incomplete', { params });
      set({ incompleteLeads: response.data.properties, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch leads', isLoading: false });
    }
  },

  toggleLeadStatus: async (propertyId, currentStatus) => {
    const previous = get().incompleteLeads;
    // Optimistic update
    set({
      incompleteLeads: previous.map(lead =>
        lead._id === propertyId ? { ...lead, wasContacted: !currentStatus } : lead
      ),
    });
    try {
      await apiClient.patch(`/properties/${propertyId}/contact-status`, {
        wasContacted: !currentStatus,
      });
    } catch (error) {
      set({ incompleteLeads: previous, error: 'Failed to update contact status' });
    }
  },
}));

export default useAdminStore;