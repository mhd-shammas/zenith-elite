import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  DollarSign, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info,
  X,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

import { SellAIAssistant } from '../components/SellAIAssistant';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Map component for selecting location
const LocationSelector = ({ 
  latitude, 
  longitude, 
  onLocationSelect 
}: { 
  latitude?: number; 
  longitude?: number; 
  onLocationSelect: (lat: number, lng: number, address: string) => void 
}) => {
  const map = useMap();
  const geocodingLib = useMapsLibrary('geocoding');
  const [markerPos, setMarkerPos] = React.useState<{ lat: number, lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng || !geocodingLib) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });

    const geocoder = new geocodingLib.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        onLocationSelect(lat, lng, response.results[0].formatted_address);
      } else {
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-surface-border mt-4 relative">
      <Map
        defaultCenter={markerPos || { lat: 37.7749, lng: -122.4194 }}
        defaultZoom={12}
        mapId="CAR_LOCATION_PICKER"
        onClick={handleMapClick}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full"
      >
        {markerPos && (
          <AdvancedMarker position={markerPos}>
            <Pin background="#0F172A" borderColor="#fff" glyphColor="#fff" />
          </AdvancedMarker>
        )}
      </Map>
      <div className="absolute top-4 left-4 right-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-surface-border shadow-sm inline-flex items-center gap-2">
          <MapPin size={14} className="text-primary-navy" />
          <span className="text-[10px] font-bold text-primary-navy uppercase tracking-widest whitespace-nowrap">
            Click on the map to pinpoint location
          </span>
        </div>
      </div>
    </div>
  );
};

