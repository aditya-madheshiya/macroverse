import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Loader2, BookmarkX, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosInstance'; 

const Wishlist = ({ type }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      // अगर टाइप purchased है तो आर्डर एंडपॉइंट से डेटा लाएगा
      const endpoint = type === 'purchased' ? '/orders/purchased-assets' : '/users/wishlist';
      const res = await API.get(endpoint);
      setItems(res.data || []); 
    } catch (err) {
      console.error(err);
      setItems([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [type]);

  const handleRemoveItem = async (photoId) => {
    try {
      await API.delete(`/users/wishlist/${photoId}`);
      setItems(prevItems => prevItems.filter(item => item._id !== photoId));
    } catch (err) {
      setItems(prevItems => prevItems.filter(item => item._id !== photoId));
    }
  };

  // 📥 सिक्योर डाउनलोड ट्रिगर (फाइल बनाकर सीधे ब्राउज़र में सेव करेगा)
  const triggerSecureDownload = async (imageUrl, title) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '_')}_macroverse.png`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-12">
        <Loader2 className="animate-spin text-indigo-500" size={18} />
        <span>Loading asset collection matrix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-white">
          {type === 'purchased' ? 'Purchased Assets' : 'Liked Photos (Wishlist)'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {type === 'purchased' ? 'Your commercial licensed macro photography stock.' : 'Your bookmarked aesthetic assets matrix.'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-900 rounded-3xl bg-slate-900/10 space-y-3 max-w-xl">
          <BookmarkX size={40} className="text-slate-600 animate-pulse" />
          <div className="text-center">
            <h3 className="font-bold text-white text-base">No Assets Found</h3>
            <p className="text-xs text-slate-500 mt-1">यह कलेक्शन अभी पूरी तरह खाली है।</p>
          </div>
          <Link to="/explore" className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-md">
            Go To Gallery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="group bg-slate-900/40 rounded-2xl overflow-hidden border border-slate-900 flex flex-col justify-between">
              
              {/* 🔒 इमेज कंटेनर - राइट क्लिक हमेशा के लिए ब्लॉक */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden select-none">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none" />
                
                {/* 🛡️ वॉटरमार्क केवल विशलिस्ट मोड में दिखेगा, Purchased में हट जाएगा */}
                {type !== 'purchased' && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-25">
                      <span className="text-white font-black text-base tracking-widest uppercase border-2 border-white/40 px-3 py-1.5 rotate-12 bg-slate-950/10 backdrop-blur-[0.5px]">
                        MACROVERSE
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-950/80 p-2 rounded-xl text-rose-500 border border-slate-900/60 shadow-lg">
                      <Heart size={16} fill="currentColor" />
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 flex justify-between items-center bg-slate-950/20 border-t border-slate-900/30">
                <div className="truncate pr-2">
                  <h3 className="font-bold text-white text-sm truncate" title={item.title}>{item.title}</h3>
                  <span className="text-xs text-indigo-400 font-black tracking-wide mt-0.5 block">{item.price}</span>
                </div>
                
                {/* ⚡ ऐक्शन बटन: पेमेंट के बाद डाउनलोड बटन, वर्ना ट्रैश बटन */}
                {type === 'purchased' ? (
                  <button onClick={() => triggerSecureDownload(item.imageUrl, item.title)} className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer">
                    <Download size={12} /> Download Asset
                  </button>
                ) : (
                  <button onClick={() => handleRemoveItem(item._id)} className="text-slate-500 hover:text-rose-400 p-2.5 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-xl transition cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;