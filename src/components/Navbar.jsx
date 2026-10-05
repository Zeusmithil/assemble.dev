import React, { useState } from 'react';

const CITIES = ['Chennai', 'San Francisco', 'New York', 'London', 'Bangalore', 'Tokyo'];

const ROLE_CONFIGS = {
  attendee: { label: 'Attendee', icon: '🎟' },
  organizer: { label: 'Organizer', icon: '🎯' },
  speaker: { label: 'Speaker', icon: '🎤' },
  sponsor: { label: 'Sponsor', icon: '💼' },
  venue: { label: 'Venue Provider', icon: '📍' },
};

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
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeRole = userRole || currentUser?.role || 'attendee';

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

  const handleRoleSwitch = (newRole) => {
    setUserRole(newRole);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      localStorage.setItem('assemble_session', JSON.stringify(updated));
    }
    navigate('/dashboard');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-2xs transition-all">
      <div className="flex justify-between items-center px-4 md:px-10 py-3.5 max-w-[1280px] mx-auto">
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate('/')}
            className="font-geist text-xl font-black tracking-tight uppercase text-black flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shadow-xs">E</span>
            <span>Event Horizon</span>
          </button>

          {/* Quick Location Badge - shown only after user logs in */}
          {currentUser && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white/90 text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-all shadow-2xs cursor-pointer backdrop-blur-md"
              >
                <span className="material-symbols-outlined text-sm text-gray-500">location_on</span>
                <span>{selectedCity}</span>
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>

              {locationDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-scaleUp">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Select City
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedCity === city ? 'font-bold text-[#00355f] bg-blue-50/60' : 'text-gray-600'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="material-symbols-outlined text-sm text-[#00355f]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation Links - shown only after user logs in */}
        {currentUser && (
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center text-xs font-semibold text-gray-600">
            {/* Primary Home Link */}
            <button
              onClick={() => navigate('/dashboard')}
              className={`transition-colors hover:text-black cursor-pointer flex items-center gap-1.5 ${
                currentPath === '/dashboard' ? 'text-[#00355f] font-bold' : ''
              }`}
            >
              <span>Home</span>
            </button>

            {/* Discover Link */}
            <button
              onClick={() => navigate('/discover')}
              className={`transition-colors hover:text-black cursor-pointer ${
                currentPath === '/discover' ? 'text-[#00355f] font-bold' : ''
              }`}
            >
              Browse Events
            </button>

            {/* Marketplaces - Hide for Attendee Role */}
            {activeRole !== 'attendee' && (
              <>
                <button
                  onClick={() => navigate('/speakers-marketplace')}
                  className={`transition-colors hover:text-black cursor-pointer ${
                    currentPath === '/speakers-marketplace' ? 'text-[#00355f] font-bold' : ''
                  }`}
                >
                  Speakers
                </button>

                <button
                  onClick={() => navigate('/venues-marketplace')}
                  className={`transition-colors hover:text-black cursor-pointer ${
                    currentPath === '/venues-marketplace' ? 'text-[#00355f] font-bold' : ''
                  }`}
                >
                  Venues
                </button>
              </>
            )}

            {/* Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className={`px-3.5 py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                currentPath === '/profile'
                  ? 'bg-black text-white border-black shadow-2xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
              }`}
              title="Profile & Roles"
            >
              <span className="material-symbols-outlined text-sm">account_circle</span>
              <span>Profile</span>
            </button>
          </nav>
        )}

        {/* Right Actions & Multi-Role Switcher */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <>
              {/* Accessible Multi-Role Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="px-3.5 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 text-xs font-bold text-[#00355f] hover:bg-blue-100/80 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer backdrop-blur-md"
                  title="Switch Active Platform Role"
                >
                  <span>{ROLE_CONFIGS[activeRole]?.icon || '🎟'}</span>
                  <span className="hidden sm:inline">{ROLE_CONFIGS[activeRole]?.label || 'Attendee'}</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-scaleUp text-left">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Switch Role View
                    </div>
                    {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => handleRoleSwitch(key)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                          activeRole === key ? 'font-bold text-[#00355f] bg-blue-50/60' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span>{config.label}</span>
                        </div>
                        {activeRole === key && (
                          <span className="material-symbols-outlined text-sm text-[#00355f]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Create Event CTA for Organizer */}
              {activeRole === 'organizer' && (
                <button
                  onClick={() => navigate('/create-event')}
                  className="font-geist text-xs bg-black text-white hover:bg-gray-800 transition-all px-4 py-2 rounded-full font-bold shadow-2xs hidden sm:flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Create Event</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="font-geist text-xs text-red-600 hover:bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full transition-colors font-bold cursor-pointer hidden sm:block"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="font-geist text-xs text-black hover:bg-gray-100 px-3.5 py-2 rounded-full transition-colors font-bold cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="font-geist text-xs bg-[#0f4c81] text-white hover:bg-[#00355f] transition-all px-4 sm:px-5 py-2 rounded-full font-bold shadow-2xs active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Menu Button - shown only after user logs in */}
          {currentUser && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-black p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu - only after user logs in */}
      {mobileMenuOpen && currentUser && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-[#e1e3e4] px-5 py-4 flex flex-col gap-3 animate-fadeIn shadow-lg text-left">
          {/* Mobile City Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e4]">
            <span className="text-xs font-bold text-gray-400 uppercase">City</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-[#00355f]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* If user logged in: Role Switcher inside mobile drawer */}
          {currentUser && (
            <div className="pb-2 border-b border-[#e1e3e4] space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Switch Role</span>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(ROLE_CONFIGS).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleRoleSwitch(key)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                      activeRole === key ? 'bg-[#0f4c81] text-white' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span className="truncate">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate(currentUser ? '/dashboard' : '/');
            }}
            className="py-2 text-xs font-bold text-[#00355f] flex items-center justify-between border-b border-gray-100"
          >
            <span>Home</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/discover');
            }}
            className="py-2 text-xs font-bold text-gray-700 flex items-center justify-between border-b border-gray-100"
          >
            <span>Browse Events</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>

          {activeRole !== 'attendee' && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/speakers-marketplace');
                }}
                className="py-2 text-xs font-bold text-gray-700 flex items-center justify-between border-b border-gray-100"
              >
                <span>Speakers Marketplace</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/venues-marketplace');
                }}
                className="py-2 text-xs font-bold text-gray-700 flex items-center justify-between border-b border-gray-100"
              >
                <span>Venues Marketplace</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </>
          )}

          {currentUser ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/profile');
                }}
                className="py-2 text-xs font-bold text-gray-700 flex items-center justify-between border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">account_circle</span>
                  <span>Profile</span>
                </div>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 mt-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs border border-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-xs text-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/signup');
                }}
                className="flex-1 py-2.5 bg-[#0f4c81] text-white rounded-xl font-bold text-xs"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
export default Navbar;
