import React from 'react';

export const ProfileView = ({ currentUser, onRoleChange, onLogout }) => {
  if (!currentUser) return null;

  return (
    <div className="px-4 md:px-10 max-w-[800px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-[#e1e3e4] pb-6">
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          User Settings
        </span>
        <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
          My Profile & Preferences
        </h1>
        <p className="font-inter text-sm text-[#5f5e5e] mt-1">
          Manage your personal information and adjust your platform role.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-10 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-[#edeeef] pb-6">
          <div className="w-16 h-16 rounded-full bg-[#d2e4ff] text-[#0f4c81] flex items-center justify-center text-xl font-bold font-geist">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="font-geist text-xl font-bold text-[#00355f]">{currentUser.name}</h2>
            <p className="font-inter text-xs text-gray-500">{currentUser.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider">
            Current Account Role
          </h3>
          <p className="font-inter text-xs text-[#5f5e5e] max-w-md leading-relaxed">
            You are currently browsing the platform as an <span className="font-bold text-[#0f4c81] uppercase">{currentUser.role}</span>. You can switch your role below to change your primary dashboard.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => onRoleChange('attendee')}
              className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-all ${
                currentUser.role === 'attendee'
                  ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-xs'
                  : 'border-[#c2c7d1] bg-[#f8f9fa] text-[#42474f] hover:bg-gray-100'
              }`}
            >
              Attendee Mode
            </button>
            <button
              onClick={() => onRoleChange('organizer')}
              className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-all ${
                currentUser.role === 'organizer'
                  ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-xs'
                  : 'border-[#c2c7d1] bg-[#f8f9fa] text-[#42474f] hover:bg-gray-100'
              }`}
            >
              Organizer Mode
            </button>
          </div>
        </div>

        {/* Danger Area */}
        <div className="pt-6 border-t border-[#edeeef] flex justify-between items-center">
          <div>
            <h4 className="font-geist font-bold text-sm text-red-600">Sign Out</h4>
            <p className="font-inter text-xs text-gray-500 mt-0.5">End your active authenticated session.</p>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-98"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
