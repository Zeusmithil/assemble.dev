import React, { useState, useMemo } from 'react';

const INITIAL_SPONSORS = [
  {
    id: 'sp-1',
    name: 'TechNova Solutions',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
    industry: 'Technology & Software',
    description: 'Leading provider of enterprise cloud software and next-gen AI search pipelines.',
    categories: ['Technology Events', 'Hackathons', 'Developer Communities', 'Student Events'],
    eventTypes: ['Conferences', 'Workshops', 'Hackathons'],
    availableBudget: '$2,000 – $10,000',
    minAmt: 2000,
    maxAmt: 10000,
    locations: ['Chennai', 'Bangalore', 'San Francisco'],
    contact: 'represent@technova.com',
    terms: 'Logo placement on all banners, dedicated 5-minute keynote presentation.'
  },
  {
    id: 'sp-2',
    name: 'BrandX Media',
    logo: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=150',
    industry: 'Marketing & Design',
    description: 'A global brand agency specializing in micro-interactions and spatial design identity.',
    categories: ['Creative Events', 'Design Summits', 'SaaS Conferences'],
    eventTypes: ['Design Workshops', 'Seminars'],
    availableBudget: '$1,000 – $5,000',
    minAmt: 1000,
    maxAmt: 5000,
    locations: ['New York', 'London', 'Bangalore'],
    contact: 'partnerships@brandx.design',
    terms: 'Goodies and welcome box branding, website logo inclusion.'
  },
  {
    id: 'sp-3',
    name: 'GigaTech Energy',
    logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150',
    industry: 'Clean Energy & Infrastructure',
    description: 'Powering green data infrastructure and carbon-neutral workspaces.',
    categories: ['Sustainability Conferences', 'Green Tech Gatherings'],
    eventTypes: ['Conferences', 'Public Lectures'],
    availableBudget: '$5,000 – $25,000',
    minAmt: 5000,
    maxAmt: 25000,
    locations: ['London', 'San Francisco'],
    contact: 'sponsors@gigatech.energy',
    terms: 'Keynote sponsor, VIP lounge branding, naming rights for main stage.'
  }
];

