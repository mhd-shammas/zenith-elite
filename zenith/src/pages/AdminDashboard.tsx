import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Filter, 
  Search,
  MoreVertical,
  ChevronDown,
  Activity,
  Users,
  Car as CarIcon,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ListingRequest, Car } from '../types';

// Mock data for admin
const MOCK_REQUESTS: (ListingRequest & { carTitle: string; sellerEmail: string })[] = [
  {
    id: 'req1',
    carId: 'c1',
    sellerId: 'u2',
    status: 'Pending',
    timestamp: '2024-05-10T14:30:00Z',
    type: 'Sell',
    carTitle: 'Porsche 911 Carrera S',
    sellerEmail: 'julian@rossi.com'
  },
  {
    id: 'req2',
    carId: 'c2',
    sellerId: 'u3',
    status: 'Pending',
    timestamp: '2024-05-10T15:45:00Z',
    type: 'Sell',
    carTitle: 'Tesla Model S Plaid',
    sellerEmail: 'sarah@miller.com'
  },
  {
    id: 'req3',
    carId: '-',
    sellerId: 'u4',
    status: 'Pending',
    timestamp: '2024-05-10T16:20:00Z',
    type: 'VerifyAccount',
    carTitle: 'Account Verification',
    sellerEmail: 'david@elite.com'
  }
];

export const AdminDashboard = () => {
  const [requests, setRequests] = React.useState(MOCK_REQUESTS);
  const [filter, setFilter] = React.useState<'All' | 'Sell' | 'VerifyAccount'>('All');
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  const filteredRequests = requests.filter(r => filter === 'All' || r.type === filter);

  const handleAction = async (id: string, action: 'Approved' | 'Rejected', type: 'Sell' | 'VerifyAccount') => {
    setProcessingId(id);
    
    // Simulate API delay for security verification
    await new Promise(resolve => setTimeout(resolve, 800));

    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    
    if (action === 'Approved' && type === 'VerifyAccount') {
      console.log("User Account #ZNTH-VERIFIED-SYNC: Identity status updated to ACTIVE.");
    }
    
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary-navy p-1.5 rounded-lg text-white">
                <Shield size={20} />
              </div>
              <span className="font-black italic uppercase tracking-tighter text-lg">ZENITH <span className="text-secondary-slate not-italic font-medium text-xs ml-1 uppercase tracking-[0.2em]">HQ / 71-04</span></span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <nav className="flex items-center gap-4">
              <button className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Dashboard</button>
              <button className="text-xs font-bold uppercase tracking-widest text-secondary-slate hover:text-[#1A1A1A] transition-colors">Audit Logs</button>
              <button className="text-xs font-bold uppercase tracking-widest text-secondary-slate hover:text-[#1A1A1A] transition-colors">Settings</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-[#1A1A1A]">System Administrator</p>
              <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-widest">Active Connection</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Admin" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8 lg:p-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Pending Approvals', val: '12', icon: Clock, color: 'text-amber-500' },
            { label: 'Active Sellers', val: '1,284', icon: Users, color: 'text-blue-500' },
            { label: 'Inventory Value', val: '$840M', icon: Activity, color: 'text-emerald-500' },
            { label: 'System Alerts', val: '0', icon: AlertCircle, color: 'text-secondary-slate' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-secondary-slate tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-[#1A1A1A]">{stat.val}</p>
              </div>
              <div className={cn("p-3 rounded-xl bg-slate-50", stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Workspace */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight mb-1 text-primary-navy">Requests Queue</h2>
              <p className="text-xs font-medium text-secondary-slate uppercase tracking-widest">Awaiting Security & Verification Checksum</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter by ID, Email, Type..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-navy transition-all"
                />
              </div>
              <div className="flex p-0.5 bg-white border border-slate-200 rounded-xl">
                 {(['All', 'Sell', 'VerifyAccount'] as const).map((t) => (
                   <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all",
                      filter === t ? "bg-primary-navy text-white shadow-sm" : "text-secondary-slate hover:bg-slate-100"
                    )}
                   >
                     {t === 'VerifyAccount' ? 'Account' : t}
                   </button>
                 ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/20 text-[10px] font-black uppercase tracking-[0.2em] text-secondary-slate">
                  <th className="px-8 py-5">Entry ID</th>
                  <th className="px-8 py-5">Request Type</th>
                  <th className="px-8 py-5">Relational Anchor</th>
                  <th className="px-8 py-5">Author / Email</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right font-serif italic normal-case tracking-normal">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <AnimatePresence>
                  {filteredRequests.map((req, i) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={req.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6 font-mono text-[11px] text-primary-navy font-bold">#{req.id.toUpperCase()}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                          req.type === 'Sell' ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                        )}>
                          {req.type === 'Sell' ? 'Market listing' : 'Verification'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <CarIcon size={14} className="text-secondary-slate" />
                          <span className="font-bold text-[#1A1A1A]">{req.carTitle}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-secondary-slate font-medium">{req.sellerEmail}</td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={cn(
                            "badge",
                            req.status === 'Pending' ? 'badge-pending' : req.status === 'Approved' ? 'badge-verified' : 'badge-rejected'
                          )}>
                            {req.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          {req.status === 'Pending' ? (
                            <>
                              <button 
                                onClick={() => handleAction(req.id, 'Approved', req.type)}
                                disabled={processingId === req.id}
                                className={cn(
                                  "w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50",
                                  processingId === req.id && "animate-pulse"
                                )}
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleAction(req.id, 'Rejected', req.type)}
                                disabled={processingId === req.id}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <button className="text-secondary-slate hover:text-primary-navy p-2 group-hover:scale-110 transition-transform">
                              <ExternalLink size={18} />
                            </button>
                          )}
                          <button className="text-slate-300 hover:text-slate-600 p-2">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Filter size={32} />
              </div>
              <h3 className="text-lg font-black text-primary-navy uppercase italic tracking-tight">Queue Depleted</h3>
              <p className="text-secondary-slate text-xs font-medium uppercase tracking-widest mt-2">All security checks complete for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
