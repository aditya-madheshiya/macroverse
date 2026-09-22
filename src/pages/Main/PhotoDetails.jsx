import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ShieldCheck, RefreshCw, Eye, Sparkles } from 'lucide-react';
import API from '../../api/axiosInstance';

const PhotoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⚡ विशिष्ट आईडी का डेटा लाना
    API.get(`/photos/${id}`)
      .then(res => {
        setPhoto(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using template matrix fallback data.");
        setPhoto({
          id: id,
          title: "Misty Mountain Range Peak",
          author: "Alex Meyer",
          price: "15.00",
          url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"
        });
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // ⚡ कार्ट में आइटम जोड़ना
      await API.post('/cart/add', { photoId: id });
      alert("Asset successfully linked to your cart basket!");
      navigate('/cart');
    } catch (err) {
      alert("API Error: Secure session expired. Please sign in again.");
      navigate('/login');
    }
  };

  if (loading) return <div className="text-center py-32 text-slate-500 font-medium">Loading Asset Node...</div>;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Photo Render */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-3xl shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl aspect-4/3">
                <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex gap-6 pl-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Eye size={14} /> Verified License</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} /> 4K Resolution Source</span>
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">Asset #{photo.id}</span>
              <h1 className="text-3xl font-black text-white tracking-tight">{photo.title}</h1>
              <p className="text-sm text-slate-400 font-medium">Curated Asset by {photo.author}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-5">
                <div>
                  <h3 className="font-bold text-white text-base">Standard Commercial</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Royalty-Free Digital License</p>
                </div>
                <span className="text-3xl font-black text-indigo-400">${photo.price}</span>
              </div>

              <div className="space-y-3 text-xs text-slate-400 font-semibold leading-relaxed">
                <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" /> Full digital distribution indemnity cover.</div>
                <div className="flex items-center gap-3"><RefreshCw size={16} className="text-emerald-500 flex-shrink-0" /> Lifetime storage cloud re-download access.</div>
              </div>

              <button onClick={handleAddToCart} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition text-sm cursor-pointer active:scale-95">
                <ShoppingCart size={18} /> Purchase License
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PhotoDetails;