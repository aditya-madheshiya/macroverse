import React from 'react';
import { Layers } from 'lucide-react';

const Categories = () => {
  const categoriesList = [
    { name: "Cinematic Nature", count: "14.2k Assets", img: "https://images.unsplash.com/photo-1511497584788-876760111969?w=500&auto=format&fit=crop&q=80" },
    { name: "Cyberpunk & Neon", count: "8.5k Assets", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80" },
    { name: "Architectural Lines", count: "6.1k Assets", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80" },
    { name: "Minimalist Geometry", count: "9.9k Assets", img: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500&auto=format&fit=crop&q=80" },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 border-b border-slate-900 pb-8 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400"><Layers size={26} /></div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">📂 Structured Multiverse</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Navigate seamlessly into high-selling imagery genres.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesList.map((cat, i) => (
            <div key={i} className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-indigo-500/5 transition duration-300 border border-slate-900">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              {/* Ultra Modern Smooth Dark Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/60 transition flex flex-col justify-end p-5">
                <h3 className="text-white font-black text-xl tracking-tight leading-none group-hover:text-indigo-400 transition">{cat.name}</h3>
                <p className="text-slate-400 text-xs font-bold mt-1.5 uppercase tracking-widest">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Categories;