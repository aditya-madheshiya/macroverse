import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

const Collections = () => {
  const collections = [
    { title: "Summer Aesthetic 2026", count: "48 Masterpieces", img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80" },
    { title: "Minimal Corporate", count: "32 Assets", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
    { title: "Cyberpunk Alleyways", count: "25 Frames", img: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 border-b border-slate-900 pb-6 flex items-center gap-3">
          <Layers className="text-indigo-500" size={32} />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Curated Vault Collections</h1>
            <p className="text-slate-400 text-sm mt-0.5">Handpicked premium bundles designed by elite curators.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col, i) => (
            <div key={i} className="group bg-slate-900/30 rounded-2xl overflow-hidden border border-slate-900 hover:border-slate-800 transition duration-300 cursor-pointer">
              <div className="h-52 overflow-hidden bg-slate-950">
                <img src={col.img} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-5 flex justify-between items-center bg-slate-900/10">
                <div>
                  <h3 className="font-black text-white text-base group-hover:text-indigo-400 transition">{col.title}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{col.count}</p>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 group-hover:text-white group-hover:bg-indigo-600 transition"><ArrowRight size={16} /></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Collections;