export const SellCar = () => {
  const [step, setStep] = React.useState(1);
  const [images, setImages] = React.useState<string[]>([]);
  const [vehicleType, setVehicleType] = React.useState<string>('Sedan');
  const [formData, setFormData] = React.useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    location: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    transmission: 'Automatic',
    fuelType: 'Gas',
    managed: false
  });

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface-bg p-8 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-surface-border shadow-xl">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} />
          </div>
          <h2 className="text-2xl font-black text-primary-navy uppercase italic tracking-tighter mb-4">Google Maps Key Required</h2>
          <p className="text-sm text-secondary-slate mb-6">To enable precise location pinpointing, please add your Google Maps API key.</p>
          
          <div className="text-left space-y-4 mb-8">
            <p className="text-xs font-bold text-primary-navy uppercase tracking-widest">Setup Instructions:</p>
            <ul className="text-[11px] text-secondary-slate space-y-2 list-decimal ml-4">
              <li>Get an API key from the <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener" className="text-accent-blue hover:underline">Google Cloud Console</a>.</li>
              <li>Wait for the <strong>"Enter your environment variable"</strong> popup in this app.</li>
              <li>Paste your key as <code>GOOGLE_MAPS_PLATFORM_KEY</code>.</li>
              <li>Alternatively, go to <strong>Settings</strong> (⚙️) → <strong>Secrets</strong> to add it manually.</li>
            </ul>
          </div>
          <p className="text-[10px] text-secondary-slate italic">The app builds automatically - no page reload needed.</p>
        </div>
      </div>
    );
  }

  const handleAIFill = (data: Partial<typeof formData & { vehicleType: string }>) => {
    setFormData(prev => ({
      ...prev,
      vin: data.vin || prev.vin,
      make: data.make || prev.make,
      model: data.model || prev.model,
      year: data.year || prev.year,
      mileage: data.mileage || prev.mileage,
      price: data.price || prev.price,
      location: data.location || prev.location,
      latitude: data.latitude || prev.latitude,
      longitude: data.longitude || prev.longitude,
      transmission: data.transmission || prev.transmission,
      fuelType: data.fuelType || prev.fuelType,
    }));
    if (data.vehicleType) {
      setVehicleType(data.vehicleType);
    }
  };
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const vehicleTypes = ['Sedan', 'SUV', 'Coupe', 'Truck', 'Lux'];
  const transmissionTypes = ['Automatic', 'Manual'];
  const fuelTypes = ['Gas', 'Electric', 'Hybrid'];

  // Load draft on mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('zenith_car_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed.formData || formData);
        setVehicleType(parsed.vehicleType || 'Sedan');
        setStep(parsed.step || 1);
        setLastSaved(new Date(parsed.timestamp));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  const saveDraft = () => {
    setIsSaving(true);
    const draft = {
      formData,
      vehicleType,
      step,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('zenith_car_draft', JSON.stringify(draft));
    
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 600);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file as File));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      // Clean up the URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index]);
      return newImages.filter((_, i) => i !== index);
    });
  };

  const steps = [
    { id: 1, title: 'Vehicle Info', icon: Info },
    { id: 2, title: 'Visuals', icon: ImageIcon },
    { id: 3, title: 'Pricing', icon: DollarSign },
  ];

  const stepVariants = {
    initial: { opacity: 0, x: 20, y: 10 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -20, y: -10 },
  };

  const stepTransition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div className="bg-surface-bg min-h-screen pt-12 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary-navy uppercase tracking-tight mb-4">
            List Your Vehicle
          </h1>
          <p className="text-secondary-slate">
            Our white-glove onboarding process ensures your car gets the attention it deserves.
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-border -translate-y-1/2 z-0" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                step >= s.id 
                  ? "bg-primary-navy border-primary-navy text-white shadow-md" 
                  : "bg-white border-surface-border text-secondary-slate"
              )}>
                <s.icon size={18} />
              </div>
              <p className={cn(
                "text-[10px] font-bold uppercase mt-2 tracking-widest transition-colors duration-500",
                step >= s.id ? "text-primary-navy" : "text-secondary-slate"
              )}>
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-surface-border shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                className="p-8 md:p-12 space-y-8"
              >
                <div className="flex items-center justify-between col-span-2 mb-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 rounded-lg text-accent-blue border border-accent-blue/20">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Magic Assist Active</span>
                  </div>
                  <p className="text-[10px] text-secondary-slate font-medium">Use the assistant below to auto-fill this form.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-2">VIN Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="vin"
                        value={formData.vin}
                        onChange={handleInputChange}
                        placeholder="Enter 17-digit VIN..." 
                        className="input-field pr-12"
                      />
                      <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                    </div>
                    <p className="mt-2 text-[10px] text-secondary-slate font-medium">Automatic verification via Zenith Security.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-2">Make</label>
                    <input 
                      type="text" 
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      placeholder="e.g. Porsche" 
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-2">Model</label>
                    <input 
                      type="text" 
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="e.g. 911 GT3" 
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-2">Year</label>
                    <input 
                      type="number" 
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="2024" 
                      className="input-field" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-2">Mileage</label>
                    <input 
                      type="number" 
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="0" 
                      className="input-field" 
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-2">Vehicle Location</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Beverly Hills, CA or Select on Map" 
                        className="input-field pl-12" 
                      />
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-navy/40" size={18} />
                    </div>
                    
                    <APIProvider apiKey={API_KEY} version="weekly">
                      <LocationSelector 
                        latitude={formData.latitude}
                        longitude={formData.longitude}
                        onLocationSelect={(lat, lng, address) => {
                          setFormData(prev => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng,
                            location: address
                          }));
                        }}
                      />
                    </APIProvider>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-4">Vehicle Type</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {vehicleTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVehicleType(type)}
                          className={cn(
                            "py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2",
                            vehicleType === type 
                              ? "bg-primary-navy border-primary-navy text-white shadow-lg scale-105" 
                              : "bg-white border-surface-border text-secondary-slate hover:border-primary-navy/30"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-4">Transmission</label>
                      <div className="flex gap-3">
                        {transmissionTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, transmission: type }))}
                            className={cn(
                              "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2",
                              formData.transmission === type 
                                ? "bg-primary-navy border-primary-navy text-white shadow-lg" 
                                : "bg-white border-surface-border text-secondary-slate hover:border-primary-navy/30"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-4">Fuel Type</label>
                      <div className="flex gap-3">
                        {fuelTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, fuelType: type }))}
                            className={cn(
                              "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border-2",
                              formData.fuelType === type 
                                ? "bg-primary-navy border-primary-navy text-white shadow-lg" 
                                : "bg-white border-surface-border text-secondary-slate hover:border-primary-navy/30"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                className="p-8 md:p-12 space-y-8"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-100 rounded-3xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <div className="w-20 h-20 bg-primary-navy/5 flex items-center justify-center rounded-2xl mx-auto mb-6 text-primary-navy transition-transform group-hover:scale-110">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary-navy mb-2">High-Resolution Upload</h3>
                  <p className="text-secondary-slate text-sm max-w-xs mx-auto mb-8">
                    Please provide at least 10 clear photos including exterior, interior, and engine bay.
                  </p>
                  <button className="btn-secondary mx-auto">Browse Files</button>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={img} 
                        className="relative aspect-square rounded-xl overflow-hidden border border-surface-border group"
                      >
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={stepTransition}
                className="p-8 md:p-12 space-y-12"
              >
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary-navy mb-4">Asking Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-navy" size={32} />
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00" 
                      className="w-full pl-16 pr-8 py-8 bg-slate-50 border-none rounded-3xl text-4xl font-black focus:ring-4 focus:ring-primary-navy/10 outline-none"
                    />
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl flex gap-3 text-emerald-800">
                    <Zap size={20} className="shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">
                      Based on current market trends, we suggest a listing price between <span className="font-bold">$125,000 - $138,000</span> for this model.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border border-surface-border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      name="managed"
                      checked={formData.managed}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-surface-border text-primary-navy focus:ring-primary-navy" 
                    />
                    <p className="text-xs font-bold text-primary-navy">List as Zenith Managed (Premium Placement)</p>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-surface-border flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => step > 1 && setStep(step - 1)}
                className={cn(
                  "btn-ghost font-bold opacity-50 hover:opacity-100",
                  step === 1 && "invisible"
                )}
              >
                Previous
              </button>
              
              <div className="h-6 w-px bg-surface-border hidden sm:block" />

              <button 
                onClick={saveDraft}
                disabled={isSaving}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary-navy hover:text-accent-blue transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Zap size={14} className="text-accent-blue" />
                  </motion.div>
                ) : (
                  <FileText size={14} />
                )}
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              {lastSaved && !isSaving && (
                <span className="text-[10px] font-bold text-secondary-slate uppercase tracking-tighter">
                  Last saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button 
                onClick={() => step < 3 ? setStep(step + 1) : null}
                className="btn-primary"
              >
                {step === 3 ? 'Publish Listing' : 'Continue'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale">
          <div className="flex items-center gap-2">
             <ShieldCheck size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">TLS Secure</span>
          </div>
          <div className="flex items-center gap-2">
             <FileText size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Listing Agreement</span>
          </div>
        </div>
      </div>
      <SellAIAssistant onFill={handleAIFill} />
    </div>
  );
};
