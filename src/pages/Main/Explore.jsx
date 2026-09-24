import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowUpDown, Heart, Eye, Camera, CheckCircle, X, Maximize2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance';

const Explore = () => {
  const [explorePhotos, setExplorePhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const macroCategories = ["All Macro Shots", "Nature & Botany", "Insects & Wildlife", "Textures & Abstract"];
  const [activeCategory, setActiveCategory] = useState("All Macro Shots");

  const [toast, setToast] = useState({ show: false, message: '' });
  const [likedPhotoIds, setLikedPhotoIds] = useState([]);

  // 🔍 FULL IMAGE MODAL STATES
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchLivePhotosAndWishlist = async () => {
      try {
        const res = await API.get('/photos/explore-live');
        setExplorePhotos(res.data);

        const token = localStorage.getItem('token');
        if (token) {
          const wishlistRes = await API.get('/users/wishlist');
          const ids = wishlistRes.data.map(item => item._id);
          setLikedPhotoIds(ids);
        }
      } catch (err) {
        console.error("Error loading gallery matrix stream", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivePhotosAndWishlist();
  }, []);

  const showPremiumToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleLikeToggle = async (photoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showPremiumToast("⚠️ Please login to bookmark assets!");
      return;
    }

    const isAlreadyLiked = likedPhotoIds.includes(photoId);

    if (isAlreadyLiked) {
      try {
        await API.delete(`/users/wishlist/${photoId}`);
        setLikedPhotoIds(prev => prev.filter(id => id !== photoId));
        showPremiumToast("💔 Removed from your wishlist matrix!");
      } catch (err) {
        console.error("Error removing from wishlist:", err);
        showPremiumToast("❌ Failed to unlike asset");
      }
    } else {
      try {
        const res = await API.post('/users/wishlist/add', { photoId });
        if (res.data.success) {
          setLikedPhotoIds(prev => [...prev, photoId]);
          showPremiumToast("💖 Added to your secure wishlist matrix!");
        }
      } catch (err) {
        console.error("Error adding to wishlist:", err);
        showPremiumToast(err.response?.data?.message || "❌ Server error during bookmark");
      }
    }
  };

  const filteredPhotos = activeCategory === "All Macro Shots"
    ? explorePhotos
    : explorePhotos.filter(photo => photo.category === activeCategory);

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 font-bold flex items-center justify-center">Loading Live Macro Stream...</div>;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 relative">
      
      {/* 🔔 PREMIUM TOAST */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-slate-200 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in backdrop-blur-md">
          <CheckCircle size={18} className="text-indigo-400" />
          <span className="text-xs font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* 🖼️ ULTRA-PREMIUM FULL IMAGE VIEW MODAL (LIGHTBOX) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-900/60 p-3 rounded-full border border-slate-800 transition cursor-pointer z-50"
          >
            <X size={22} />
          </button>

          {/* Large Image Container */}
          <div className="max-w-full max-h-full flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Full Macro Asset" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-900 shadow-2xl select-none pointer-events-none" 
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-25">
                <span className="text-white font-black text-3xl md:text-5xl tracking-widest uppercase border-4 border-white/35 px-6 py-3 rotate-12 bg-slate-950/20 backdrop-blur-[1px]">
                  MACROVERSE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="border-b border-slate-900 pb-8 mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider">
            <Camera size={12} /> Macro Cluster Live Node
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">Explore Microverse Gallery</h1>
        </div>

        {/* DYNAMIC FILTERS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 border border-slate-900 p-4 rounded-2xl mb-10 backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full lg:w-auto">
            {macroCategories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 cursor-pointer">
              <SlidersHorizontal size={14} /> Refine Specs
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 cursor-pointer">
              <ArrowUpDown size={14} /> Most Viewed
            </button>
          </div>
        </div>

        {/* 🖼️ LIVE DYNAMIC GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPhotos.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12 font-bold">
              इस कैटेगरी ("{activeCategory}") में अभी कोई लाइव फोटो उपलब्ध नहीं है।
            </div>
          ) : (
            filteredPhotos.map((photo) => {
              const isLiked = likedPhotoIds.includes(photo._id);

              return (
                <div key={photo._id} className="group bg-slate-900/30 rounded-3xl overflow-hidden border border-slate-900 hover:border-slate-800 transition duration-300 flex flex-col justify-between shadow-xl">
                  
                  {/* इमेज बॉक्स कंटेनर */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 select-none pointer-events-none" 
                    />
                    
                    {/* 🔒 फ्रंटएंड वॉटरमार्क शील्ड */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-25 group-hover:opacity-10 transition duration-300">
                      <span className="text-white font-black text-xl tracking-widest uppercase border-2 border-white/40 px-3 py-1.5 rotate-12 bg-slate-950/10 backdrop-blur-[0.5px]">
                        MACROVERSE
                      </span>
                    </div>
                    
                    {/* HINT OVERLAY */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-bold opacity-0 md:group-hover:opacity-100 transition duration-300 pointer-events-none flex items-center gap-1 z-20">
                      <Maximize2 size={10} className="text-indigo-400" /> Click to view full image
                    </div>

                    {/* 🎯 OVERLAY LAYER: Mobile par hamesha dikhega (opacity-100), Desktop par sirf hover par (md:opacity-0 md:group-hover:opacity-100) */}
                    <div 
                      onClick={() => setSelectedImage(photo.imageUrl)} 
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-3.5 cursor-zoom-in z-20"
                    >
                      <div className="flex justify-end items-center w-full">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleLikeToggle(photo._id);
                          }}
                          className={`border p-2 rounded-xl transition duration-300 cursor-pointer shadow-lg active:scale-95 ${
                            isLiked ? 'bg-rose-600/30 border-rose-500 text-rose-500 scale-105' : 'bg-slate-950/90 border-slate-800 text-slate-300'
                          }`}
                        >
                          <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs bg-slate-950/90 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 flex items-center gap-1 font-bold">
                          <Eye size={12} className="text-indigo-400" /> {photo.views || 0}
                        </span>
                        
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation(); 
                            const token = localStorage.getItem('token');
                            if (!token) {
                              showPremiumToast("⚠️ Please login to add items to cart!");
                              return;
                            }
                            try {
                              const res = await API.post('/users/cart/add', { photoId: photo._id });
                              if (res.data.success) {
                                showPremiumToast("🛒 Asset added to your marketplace cart!");
                              }
                            } catch (err) {
                              showPremiumToast(err.response?.data?.message || "❌ Failed to add to cart");
                            }
                          }}
                          className="bg-indigo-600 text-white font-bold py-2 px-3 rounded-xl text-center text-xs shadow-lg hover:bg-indigo-500 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingCart size={13} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* नीचे का मेटाडेटा कार्ड */}
                  <div className="p-5 flex flex-col gap-3 border-t border-slate-900/50 bg-slate-950/20">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5 truncate">
                        <h3 className="font-bold text-white text-sm tracking-wide truncate">{photo.title}</h3>
                        {/* ⚡ Full Name display */}
                        <p className="text-[11px] text-indigo-400 font-semibold truncate capitalize">
                          By {photo.uploadedBy?.fullName || photo.uploadedBy?.name || (photo.uploadedBy?.firstName ? `${photo.uploadedBy.firstName} ${photo.uploadedBy.lastName || ''}`.trim() : "Verified Creator")}
                        </p>
                      </div>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                        {photo.price}
                      </span>
                    </div>
                    <div className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1.5 rounded-lg font-mono flex items-center gap-1.5 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                      {photo.magnification}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default Explore;