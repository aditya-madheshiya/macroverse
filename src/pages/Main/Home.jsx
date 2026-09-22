import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Flame, ArrowRight, Download, Heart, Eye, Sparkles } from 'lucide-react';
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 backdrop-blur-lg focus-within:border-indigo-500 transition duration-300">
            <Search className="text-slate-500 ml-4 flex-shrink-0" size={24} />
            <input type="text" placeholder="Search assets (e.g. Cinematic Landscapes)..." className="w-full px-4 py-3 bg-transparent outline-none text-white font-medium text-base placeholder-slate-500" />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer">Search</button>
          </div>
        </div>
      </section>

      {/* Grid Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest"><Flame size={14} fill="currentColor" /> Curated Gallery</div>
            <h2 className="text-3xl font-black text-white tracking-tight mt-1">Trending Micro Masterpieces</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-medium">Syncing with Microverse Core APIs...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingPhotos.map((photo) => (
              <div key={photo.id} className="group bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-900 hover:border-slate-800 transition duration-300">
                <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-4">
                    <span className="text-xs bg-slate-900/80 px-2.5 py-1 rounded-md text-slate-300 w-fit flex items-center gap-1"><Eye size={12} /> {photo.views || '1.2k'}</span>
                    <Link to={`/photo/${photo.id}`} className="bg-white text-slate-950 font-bold py-2 px-4 rounded-xl text-center text-xs flex items-center justify-center gap-1.5">
                      <Download size={14} /> View & License
                    </Link>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center border-t border-slate-900">
                  <div>
                    <h3 className="font-bold text-white text-sm truncate max-w-[150px]">{photo.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">by {photo.author?.name || photo.author}</p>
                  </div>
                  <span className="text-sm font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">${photo.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;