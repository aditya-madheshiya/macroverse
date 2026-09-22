import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Connect with Us</h1>
              <p className="text-slate-400 text-sm mt-1">Need customized enterprise licensing parameters? Open a channel.</p>
            </div>
            <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400 pt-4">
              <div className="flex items-center gap-3"><Mail className="text-indigo-400" size={18} /> secure@microverse.com</div>
              <div className="flex items-center gap-3"><Phone className="text-indigo-400" size={18} /> +1 (555) 890-2134</div>
              <div className="flex items-center gap-3"><MapPin className="text-indigo-400" size={18} /> Innovation Bay, SF, CA</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-900 p-6 rounded-3xl backdrop-blur-xl">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Identity Name</label>
                <input type="text" placeholder="John Doe" className="w-full border border-slate-800 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Route</label>
                <input type="email" placeholder="you@example.com" className="w-full border border-slate-800 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Transmission Message</label>
                <textarea placeholder="State your request parameters..." rows="4" className="w-full border border-slate-800 px-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60 resize-none"></textarea>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-xl shadow-indigo-600/10 cursor-pointer active:scale-95">Send Dispatch</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;