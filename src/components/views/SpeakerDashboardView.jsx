import React, { useState } from 'react';

export const SpeakerDashboardView = ({
  currentUser,
  events = [],
  speakers = [],
  speakingInvites = [],
  onAcceptInvite,
  onDeclineInvite,
  onApplyForSpeaking,
  onUpdateSpeakerProfile,
  setActiveView,
  onSelectEvent,
  onRoleChange,
}) => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [showEditModal, setShowEditModal] = useState(false);
  const [availability, setAvailability] = useState(currentUser?.speakerProfile?.availability || 'Available for Bookings');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applicationPitch, setApplicationPitch] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Profile fields state
  const [title, setTitle] = useState(currentUser?.speakerProfile?.title || 'Tech Keynote Speaker & AI Specialist');
  const [org, setOrg] = useState(currentUser?.speakerProfile?.organization || 'Independent');
  const [bio, setBio] = useState(currentUser?.speakerProfile?.bio || 'Passionate about artificial intelligence, human-computer interaction, and developer ecosystems.');
  const [topics, setTopics] = useState(currentUser?.speakerProfile?.topics || ['Artificial Intelligence', 'System Architecture', 'Developer Experience']);
  const [newTopic, setNewTopic] = useState('');
  const [feeType, setFeeType] = useState(currentUser?.speakerProfile?.feeType || 'fee');
  const [feeAmount, setFeeAmount] = useState(currentUser?.speakerProfile?.feeAmount || '2500');
  const [currency, setCurrency] = useState(currentUser?.speakerProfile?.currency || '€');
  const [videoUrl, setVideoUrl] = useState(currentUser?.speakerProfile?.videoUrl || '');
  const [videoFileName, setVideoFileName] = useState(currentUser?.speakerProfile?.videoFileName || '');
  const [videoFileSize, setVideoFileSize] = useState(currentUser?.speakerProfile?.videoFileSize || '');
  const [yearsExperience, setYearsExperience] = useState(currentUser?.speakerProfile?.yearsExperience || '8');

  const handleVideoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setVideoFileName(file.name);
    setVideoFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

    if (file.size <= 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setVideoUrl(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl('');
    setVideoFileName('');
    setVideoFileSize('');
  };

  // Filter events looking for speakers
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= new Date());
  const myAcceptedEvents = speakingInvites.filter((inv) => inv.status === 'accepted' && (inv.speakerEmail === currentUser?.email || inv.speakerName === currentUser?.name));
  const myPendingInvites = speakingInvites.filter((inv) => inv.status === 'pending' && (inv.speakerEmail === currentUser?.email || inv.speakerName === currentUser?.name));

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (t) => {
    setTopics(topics.filter((item) => item !== t));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateSpeakerProfile) {
      onUpdateSpeakerProfile({
        title,
        organization: org,
        bio,
        topics,
        feeType,
        feeAmount,
        currency,
        videoUrl,
        videoFileName,
        videoFileSize,
        yearsExperience,
        availability,
      });
    }
    setShowEditModal(false);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (onApplyForSpeaking && selectedOpportunity) {
      onApplyForSpeaking(selectedOpportunity.id, applicationPitch);
      setApplicationSuccess(true);
      setTimeout(() => {
        setApplicationSuccess(false);
        setSelectedOpportunity(null);
        setApplicationPitch('');
      }, 1500);
    }
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn text-left">
      {/* Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#00355f] via-[#0f4c81] to-[#0066b2] p-8 md:p-10 text-white shadow-xl shadow-blue-900/10 border border-white/20 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
              <span>🎤</span>
              <span>Speaker Command Center</span>
            </div>
            <h1 className="font-geist text-3xl md:text-4xl font-extrabold tracking-tight">
              Build Your Speaking Profile
            </h1>
            <p className="font-inter text-sm text-blue-100/90 leading-relaxed">
              Showcase your thought leadership, receive keynote invitations from organizers, and discover speaking stages worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-5 py-2.5 bg-white/90 hover:bg-white text-[#00355f] rounded-2xl font-geist font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>Edit Speaker Profile</span>
            </button>
            <button
              onClick={() => onRoleChange && onRoleChange('attendee')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-geist font-bold text-xs border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              <span>Switch to Attendee Mode</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Stats Grid with Glassmorphic Translucent Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0f4c81] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">mail</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{myPendingInvites.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Pending Invites</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{myAcceptedEvents.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Confirmed Keynotes</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">campaign</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{upcomingEvents.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Open Stages</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">
              {feeType === 'free' ? 'Free' : `${currency}${feeAmount}`}
            </div>
            <div className="font-inter text-xs text-gray-500 font-medium">Base Fee Rate</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e1e3e4] gap-6 text-sm font-semibold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'opportunities'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">explore</span>
          <span>Speaking Opportunities ({upcomingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invitations')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'invitations'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">mail</span>
          <span>Invitations from Organizers ({myPendingInvites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my-events')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-events'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">event_note</span>
          <span>My Speaking Events ({myAcceptedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile-preview')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile-preview'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">badge</span>
          <span>Public Profile Preview</span>
        </button>
      </div>

      {/* TAB 1: Speaking Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-geist text-lg font-bold text-[#00355f]">Events Looking for Speakers</h2>
              <p className="font-inter text-xs text-gray-500">Apply to present keynotes, lightning talks, or panel discussions.</p>
            </div>
            <button
              onClick={() => setActiveView('discover')}
              className="text-xs font-bold text-[#0f4c81] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all public events</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0f4c81] px-2.5 py-1 rounded-lg">
                      {evt.category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Open Call
                    </span>
                  </div>

                  <h3 className="font-geist font-bold text-base text-[#00355f] leading-snug line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="font-inter text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-1.5 pt-2 text-xs font-inter text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-gray-400">calendar_today</span>
                      <span>{evt.startDate} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                      <span>{evt.location}, {evt.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-gray-400">group</span>
                      <span>Expected: {evt.expectedAttendees || 200}+ attendees</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#edeeef] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectEvent && onSelectEvent(evt)}
                    className="text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setSelectedOpportunity(evt)}
                    className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Apply to Speak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Invitations */}
      {activeTab === 'invitations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-geist text-lg font-bold text-[#00355f]">Keynote Invitations</h2>
              <p className="font-inter text-xs text-gray-500">Organizers who directly requested your speaking presence.</p>
            </div>
          </div>

          {myPendingInvites.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0f4c81] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">mail</span>
              </div>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Pending Invitations</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                When organizers discover your profile in the Speakers Marketplace and invite you, their proposals will appear here.
              </p>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-5 py-2.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Polish Your Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPendingInvites.map((inv) => (
                <div key={inv.id} className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                        Pending Response
                      </span>
                      <h3 className="font-geist text-base font-bold text-[#00355f] mt-2">{inv.eventTitle}</h3>
                      <p className="font-inter text-xs text-gray-500">From Organizer: {inv.organizerName || 'Event Host'}</p>
                    </div>
                  </div>
                  <p className="font-inter text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    "{inv.message || 'We would be honored to host you for a 30-minute keynote on your area of expertise.'}"
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onDeclineInvite && onDeclineInvite(inv.id)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onAcceptInvite && onAcceptInvite(inv.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Accept Invitation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: My Speaking Events */}
      {activeTab === 'my-events' && (
        <div className="space-y-4">
          <h2 className="font-geist text-lg font-bold text-[#00355f]">Confirmed Speaking Engagements</h2>
          {myAcceptedEvents.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Confirmed Engagements Yet</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                Apply to open speaker calls or accept keynote invitations to populate your speaking schedule.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAcceptedEvents.map((ev) => (
                <div key={ev.id} className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                      Confirmed Keynote
                    </span>
                    <h3 className="font-geist font-bold text-[#00355f] text-base mt-2">{ev.eventTitle}</h3>
                    <p className="font-inter text-xs text-gray-500">Date: {ev.date || 'Upcoming'}</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Public Profile Preview */}
      {activeTab === 'profile-preview' && (
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2.5rem] p-8 md:p-10 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#edeeef] pb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00355f] to-[#0f4c81] text-white flex items-center justify-center font-geist text-3xl font-extrabold shadow-md border-4 border-white">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="font-geist text-2xl font-bold text-[#00355f]">{currentUser?.name}</h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full w-fit mx-auto sm:mx-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{availability}</span>
                </span>
              </div>
              <p className="font-inter text-sm font-semibold text-[#0f4c81]">{title}</p>
              <p className="font-inter text-xs text-gray-500">{org} • {yearsExperience} Years Experience</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">Bio & Background</h4>
            <p className="font-inter text-sm text-gray-700 leading-relaxed bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
              {bio}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">Featured Topics</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((t, idx) => (
                <span key={idx} className="px-3.5 py-1.5 bg-blue-50/80 border border-blue-100 text-[#00355f] font-inter text-xs font-semibold rounded-xl">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {videoUrl && (
            <div className="space-y-2 pt-2">
              <h4 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">Introduction & Demo Reel</h4>
              <div className="p-3.5 bg-[#f8f9fa] rounded-2xl border border-[#e1e3e4] space-y-2.5">
                <div className="rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-h-64 object-contain"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                </div>
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-[#00355f] flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-blue-600 text-sm">smart_display</span>
                    <span className="truncate">{videoFileName || 'Keynote Demo Video'}</span>
                  </span>
                  {videoFileSize && <span className="text-[11px] text-gray-400 flex-shrink-0">{videoFileSize}</span>}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#edeeef] flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Speaking Rate</span>
              <span className="font-geist text-lg font-black text-[#00355f]">
                {feeType === 'free' ? 'Pro-bono / Free' : `${currency}${feeAmount} per Keynote`}
              </span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-5 py-2.5 bg-[#0f4c81] text-white rounded-xl font-bold text-xs hover:bg-[#00355f]"
            >
              Edit Details
            </button>
          </div>
        </div>
      )}

      {/* Cross-Role Additional Capabilities Drawer */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f4c81]">hub</span>
          <h3 className="font-geist text-base font-bold text-[#00355f]">Cross-Role Capabilities</h3>
        </div>
        <p className="font-inter text-xs text-gray-600 max-w-2xl leading-relaxed">
          As a registered Speaker, your account also allows you to discover events as an attendee, launch community rooms, or host your own full events.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => onRoleChange && onRoleChange('attendee')}
            className="p-4 bg-white rounded-2xl border border-blue-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎟 Attendee Portal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Register for upcoming conferences and save tickets.</p>
          </button>

          <button
            onClick={() => setActiveView('create-event')}
            className="p-4 bg-white rounded-2xl border border-blue-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎯 Organize Event</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Host your own workshop, meetup, or masterclass.</p>
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className="p-4 bg-white rounded-2xl border border-blue-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>👥 Community Hub</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Join or launch private community spaces with room codes.</p>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#e1e3e4] space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">✏️ Edit Speaker Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-inter">
              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Professional Title / Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Researcher & Tech Keynote Speaker"
                  className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Years of Experience</label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Short Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe your background, career milestones, and speaking style..."
                  className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Speaking Topics</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add topic (e.g. LLM Reasoning)"
                    className="flex-grow px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-[#0f4c81] text-white rounded-xl font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {topics.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-semibold flex items-center gap-1.5">
                      {t}
                      <button type="button" onClick={() => handleRemoveTopic(t)} className="text-gray-400 hover:text-black">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">
                  Intro / Demo Reel Video (Upload from Device)
                </label>
                {videoUrl ? (
                  <div className="p-3 bg-[#f8f9fa] rounded-2xl border border-[#c2c7d1] space-y-2">
                    <div className="rounded-xl overflow-hidden bg-black max-h-48 flex items-center justify-center">
                      <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-48 object-contain"
                      >
                        Your browser does not support HTML5 video.
                      </video>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2 truncate">
                        <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                        <span className="font-semibold text-gray-800 truncate">{videoFileName || 'Selected Video File'}</span>
                        {videoFileSize && <span className="text-gray-400 text-[11px]">({videoFileSize})</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <label className="text-[11px] font-bold text-[#0f4c81] hover:underline cursor-pointer">
                          Change
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveVideo}
                          className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] bg-[#f8f9fa] hover:bg-blue-50/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#0f4c81] transition-colors mb-1">
                      video_file
                    </span>
                    <span className="text-xs font-bold text-[#00355f] group-hover:text-[#0f4c81]">
                      Choose video file from your device
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5">
                      MP4, WebM, MOV, or MKV (demo reel or keynote clip)
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Speaking Fee</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeeType('free')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs ${feeType === 'free' ? 'bg-[#0f4c81] text-white border-[#0f4c81]' : 'border-gray-200 bg-gray-50'}`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeType('fee')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs ${feeType === 'fee' ? 'bg-[#0f4c81] text-white border-[#0f4c81]' : 'border-gray-200 bg-gray-50'}`}
                  >
                    Fixed Fee
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeeType('depends')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold text-xs ${feeType === 'depends' ? 'bg-[#0f4c81] text-white border-[#0f4c81]' : 'border-gray-200 bg-gray-50'}`}
                  >
                    Depends
                  </button>
                </div>
                {feeType !== 'free' && (
                  <div className="flex gap-2 pt-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-20 px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    >
                      <option value="€">€ (EUR)</option>
                      <option value="$">$ (USD)</option>
                      <option value="₹">₹ (INR)</option>
                      <option value="£">£ (GBP)</option>
                    </select>
                    <input
                      type="number"
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(e.target.value)}
                      placeholder="Approx fee"
                      className="flex-grow px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-semibold"
                >
                  <option value="Available for Bookings">Available for Bookings</option>
                  <option value="Open to Keynotes Only">Open to Keynotes Only</option>
                  <option value="Limited Availability">Limited Availability</option>
                  <option value="On Hiatus">On Hiatus</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#edeeef] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply to Speak Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
              <h3 className="font-geist text-base font-bold text-[#00355f]">Apply as Keynote Speaker</h3>
              <button onClick={() => setSelectedOpportunity(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            {applicationSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-geist font-bold text-emerald-700">Application Submitted!</h4>
                <p className="font-inter text-xs text-gray-500">The event organizer will review your proposal and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs font-inter">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Target Event</span>
                  <div className="font-bold text-[#00355f] text-sm mt-0.5">{selectedOpportunity.title}</div>
                  <div className="text-[11px] text-gray-500">{selectedOpportunity.startDate} • {selectedOpportunity.location}</div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Your Keynote Topic & Pitch</label>
                  <textarea
                    required
                    rows={4}
                    value={applicationPitch}
                    onChange={(e) => setApplicationPitch(e.target.value)}
                    placeholder="Describe what you plan to speak on, key audience takeaways, and why you are a great fit..."
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOpportunity(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SpeakerDashboardView;
