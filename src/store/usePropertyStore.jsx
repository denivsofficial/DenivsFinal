import { create } from 'zustand';

const usePropertyStore = create((set) => ({

    // 1. Loading State
  isLoading: false, // Set to true if you want to test the skeleton locally
  
  // 2. Initial Data
  featuredProperties: 
  [
    
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
  ],

  // 3. Actions
  setLoading: (status) => set({ isLoading: status }),
  setFeaturedProperties: (propertiesFromBackend) => 
    set({ featuredProperties: propertiesFromBackend }),






}));

export default usePropertyStore;