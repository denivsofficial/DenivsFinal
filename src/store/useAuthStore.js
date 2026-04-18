import { create } from 'zustand';
import axios from 'axios';

// --- API CLIENT SETUP ---
// We export this so you can use it in your profile forms!
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, 
});

// Add request interceptor to ensure credentials are sent
apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useAuthStore = create((set, get) => ({
  // --- STATE ---
  user: null, 
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tempUserId: null, 

  // ==========================================
  // 1. SIGNUP FLOW 
  // ==========================================
  
  initiateSignup: async (type, value) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/initiate-signup', { type, value });
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      // Fixed typo here: was 'ssage'
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
      const { tempUserId } = get();
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
  // 2.5 GOOGLE AUTH FLOW
  // ==========================================

  loginWithGoogle: async (googleCredential) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/google', { 
        token: googleCredential 
      });
      set({ 
        user: response.data.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Google authentication failed', isLoading: false });
      return { success: false };
    }
  },

  // ==========================================
  // 3. SESSION MANAGEMENT
  // ==========================================

  checkAuthSession: async () => {
    try {
      const response = await apiClient.get('/check-auth');
      set({ user: response.data.data, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post('/logout'); 
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      console.error("Logout failed", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;