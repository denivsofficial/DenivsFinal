import { create } from 'zustand';
import axios from 'axios';

// --- API CLIENT SETUP ---
const apiClient = axios.create({
  // Make sure this matches your backend API route prefix (often /api)
  baseURL: 'https://api.denivs.com', 
  withCredentials: true, // CRITICAL: Tells the browser to send/receive the JWT cookies
});

const useAuthStore = create((set) => ({
  // --- STATE ---
 user:null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tempUserId: null, // Stores the ID between Step 2 and 3 of Signup

  // ==========================================
  // 1. SIGNUP FLOW (The 3-Step Process)
  // ==========================================
  
  initiateSignup: async (type, value) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/initiate-signup', { type, value });
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to send OTP', isLoading: false });
      return { success: false };
    }
  },

  verifyOtp: async (type, value, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/verify-otp', { type, value, otp });
      set({ tempUserId: response.data.data.userId, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Invalid OTP', isLoading: false });
      return { success: false };
    }
  },

  completeSignup: async (name, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { tempUserId } = useAuthStore.getState();
      const response = await apiClient.post('/complete-signup', { 
        userId: tempUserId, 
        name, 
        password, 
        confirmPassword 
      });
      
      set({ 
        user: response.data.data, 
        isAuthenticated: true, 
        isLoading: false,
        tempUserId: null 
      });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to complete profile', isLoading: false });
      return { success: false };
    }
  },

  // ==========================================
  // 2. LOGIN FLOW
  // ==========================================

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      // Backend expects "identifier" (email or phone) and "password"
      const response = await apiClient.post('/login', { identifier, password });
      
      set({ 
        user: response.data.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Invalid credentials', isLoading: false });
      return { success: false };
    }
  },

  // ==========================================
  // 3. SESSION MANAGEMENT
  // ==========================================

  // Run this in App.jsx to persist login across page refreshes
  checkAuthSession: async () => {
    try {
      const response = await apiClient.get('/check-auth');
      set({ user: response.data.data, isAuthenticated: true });
    } catch (error) {
      // If it fails, it means the cookie expired or they aren't logged in
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Tell the backend to clear the httpOnly cookie
      await apiClient.post('/logout'); 
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      console.error("Logout failed", error);
      // Even if backend fails, clear frontend state so they appear logged out
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Utility to clear errors when switching between forms
  clearError: () => set({ error: null }),
}));

export default useAuthStore;