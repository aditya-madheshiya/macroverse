import React from 'react';
import { Link } from 'react-router-dom';

// लोगो इमेज इम्पोर्ट
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* कॉलम 1: ब्रांड और परिचय */}
          <div className="md:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3.5 group w-max">
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl">
                <img 
                  src={logo} 
                  alt="Macroverse Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Macroverse
              </span>
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed font-medium">
              The next-generation marketplace for curated, ultra high-resolution micro stock photos. Empowering worldwide creators with secure digital assets.
            </p>
          </div>

          {/* कॉलम 2: मार्केटप्लेस लिंक्स */}
          <div>
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Marketplace</h3>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link to="/explore" className="text-slate-200 hover:text-white hover:underline transition">Explore Assets</Link>
              <Link to="/categories" className="text-slate-200 hover:text-white hover:underline transition">Categories</Link>
              <Link to="/collections" className="text-slate-200 hover:text-white hover:underline transition">Collections</Link>
            </div>
          </div>

          {/* कॉलम 3: कंपनी लिंक्स */}
          <div>
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Company</h3>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link to="/about" className="text-slate-200 hover:text-white hover:underline transition">About Us</Link>
              <Link to="/contact" className="text-slate-200 hover:text-white hover:underline transition">Contact Support</Link>
              <Link to="/blog" className="text-slate-200 hover:text-white hover:underline transition">Our Blog</Link>
            </div>
          </div>

          {/* कॉलम 4: लीगल लिंक्स */}
          <div>
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Legal</h3>
            <div className="flex flex-col gap-3 text-sm font-medium">
              <Link to="/privacy" className="text-slate-200 hover:text-white hover:underline transition">Privacy Policy</Link>
              <Link to="/terms" className="text-slate-200 hover:text-white hover:underline transition">Terms & Conditions</Link>
              <a href="mailto:support@macroverse.com" className="text-slate-200 hover:text-white hover:underline transition">Direct Mail</a>
            </div>
          </div>

        </div>

        {/* बॉटम बार: कॉपीराइट और सारे सोशल मीडिया लिंक्स */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* कॉपीराइट टेक्स्ट */}
          <div className="text-sm font-medium text-slate-300">
            © {new Date().getFullYear()} Macroverse Inc. All rights reserved.
          </div>
          
          {/* 🌐 सारे सोशल मीडिया के ऑप्शन (यहाँ '#' की जगह सीधे अपनी लिंक डाल दो भाई) */}
          <div className="flex flex-wrap gap-5 text-sm font-bold tracking-wide uppercase text-slate-300">
            <a href="https://instagram.com/YOUR_USERNAME" target="_blank" rel="noreferrer" className="text-pink-500 hover:text-white transition">
              Instagram
            </a>
            <a href="https://linkedin.com/in/YOUR_USERNAME" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-white transition">
              LinkedIn
            </a>
            <a href="https://twitter.com/YOUR_USERNAME" target="_blank" rel="noreferrer" className="text-sky-400 hover:text-white transition">
              Twitter / X
            </a>
            <a href="https://facebook.com/YOUR_PAGE" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-white transition">
              Facebook
            </a>
            <a href="https://github.com/YOUR_USERNAME" target="_blank" rel="noreferrer" className="text-slate-100 hover:text-white transition">
              GitHub
            </a>
            <a href="https://discord.gg/YOUR_INVITE" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition">
              Discord
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;