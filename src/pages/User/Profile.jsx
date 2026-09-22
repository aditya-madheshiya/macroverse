import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Shield, Loader2 } from 'lucide-react';
import API from '../../api/axiosInstance'; // आपका एक्सियोस इंस्टेंस

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // 🎯 आपके नए userRoutes के /profile एंडपॉइंट से लाइव डेटा फेच हो रहा है
        const res = await API.get('/users/profile');
        setUserData(res.data);
        setError(null);
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("डेटाबेस से आपकी प्रोफाइल सिंक नहीं हो पाई।");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // तारीख को सुंदर फॉर्मेट में बदलने के लिए फंक्शन
  const formatDate = (dateString) => {
    if (!dateString) return "Recent Member";
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 font-bold text-sm py-12">
        <Loader2 className="animate-spin text-indigo-500" size={18} />
        <span>Fetching secure identity matrix...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-rose-500 font-bold text-sm py-12">{error}</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-white">My Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your personal identity settings.</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-2xl space-y-6">
        
        {/* AVATAR & BADGE BLOCK - 100% DYNAMIC */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-900">
          <div className="h-16 w-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/10 uppercase">
            {userData?.firstName ? userData.firstName.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white capitalize">
              {`${userData?.firstName} ${userData?.lastName || ''}`.trim()}
            </h3>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5 uppercase tracking-wider">
              {userData?.role === 'admin' ? '🛡️ Master Admin' : 'Premium Creator'}
            </p>
          </div>
        </div>

        {/* FIRST & LAST NAME FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">First Name</span>
            <div className="flex items-center gap-2 text-slate-200 font-bold bg-slate-950 p-3 rounded-xl border border-slate-900 capitalize">
              <User size={16} className="text-slate-600" /> {userData?.firstName || 'N/A'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Last Name</span>
            <div className="flex items-center gap-2 text-slate-200 font-bold bg-slate-950 p-3 rounded-xl border border-slate-900 capitalize">
              <User size={16} className="text-slate-600" /> {userData?.lastName || '—'}
            </div>
          </div>
        </div>

        {/* EMAIL FIELD */}
        <div className="space-y-1 text-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</span>
          <div className="flex items-center gap-2 text-slate-200 font-bold bg-slate-950 p-3 rounded-xl border border-slate-900">
            <Mail size={16} className="text-slate-600" /> {userData?.email || 'N/A'}
          </div>
        </div>

        {/* METADATA TIMELINE FOOTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-900 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-indigo-500/70" /> 
            <span>Joined: {formatDate(userData?.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-indigo-500/70" /> 
            <span>Account Status: <span className="text-emerald-400">Active Node</span></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;