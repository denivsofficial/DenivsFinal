import { create } from 'zustand';
import { apiClient } from './useAuthStore'; 

const fallbackDummyData = [
  { id: 1, title: "Shivneri Heights", location: "CIDCO N-7, Sambhajinagar", price: "35,00,000", tags: ["SALE", "LAND"], specs: { bed: 2, bath: 2, area: "78.5 m²" }, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800" },
  { id: 2, title: "Gajanan Residency", location: "Aurangpura, Sambhajinagar", price: "45,00,000", tags: ["RENT", "HOUSE"], specs: { bed: 4, bath: 2, area: "120 m²" }, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800" },
];

const usePropertyStore = create((set, get) => ({

  isLoading: false,
  error: null,

  featuredProperties: fallbackDummyData,
  likedPropertyIds: [],
  likedPropertiesData: [],
  myListings: [],

  setLoading: (status) => set({ isLoading: status }),
  setFeaturedProperties: (propertiesFromBackend) =>
    set({ featuredProperties: propertiesFromBackend }),

  fetchProperties: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append('search', filters.search);
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);

      if (filters.lat && filters.lng && filters.radius) {
        queryParams.append('lat', filters.lat);
        queryParams.append('lng', filters.lng);
        queryParams.append('radius', filters.radius);
      }

      const response = await apiClient.get(`/api/properties/feed?${queryParams.toString()}`);
      const propertiesArray = response.data?.data?.properties || [];

      if (response.data.success && propertiesArray.length > 0) {
        const formattedProperties = propertiesArray.map(prop => ({
          id: prop._id,
          _id: prop._id,

          title: prop.title || prop.project || `${prop.propertyType} for ${prop.transactionType}`,

          location: `${prop.location?.address || prop.locality || ''}, ${prop.location?.city || prop.city || ''}`,

          price: prop.price?.value?.toString() || prop.price?.toString() || 'Price on Request',

          image: prop.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800",

          featuredRank: prop.featuredRank ?? 0
        }));

        set({ featuredProperties: formattedProperties, isLoading: false });
      } else {
        set({ featuredProperties: [], isLoading: false });
      }

    } catch (error) {
      set({
        featuredProperties: fallbackDummyData,
        isLoading: false,
        error: error.message
      });
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true });

    try {
      const response = await apiClient.get('/api/favorites');

      if (response.data?.favorites) {
        const ids = response.data.favorites.map(fav => fav.propertyId?._id || fav.propertyId);

        set({ likedPropertyIds: ids, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (propertyId) => {
    const { likedPropertyIds } = get();
    const isLiked = likedPropertyIds.includes(propertyId);

    set({
      likedPropertyIds: isLiked
        ? likedPropertyIds.filter(id => id !== propertyId)
        : [...likedPropertyIds, propertyId]
    });

    try {
      if (isLiked) {
        await apiClient.delete(`/api/favorites/${propertyId}`);
      } else {
        await apiClient.post(`/api/favorites/${propertyId}`);
      }
    } catch {
      set({ likedPropertyIds });
    }
  },

  fetchMyListings: async () => {
    try {
      const res = await apiClient.get('/api/properties/my-listings');

      if (res.data.success) {
        const formatted = res.data.data.map((prop) => ({
          _id: prop._id,
          title: prop.title,
          location: prop.location,
          price: prop.price,
          images: prop.images || []
        }));

        set({ myListings: formatted });
      }
    } catch (err) {
      console.error("Failed to fetch my listings");
    }
  }

}));

export default usePropertyStore;