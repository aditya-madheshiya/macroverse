import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import API from '../../api/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🎯 पॉपअप विंडो (Toast) स्टेट
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      
      // ⚡ 1. डेटा आते ही तुरंत बिना किसी देरी के लोकल स्टोरेज में डालें
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); 
      
      // डिफ़ॉल्ट alert हटाकर सुंदर पॉपअप दिखाना
      setToast({ show: true, message: "Login Successful! Redirecting..." });
      
      // ⚡ 2. 1.5 सेकंड का स्मूथ टाइमर (ताकि डेटा पक्का राइट हो जाए)
      setTimeout(() => {
        setToast({ show: false, message: '' });
        
        // 🔄 रोल चेक करके सीधा सही पेज पर भेजें (window.location से टोकन तुरंत सिंक होगा)
        if (response.data.role === 'admin') {
          window.location.href = '/admin'; // एडमिन सीधे एडमिन टर्मिनल पर जाएगा
        } else {
          window.location.href = '/dashboard'; // नॉर्मल यूजर यूजर डैशबोर्ड पर जाएगा
        }
      }, 1500);

    } catch (err) {
      // अगर बैकएंड कोई एरर मैसेज भेजता है तो उसे दिखाएं
      alert(err.response?.data?.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 px-4 py-16 relative">
      
      {/* 🎯 एनिमेटेड मॉडर्न पॉपअप विंडो */}
      {toast.show && (
        <div className="fixed top-24 right-6 bg-slate-900 border border-indigo-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-950/20 flex items-center gap-3 animate-bounce z-50">
          <CheckCircle className="text-indigo-400 flex-shrink-0" size={20} />
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="max-w-md w-full bg-slate-900/40 border border-slate-900 p-8 rounded-3xl shadow-2xl space-y-6 backdrop-blur-xl relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
            <Camera size={24} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 font-medium">Log in to secure your creator space</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-500" size={18} />
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-800 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-500" size={18} />
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-800 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-indigo-500/50 font-medium text-sm text-slate-200 bg-slate-950/60" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-95 disabled:opacity-50">
            {loading ? "Authenticating..." : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 font-medium pt-2 border-t border-slate-900/60">
          New here? <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;