import React, { useState } from 'react';

export const ProfileView = ({
  currentUser,
  onRoleChange,
  onLogout,
  communities = [],
  onJoinCommunity,
  onOpenCommunityRoom,
  onCreateCommunityRoom
}) => {
  const [code, setCode] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);

  // Create Room modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [roomLogo, setRoomLogo] = useState('');
  const [roomInfo, setRoomInfo] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(null);

  if (!currentUser) return null;

  const handleJoin = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setStatusMsg('');

    const res = onJoinCommunity(code);
    if (res.success) {
      setIsError(false);
      setStatusMsg(res.message);
      setCode('');
    } else {
      setIsError(true);
      setStatusMsg(res.message);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim() || !roomDesc.trim()) return;

    const createdCom = onCreateCommunityRoom(roomName, roomDesc, roomLogo, roomInfo);
    if (createdCom && createdCom.code) {
      setNewRoomCode(createdCom.code);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (channel) => {
    if (channel === 'whatsapp') {
      const text = `Join my community room "${roomName}" on assemble.dev! Use the unique Room Code: ${newRoomCode}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      setShared('Shared successfully to WhatsApp.');
    } else if (channel === 'email') {
      const subject = `Join community room: ${roomName}`;
      const body = `Hi,\n\nJoin my community room "${roomName}" on assemble.dev using the unique Room Code: ${newRoomCode}.\n\nBest regards!`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      setShared('Email client opened successfully.');
    }
  };

  const userCommunities = currentUser.communities || [];

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
          Manage your personal information, community rooms, and adjust your platform role.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-10 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-[#edeeef] pb-6">
          <div className="w-16 h-16 rounded-full bg-[#d2e4ff] text-[#0f4c81] flex items-center justify-center text-xl font-bold font-geist">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-left">
            <h2 className="font-geist text-xl font-bold text-[#00355f]">{currentUser.name}</h2>
            <p className="font-inter text-xs text-gray-500">{currentUser.email}</p>
          </div>
        </div>



        {/* Join Community Code Card */}
        <div className="pt-6 border-t border-[#edeeef] space-y-4">
          <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider text-left">
            Join a Community
          </h3>
          <p className="font-inter text-xs text-[#5f5e5e] text-left leading-relaxed">
            Enter a unique community room joining code to immediately join a private community space.
          </p>

          <form onSubmit={handleJoin} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. AI2026X7"
              className="flex-grow px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-mono font-bold text-[#00355f]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-geist font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              Join Community
            </button>
          </form>

          {statusMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-bold w-fit text-left ${
                isError
                  ? 'bg-rose-50 border border-rose-100 text-rose-600'
                  : 'bg-green-50 border border-green-100 text-green-600'
              }`}
            >
              {statusMsg}
            </div>
          )}
        </div>

        {/* Start Community Card */}
        <div className="pt-6 border-t border-[#edeeef] space-y-4 text-left">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider">
                Start a Community
              </h3>
              <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed mt-0.5">
                Represent a group, organization, or cohort by setting up a private digital room.
              </p>
            </div>
            <button
              onClick={() => {
                setNewRoomCode('');
                setCopied(false);
                setShared(null);
                setRoomName('');
                setRoomDesc('');
                setRoomLogo('');
                setRoomInfo('');
                setShowCreateModal(true);
              }}
              className="px-5 py-2.5 border border-[#0f4c81] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white rounded-xl font-geist font-bold text-xs transition-all active:scale-98 cursor-pointer whitespace-nowrap align-self-start"
            >
              Create Room
            </button>
          </div>
        </div>

        {/* Account Role switcher */}
        <div className="pt-6 border-t border-[#edeeef] space-y-4">
          <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider text-left">
            Current Account Role
          </h3>
          <p className="font-inter text-xs text-[#5f5e5e] text-left leading-relaxed">
            You are currently browsing the platform as an <span className="font-bold text-[#0f4c81] uppercase">{currentUser.role}</span>. You can switch your role below to change your primary dashboard.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              onClick={() => onRoleChange('attendee')}
              className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                currentUser.role === 'attendee'
                  ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-xs'
                  : 'border-[#c2c7d1] bg-[#f8f9fa] text-[#42474f] hover:bg-gray-100'
              }`}
            >
              Attendee Mode
            </button>
            <button
              onClick={() => onRoleChange('organizer')}
              className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
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
          <div className="text-left">
            <h4 className="font-geist font-bold text-sm text-red-600">Sign Out</h4>
            <p className="font-inter text-xs text-gray-500 mt-0.5">End your active authenticated session.</p>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-98 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-6 animate-scaleUp relative overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-[#edeeef] pb-4">
              <span className="font-geist text-lg font-bold text-[#00355f]">Create Community Room</span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#727780] hover:text-[#191c1d] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg font-bold">close</span>
              </button>
            </div>

            {!newRoomCode ? (
              <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Community Name</label>
                  <input
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Developer Community"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Description</label>
                  <textarea
                    required
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    placeholder="Describe the purpose of your community..."
                    rows="3"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Logo / Banner URL (Optional)</label>
                  <input
                    type="url"
                    value={roomLogo}
                    onChange={(e) => setRoomLogo(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Basic Info (e.g. Category/Location)</label>
                  <input
                    type="text"
                    value={roomInfo}
                    onChange={(e) => setRoomInfo(e.target.value)}
                    placeholder="e.g. Technology, Chennai"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0f4c81] hover:bg-[#00355f] text-white transition-all rounded-xl font-geist font-bold text-xs shadow-xs cursor-pointer"
                >
                  Create & Generate Code
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl font-bold">done</span>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-geist font-bold text-sm text-[#00355f]">{roomName} Created!</h3>
                  <p className="font-inter text-[11px] text-[#5f5e5e]">
                    Your community room is ready. Share the unique room code below with members to join.
                  </p>
                </div>

                <div className="bg-[#f8f9fa] border border-[#c2c7d1] p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-extrabold uppercase text-[#727780] tracking-wider block">Unique Room Code</span>
                  <div className="font-mono text-xl font-black text-[#0f4c81] tracking-widest">{newRoomCode}</div>
                  
                  <div className="flex flex-wrap gap-2 justify-center pt-1">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-white border border-[#c2c7d1] hover:bg-gray-50 rounded-lg text-[9px] font-bold font-geist text-[#00355f] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>

                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg text-[9px] font-bold text-green-700 flex items-center gap-1 cursor-pointer border border-green-200"
                    >
                      <span>Share WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleShare('email')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-[9px] font-bold text-blue-700 flex items-center gap-1 cursor-pointer border border-blue-200"
                    >
                      <span>Share Email</span>
                    </button>
                  </div>
                </div>

                {shared && (
                  <p className="text-[10px] font-bold text-green-600 bg-green-50 p-2.5 rounded-xl border border-green-100 text-center">
                    {shared}
                  </p>
                )}

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2.5 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-bold font-geist cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


