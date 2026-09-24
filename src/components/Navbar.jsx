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
    setIsOpen(false);
    navigate('/login');
  };

  const handleIconClick = (tabName) => {
    localStorage.setItem('activeDashboardTab', tabName);
    setIsOpen(false);
    navigate('/dashboard');
    window.dispatchEvent(new Event('storageTabChange'));
  };

  // 💎 हाई-विज़िबिलिटी एक्टिव लिंक स्टाइल
  const linkStyle = ({ isActive }) => 
    `text-sm font-bold tracking-wide transition-all duration-300 py-2 flex items-center gap-2 border-b-2 ${
      isActive 
        ? 'text-indigo-400 border-indigo-500 font-extrabold drop-shadow-[0_0_10px_rgba(129,140,248,0.6)]' 
        : 'text-slate-300 border-transparent hover:text-white hover:border-slate-700'
    }`;

  return (
    <>
      {/* 🔮 Butter-smooth Slide-in & Stagger Keyframe Styles */}
      <style>{`
        @keyframes menuSlideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes itemFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-menu-smooth {
          animation: menuSlideDown 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-item-stagger {
          animation: itemFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <nav className="bg-slate-950/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* 📸 LOGO SECTION */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0" onClick={() => setIsOpen(false)}>
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

            {/* 🖥️ MENU LINKS (DESKTOP) */}
            <div className="hidden md:flex items-center gap-10">
              <NavLink to="/explore" className={linkStyle}>
                <Compass size={16} />
                <span>Explore Gallery</span>
              </NavLink>
              <NavLink to="/upload" className={linkStyle}>
                <Upload size={16} />
                <span>Sell Artwork</span>
              </NavLink>
              
              {user && role === 'admin' && (
                <NavLink to="/admin" className="flex items-center gap-2 text-sm font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl transition hover:bg-rose-500/20">
                  <Shield size={16} className="animate-pulse" /> Admin Control
                </NavLink>
              )}
            </div>

            {/* 🔑 ACTIONS & AUTH BUTTONS (DESKTOP) */}
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

              {!user ? (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-slate-300 hover:text-white font-bold text-sm px-4 py-2.5 transition">
                    Login
                  </Link>
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

            {/* MOBILE MENU BUTTON (Smooth Rotation) */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition duration-300 cursor-pointer active:scale-90"
              >
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                  {isOpen ? <X size={22} /> : <Menu size={22} />}
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* 📱 MOBILE DROPDOWN WITH ULTRA-SMOOTH SPRING ANIMATION */}
        {isOpen && (
          <div className="animate-menu-smooth absolute top-20 left-0 w-full bg-slate-950/98 backdrop-blur-3xl border-b border-slate-800/80 px-6 pt-5 pb-8 space-y-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] z-50 md:hidden origin-top">
            
            <Link 
              to="/explore" 
              onClick={() => setIsOpen(false)} 
              style={{ animationDelay: '0.04s' }}
              className="animate-item-stagger flex items-center gap-3 py-3 px-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 hover:text-white hover:border-indigo-500/50 active:bg-slate-800 transition duration-200"
            >
              <Compass size={18} className="text-indigo-400" /> Explore Gallery
            </Link>

            <Link 
              to="/upload" 
              onClick={() => setIsOpen(false)} 
              style={{ animationDelay: '0.08s' }}
              className="animate-item-stagger flex items-center gap-3 py-3 px-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 hover:text-white hover:border-indigo-500/50 active:bg-slate-800 transition duration-200"
            >
              <Upload size={18} className="text-indigo-400" /> Sell Artwork
            </Link>
            
            {user && role === 'admin' && (
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                style={{ animationDelay: '0.12s' }}
                className="animate-item-stagger flex items-center gap-3 py-3 px-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold active:bg-rose-500/20 transition duration-200"
              >
                <Shield size={18} /> Admin Control Panel
              </Link>
            )}
            
            {!user ? (
              <div style={{ animationDelay: '0.14s' }} className="animate-item-stagger grid grid-cols-2 gap-3 pt-3">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center py-3 text-slate-300 border border-slate-800 bg-slate-900/90 rounded-xl font-bold active:scale-95 hover:text-white transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)} 
                  className="text-center py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 active:scale-95 hover:bg-indigo-500 transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div style={{ animationDelay: '0.14s' }} className="animate-item-stagger pt-3 space-y-2.5">
                <button 
                  onClick={() => handleIconClick('dashboard')} 
                  className="w-full text-center py-3.5 text-white bg-slate-900 border border-slate-800 rounded-xl font-bold block active:scale-95 hover:border-slate-700 transition duration-200"
                >
                  Open Dashboard
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-center py-3.5 bg-rose-950/40 border border-rose-900/30 text-rose-400 rounded-xl font-bold active:scale-95 hover:bg-rose-900/40 transition duration-200"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;