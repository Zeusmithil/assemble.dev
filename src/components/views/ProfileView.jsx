import React, { useState } from 'react';

const ALL_ROLES = [
  { id: 'attendee', title: 'Attendee', icon: '🎟', desc: 'Discover and participate in experiences' },
  { id: 'organizer', title: 'Organizer', icon: '🎯', desc: 'Create, fund, and manage live events' },
  { id: 'speaker', title: 'Speaker', icon: '🎤', desc: 'Showcase expertise & deliver keynotes' },
  { id: 'sponsor', title: 'Sponsor', icon: '💼', desc: 'Discover & grant event funding' },
  { id: 'venue', title: 'Venue Provider', icon: '📍', desc: 'Host events in your verified spaces' },
];

export const ProfileView = ({
  currentUser,
  onRoleChange,
  onLogout,
  communities = [],
  onJoinCommunity,
  onOpenCommunityRoom,
  onCreateCommunityRoom,
  onUpdateCapabilities,
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

  const currentRole = currentUser.role || 'attendee';
  const userCapabilities = currentUser.capabilities || [currentRole, 'attendee'];

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
      const text = `Join my community room "${roomName}" on Event Horizon! Use the unique Room Code: ${newRoomCode}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      setShared('Shared successfully to WhatsApp.');
    } else if (channel === 'email') {
      const subject = `Join community room: ${roomName}`;
      const body = `Hi,\n\nJoin my community room "${roomName}" on Event Horizon using the unique Room Code: ${newRoomCode}.\n\nBest regards!`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
      setShared('Email client opened successfully.');
    }
  };



  const userCommunities = currentUser.communities || [];

  return (
    <div className="px-4 md:px-10 max-w-[900px] mx-auto py-8 space-y-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="border-b border-[#e1e3e4] pb-6">
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          User Settings & Multi-Role Identity
        </span>
        <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
          My Profile & Role Preferences
        </h1>
        <p className="font-inter text-sm text-[#5f5e5e] mt-1">
          One account. One platform. Multiple ways to participate.
        </p>
      </div>

      {/* Profile Details Card with Glassmorphism */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-blue-900/5 space-y-6">
        {/* User Info & Primary Role */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#edeeef] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00355f] to-[#0f4c81] text-white flex items-center justify-center text-2xl font-bold font-geist shadow-md">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-geist text-xl font-bold text-[#00355f]">{currentUser.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0f4c81] border border-blue-100">
                  Primary: {ALL_ROLES.find((r) => r.id === currentRole)?.title || currentRole}
                </span>
              </div>
              <p className="font-inter text-xs text-gray-500 mt-0.5">{currentUser.email} • {currentUser.location || 'Chennai'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer w-fit"
          >
            Sign Out
          </button>
        </div>

        {/* Accessible Mode / Active Dashboard Switcher */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider">
                Active Dashboard View
              </h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-0.5">
                Switch which dashboard loads when you visit Event Horizon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {ALL_ROLES.map((r) => {
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onRoleChange && onRoleChange(r.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-[#0f4c81] text-white border-[#0f4c81] shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-xs font-bold">{r.title}</span>
                  {isActive && <span className="text-[9px] text-blue-200 uppercase font-black">Active</span>}
                </button>
              );
            })}
          </div>
        </div>



        {/* Join Community Code Card */}
        <div className="pt-6 border-t border-[#edeeef] space-y-4">
          <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider">
            Join a Community
          </h3>
          <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
            Enter a unique community room joining code to immediately join a private community space.
          </p>

          <form onSubmit={handleJoin} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. EH-AI2026"
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
              className={`p-3 rounded-xl text-xs font-bold w-fit ${
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
        <div className="pt-6 border-t border-[#edeeef] space-y-4">
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
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-geist font-bold text-xs shadow-xs transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer w-fit"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Create a Room</span>
            </button>
          </div>
        </div>

        {/* My Communities List */}
        <div className="pt-6 border-t border-[#edeeef] space-y-4">
          <h3 className="font-geist font-bold text-sm text-[#00355f] uppercase tracking-wider">
            My Communities ({userCommunities.length})
          </h3>

          {userCommunities.length === 0 ? (
            <p className="text-xs text-gray-500 italic">You haven't joined any communities yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userCommunities.map((comName) => {
                const matched = communities.find((c) => c.name === comName);
                return (
                  <div
                    key={comName}
                    onClick={() => {
                      if (matched && onOpenCommunityRoom) {
                        onOpenCommunityRoom(matched);
                      }
                    }}
                    className="p-4 border border-[#e1e3e4] rounded-2xl bg-[#f8f9fa] hover:bg-[#d2e4ff]/10 hover:border-[#0f4c81] transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-geist font-bold text-xs text-[#00355f]">{comName}</h4>
                      <span className="font-mono text-[9px] text-[#5f5e5e]">Code: {matched?.code || '—'}</span>
                    </div>
                    <span className="material-symbols-outlined text-base text-[#0f4c81]">chevron_right</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Community Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-5 animate-scaleUp text-left">
            <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">Create Community Room</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRoomCode('');
                }}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {!newRoomCode ? (
              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-inter">
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Room Name</label>
                  <input
                    type="text"
                    required
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. AI Engineers Guild"
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    placeholder="What is this community room about?"
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Basic Info / Domain</label>
                  <input
                    type="text"
                    value={roomInfo}
                    onChange={(e) => setRoomInfo(e.target.value)}
                    placeholder="e.g. Technology & Developers"
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                  >
                    Generate Room Code
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <div>
                  <h4 className="font-geist font-bold text-lg text-[#00355f]">Room Created Successfully!</h4>
                  <p className="font-inter text-xs text-gray-500 mt-1">
                    Share this unique Room Code with members to invite them:
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-[#00355f] tracking-widest">{newRoomCode}</span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold hover:bg-[#00355f]"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Share via WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                  >
                    Share via Email
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewRoomCode('');
                  }}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold"
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
export default ProfileView;
