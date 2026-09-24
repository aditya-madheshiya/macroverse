import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // ⚡ Har baar jab route/path change hoga, page turant top par chala jayega
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Turant top par bhejne ke liye
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;