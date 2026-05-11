import React from 'react';
import { motion } from 'motion/react';
import { MOCK_USER, MOCK_CARS } from '../constants';
import { 
  User as UserIcon, 
  Settings, 
  ShieldCheck, 
  CreditCard, 
  Package, 
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Dashboard = () => {
  return (
    <div className="bg-surface-bg min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
              <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-extrabold text-primary-navy tracking-tight">{MOCK_USER.name}</h1>
                <ShieldCheck className="text-emerald-500" size={24} />
              </div>
              <p className="text-secondary-slate font-medium">{MOCK_USER.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="badge badge-verified">{MOCK_USER.plan} MEMBER</span>
                <span className="badge bg-slate-100 text-slate-600 border border-slate-200 uppercase font-black tracking-tighter">EST. 2024</span>
              </div>
            </div>
          </div>
          <button className="btn-secondary w-full md:w-auto">
            <Settings size={18} /> Edit Portfolio
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Active Listings', val: '4', icon: Package, color: 'text-blue-600' },
                { label: 'Total Sales', val: '$12.4M', icon: TrendingUp, color: 'text-emerald-600' },
                { label: 'Member Rating', val: '5.0', icon: ShieldCheck, color: 'text-amber-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-surface-border shadow-sm">
                  <stat.icon className={cn("mb-4", stat.color)} size={24} />
                  <p className="text-xs font-bold text-secondary-slate uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-primary-navy">{stat.val}</p>
                </div>
              ))}
            </div>

            {/* My Listings */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-surface-border flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-primary-navy uppercase tracking-tight">Active Portfolio</h3>
                <button className="text-xs font-bold text-accent-blue hover:underline">Manage All</button>
              </div>
              <div className="divide-y divide-surface-border">
                {MOCK_CARS.slice(0, 2).map((car) => (
                  <div key={car.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-14 rounded-lg overflow-hidden border border-surface-border">
                        <img src={car.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-secondary-slate uppercase">{car.year} {car.make}</p>
                        <p className="font-bold text-primary-navy">{car.model}</p>
                        <p className="text-xs text-secondary-slate mt-1">{car.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary-navy">${car.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50 flex justify-center">
                 <button className="btn-ghost text-xs font-bold uppercase tracking-widest">
                   View Performance Report <ChevronRight size={14} />
                 </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Account Settings */}
            <div className="bg-white p-8 rounded-2xl border border-surface-border shadow-sm">
              <h3 className="font-extrabold text-primary-navy uppercase tracking-tight mb-8">Account Access</h3>
              <div className="space-y-6">
                {[
                  { label: 'Subscription', val: 'Diamond Elite', icon: CreditCard },
                  { label: 'Verification', val: 'KYC Verified', icon: ShieldCheck },
                  { label: 'Support Tier', val: '24/7 Priority', icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="bg-slate-50 p-2 rounded-lg text-primary-navy">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-secondary-slate uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-bold text-primary-navy">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 btn-secondary py-4 text-xs font-black uppercase tracking-widest">
                Upgrade Membership
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-primary-navy p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 opacity-10">
                 <UserIcon size={120} />
               </div>
               <div className="relative z-10">
                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-4">Concierge Desk</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Need help with a high-value acquisition? Your dedicated agent is on standby.</p>
                <div className="flex flex-col gap-2">
                  <button className="btn-primary bg-white text-primary-navy py-3 text-xs">Request Consultant</button>
                  <button className="btn-secondary bg-transparent border-white/20 text-white py-3 text-xs">Knowledge Base <ExternalLink size={14} /> </button>
                </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
