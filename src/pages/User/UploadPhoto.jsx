import React, { useState } from 'react';
import { Upload, Tag, Image as ImageIcon, CheckCircle, Camera } from 'lucide-react';
import API from '../../api/axiosInstance';

const UploadPhoto = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Nature & Botany');
  const [price, setPrice] = useState('');
  const [magnification, setMagnification] = useState('2:1 Macro');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a high-res macro photo!");

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', `₹${price}`);
    formData.append('magnification', magnification);
    formData.append('image', imageFile);

    try {
      await API.post('/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setToast({ show: true, message: "Macro asset uploaded to Cloudinary successfully!" });
      setTitle('');
      setPrice('');
      setImageFile(null);
      setPreviewUrl('');
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed. Check if you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex justify-center items-center">
      {toast.show && (
        <div className="fixed top-24 right-6 bg-slate-900 border border-emerald-500/30 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="max-w-2xl w-full bg-slate-900/60 border border-slate-900 p-8 rounded-3xl shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Sell Your Macro Artwork</h1>
        </div>

        <form onSubmit={handleUpload} className="space-y-6 text-sm font-bold text-slate-300">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400">Micro Asset File</label>
            <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center cursor-pointer relative bg-slate-950/40">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              ) : (
                <div className="flex flex-col items-center py-6">
                  <Upload size={32} className="text-indigo-400 mb-2" />
                  <p className="text-white">Click to select high-resolution picture</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-400">Photo Title</label>
            <div className="relative flex items-center">
              <ImageIcon className="absolute left-4 text-slate-500" size={18} />
              <input type="text" placeholder="e.g., Snowflake Geometry Pattern" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-slate-800 pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 text-white outline-none focus:border-indigo-500" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-800 p-3 rounded-xl bg-slate-950 text-slate-300 mt-1">
                <option>Nature & Botany</option>
                <option>Insects & Wildlife</option>
                <option>Textures & Abstract</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Magnification</label>
              <div className="relative flex items-center mt-1">
                <Camera className="absolute left-3 text-slate-500" size={16} />
                <input type="text" placeholder="e.g., 5:1 Macro" value={magnification} onChange={e => setMagnification(e.target.value)} className="w-full border border-slate-800 pl-10 pr-4 py-3 rounded-xl bg-slate-950 text-white outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Price (INR)</label>
              <div className="relative flex items-center mt-1">
                <span className="absolute left-3.5 text-slate-400 font-bold text-base select-none">₹</span>
                <input type="number" placeholder="250" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-slate-800 pl-9 pr-4 py-3 rounded-xl bg-slate-950 text-white outline-none focus:border-indigo-500" required />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-4 cursor-pointer disabled:opacity-50">
            {loading ? "Uploading..." : "List Asset For Sale"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPhoto;