import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<UserType | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadUser = () => {
    const savedUser = localStorage.getItem('zenith_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  React.useEffect(() => {
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('zenith_user');
    setUser(null);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Inventory', path: '/inventory' },
    { name: 'Sell Your Car', path: '/sell' },
    { name: 'Messages', path: '/messages' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-navy p-2 rounded-lg text-white group-hover:rotate-12 transition-transform">
                <Car size={24} />
              </div>
              <span className="text-2xl font-extrabold tracking-tighter text-primary-navy uppercase italic">
                ZENITH
              </span>
            </Link>

            {user?.role === 'Admin' && (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-primary-navy hover:bg-primary-navy hover:text-white transition-all shadow-sm"
              >
                <LayoutDashboard size={12} />
                Admin Portal
              </Link>
            )}
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors hover:text-accent-blue",
                  location.pathname === link.path ? "text-accent-blue" : "text-secondary-slate"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-surface-border mx-2" />
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-primary-navy">{user.name}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">{user.role}</span>
                      <ShieldCheck size={10} className="text-emerald-600" />
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-surface-border overflow-hidden group-hover:border-primary-navy transition-colors">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0F172A&color=fff`} 
                      alt="Profile" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-secondary-slate hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary text-xs py-2.5 px-6 rounded-xl italic font-black uppercase tracking-tighter"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-navy p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-surface-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-bold text-primary-navy py-2"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 py-4 border-t border-surface-border"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0F172A&color=fff`} 
                      alt="Profile" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-secondary-slate">View Profile • {user.role}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="p-2 text-red-600"
                  >
                    <LogOut size={20} />
                  </button>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block btn-primary text-center py-4 rounded-xl font-black uppercase tracking-widest italic"
                >
                  Sign In to Zenith
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
