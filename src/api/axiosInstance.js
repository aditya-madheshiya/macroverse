import axios from 'axios';

const API = axios.create({
  // ⚡ Agar live environment variable mile to wo use karega, nahi to local fallback
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// इंटरसेप्टर: हर रिक्वेस्ट के साथ LocalStorage से JWT Token अपने आप भेजने के लिए
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;