import { create } from 'zustand';
import { apiClient } from './useAuthStore'; // Import the API client!

// We save your dummy data here as a safety net for tomorrow's demo
const fallbackDummyData = [
  {
    id: 1,
    title: "Shivneri Heights",
    location: "CIDCO N-7, Sambhajinagar, Maharashtra, India",
    price: "35,00,000",
    tags: ["SALE", "LAND"],
    specs: { bed: 2, bath: 2, area: "78.5 m²" },
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800"
  },
  {
    id: 2,
    title: "Gajanan Residency",
    location: "Aurangpura, Sambhajinagar, Maharashtra, India",
    price: "45,00,000",
    tags: ["RENT", "HOUSE"],
    specs: { bed: 4, bath: 2, area: "120 m²" },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800"
  },
  {
    id: 3,
    title: "Sahyadri Chambers",
    location: "Jalna Road, near MGM, Sambhajinagar, Maharashtra, India",
    price: "30,00,000",
    tags: ["COMMERCIAL", "DUPLEX"],
    specs: { bed: 3, bath: 3, area: "95 m²" },
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800"
  },
  {
    id: 4,
    title: "Marathwada Villa",
    location: "Waluj MIDC, Sambhajinagar, Maharashtra, India",
    price: "55,00,000",
    tags: ["SALE", "VILLA"],
    specs: { bed: 5, bath: 4, area: "210 m²" },
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800"
  },
  {
    id: 5,
    title: "Ajanta View Apartments",
    location: "Paithan Road, Sambhajinagar, Maharashtra, India",
    price: "28,50,000",
    tags: ["RENT", "FLAT"],
    specs: { bed: 2, bath: 1, area: "65 m²" },
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800"
  },
  {
    id: 6,
    title: "Ellora Residency",
    location: "Railway Station Area, Sambhajinagar, Maharashtra, India",
    price: "42,00,000",
    tags: ["SALE", "HOUSE"],
    specs: { bed: 3, bath: 2, area: "110 m²" },
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800"
  }
];

// CRITICAL: Added `get` to the parameters so we can read current state inside actions
const usePropertyStore = create((set, get) => ({
  // 1. State
  isLoading: false, 
  error: null,
  featuredProperties: fallbackDummyData, // Start with dummy data initially
  likedPropertyIds: [], // Stores IDs of properties the user has liked

  // 2. Actions
  setLoading: (status) => set({ isLoading: status }),
  setFeaturedProperties: (propertiesFromBackend) => set({ featuredProperties: propertiesFromBackend }),

  // 3. Fetch Properties (Feed)
  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.get('/api/properties/feed');
      
      const propertiesArray = response.data?.data?.properties || [];
      
      if (response.data.success && propertiesArray.length > 0) {
        const formattedProperties = propertiesArray.map(prop => ({
          id: prop._id,
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
            area: prop.residentialDetails?.carpetArea ? `${prop.residentialDetails.carpetArea} sqft` : 'N/A' 
          },
          image: prop.images && prop.images.length > 0 
            ? prop.images[0] 
            : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800"
        }));

        set({ featuredProperties: formattedProperties, isLoading: false });
      } else {
        console.warn("No properties found in database, using fallback data.");
        set({ featuredProperties: fallbackDummyData, isLoading: false });
      }
    } catch (error) {
      console.error("Backend fetch failed, loading dummy data:", error.message);
      set({ featuredProperties: fallbackDummyData, isLoading: false, error: error.message });
    }
  },

  // 4. Fetch the User's Favorites
  fetchFavorites: async () => {
    try {
      const response = await apiClient.get('/api/favorites');
      if (response.data && response.data.favorites) {
        // Extract just the property IDs from the backend response
        const ids = response.data.favorites.map(fav => fav.propertyId?._id || fav.propertyId);
        set({ likedPropertyIds: ids });
      }
    } catch (error) {
      console.error("Failed to fetch favorites", error);
    }
  },

  // 5. Toggle Favorite (Optimistic UI Update)
  toggleFavorite: async (propertyId) => {
    // Read the current state
    const { likedPropertyIds } = get();
    const isLiked = likedPropertyIds.includes(propertyId);

    // Optimistic Update: Instantly update the UI before the API finishes!
    if (isLiked) {
      set({ likedPropertyIds: likedPropertyIds.filter(id => id !== propertyId) });
    } else {
      set({ likedPropertyIds: [...likedPropertyIds, propertyId] });
    }

    // Silently ping the backend
    try {
      if (isLiked) {
        await apiClient.delete(`/api/favorites/${propertyId}`);
      } else {
        await apiClient.post(`/api/favorites/${propertyId}`);
      }
    } catch (error) {
      // If the backend request fails, rollback the UI to its previous state
      console.error("Failed to update favorite", error);
      set({ likedPropertyIds }); 
    }
  }
}));

export default usePropertyStore;