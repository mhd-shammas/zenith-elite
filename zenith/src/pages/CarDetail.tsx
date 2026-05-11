import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MOCK_CARS } from '../constants';
import { 
  ChevronLeft, 
  MapPin, 
  Gauge, 
  Fuel, 
  Settings, 
  ShieldCheck, 
  MessageSquare,
  Share2,
  Heart,
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

export const CarDetail = () => {
  const { id } = useParams();
  const car = MOCK_CARS.find(c => c.id === id);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vehicle not found</h2>
          <Link to="/inventory" className="btn-primary">Return to Inventory</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Condition', value: 'Pre-owned', icon: ShieldCheck },
    { label: 'Transmission', value: car.transmission, icon: Settings },
    { label: 'Fuel Type', value: car.fuelType, icon: Fuel },
    { label: 'Drivetrain', value: 'All-Wheel Drive', icon: Zap },
  ];

  return (
    <div className="bg-surface-bg min-h-screen">
      {/* breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/inventory" className="inline-flex items-center text-sm font-bold text-secondary-slate hover:text-primary-navy transition-colors">
          <ChevronLeft size={16} /> Back to Inventory
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Visuals & Details */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden shadow-xl bg-white border border-surface-border aspect-[16/9]"
            >
              <img 
                src={car.image} 
                alt={car.model} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Mileage', val: `${car.mileage.toLocaleString()} mi`, icon: Gauge },
                { label: 'Location', val: car.location, icon: MapPin },
                { label: 'Year', val: car.year, icon: Calendar },
                { label: 'Status', val: car.status, icon: Info },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-surface-border shadow-sm">
                  <item.icon size={18} className="text-secondary-slate mb-3" />
                  <p className="text-[10px] font-bold text-secondary-slate uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-extrabold text-primary-navy uppercase">{item.val}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm">
              <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Vehicle Description</h3>
              <p className="text-secondary-slate leading-relaxed mb-6">
                {car.description} This {car.year} {car.make} {car.model} is a standout example of engineering excellence. 
                Maintained to the highest standards, it offers a perfect balance of performance and luxury.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-surface-border">
                <div>
                  <h4 className="text-sm font-black uppercase text-primary-navy mb-4 tracking-widest">Key Features</h4>
                  <ul className="space-y-3">
                    {['Premium Package Plus', 'Sport Chrono Package', '21" Exclusive Wheels', 'Full Leather Interior'].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-secondary-slate font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase text-primary-navy mb-4 tracking-widest">Technical details</h4>
                   <div className="space-y-4">
                    {specs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-secondary-slate">{spec.label}</span>
                        <span className="font-bold text-primary-navy">{spec.value}</span>
                      </div>
                    ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Action */}
          <div className="space-y-6">
            <div className="bg-primary-navy p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-black italic italic tracking-tighter uppercase mb-2">
                      {car.make} <br /> {car.model}
                    </h1>
                    <span className="badge border-white/20 text-white/80 bg-white/10 uppercase italic font-bold">
                      {car.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Heart size={18} />
                    </button>
                    <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Vault Price</p>
                  <p className="text-5xl font-black">${car.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-2">Excluding taxes, registration, and shipping.</p>
                </div>

                <div className="space-y-3">
                  <button className="w-full btn-primary bg-white text-primary-navy font-black py-4 hover:bg-slate-100">
                    Acquire Now
                  </button>
                  <button className="w-full btn-secondary bg-transparent border-white/20 text-white hover:bg-white/5 py-4">
                    <MessageSquare size={18} /> Contact Seller
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shrink-0">
                    <img src={MOCK_CARS[0].image} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Listing Agent</p>
                    <p className="font-bold text-sm tracking-tight">{car.sellerName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety/Verification Info */}
            <div className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm">
              <div className="flex gap-4 items-start mb-4">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AutoVault Guaranteed</h4>
                  <p className="text-xs text-secondary-slate leading-relaxed">
                    This vehicle has been verified by our experts. We guarantee the title accuracy and condition report.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-border">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-secondary-slate">VIN</span>
                  <span className="text-primary-navy tracking-widest font-mono">{car.vin || 'WP0AA2A9XPS2'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
