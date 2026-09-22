import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Menu, X, LogOut, Shield, Compass, Upload } from 'lucide-react';

// लोगो इमेज का डायरेक्ट इम्पोर्ट
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (token) {
      try {
        setUser({ name: "User" }); 
        setRole(userRole);
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    } else {
      setUser(null);
      setRole(null);
    }
  }, [localStorage.getItem('token'), localStorage.getItem('role')]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('activeDashboardTab');
    setUser(null);
    setRole(null);
    navigate('/login');
  };

  const handleIconClick = (tabName) => {
    localStorage.setItem('activeDashboardTab', tabName);
    navigate('/dashboard');
    window.dispatchEvent(new Event('storageTabChange'));
  };

  // 💎 हाई-विज़िबिलिटी एक्टिव लिंक स्टाइल (साफ़ और चमकीला टेक्स्ट)
  const linkStyle = ({ isActive }) => 
    `text-sm font-bold tracking-wide transition-all duration-300 py-2 flex items-center gap-2 border-b-2 ${
      isActive 
        ? 'text-indigo-400 border-indigo-500 font-extrabold drop-shadow-[0_0_10px_rgba(129,140,248,0.6)]' 
        : 'text-slate-300 border-transparent hover:text-white hover:border-slate-700'
    }`;

  return (
    <nav className="bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-900 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* 📸 LOGO SECTION (Macroverse Brand) */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center transition-all duration-300 group-hover:border-indigo-500">
              <img 
                src={logo} 
                alt="Microverse Logo" 
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white transition duration-300 group-hover:text-indigo-400">
                Macroverse
              </span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Macro Assets Marketplace
              </span>
            </div>
          </Link>

          {/* 🖥️ MENU LINKS (DESKTOP - HIGH VISIBILITY) */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink to="/explore" className={linkStyle}>
              <Compass size={16} />
              <span>Explore Gallery</span>
            </NavLink>
            <NavLink to="/upload" className={linkStyle}>
              <Upload size={16} />
              <span>Sell Artwork</span>
            </NavLink>
            
            {/* ADMIN ROUTE (साफ़ दिखने वाला रेड बैज) */}
            {user && role === 'admin' && (
              <NavLink to="/admin" className="flex items-center gap-2 text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl transition hover:bg-rose-500/20">
                <Shield size={16} className="animate-pulse" /> Admin Control
              </NavLink>
            )}
          </div>

          {/* 🔑 ACTIONS & NEW LUXURY AUTH BUTTONS (DESKTOP) */}
          <div className="hidden md:flex items-center gap-6">
            
            {user && (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
                <button 
                  onClick={() => handleIconClick('liked')} 
                  className="p-2 text-slate-400 hover:text-rose-400 transition relative cursor-pointer"
                >
                  <Heart size={20} />
                  <span className="absolute top-1 right-1 bg-rose-500 w-2 h-2 rounded-full border border-slate-950"></span>
                </button>

                <button 
                  onClick={() => handleIconClick('cart')} 
                  className="p-2 text-slate-400 hover:text-indigo-400 transition relative cursor-pointer"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute top-1 right-1 bg-indigo-400 w-2 h-2 rounded-full border border-slate-950"></span>
                </button>
              </div>
            )}

            {/* NEW LUXURY BUTTONS LOGIC */}
            {!user ? (
              <div className="flex items-center gap-4">
                {/* साफ़ और सुंदर लॉगिन बटन */}
                <Link to="/login" className="text-slate-300 hover:text-white font-bold text-sm px-4 py-2.5 transition">
                  Login
                </Link>
                {/* प्रीमियम इंडिगो ग्लो साइनअप बटन */}
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-95">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleIconClick('dashboard')} 
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-md"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 transition cursor-pointer" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* 📱 MOBILE DROPDOWN (HIGH VISIBILITY) */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-900 px-6 pt-4 pb-8 space-y-4 font-bold text-base">
          <Link to="/explore" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-3 text-slate-300 hover:text-white border-b border-slate-900/60 transition">
            <Compass size={18} className="text-indigo-400" /> Explore Gallery
          </Link>
          <Link to="/upload" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-3 text-slate-300 hover:text-white border-b border-slate-900/60 transition">
            <Upload size={18} className="text-indigo-400" /> Sell Artwork
          </Link>
          
          {user && role === 'admin' && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 py-3 text-rose-400 font-bold border-b border-slate-900/60 transition">
              <Shield size={18} /> Admin Control Panel
            </Link>
          )}
          
          {!user ? (
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 text-slate-300 border border-slate-800 bg-slate-900 rounded-xl font-bold">Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md">Sign Up</Link>
            </div>
          ) : (
            <div className="pt-4 space-y-3">
              <button onClick={() => { setIsOpen(false); handleIconClick('dashboard'); }} className="w-full text-center py-3.5 text-white bg-slate-900 border border-slate-800 rounded-xl font-bold block">
                Open Dashboard
              </button>
              <button onClick={() => { setIsOpen(false); handleLogout(); }} className="w-full text-center py-3.5 bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-xl font-bold">
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;