import React, { useState, useMemo } from 'react';
import { INITIAL_SPEAKERS } from '../../data/initialData';

export const SpeakerMarketplaceView = ({ onBack, onInviteSpeaker }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [selectedFee, setSelectedFee] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSpeakerProfile, setSelectedSpeakerProfile] = useState(null);
  const [invitedSpeaker, setInvitedSpeaker] = useState(null);
  const [inviteEventTitle, setInviteEventTitle] = useState('Design Systems Architecture Summit');
  const [inviteMessage, setInviteMessage] = useState('We would love to invite you as our keynote speaker for this session.');

  // Combine initial speakers with any dynamically registered speakers from local storage
  const allSpeakers = useMemo(() => {
    const local = JSON.parse(localStorage.getItem('assemble_speakers') || '[]');
    // Avoid duplicate IDs
    const combined = [...local, ...INITIAL_SPEAKERS];
    const unique = [];
    const seen = new Set();
    combined.forEach((s) => {
      const key = s.email || s.name;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(s);
      }
    });
    return unique;
  }, []);

  // Extract all unique expertise chips for filtration
  const allExpertise = useMemo(() => {
    const set = new Set();
    allSpeakers.forEach((s) => {
      if (Array.isArray(s.expertise)) {
        s.expertise.forEach((e) => set.add(e));
      }
    });
    return Array.from(set);
  }, [allSpeakers]);

  // Extract unique locations
  const allLocations = useMemo(() => {
    const set = new Set();
    allSpeakers.forEach((s) => {
      if (s.location) set.add(s.location);
    });
    return ['All', ...Array.from(set)];
  }, [allSpeakers]);

  // Filter speakers list
  const filteredSpeakers = useMemo(() => {
    return allSpeakers.filter((spk) => {
      // Expertise filter
      if (selectedExpertise !== 'All') {
        const hasExp = spk.expertise && spk.expertise.some((e) => e.toLowerCase() === selectedExpertise.toLowerCase());
        if (!hasExp) return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && spk.location && spk.location !== selectedLocation) {
        return false;
      }

      // Fee filter
      const numericFee = Number(String(spk.fee).replace(/[^0-9]/g, '')) || 0;
      if (selectedFee === 'free' && !String(spk.fee).toLowerCase().includes('free')) return false;
      if (selectedFee === 'budget' && (numericFee >= 3000 || String(spk.fee).toLowerCase().includes('free'))) return false;
      if (selectedFee === 'mid' && (numericFee < 3000 || numericFee > 5000)) return false;
      if (selectedFee === 'premium' && numericFee <= 5000) return false;

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = spk.name?.toLowerCase().includes(query);
        const matchesBio = spk.bio?.toLowerCase().includes(query);
        const matchesCompany = spk.company?.toLowerCase().includes(query);
        const matchesDesignation = spk.designation?.toLowerCase().includes(query);
        const matchesExpertise = spk.expertise?.some((e) => e.toLowerCase().includes(query));
        if (!matchesName && !matchesBio && !matchesCompany && !matchesDesignation && !matchesExpertise) return false;
      }

      return true;
    });
  }, [allSpeakers, selectedExpertise, selectedFee, selectedLocation, searchTerm]);

  const handleSendInvitation = (e) => {
    e.preventDefault();
    if (invitedSpeaker) {
      const invites = JSON.parse(localStorage.getItem('assemble_speaking_invites') || '[]');
      const newInvite = {
        id: `inv-${Date.now()}`,
        speakerId: invitedSpeaker.id,
        speakerName: invitedSpeaker.name,
        speakerEmail: invitedSpeaker.email,
        eventTitle: inviteEventTitle,
        message: inviteMessage,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      invites.unshift(newInvite);
      localStorage.setItem('assemble_speaking_invites', JSON.stringify(invites));

      if (onInviteSpeaker) {
        onInviteSpeaker(newInvite);
      }

      alert(`✓ Keynote invitation dispatched to ${invitedSpeaker.name}! They will see it on their Speaker Dashboard.`);
      setInvitedSpeaker(null);
    }
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-6 animate-fadeIn text-left">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <span>← Back to Home</span>
        </button>
      )}

      {/* Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#00355f] via-[#0f4c81] to-[#0066b2] p-8 md:p-10 text-white shadow-xl shadow-blue-900/10 border border-white/20 backdrop-blur-md">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
            <span>🎤</span>
            <span>Thought Leadership Marketplace</span>
          </div>
          <h1 className="font-geist text-3xl md:text-4xl font-extrabold tracking-tight">
            Speakers Marketplace
          </h1>
          <p className="font-inter text-sm text-blue-100/90 leading-relaxed">
            Source world-class keynotes, technical panelists, and masterclass mentors. Review speaking demo reels and dispatch booking invitations directly.
          </p>
        </div>
      </div>

      {/* Advanced Filters Bento Card */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-[#e1e3e4] shadow-xs space-y-4">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-5 text-gray-400">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search speakers by name, company, keynote topic, or bio..."
            className="w-full pl-14 pr-10 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-2xl font-inter text-xs text-black focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-400 hover:text-black">
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Expertise / Domain</span>
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Topics ({allExpertise.length})</option>
              {allExpertise.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Booking Fee Rate</span>
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Fee Ranges</option>
              <option value="free">Pro-bono / Free</option>
              <option value="budget">Budget (&lt; $3,000)</option>
              <option value="mid">Mid-Range ($3,000 - $5,000)</option>
              <option value="premium">Premium ($5,000+)</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Speaker Location</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Speakers Grid */}
      {filteredSpeakers.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-2">
          <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
          <h3 className="font-geist text-lg font-bold text-[#00355f]">No Matching Speakers Found</h3>
          <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your topic or fee filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSpeakers.map((spk) => (
            <div
              key={spk.id}
              className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2rem] p-6 shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={spk.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                    alt={spk.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#e1e3e4] shadow-xs"
                  />
                  <div>
                    <h3 className="font-geist font-bold text-[#00355f] text-base leading-snug">{spk.name}</h3>
                    <p className="font-inter text-xs text-[#5f5e5e]">{spk.designation}</p>
                    <p className="font-inter text-xs font-semibold text-[#0f4c81]">{spk.company}</p>
                  </div>
                </div>

                <p className="font-inter text-xs text-[#42474f] line-clamp-3 leading-relaxed">
                  {spk.bio}
                </p>

                {spk.expertise && spk.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {spk.expertise.slice(0, 3).map((exp, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-50/70 text-[#00355f] text-[10px] font-bold rounded-lg border border-blue-100">
                        {exp}
                      </span>
                    ))}
                    {spk.expertise.length > 3 && (
                      <span className="px-2 py-1 text-[10px] text-gray-400 font-bold">
                        +{spk.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#edeeef] flex justify-between items-center gap-2">
                <div className="font-geist text-xs font-black text-[#00355f]">{spk.fee}</div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelectedSpeakerProfile(spk)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Bio
                  </button>
                  <button
                    onClick={() => setInvitedSpeaker(spk)}
                    className="px-4 py-1.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs active:scale-95"
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dedicated Speaker Public Profile Modal */}
      {selectedSpeakerProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#e1e3e4] space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedSpeakerProfile.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                  alt={selectedSpeakerProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <h3 className="font-geist text-xl font-bold text-[#00355f]">{selectedSpeakerProfile.name}</h3>
                  <p className="font-inter text-xs text-gray-500">{selectedSpeakerProfile.designation} • {selectedSpeakerProfile.company}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Available for Keynotes</span>
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedSpeakerProfile(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Speaker Biography</span>
              <p className="font-inter text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {selectedSpeakerProfile.bio}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Specialization & Topics</span>
              <div className="flex flex-wrap gap-2">
                {(selectedSpeakerProfile.expertise || []).map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-[#00355f] text-xs font-semibold rounded-xl border border-blue-100">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {selectedSpeakerProfile.videoUrl && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Keynote Demo Video</span>
                {selectedSpeakerProfile.videoUrl.includes('youtube.com') || selectedSpeakerProfile.videoUrl.includes('youtu.be') ? (
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-500 text-xl">play_circle</span>
                      <span className="text-xs font-bold text-[#00355f]">Keynote Demo Reel</span>
                    </div>
                    <a
                      href={selectedSpeakerProfile.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800"
                    >
                      Watch Video
                    </a>
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden bg-black max-h-56 flex items-center justify-center border border-gray-100">
                    <video
                      src={selectedSpeakerProfile.videoUrl}
                      controls
                      className="w-full max-h-56 object-contain"
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Speaking Rate</span>
                <span className="font-geist text-base font-black text-[#00355f]">{selectedSpeakerProfile.fee}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedSpeakerProfile(null);
                  setInvitedSpeaker(selectedSpeakerProfile);
                }}
                className="px-6 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs"
              >
                Send Speaking Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {invitedSpeaker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 animate-scaleUp text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-geist text-base font-bold text-[#00355f]">Invite Speaker to Your Event</h3>
              <button onClick={() => setInvitedSpeaker(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            <form onSubmit={handleSendInvitation} className="space-y-4 text-xs font-inter">
              <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <img
                  src={invitedSpeaker.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400'}
                  alt={invitedSpeaker.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <div className="font-bold text-[#00355f]">{invitedSpeaker.name}</div>
                  <div className="text-[11px] text-gray-500">{invitedSpeaker.designation} • {invitedSpeaker.company}</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Event Title</label>
                <input
                  type="text"
                  required
                  value={inviteEventTitle}
                  onChange={(e) => setInviteEventTitle(e.target.value)}
                  placeholder="e.g. AI Innovation Summit 2026"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Invitation Message & Session Topic</label>
                <textarea
                  rows={3}
                  required
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Describe your session format, target audience, and honorary offer..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInvitedSpeaker(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpeakerMarketplaceView;
