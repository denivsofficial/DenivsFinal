import { create } from 'zustand';
import { apiClient } from './useAuthStore'; 

// We save your dummy data here as a safety net
const fallbackDummyData = [
  { id: 1, title: "Shivneri Heights", location: "CIDCO N-7, Sambhajinagar", price: "35,00,000", tags: ["SALE", "LAND"], specs: { bed: 2, bath: 2, area: "78.5 m²" }, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800" },
  { id: 2, title: "Gajanan Residency", location: "Aurangpura, Sambhajinagar", price: "45,00,000", tags: ["RENT", "HOUSE"], specs: { bed: 4, bath: 2, area: "120 m²" }, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800" },
  { id: 3, title: "Sahyadri Chambers", location: "Jalna Road, near MGM", price: "30,00,000", tags: ["COMMERCIAL", "DUPLEX"], specs: { bed: 3, bath: 3, area: "95 m²" }, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800" },
  { id: 4, title: "Marathwada Villa", location: "Waluj MIDC, Sambhajinagar", price: "55,00,000", tags: ["SALE", "VILLA"], specs: { bed: 5, bath: 4, area: "210 m²" }, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800" },
  { id: 5, title: "Ajanta View Apartments", location: "Paithan Road, Sambhajinagar", price: "28,50,000", tags: ["RENT", "FLAT"], specs: { bed: 2, bath: 1, area: "65 m²" }, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800" },
  { id: 6, title: "Ellora Residency", location: "Railway Station Area", price: "42,00,000", tags: ["SALE", "HOUSE"], specs: { bed: 3, bath: 2, area: "110 m²" }, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800" }
];

const usePropertyStore = create((set, get) => ({
  isLoading: false,
  error: null,
  featuredProperties: fallbackDummyData, 
  likedPropertyIds: [], 
  likedPropertiesData: [],
  
  setLoading: (status) => set({ isLoading: status }),
  setFeaturedProperties: (propertiesFromBackend) => set({ featuredProperties: propertiesFromBackend }),

  fetchProperties: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
      
      // 🚀 NEW: Check for Location Coordinates and attach them to the request
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

          tags: [
            prop.transactionType?.toUpperCase() || "SALE",
            prop.propertyType?.toUpperCase() || "PROPERTY"
          ],

          specs: {
            bed: prop.residentialDetails?.bedrooms || parseInt(prop.bedrooms) || 0,
            bath: prop.residentialDetails?.bathrooms || 2,
            area: prop.residentialDetails?.carpetArea
              ? `${prop.residentialDetails.carpetArea} sqft`
              : 'N/A'
          },

          image:
            prop.images && prop.images.length > 0
              ? prop.images[0]
              : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800",

          featuredRank: prop.featuredRank ?? 0
        }));

        set({ featuredProperties: formattedProperties, isLoading: false });
      } else {
        set({ featuredProperties: [], isLoading: false });
      }
    } catch (error) {
      console.error("Backend fetch failed, loading dummy data:", error.message);
      set({ featuredProperties: fallbackDummyData, isLoading: false, error: error.message });
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/api/favorites');
      if (response.data && response.data.favorites) {
        const ids = response.data.favorites.map(fav => fav.propertyId?._id || fav.propertyId);
        const fullProperties = response.data.favorites.map(fav => fav.propertyId).filter(Boolean); 

        const formattedLiked = fullProperties.map(prop => ({
          id: prop._id,
          title: prop.title || prop.project || `${prop.propertyType} for ${prop.transactionType}`,
          location: `${prop.location?.address || prop.locality || ''}, ${prop.location?.city || prop.city || ''}`,
          price: prop.price?.value?.toString() || prop.price?.toString() || 'Price on Request',
          tags: [prop.transactionType?.toUpperCase() || "SALE", prop.propertyType?.toUpperCase() || "PROPERTY"],
          specs: { bed: prop.residentialDetails?.bedrooms || parseInt(prop.bedrooms) || 0, bath: prop.residentialDetails?.bathrooms || 2, area: prop.residentialDetails?.carpetArea ? `${prop.residentialDetails.carpetArea} sqft` : 'N/A' },
          image: prop.images && prop.images.length > 0 ? prop.images[0] : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800"
        }));

        set({ likedPropertyIds: ids, likedPropertiesData: formattedLiked, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch favorites", error);
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (propertyId) => {
    const { likedPropertyIds } = get();
    const isLiked = likedPropertyIds.includes(propertyId);

    if (isLiked) {
      set({ likedPropertyIds: likedPropertyIds.filter(id => id !== propertyId) });
    } else {
      set({ likedPropertyIds: [...likedPropertyIds, propertyId] });
    }

    try {
      if (isLiked) {
        await apiClient.delete(`/api/favorites/${propertyId}`);
      } else {
        await apiClient.post(`/api/favorites/${propertyId}`);
      }
    } catch (error) {
      console.error("Failed to update favorite", error);
      set({ likedPropertyIds });
    }
  }
}));

export default usePropertyStore;