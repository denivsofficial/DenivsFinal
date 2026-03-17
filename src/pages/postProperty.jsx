import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building, Home, MapPin, Briefcase, Store, UploadCloud, ChevronLeft, ChevronRight, CheckCircle2, X } from 'lucide-react';

// --- 1. THE ZOD VALIDATION SCHEMA ---
const propertySchema = z.object({
  propertyType: z.string().min(1, "Please select a property type"),
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
  project: z.string().optional(),
  bedrooms: z.string().min(1, "Please select bedrooms"),
  carpetArea: z.string().min(1, "Carpet area is required").regex(/^\d+$/, "Please enter numbers only (e.g., 850)"),
  floor: z.string().min(1, "Floor number is required"),
  price: z.string().min(1, "Price is required"),
});

const PostProperty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [previewImages, setPreviewImages] = useState([]);
  const totalSteps = 4;

  // --- IMAGE UPLOAD HANDLERS ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPreviewImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (indexToRemove) => {
    setPreviewImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- REACT HOOK FORM SETUP ---
  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: { propertyType: '' }
  });

  const selectedType = watch('propertyType');

  // --- STEP NAVIGATION & VALIDATION ---
  const handleNext = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['propertyType'];
    if (step === 2) fieldsToValidate = ['city', 'locality'];
    if (step === 3) fieldsToValidate = ['bedrooms', 'carpetArea', 'floor'];
    if (step === 4) fieldsToValidate = ['price'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = (data) => {
    // We will attach the previewImages to the backend request later
    console.log("Form Data Ready for Backend:", data);
    console.log("Images to upload:", previewImages);
    setStep(5); 
  };

  // --- UI RENDERER ---
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 min-h-[600px] flex flex-col mt-4">
        
        {/* Header */}
        {step < 5 && (
          <div className="border-b border-slate-100 p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <div className='bg-[#001A33] p-1 rounded-md'>
                    <div className='w-4 h-4 border-2 border-white rounded-sm'></div>
                </div>
                <span className='font-bold text-lg tracking-tight text-[#001A33]'>DENIVS</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 text-left">Step {step} of {totalSteps}</p>
          </div>
        )}

        {/* Dynamic Body */}
        <div className="p-6 flex-grow flex flex-col">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-center mb-2">Post Your Property</h2>
              <p className="text-sm text-slate-500 text-center mb-6">What type of property are you selling?</p>
              <div className="space-y-3">
                {[
                  { id: 'apartment', label: 'Apartment', icon: Building },
                  { id: 'house', label: 'House', icon: Home },
                  { id: 'land', label: 'Land / Plot', icon: MapPin },
                  { id: 'office', label: 'Office', icon: Briefcase },
                  { id: 'shop', label: 'Shop', icon: Store },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setValue('propertyType', type.id, { shouldValidate: true })}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedType === type.id ? 'border-[#001A33] bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <type.icon className={selectedType === type.id ? 'text-[#001A33]' : 'text-slate-500'} />
                    <span className="font-semibold text-slate-700">{type.label}</span>
                  </button>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-500 text-xs mt-2 text-center">{errors.propertyType.message}</p>}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h2 className="text-xl font-bold mb-6">Where is the property located?</h2>
              <div>
                <label className="text-sm font-semibold text-slate-600">City</label>
                <select {...register('city')} className="w-full mt-1 h-11 border border-slate-300 rounded-lg px-3 bg-white focus:ring-2 focus:ring-[#001A33] focus:outline-none">
                  <option value="">Select City</option>
                  <option value="Pune">Pune</option>
                  <option value="Chh. Sambhajinagar">Chh. Sambhajinagar</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">Locality / Area</label>
                <input {...register('locality')} placeholder="e.g. Cidco N-4" className="w-full mt-1 h-11 border border-slate-300 rounded-lg px-3 focus:ring-2 focus:ring-[#001A33] focus:outline-none" />
                {errors.locality && <p className="text-red-500 text-xs mt-1">{errors.locality.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600">Project / Building (optional)</label>
                <input {...register('project')} placeholder="Enter Project Name" className="w-full mt-1 h-11 border border-slate-300 rounded-lg px-3 focus:ring-2 focus:ring-[#001A33] focus:outline-none" />
              </div>
            </div>
          )}

         {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h2 className="text-xl font-bold mb-6">Tell us about the property</h2>
              
              <div>
                <label className="text-sm font-semibold text-slate-600">Bedrooms</label>
                <select {...register('bedrooms')} className="w-full mt-1 h-11 border border-slate-300 rounded-lg px-3 bg-white focus:ring-2 focus:ring-[#001A33] focus:outline-none">
                  <option value="">Select</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4+ BHK">4+ BHK</option>
                </select>
                {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms.message}</p>}
              </div>

              {/* UPDATED: Carpet Area with fixed "sq.ft." on the right */}
              <div>
                <label className="text-sm font-semibold text-slate-600">Carpet Area</label>
                <div className="relative mt-1">
                  <input 
                    type="text" 
                    inputMode="numeric"
                    {...register('carpetArea')} 
                    placeholder="850" 
                    className="w-full h-11 border border-slate-300 rounded-lg pl-3 pr-14 focus:ring-2 focus:ring-[#001A33] focus:outline-none" 
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">sq.ft.</span>
                </div>
                {errors.carpetArea && <p className="text-red-500 text-xs mt-1">{errors.carpetArea.message}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600">Floor Number</label>
                <input type="number" {...register('floor')} placeholder="e.g. 4" className="w-full mt-1 h-11 border border-slate-300 rounded-lg px-3 focus:ring-2 focus:ring-[#001A33] focus:outline-none" />
                {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor.message}</p>}
              </div>
            </div>
          )}
          {/* STEP 4 (Correctly Placed Body) */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h2 className="text-xl font-bold mb-6">Set your price & photos</h2>
              <div>
                <label className="text-sm font-semibold text-slate-600">Expected Price</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-semibold">₹</span>
                  <input type="number" {...register('price')} placeholder="45,00,000" className="w-full h-11 border border-slate-300 rounded-lg pl-8 pr-3 focus:ring-2 focus:ring-[#001A33] focus:outline-none" />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-2">Photos</label>
                <input 
                  type="file" 
                  id="property-images" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="property-images"
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                >
                  <div className="bg-[#001A33] text-white p-2 rounded-full mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="font-bold text-[#001A33]">Upload Photos</p>
                  <p className="text-xs text-slate-500 mt-1">Drag & drop or <span className="underline">Browse files</span></p>
                </label>

                {/* Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-square group">
                        <img src={img.preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center text-center h-full space-y-6 py-8">
              <CheckCircle2 size={64} className="text-green-500" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Submitted!</h2>
                <p className="text-sm text-slate-600 max-w-[250px] mx-auto">
                  Your property has been listed successfully. We will verify and publish it shortly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons (Correctly Restored) */}
        <div className="border-t border-slate-100 p-6">
          {step === 1 && (
             <button onClick={handleNext} className="w-full h-12 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] transition flex justify-center items-center gap-2">
               Continue <ChevronRight size={18} />
             </button>
          )}

          {step > 1 && step < 4 && (
            <div className="flex justify-between gap-4">
              <button onClick={handleBack} className="w-1/3 h-12 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition flex justify-center items-center gap-1">
                <ChevronLeft size={18} /> Back
              </button>
              <button onClick={handleNext} className="w-2/3 h-12 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] transition flex justify-center items-center gap-2">
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 4 && (
             <div className="flex justify-between gap-4">
              <button onClick={handleBack} className="w-1/3 h-12 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition flex justify-center items-center gap-1">
                <ChevronLeft size={18} /> Back
              </button>
              {/* This is the final submit button! */}
              <button onClick={handleSubmit(onSubmit)} className="w-2/3 h-12 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] transition flex justify-center items-center">
                Post Property
              </button>
            </div>
          )}

          {step === 5 && (
             <button onClick={() => navigate('/')} className="w-full h-12 bg-[#001A33] text-white rounded-lg font-bold hover:bg-[#13304c] transition flex justify-center items-center">
               Go to Dashboard
             </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PostProperty;