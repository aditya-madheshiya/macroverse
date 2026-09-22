import React from 'react';
import { Camera, ShieldAlert } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl"><Camera size={24} /></div>
          <h1 className="text-4xl font-black text-white tracking-tight">The Microverse Narrative</h1>
          <p className="text-slate-400 font-medium text-sm">Curation of pristine visual architectures—one block at a time.</p>
        </div>
        
        <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-3xl backdrop-blur-md space-y-6 text-slate-400 leading-relaxed font-medium text-sm sm:text-base">
          <p>
            Launched with an absolute mandate, <strong className="text-white">Microverse</strong> is a highly tuned stock photography ecosystem designed to scale the capabilities of designers, frontend engineers, and global brands.
          </p>
          <p>
            We eliminate standard copyright bottlenecks by providing clear, royalty-free digital licenses packaged under micro-investment values. Our catalog features nothing short of ultra high-resolution, pixel-perfect captures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;