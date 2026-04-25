import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize, Heart } from 'lucide-react';
import usePropertyStore from '../store/usePropertyStore';

const PropertyListPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const mode = searchParams.get('mode');
    const searchQuery = searchParams.get('search');
    const propertyType = searchParams.get('propertyType');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');
    const transactionType = searchParams.get('transactionType'); // 👈 Captures 'Rent' or 'Sale' from URL

    const {
        featuredProperties,
        likedPropertiesData,
        likedPropertyIds,
        isLoading,
        fetchProperties,
        fetchFavorites,
        toggleFavorite
    } = usePropertyStore();

    useEffect(() => {
        if (mode === 'liked') {
            fetchFavorites();
        } else {
            fetchProperties({ 
                search: searchQuery, 
                propertyType: propertyType, 
                transactionType: transactionType, // 👈 Passes Rent/Sale to your backend
                maxPrice: maxPrice, 
                status: status 
            });
        }
    }, [mode, searchQuery, propertyType, transactionType, maxPrice, status]);

    const displayData = mode === 'liked' ? likedPropertiesData : featuredProperties;

    let pageTitle = "Search Results";
    if (mode === 'liked') pageTitle = "Your Saved Properties";
    if (searchQuery) pageTitle = `Results for "${searchQuery}"`;
    if (propertyType) pageTitle = `${propertyType} Properties`;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">

                <div className="mb-8 border-b border-slate-200 pb-4">
                    <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
                    <p className="text-slate-500 mt-2">
                        {isLoading ? 'Loading properties...' : `Found ${displayData.length} properties`}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20 text-slate-500 font-bold">Loading...</div>
                ) : displayData.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-bold text-slate-700">No properties found.</h2>
                        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayData.map((item) => {
                            const isLiked = likedPropertyIds.includes(item.id);
                            
                            // 👈 Checks if it's a rental
                            const isRent = item.tags?.includes('Rent') || item.tags?.includes('RENT');

                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => navigate(`/property/${item.id}`)}
                                    className="cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group transition-all duration-300 hover:shadow-xl"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="bg-white/20 backdrop-blur-lg text-white text-[10px] px-3 py-1 rounded-full border border-white/30 font-bold tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        {/* 👈 e.stopPropagation prevents routing when clicking heart */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(item.id);
                                            }} 
                                            className={`absolute top-4 right-4 p-2 backdrop-blur-lg rounded-full border transition ${isLiked ? 'bg-red-50/90 border-red-200 text-red-500' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                                        >
                                            <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
                                        </button>
                                        
                                        {/* Replaced <Link> with a normal div to prevent nested anchor errors */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px] pointer-events-none">
                                            <div className="bg-blue-950 text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                View Property
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            {/* 👈 Updated Price display for rentals */}
                                            <span className="font-extrabold text-slate-900 text-lg flex items-end gap-1">
                                                ₹ {item.price}
                                                {isRent && item.price !== 'Price on Request' && (
                                                    <span className="text-xs font-semibold text-slate-500 mb-1">/ month</span>
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-1 truncate">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mb-6 truncate">{item.location}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-slate-600"><Bed size={16} className="text-blue-950/70" /> <span className="text-xs font-bold">{item.specs.bed}</span></div>
                                            <div className="flex items-center gap-2 text-slate-600"><Bath size={16} className="text-blue-950/70" /> <span className="text-xs font-bold">{item.specs.bath}</span></div>
                                            <div className="flex items-center gap-2 text-slate-600"><Maximize size={16} className="text-blue-950/70" /> <span className="text-xs font-bold">{item.specs.area}</span></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyListPage;