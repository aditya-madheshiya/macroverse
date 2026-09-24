import axios from 'axios';

const API = axios.create({
  // ⚡ Agar live environment variable mile to wo use karega, nahi to local fallback
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// इंटरसेप्टर: हर रिक्वेस्ट के साथ ताज़ा JWT Token भेजने और टोकन न होने पर हेडर साफ़ करने के लिए
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // 🔒 अगर टोकन नहीं है या यूजर बदल गया है, तो पुराना हेडर हटाएँ
    delete config.headers.Authorization;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;