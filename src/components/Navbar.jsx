import React, { useState } from 'react';

const CITIES = ['Chennai', 'San Francisco', 'New York', 'London', 'Bangalore', 'Tokyo'];

export const Navbar = ({
  currentPath,
  navigate,
  currentUser,
  onLogout,
  selectedCity,
  setSelectedCity,
  userRole,
  setUserRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fdfdfd]/90 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="flex justify-between items-center px-4 md:px-10 py-3.5 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="font-geist text-xl font-black tracking-tight uppercase text-black flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">A</span>
            <span>assemble.dev</span>
          </button>

          {/* Quick Location Badge */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-all shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-gray-500">location_on</span>
              <span>{selectedCity}</span>
              <span className="material-symbols-outlined text-xs">expand_more</span>
            </button>

            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Location
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedCity === city ? 'font-bold text-black bg-gray-50' : 'text-gray-600'
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && (
                      <span className="material-symbols-outlined text-sm text-black">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center text-sm font-medium text-gray-500">
          {!currentUser ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className="transition-colors hover:text-black cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="transition-colors hover:text-black cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="transition-colors hover:text-black cursor-pointer"
              >
                Features
              </button>
            </>
          ) : (
            <>
              {currentUser.role === 'organizer' ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`transition-colors hover:text-black cursor-pointer ${
                      currentPath === '/dashboard' ? 'text-black font-bold' : ''
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/my-events')}
                    className={`transition-colors hover:text-black cursor-pointer ${
                      currentPath === '/my-events' ? 'text-black font-bold' : ''
                    }`}
                  >
                    My Events
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`transition-colors hover:text-black cursor-pointer ${
                      currentPath === '/dashboard' || currentPath === '/my-events' ? 'text-black font-bold' : ''
                    }`}
                  >
                    My Events
                  </button>
                </>
              )}
              <button
                onClick={() => navigate('/profile')}
                className={`transition-colors hover:text-black cursor-pointer ${
                  currentPath === '/profile' ? 'text-black font-bold' : ''
                }`}
              >
                Profile
              </button>
            </>
          )}
        </nav>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Shortcuts for authenticated state */}
          {currentUser && currentUser.role === 'organizer' && (
            <button
              onClick={() => navigate('/create-event')}
              className="font-geist text-xs md:text-sm bg-black text-white hover:bg-gray-800 transition-all px-6 py-2.5 rounded-full font-semibold shadow-2xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Create Event</span>
            </button>
          )}

          {/* Login / Sign Up buttons for guest, logout for user */}
          {!currentUser ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="font-geist text-sm text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-colors font-semibold hidden sm:block cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="font-geist text-xs md:text-sm bg-[#0f4c81] text-white hover:bg-[#00355f] transition-all px-6 py-2.5 rounded-full font-bold shadow-2xs active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="font-geist text-sm text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-full transition-colors font-semibold cursor-pointer"
            >
              Logout
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f8f9fa] border-b border-[#e1e3e4] px-4 py-4 flex flex-col gap-3 animate-fadeIn shadow-md">
          {/* Mobile Location Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e4]">
            <span className="text-xs font-bold text-[#727780] uppercase">Location</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#c2c7d1] rounded-md px-2 py-1 text-[#00355f]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {!currentUser ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
              >
                <span>Home</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
              >
                <span>About</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
              >
                <span>Features</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full mt-2 py-2.5 border border-[#c2c7d1] rounded-xl font-medium text-center text-[#191c1d] hover:bg-[#e7e8e9] cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signup');
                }}
                className="w-full py-2.5 bg-[#0f4c81] text-white rounded-xl font-bold text-center hover:bg-[#00355f] cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {currentUser.role === 'organizer' ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
                  >
                    <span>Dashboard</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/my-events');
                    }}
                    className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
                  >
                    <span>My Events</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
                  >
                    <span>My Events</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/profile');
                }}
                className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
              >
                <span>Profile</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              {currentUser.role === 'organizer' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/create-event');
                  }}
                  className="text-left py-2 font-medium text-[#191c1d] flex items-center justify-between border-b border-[#edeeef] cursor-pointer"
                >
                  <span>Create Event</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full mt-2 py-2.5 bg-red-600 text-white rounded-xl font-bold text-center hover:bg-red-700 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
export default Navbar;
