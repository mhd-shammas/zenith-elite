import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const Login = () => {
  const [role, setRole] = React.useState<'Customer' | 'Admin'>('Customer');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isAdminActive, setIsAdminActive] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const savedUser = localStorage.getItem('zenith_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'Admin') {
          setIsAdminActive(true);
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (e) {
        console.error("Session check failed", e);
      }
    }
  }, [navigate]);

  const handleLoginSuccess = async (user: any, selectedRole: 'Customer' | 'Admin') => {
    // Check if user exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    let userData;
    
    if (!userDoc.exists()) {
      // Create new user profile if it doesn't exist
      userData = {
        id: user.uid,
        name: user.displayName || 'Zenith User',
        email: user.email,
        avatar: user.photoURL || '',
        verified: user.emailVerified || false,
        plan: 'Basic',
        role: selectedRole, // For demo, we let them pick the role on first login
      };
      await setDoc(userDocRef, userData);
    } else {
      userData = userDoc.data();
    }
    
    localStorage.setItem('zenith_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
    navigate(userData.role === 'Admin' ? '/admin' : '/');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleLoginSuccess(result.user, role);
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd use signInWithEmailAndPassword(auth, email, password)
      // For this demo context, we'll simulate a success with mock data if Firebase Auth isn't fully configured
      // but try the real call if desired.
      
      // Since we don't have pre-registered users in auth, we'll stick to a mock success for email
      // but Google Login will be the "real" integration.
      
      const mockUser = {
        id: 'u' + Math.random().toString(36).substr(2, 9),
        name: role === 'Admin' ? 'Admin User' : 'Alexander Sterling',
        email: email || (role === 'Admin' ? 'admin@zenith.com' : 'alex@zenith.com'),
        role: role,
        verified: true,
        plan: 'Diamond'
      };
      
      localStorage.setItem('autovault_user', JSON.stringify(mockUser));
      window.dispatchEvent(new Event('storage'));
      navigate(role === 'Admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-navy flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-transparent to-black/50" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-lg text-primary-navy">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">ZENITH</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            SECURE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">LEGACY.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            The world's most trusted marketplace for high-performance and luxury vehicles.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 grid grid-cols-2 gap-8"
        >
          <div>
            <p className="text-3xl font-black text-white">$1.2B+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Volume</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">4.8M+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified Users</p>
          </div>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-primary-navy mb-3 uppercase tracking-tight italic">Portal Entry</h2>
            <p className="text-secondary-slate">Access your prestige automotive account.</p>
          </div>

          {/* Role Switcher */}
          {!isAdminActive && (
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                onClick={() => setRole('Customer')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  role === 'Customer' ? "bg-white text-primary-navy shadow-sm" : "text-secondary-slate hover:text-primary-navy"
                )}
              >
                <User size={14} />
                Customer
              </button>
              <button 
                onClick={() => setRole('Admin')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  role === 'Admin' ? "bg-white text-primary-navy shadow-sm" : "text-secondary-slate hover:text-primary-navy"
                )}
              >
                <ShieldCheck size={14} />
                Admin
              </button>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                <Shield size={14} />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-secondary-slate ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'Admin' ? 'admin@zenith.com' : 'alex@zenith.com'}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-navy/20 focus:bg-white transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-secondary-slate">Secure Password</label>
                <button type="button" className="text-[10px] font-black uppercase text-accent-blue hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary-navy/20 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-sm font-black italic tracking-tighter disabled:opacity-50"
            >
              {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-secondary-slate font-black tracking-widest text-[9px]">Encryption Bridge</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-primary-navy hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-center text-xs font-bold text-secondary-slate">
            Don't have an account? <button className="text-accent-blue hover:underline uppercase tracking-widest text-[10px]">Initialize Registration</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
