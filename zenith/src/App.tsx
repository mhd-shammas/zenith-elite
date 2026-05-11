import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { CarDetail } from './pages/CarDetail';
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';
import { SellCar } from './pages/SellCar';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { useLocation } from 'react-router-dom';
import { ChatBot } from './components/ChatBot';

const Footer = () => (
  <footer className="bg-primary-navy text-white pt-20 pb-10 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <h3 className="text-2xl font-black italic tracking-tighter italic">ZENITH</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            The world's most prestigious luxury vehicle marketplace. Featuring end-to-end encrypted transactions.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-300">Platforms</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">How it works</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Seller Portal</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-300">Support</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Expert</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-300">Connect</h4>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
              <div className="w-5 h-5 bg-slate-400 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
        <p>© 2024 ZENITH INT. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-slate-300">PRIVACY POLICY</a>
          <a href="#" className="hover:text-slate-300">TERMS OF SERVICE</a>
        </div>
      </div>
    </div>
  </footer>
);

function AppContent() {
  const location = useLocation();
  const isSpecialPage = ['/login', '/admin'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!isSpecialPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/sell" element={<SellCar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <ChatBot />
      {!isSpecialPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

