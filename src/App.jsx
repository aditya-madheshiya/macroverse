import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout & Common Components (Check Caps and spellings carefully)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
// 1. Main Pages
import Home from './pages/Main/Home';
import Explore from './pages/Main/Explore';
import Categories from './pages/Main/Categories';
import PhotoDetails from './pages/Main/PhotoDetails';

// 2. User Pages
import Wishlist from './pages/User/Wishlist';
import Cart from './pages/User/Cart';
import UserDashboard from './pages/User/UserDashboard';
import MyDownloads from './pages/User/MyDownloads';
import MyOrders from './pages/User/MyOrders';
import Profile from './pages/User/Profile';

// 3. Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// 4. Company Pages
import Collections from './pages/Company/Collections';
import Pricing from './pages/Company/Pricing';
import About from './pages/Company/About';
import Contact from './pages/Company/Contact';
import Blog from './pages/Company/Blog';
import FAQ from './pages/Company/FAQ';
import PrivacyPolicy from './pages/Company/PrivacyPolicy';
import TermsConditions from './pages/Company/TermsConditions';

// 🎯 5. Admin Page (यहाँ इम्पोर्ट गायब था, इसे जोड़ दिया है)
import AdminDashboard from './pages/Admin/AdminDashboard';
import UploadPhoto from './pages/User/UploadPhoto';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/photo/:id" element={<PhotoDetails />} />

            {/* User Routes */}
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/downloads" element={<MyDownloads />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🎯 Admin Route (यहाँ रूट गायब था, इसे जोड़ दिया है) */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/upload" element={<UploadPhoto />} />

            {/* Company Routes */}
            <Route path="/collections" element={<Collections />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            
            {/* Catch-all Route: अगर कोई पाथ गड़बड़ होगा तो ये दिखेगा */}
            <Route path="*" element={
              <div className="p-20 text-center font-bold text-red-500 text-xl bg-white m-10 rounded-2xl shadow-sm">
                ⚠️ URL Error or Page Not Found! <br />
                <a href="/" className="text-indigo-600 underline text-sm font-medium mt-2 inline-block">Go to Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;