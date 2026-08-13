import React, { useState, useMemo } from 'react';
import { INITIAL_SPEAKERS } from '../../data/initialData';

export const SpeakerMarketplaceView = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [selectedFee, setSelectedFee] = useState('All');
  const [invitedSpeaker, setInvitedSpeaker] = useState(null);

  // Extract all unique expertise chips for filtration
  const allExpertise = useMemo(() => {
    const set = new Set();
    INITIAL_SPEAKERS.forEach(s => s.expertise.forEach(e => set.add(e)));
    return Array.from(set);
  }, []);

  // Filter speakers list
  const filteredSpeakers = useMemo(() => {
    return INITIAL_SPEAKERS.filter((spk) => {
      // Expertise filter
      if (selectedExpertise !== 'All' && !spk.expertise.includes(selectedExpertise)) return false;

      // Fee filter
      const numericFee = Number(spk.fee.replace(/[^0-9]/g, ''));
      if (selectedFee === 'budget' && numericFee >= 3000) return false;
      if (selectedFee === 'mid' && (numericFee < 3000 || numericFee > 5000)) return false;
      if (selectedFee === 'premium' && numericFee <= 5000) return false;

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = spk.name.toLowerCase().includes(query);
        const matchesBio = spk.bio.toLowerCase().includes(query);
        const matchesCompany = spk.company.toLowerCase().includes(query);
        const matchesDesignation = spk.designation.toLowerCase().includes(query);
        if (!matchesName && !matchesBio && !matchesCompany && !matchesDesignation) return false;
      }

      return true;
    });
  }, [selectedExpertise, selectedFee, searchTerm]);

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-6 animate-fadeIn">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <span>← Back to Dashboard</span>
        </button>
      )}

      {/* Header */}
      <div>
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          Thought Leadership
        </span>
        <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
          Speakers Marketplace
        </h1>
        <p className="font-inter text-sm text-[#5f5e5e] mt-1">
          Source keynotes, panelists, and workshop mentors for your next event.
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs space-y-5">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-5 text-gray-400">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search speakers by name, company affiliation, or bio topics..."
            className="w-full pl-14 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl font-inter text-xs text-black focus:outline-none focus:border-black focus:bg-white transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-400 hover:text-black">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Expertise / Topic</span>
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Expertise</option>
              {allExpertise.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Booking Fee</span>
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Fees</option>
              <option value="budget">Budget (&lt; $3,000 / event)</option>
              <option value="mid">Mid-Range ($3,000 - $5,000 / event)</option>
              <option value="premium">Premium ($5,000+ / event)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredSpeakers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e1e3e4] p-8 space-y-2">
          <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
          <h3 className="font-geist text-lg font-bold text-black">No matching speakers found</h3>
          <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSpeakers.map((spk) => (
            <div key={spk.id} className="bg-white border border-[#e1e3e4] rounded-2xl p-6 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img src={spk.photo} alt={spk.name} className="w-16 h-16 rounded-full object-cover border border-[#e1e3e4]" />
                  <div>
                    <h3 className="font-geist font-bold text-[#00355f] text-base leading-snug">{spk.name}</h3>
                    <p className="font-inter text-xs text-[#5f5e5e]">{spk.designation}</p>
                    <p className="font-inter text-xs font-semibold text-[#0f4c81]">{spk.company}</p>
                  </div>
                </div>

                <p className="font-inter text-xs text-[#42474f] line-clamp-3 leading-relaxed">{spk.bio}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {spk.expertise.map((exp, i) => (
                    <span key={i} className="px-2.5 py-1 bg-[#f3f4f5] text-[#42474f] text-[9px] font-semibold rounded-md">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#edeeef] flex justify-between items-center">
                <span className="font-geist text-xs font-bold text-[#00355f]">{spk.fee}</span>
                <button
                  onClick={() => setInvitedSpeaker(spk)}
                  className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Invite to Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {invitedSpeaker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-scaleUp">
            <div className="w-12 h-12 bg-[#e2f7e2] text-[#1a853e] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <h3 className="font-geist text-xl font-bold text-[#00355f] text-center">Invitation Sent!</h3>
            <p className="font-inter text-xs text-[#5f5e5e] text-center">
              Keynote invitation dispatched to <span className="font-bold text-[#00355f]">{invitedSpeaker.name}</span> ({invitedSpeaker.company}).
            </p>
            <button onClick={() => setInvitedSpeaker(null)} className="w-full py-3 bg-[#0f4c81] text-white rounded-xl font-bold text-xs cursor-pointer">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpeakerMarketplaceView;