export const SponsorshipSection = ({
  events,
  sponsorshipRequests,
  onRequestSponsorship,
  onSimulateSponsorApprove,
  currentUser,
}) => {
  const [subTab, setSubTab] = useState('find');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Request Modal State
  const [requestSponsor, setRequestSponsor] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [selectedRequirement, setSelectedRequirement] = useState('Venue');
  const [requestedAmount, setRequestedAmount] = useState(5000);
  const [pitchMessage, setPitchMessage] = useState('');

  // Keep selectedEventId in sync when events array changes or a new event is created
  React.useEffect(() => {
    if (events && events.length > 0) {
      if (!selectedEventId || !events.some(e => e.id === selectedEventId)) {
        setSelectedEventId(events[0].id);
      }
    }
  }, [events, selectedEventId]);

  const industries = useMemo(() => {
    const set = new Set();
    INITIAL_SPONSORS.forEach(s => set.add(s.industry));
    return Array.from(set);
  }, []);

  const filteredSponsors = useMemo(() => {
    return INITIAL_SPONSORS.filter((s) => {
      if (selectedIndustry !== 'All' && s.industry !== selectedIndustry) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesDesc = s.description.toLowerCase().includes(query);
        const matchesCategory = s.categories.some(c => c.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    });
  }, [selectedIndustry, searchTerm]);

  /**
   * Check if a sponsor+event combo is already claimed by ANY team member.
   * Returns the existing request if found.
   */
  const getExistingRequest = (sponsorId, eventId) =>
    sponsorshipRequests.find(r => r.sponsorId === sponsorId && r.eventId === eventId) || null;

  /**
   * Real-time lock check for the modal's currently selected event.
   */
  const modalExistingRequest = useMemo(() => {
    if (!requestSponsor || !selectedEventId) return null;
    return getExistingRequest(requestSponsor.id, selectedEventId);
  }, [requestSponsor, selectedEventId, sponsorshipRequests]);

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!requestSponsor || modalExistingRequest) return;

    const matchedEvent = events.find(evt => evt.id === selectedEventId) || events[0];

    const newRequest = {
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      sponsorId: requestSponsor.id,
      sponsorName: requestSponsor.name,
      eventId: matchedEvent?.id || '',
      eventTitle: matchedEvent ? matchedEvent.title : 'General Event',
      requirement: selectedRequirement,
      amount: Number(requestedAmount),
      pitch: pitchMessage,
      status: 'Requested',
      code: '',
      date: new Date().toISOString().split('T')[0],
      appliedBy: currentUser?.name || 'Team Member',
      appliedByEmail: currentUser?.email || '',
    };

    onRequestSponsorship(newRequest);
    setRequestSponsor(null);
    setPitchMessage('');
    setSubTab('my-sponsors');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sub navigation bar */}
      <div className="flex border-b border-[#e1e3e4] gap-6 text-sm font-semibold">
        <button
          onClick={() => setSubTab('find')}
          className={`pb-3 transition-all cursor-pointer ${
            subTab === 'find'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          Find Sponsors
        </button>
        <button
          onClick={() => setSubTab('my-sponsors')}
          className={`pb-3 transition-all cursor-pointer ${
            subTab === 'my-sponsors'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          My Sponsors ({sponsorshipRequests.length})
        </button>
      </div>

      {/* ── FIND SPONSORS ── */}
      {subTab === 'find' && (
        <div className="space-y-6">
          {/* Search + filter */}
          <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-2xs space-y-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-gray-400">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sponsors by industry, keywords, or preferences..."
                className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-gray-400">Industry Sector:</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedIndustry('All')}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedIndustry === 'All'
                      ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#00355f]'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  All Sectors
                </button>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedIndustry === ind
                        ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#00355f]'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-2.5 bg-[#fff8e1] border border-[#ffd54f] rounded-xl px-4 py-3 text-xs font-inter text-[#7a5a00]">
            <span className="material-symbols-outlined text-[#f9a825] text-base mt-0.5">info</span>
            <span>
              <strong>Team Exclusivity:</strong> Only one team member can request sponsorship from a given sponsor per event.
              A lock badge will appear on a sponsor card when a team member has already applied for a specific event.
            </span>
          </div>

          {/* Sponsors grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredSponsors.map((sp) => {
              const claimedRequests = sponsorshipRequests.filter(r => r.sponsorId === sp.id);

              return (
                <div
                  key={sp.id}
                  className="bg-white border border-[#e1e3e4] rounded-[2rem] p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={sp.logo} alt={sp.name} className="w-12 h-12 rounded-xl object-cover border border-[#e1e3e4]" />
                      <div>
                        <h4 className="font-geist font-bold text-[#00355f] text-base leading-snug">{sp.name}</h4>
                        <span className="text-[10px] font-bold text-[#0f4c81] uppercase tracking-wider">{sp.industry}</span>
                      </div>
                    </div>

                    <p className="font-inter text-xs text-[#5f5e5e] line-clamp-3 leading-relaxed">{sp.description}</p>

                    <div className="space-y-2 pt-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Interested In:</span>
                      <div className="flex flex-wrap gap-1">
                        {sp.categories.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#f3f4f5] text-[#42474f] text-[9px] font-semibold rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Lock badge: shows which events are already claimed */}
                    {claimedRequests.length > 0 && (
                      <div className="bg-[#fff3d6] border border-[#ffd54f] rounded-xl px-3 py-2 space-y-1.5">
                        <span className="text-[9px] font-bold text-[#b46d00] uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs leading-none">lock</span>
                          Claimed for some events
                        </span>
                        {claimedRequests.map((cr, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 flex-wrap text-[9px] text-[#7a5a00] font-inter">
                            <span className="font-bold">{cr.appliedBy || 'Team Member'}</span>
                            <span className="text-gray-400">→</span>
                            <span className="italic truncate max-w-[120px]">{cr.eventTitle}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                              cr.status === 'Sponsorship Code Generated' || cr.status === 'Approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {cr.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#edeeef] flex justify-between items-center">
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">Funding Available</span>
                      <span className="font-geist text-xs font-bold text-[#1a853e]">{sp.availableBudget}</span>
                    </div>
                    <button
                      onClick={() => {
                        setRequestSponsor(sp);
                        setRequestedAmount(sp.minAmt);
                        setSelectedEventId(events[0]?.id || '');
                        setPitchMessage('');
                      }}
                      className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Request Sponsorship
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MY SPONSOR AGREEMENTS ── */}
      {subTab === 'my-sponsors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-geist text-lg font-bold text-[#00355f]">My Active Sponsorships</h3>
            <span className="text-xs text-gray-400">{sponsorshipRequests.length} Requests Sent</span>
          </div>

          <div className="bg-white border border-[#e1e3e4] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-inter">
                <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Sponsor</th>
                    <th className="p-4">Applied By</th>
                    <th className="p-4">Agreed Amount</th>
                    <th className="p-4">Used For</th>
                    <th className="p-4">Linked Event</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeeef]">
                  {sponsorshipRequests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                        No sponsorships requested or linked yet. Browse directory to send requests!
                      </td>
                    </tr>
                  ) : (
                    sponsorshipRequests.map((req) => (
                      <tr key={req.requestId} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-semibold text-[#00355f]">{req.sponsorName}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-[#d2e4ff] text-[#0f4c81] text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                              {(req.appliedBy || 'T').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[#00355f] font-semibold">{req.appliedBy || 'Team Member'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-[#1a853e]">${req.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-[#d2e4ff] text-[#0f4c81] text-[10px] font-bold rounded uppercase">
                            {req.requirement}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 truncate max-w-[150px]">{req.eventTitle}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            req.status === 'Sponsorship Code Generated' || req.status === 'Verified' || req.status === 'Active' || req.status === 'Approved'
                              ? 'bg-[#e2f7e2] text-[#1a853e]'
                              : req.status === 'Requested'
                              ? 'bg-[#fff3d6] text-[#b46d00]'
                              : 'bg-[#e7e8e9] text-gray-500'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── REQUEST SPONSORSHIP MODAL ── */}
      {requestSponsor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full space-y-4 animate-scaleUp text-left shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">
                Request Sponsorship from {requestSponsor.name}
              </h3>
              <button
                type="button"
                onClick={() => setRequestSponsor(null)}
                className="text-gray-400 hover:text-black cursor-pointer border-none bg-transparent text-xl leading-none ml-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4 text-xs font-semibold">
              {/* Event selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Target Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  required
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>{evt.title}</option>
                  ))}
                </select>
              </div>

              {/* Lock warning */}
              {modalExistingRequest && (
                <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 animate-fadeIn">
                  <span className="material-symbols-outlined text-rose-500 text-base mt-0.5 flex-shrink-0">lock</span>
                  <div>
                    <p className="font-bold text-rose-700 text-[11px]">Sponsorship Already Claimed</p>
                    <p className="text-rose-600 text-[10px] font-normal mt-0.5 leading-relaxed">
                      <strong>{modalExistingRequest.appliedBy || 'A team member'}</strong> has already submitted a request
                      to <strong>{requestSponsor.name}</strong> for this event. Only one request is allowed
                      per sponsor per event across the team.
                    </p>
                    <p className="text-[9px] text-rose-400 mt-1.5 font-normal">
                      Current status:{' '}
                      <span className="font-bold uppercase">{modalExistingRequest.status}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Requirement */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Requirement / Service</label>
                <select
                  value={selectedRequirement}
                  onChange={(e) => setSelectedRequirement(e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl ${modalExistingRequest ? 'opacity-50' : ''}`}
                  disabled={!!modalExistingRequest}
                >
                  <option value="Venue">Venue infrastructure</option>
                  <option value="Speakers">Keynote Speakers &amp; Hosts</option>
                  <option value="Goodies">Goodies &amp; Merchandise</option>
                  <option value="Catering">Catering / AV Services</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block">
                  Requested Funding Amount ($) — Range: {requestSponsor.availableBudget}
                </label>
                <input
                  type="number"
                  min={requestSponsor.minAmt}
                  max={requestSponsor.maxAmt}
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold ${modalExistingRequest ? 'opacity-50' : ''}`}
                  required
                  disabled={!!modalExistingRequest}
                />
              </div>

              {/* Pitch */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Pitch / Proposal Message</label>
                <textarea
                  rows={3}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  placeholder="Pitch your event demographic and details to get sponsored..."
                  className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-normal ${modalExistingRequest ? 'opacity-50' : ''}`}
                  disabled={!!modalExistingRequest}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestSponsor(null)}
                  className="flex-grow py-3 border border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!modalExistingRequest}
                  className={`flex-grow py-3 rounded-xl font-semibold transition-all ${
                    modalExistingRequest
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0f4c81] text-white hover:bg-[#00355f] cursor-pointer'
                  }`}
                >
                  {modalExistingRequest ? 'Slot Already Taken' : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SponsorshipSection;
