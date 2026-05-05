import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, X, ArrowLeft } from 'lucide-react';
import { apiClient } from '../store/useAuthStore';
import usePropertyStore from '../store/usePropertyStore';

import SingleUnitDisplay from './SingleUnitDisplay';
import ProjectDisplay from './ProjectDisplay';

const PropertyDisplayPage = ({ propertyId, adminMode, onAdminClose, adminActions, refreshKey }) => {
  const { id: paramId }  = useParams();
  const navigate         = useNavigate();
  const fetchFavorites   = usePropertyStore((s) => s.fetchFavorites);

  const id = propertyId || paramId;

  const [property,  setProperty]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get(`/api/properties/${id}`);
        if (res.data.success) setProperty(res.data.data);
        else setError('Property not found.');
      } catch { 
        setError('Failed to load property.'); 
      } finally { 
        setLoading(false); 
      }
    };
    if (id) load();
    if (!adminMode) fetchFavorites();
  }, [id, refreshKey, adminMode, fetchFavorites]);

  if (loading) return (
    <div className={`${adminMode ? 'h-full' : 'min-h-screen'} flex items-center justify-center bg-slate-50`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-[#001A33]" strokeWidth={2} />
        <p className="text-sm text-slate-400">Loading property details…</p>
      </div>
    </div>
  );

  if (error || !property) return (
    <div className={`${adminMode ? 'h-full' : 'min-h-screen'} flex items-center justify-center bg-slate-50`}>
      <div className="text-center">
        <p className="text-red-500 font-semibold mb-3">{error || 'Property not found'}</p>
        <button onClick={() => adminMode ? onAdminClose() : navigate(-1)} className="text-sm text-[#001A33] underline">Go back</button>
      </div>
    </div>
  );

  // ─── ROUTING LOGIC ───
  const commonProps = {
    property,
    adminMode,
    onAdminClose,
    adminActions
  };

  if (property.listingCategory === 'Project') {
    return <ProjectDisplay {...commonProps} />;
  }

  return <SingleUnitDisplay {...commonProps} />;
};

export default PropertyDisplayPage;