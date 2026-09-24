import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Download, Eye, Sparkles, Compass, ArrowUpRight, Upload } from 'lucide-react';
import API from '../../api/axiosInstance';

const Home = () => {
  const [trendingPhotos, setTrendingPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const popularTags = ["Nature", "Architecture", "Minimalism", "Neon Cyberpunk"];

  useEffect(() => {
    // ⚡ बैकएंड से लाइव डेटा लाना
    API.get('/photos/trending')
      .then(res => {
        setTrendingPhotos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend not connected, loading fallback UI data.");
        // बैकअप डेटा (अगर बैकएंड चालू न हो)
        setTrendingPhotos([
          { id: "1", title: "Majestic Mountain Peak", author: "Alex Meyer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", price: "15", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", views: "2.4k" },
          { id: "2", title: "Cyberpunk Tokyo Nights", author: "Aki Sora", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", price: "25", url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=800", views: "1.8k" }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-slate-950 py-28 px-4 border-b border-slate-900">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
            <Sparkles size={12} className="text-indigo-400" /> Curated Photo Marketplace
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
            The Premium <br />
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Micro Photo Selling</span> Universe
          </h1>
          <p className="text-sm md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover, buy, and sell ultra high-resolution, hand-curated stock photos. Built explicitly for elite creators and developers.
          </p>
          
          {/* 🔮 DUAL CTAS: Explore Gallery & Sell Artwork */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            
            {/* Primary Action: Enter Microverse (Explore) */}
            <Link
              to="/explore"
              className="w-full sm:w-auto relative group p-[2px] rounded-3xl overflow-hidden inline-flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_0px_rgba(168,85,247,0.7)]"
            >
              {/* Rotating Aurora Border */}
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4f46e5_0%,#a855f7_25%,#ec4899_50%,#06b6d4_75%,#4f46e5_100%)] opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Glassmorphic Core */}
              <div className="w-full relative px-7 py-3.5 rounded-[22px] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center gap-3.5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-inner group-hover:rotate-12 transition-transform duration-300">
                  <Compass size={18} className="animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">
                      Enter Microverse
                    </span>
                    <Sparkles size={11} className="text-amber-400 animate-bounce" />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 -mt-0.5">Explore 4K Macro Live</p>
                </div>
                <div className="ml-2 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>

            {/* 🎨 Creator Action: Sell Your Art */}
            <Link
              to="/upload"
              className="w-full sm:w-auto relative group px-7 py-3.5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 backdrop-blur-xl inline-flex items-center justify-center gap-3.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <Upload size={18} />
              </div>
              <div className="text-left">
                <span className="text-xs font-black uppercase tracking-wider text-slate-200 group-hover:text-emerald-300 transition-colors block">
                  Sell Your Art
                </span>
              </div>
              <div className="ml-1 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300">
                <ArrowUpRight size={16} />
              </div>
            </Link>

          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;