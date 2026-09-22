import React from 'react';
import { Rss } from 'lucide-react';

const Blog = () => {
  const posts = [
    { title: "Mastering Minimal Composition in 2026", date: "June 24, 2026", desc: "Understanding geometry vectors behind elite high-converting digital visual assets.", author: "Sarah J." },
    { title: "The Rise of High-Contrast Dark UI Aesthetics", date: "May 18, 2026", desc: "Why major SaaS web-architects are switching to dark backgrounds and vibrant stock imagery.", author: "Marcus V." }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-12 border-b border-slate-900 pb-6 flex items-center gap-3">
          <Rss className="text-indigo-400" size={26} />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Microverse Chronicles</h1>
            <p className="text-slate-400 text-sm mt-0.5">Design engineering telemetry, trends, and asset reviews.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl shadow-xl space-y-4 cursor-pointer hover:border-slate-800 transition duration-300">
              <span className="text-[10px] bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md font-bold uppercase tracking-widest text-slate-500">{post.date} • {post.author}</span>
              <h2 className="text-xl font-black text-white hover:text-indigo-400 transition leading-snug">{post.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">{post.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Blog;