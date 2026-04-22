import { create } from 'zustand';
import { apiClient } from './useAuthStore';

const fallbackDummyData = [
  { id: 1, title: "Shivneri Heights", location: "CIDCO N-7, Sambhajinagar", price: "35,00,000", tags: ["SALE", "LAND"], specs: { bed: 2, bath: 2, area: "78.5 m²" }, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800" },
  { id: 2, title: "Gajanan Residency", location: "Aurangpura, Sambhajinagar", price: "45,00,000", tags: ["RENT", "HOUSE"], specs: { bed: 4, bath: 2, area: "120 m²" }, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800" },
];

const formatProperty = (prop) => {
  const city = prop.location?.city || '';
  const address = prop.location?.address || prop.location?.locality || '';
  const locationStr = [address, city].filter(Boolean).join(', ');

  const priceValue = prop.price?.value ?? prop.price?.amount ?? prop.price;
  const priceStr = priceValue ? Number(priceValue).toLocaleString('en-IN') : 'Price on Request';

  const rd = prop.residentialDetails || {};
  const pd = prop.plotDetails || {};

  return {
    id: String(prop._id),
    _id: String(prop._id),
    title: prop.title || `${prop.propertyType} for ${prop.transactionType}`,
    location: locationStr,
    price: priceStr,
    image: prop.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800",
    tags: [prop.transactionType, prop.propertyType].filter(Boolean),
    specs: {
      bed: rd.bedrooms ?? rd.bhk ?? null,
      bath: rd.bathrooms ?? null,
      area: rd.builtUpArea || rd.carpetArea || pd.plotArea || null,
    },
    featuredRank: prop.featuredRank ?? 0,
  };
};

const usePropertyStore = create((set, get) => ({

  isLoading: false,
  error: null,

  featuredProperties: fallbackDummyData,
  pagination: { currentPage: 1, totalPages: 1, totalProperties: 0 },

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

      // Text / category filters
      if (filters.search)           queryParams.append('search',           filters.search);
      if (filters.city)             queryParams.append('city',             filters.city);
      if (filters.propertyType)     queryParams.append('propertyType',     filters.propertyType);
      if (filters.transactionType)  queryParams.append('transactionType',  filters.transactionType);

      // Price range — both supported now
      if (filters.minPrice != null && filters.minPrice !== '')
        queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice != null && filters.maxPrice !== '')
        queryParams.append('maxPrice', filters.maxPrice);

      // Bedrooms
      if (filters.bedrooms != null && filters.bedrooms !== '')
        queryParams.append('bedrooms', filters.bedrooms);

      // Status (default to Available if not specified)
      queryParams.append('status', filters.status || 'Available');

      // Pagination
      if (filters.page)  queryParams.append('page',  filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      // Geo search
      if (filters.lat && filters.lng && filters.radius) {
        queryParams.append('lat',    filters.lat);
        queryParams.append('lng',    filters.lng);
        queryParams.append('radius', filters.radius);
      }

      const response = await apiClient.get(`/api/properties/feed?${queryParams.toString()}`);

      const propertiesArray = Array.isArray(response.data?.data?.properties)
        ? response.data.data.properties
        : Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data?.properties)
        ? response.data.properties
        : [];

      const paginationData = response.data?.data;

      if (response.data.success) {
        set({
          featuredProperties: propertiesArray.map(formatProperty),
          pagination: {
            currentPage:      paginationData?.currentPage      ?? 1,
            totalPages:       paginationData?.totalPages       ?? 1,
            totalProperties:  paginationData?.totalProperties  ?? propertiesArray.length,
          },
          isLoading: false,
        });
      } else {
        set({ featuredProperties: [], isLoading: false });
      }

    } catch (error) {
      set({
        featuredProperties: fallbackDummyData,
        isLoading: false,
        error: error.message,
      });
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.get('/api/favorites');
      if (response.data?.favorites) {
        const favorites = response.data.favorites;
        const ids = favorites.map(fav => String(fav.propertyId?._id || fav.propertyId));
        const propertiesData = favorites
          .filter(fav => fav.propertyId && typeof fav.propertyId === 'object')
          .map(fav => formatProperty(fav.propertyId));
        set({ likedPropertyIds: ids, likedPropertiesData: propertiesData, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (propertyId) => {
    const id = String(propertyId);
    const { likedPropertyIds, likedPropertiesData, featuredProperties } = get();
    const isLiked = likedPropertyIds.includes(id);

    if (isLiked) {
      set({
        likedPropertyIds:   likedPropertyIds.filter(existingId => existingId !== id),
        likedPropertiesData: likedPropertiesData.filter(p => p.id !== id),
      });
    } else {
      const propertyData = featuredProperties.find(p => p.id === id);
      set({
        likedPropertyIds:   [...likedPropertyIds, id],
        likedPropertiesData: propertyData ? [...likedPropertiesData, propertyData] : likedPropertiesData,
      });
    }

    try {
      if (isLiked) {
        await apiClient.delete(`/api/favorites/${id}`);
      } else {
        await apiClient.post(`/api/favorites/${id}`);
      }
    } catch {
      set({ likedPropertyIds, likedPropertiesData });
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
          images: prop.images || [],
        }));
        set({ myListings: formatted });
      }
    } catch (err) {
      console.error("Failed to fetch my listings");
    }
  },
}));

export default usePropertyStore;