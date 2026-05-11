import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { MOCK_CARS } from '../constants';
import { CarCard } from '../components/CarCard';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-primary-navy text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
                THE FUTURE OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  PREMIUM TRADING
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 max-w-xl">
                Zenith-verified, expert-inspected, and direct from the most exclusive collections in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/inventory" className="btn-primary bg-white text-primary-navy hover:bg-slate-100">
                  Browse Inventory <ArrowRight size={20} />
                </Link>
                <Link to="/sell" className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10">
                  Sell Your Vehicle
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Value Traded', val: '$1.2B+' },
                { label: 'Active Listings', val: '450+' },
                { label: 'Verified Sellers', val: '2.8k' },
                { label: 'Avg Sale Time', val: '12 Days' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-primary-navy mb-2 uppercase tracking-tight">Featured In Stock</h2>
              <p className="text-secondary-slate">Hand-picked premium selections from our partners.</p>
            </div>
            <Link to="/inventory" className="hidden sm:flex items-center gap-2 text-sm font-bold text-accent-blue hover:underline">
              View All Inventory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_CARS.slice(0, 3).map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-extrabold text-primary-navy mb-4 uppercase italic tracking-tighter">THE ZENITH STANDARD</h2>
          <p className="text-secondary-slate max-w-2xl mx-auto">We've redefined the car buying experience through rigorous verification and superior technology.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: 'Professional Verification',
                desc: 'Every listing undergoes a 125-point inspection and VIN verification before going live.'
              },
              {
                icon: Zap,
                title: 'Instant Communications',
                desc: 'Chat directly with owners through our secure, encrypted messaging platform.'
              },
              {
                icon: Globe,
                title: 'National Concierge',
                desc: 'From paperwork to white-glove delivery, we handle the logistics across all 50 states.'
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl text-primary-navy mb-6 shadow-sm border border-surface-border">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-secondary-slate leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
