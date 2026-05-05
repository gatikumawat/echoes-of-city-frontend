import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ showLinks = false }) => {
  const location = useLocation();
  const path = location.pathname;

  const activeClass = "text-[#4A0404] dark:text-[#f6f3ed] border-b-2 border-[#4A0404] pb-1 transition-colors duration-300";
  const inactiveClass = "text-[#4A0404]/70 dark:text-[#f6f3ed]/70 hover:text-[#4A0404] dark:hover:text-white transition-colors duration-300";

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const email = localStorage.getItem('email') || sessionStorage.getItem('email') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('email');
    window.location.href = '/';
  };

  return (
    <nav className="w-full top-0 z-50 bg-[#f6f3ed] dark:bg-[#210000] border-none shadow-[0_24px_32px_rgba(28,28,24,0.06)] sticky">
      <div className="flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-[#4A0404] dark:text-[#f6f3ed] font-headline">Echoes of the City</Link>
        {showLinks && (
          <div className="hidden md:flex items-center gap-10 font-serif italic text-lg tracking-tight">
            <Link className={path === '/sites' ? activeClass : inactiveClass} to="/sites">Sites</Link>
            <Link className={path === '/map' ? activeClass : inactiveClass} to="/map">Map</Link>
            <Link className={path === '/about' ? activeClass : inactiveClass} to="/about">About</Link>
          </div>
        )}
        <div className="flex items-center gap-6">
          {token ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#4A0404]/10 dark:bg-[#f6f3ed]/10 px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-[#4A0404] dark:text-[#f6f3ed] text-sm">person</span>
                <span className="text-sm font-medium text-[#4A0404] dark:text-[#f6f3ed]">{email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="font-label text-xs uppercase tracking-widest text-[#4A0404]/70 dark:text-[#f6f3ed]/70 hover:text-[#4A0404] dark:hover:text-[#f6f3ed] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/signin" className="font-label text-xs uppercase tracking-widest text-[#4A0404]/70 dark:text-[#f6f3ed]/70 hover:text-[#4A0404] dark:hover:text-[#f6f3ed] transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg text-sm font-medium scale-95 active:scale-90 transition-transform">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
