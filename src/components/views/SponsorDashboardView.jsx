import React, { useState } from 'react';

export const SponsorDashboardView = ({
  currentUser,
  events = [],
  sponsorshipRequests = [],
  sponsorshipCodes = [],
  onSimulateSponsorApprove,
  onSimulateSponsorReject,
  onRequestSponsorship,
  setActiveView,
  onSelectEvent,
  onRoleChange,
}) => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedReqEvent, setSelectedReqEvent] = useState(null);
  const [sponsorOfferAmount, setSponsorOfferAmount] = useState('5000');
  const [sponsorOfferReq, setSponsorOfferReq] = useState('Venue');
  const [sponsorOfferPitch, setSponsorOfferPitch] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [localRejectedIds, setLocalRejectedIds] = useState([]);

  // Sponsor budget metrics
  const totalBudget = currentUser?.sponsorProfile?.budgetAmount || 25000;
  const approvedRequests = sponsorshipRequests.filter((r) => r.status === 'approved' || r.status === 'active' || r.status === 'verified');
  const allocatedBudget = approvedRequests.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const availableBudget = Math.max(0, totalBudget - allocatedBudget);

  const pendingRequests = sponsorshipRequests.filter((r) => r.status === 'requested' || r.status === 'pending');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleApproveAndGenerate = (reqId) => {
    if (onSimulateSponsorApprove) {
      onSimulateSponsorApprove(reqId);
    }
  };

  const handleReject = (reqId) => {
    setLocalRejectedIds((prev) => [...prev, reqId]);
    if (onSimulateSponsorReject) {
      onSimulateSponsorReject(reqId);
    }
  };

  const handleViewEventForRequest = (req) => {
    const targetEvent = events.find(
      (e) =>
        e.id === req.eventId ||
        e.id === req.id ||
        (e.title && req.eventTitle && e.title.trim().toLowerCase() === req.eventTitle.trim().toLowerCase())
    );
    if (targetEvent && onSelectEvent) {
      onSelectEvent(targetEvent);
    } else if (events.length > 0 && onSelectEvent) {
      const fallback = {
        ...events[0],
        id: req.eventId || events[0].id,
        title: req.eventTitle || events[0].title,
        description: req.pitch || events[0].description,
      };
      onSelectEvent(fallback);
    }
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    if (selectedReqEvent) {
      if (onRequestSponsorship) {
        onRequestSponsorship(selectedReqEvent.id, sponsorOfferReq, Number(sponsorOfferAmount), sponsorOfferPitch || 'Direct corporate sponsorship grant offer.');
      }
      setOfferSuccess(true);
      setTimeout(() => {
        setOfferSuccess(false);
        setSelectedReqEvent(null);
        setSponsorOfferPitch('');
      }, 1500);
    }
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn text-left">
      {/* Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#002244] via-[#0f4c81] to-[#004b87] p-8 md:p-10 text-white shadow-xl shadow-blue-950/15 border border-white/20 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
              <span>💼</span>
              <span>Corporate Sponsorship Portal</span>
            </div>
            <h1 className="font-geist text-3xl md:text-4xl font-extrabold tracking-tight">
              Discover Sponsorship Opportunities
            </h1>
            <p className="font-inter text-sm text-blue-100/90 leading-relaxed">
              Partner with high-impact conferences, hackathons, and masterclasses. Empower event organizers and amplify your brand visibility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('discover')}
              className="px-5 py-2.5 bg-white/90 hover:bg-white text-[#00355f] rounded-2xl font-geist font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              <span>Find Events to Sponsor</span>
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

        {/* Glow accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Budget & Impact Telemetry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0f4c81] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">€{totalBudget.toLocaleString()}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Annual Sponsor Budget</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">savings</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">€{availableBudget.toLocaleString()}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Available to Grant</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">handshake</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{approvedRequests.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Active Partnerships</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{pendingRequests.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Proposals to Review</div>
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
          <span>Events Seeking Sponsors ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming-requests')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'incoming-requests'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">inbox</span>
          <span>Incoming Organizer Proposals ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active-sponsorships')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'active-sponsorships'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">verified</span>
          <span>Active Grants & Verification Codes ({approvedRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: Events Seeking Sponsors */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-geist text-lg font-bold text-[#00355f]">Curated Sponsorship Opportunities</h2>
              <p className="font-inter text-xs text-gray-500">Events with verified attendee targets and clear sponsor benefit tiers.</p>
            </div>

            <div className="flex gap-2">
              {['All', 'Technology', 'Culinary', 'Design', 'Business'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0f4c81] text-white shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0f4c81] px-2.5 py-1 rounded-lg">
                      {evt.category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      Expected {evt.expectedAttendees || 300}+ Attendees
                    </span>
                  </div>

                  <h3 className="font-geist font-bold text-base text-[#00355f] leading-snug line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="font-inter text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 space-y-1.5 text-xs font-inter">
                    <div className="flex justify-between text-gray-600">
                      <span>Organizer:</span>
                      <span className="font-semibold text-black">{evt.organizer || 'Community Guild'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Location:</span>
                      <span className="font-semibold text-black">{evt.city}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total Event Budget:</span>
                      <span className="font-bold text-[#00355f]">${(evt.budget || 25000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#edeeef] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectEvent && onSelectEvent(evt)}
                    className="text-xs font-bold text-gray-600 hover:text-black cursor-pointer"
                  >
                    View Event
                  </button>
                  <button
                    onClick={() => setSelectedReqEvent(evt)}
                    className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Sponsor This Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Incoming Requests */}
      {activeTab === 'incoming-requests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-geist text-lg font-bold text-[#00355f]">Proposals Submitted by Organizers</h2>
              <p className="font-inter text-xs text-gray-500">Review pitches and approve sponsorship grants with instant code generation.</p>
            </div>
          </div>

          {sponsorshipRequests.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-gray-300">inbox</span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Sponsorship Proposals Yet</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                When organizers request sponsorship for their venues, keynote speakers, or catering, their requests will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsorshipRequests.map((req) => {
                const reqKey = req.id || req.requestId;
                const isApproved =
                  req.status === 'approved' ||
                  req.status === 'verified' ||
                  req.status === 'Sponsorship Code Generated' ||
                  Boolean(req.code);
                const isRejected =
                  req.status === 'rejected' ||
                  req.status === 'Rejected' ||
                  localRejectedIds.includes(reqKey);

                return (
                  <div key={reqKey} className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isRejected
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {isApproved ? '✓ Approved' : isRejected ? '✕ Rejected' : 'Pending Evaluation'}
                        </span>
                        <h3 className="font-geist text-base font-bold text-[#00355f] mt-2">{req.eventTitle}</h3>
                        <p className="font-inter text-xs text-gray-500">Requirement: <span className="font-bold text-[#0f4c81]">{req.requirement}</span></p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">Requested Grant</div>
                        <div className="font-geist text-lg font-black text-[#00355f]">€{Number(req.amount).toLocaleString()}</div>
                      </div>
                    </div>

                    <p className="font-inter text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      "{req.pitch || 'We are seeking corporate sponsorship to support high-tier stage equipment and attendee welcome boxes.'}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                      {/* View Event Button */}
                      <button
                        onClick={() => handleViewEventForRequest(req)}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#00355f] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-gray-200"
                        title="View full details for this event"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>View Event</span>
                      </button>

                      {/* Action Buttons: Reject & Approve */}
                      <div className="flex items-center gap-2">
                        {isApproved ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <span>Code Issued: {req.generatedCode || req.code || 'TN2026-AI50'}</span>
                          </div>
                        ) : isRejected ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                            <span>Proposal Rejected</span>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => handleReject(reqKey)}
                              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 flex items-center gap-1"
                              title="Reject this sponsorship proposal"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => handleApproveAndGenerate(reqKey)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                              title="Approve and issue sponsorship grant code"
                            >
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              <span>Approve & Issue Code</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Active Grants & Verification Codes */}
      {activeTab === 'active-sponsorships' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-geist text-lg font-bold text-[#00355f]">Active Sponsorship Codes</h2>
            <p className="font-inter text-xs text-gray-500">Verification codes issued to organizers to automatically allocate and lock event funding.</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { code: 'TN2026-AI50', sponsor: 'TechNova Solutions', amount: '€5,000', cat: 'Keynote & AI Track', status: 'Active' },
                { code: 'TN2026-75K', sponsor: 'TechNova Solutions', amount: '€7,500', cat: 'Main Stage & Venue', status: 'Active' },
                { code: 'BX2026-30K', sponsor: 'BrandX Media', amount: '€3,000', cat: 'Swag & Goodies', status: 'Active' },
                ...approvedRequests.map(r => ({
                  code: r.generatedCode || `SP-${r.id.toUpperCase()}`,
                  sponsor: currentUser?.name || 'My Company',
                  amount: `€${Number(r.amount).toLocaleString()}`,
                  cat: r.requirement || 'General Sponsorship',
                  status: 'Active'
                }))
              ].map((c, i) => (
                <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50/40 rounded-2xl border border-blue-100 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500 uppercase">{c.sponsor}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <div className="font-mono text-base font-extrabold text-[#00355f] mt-1 tracking-wider">{c.code}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{c.cat}</div>
                  </div>
                  <div className="pt-2 border-t border-blue-100/60 flex justify-between items-center">
                    <span className="font-geist text-sm font-black text-[#0f4c81]">{c.amount}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.code);
                        alert(`Verification code "${c.code}" copied to clipboard!`);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cross-Role Navigation Banner */}
      <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-100 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-700">hub</span>
          <h3 className="font-geist text-base font-bold text-[#00355f]">Cross-Role Capabilities</h3>
        </div>
        <p className="font-inter text-xs text-gray-600 max-w-2xl leading-relaxed">
          As a Corporate Sponsor, your Event Horizon account allows you to attend events with VIP passes, organize your own company conferences, or present keynotes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => onRoleChange && onRoleChange('attendee')}
            className="p-4 bg-white rounded-2xl border border-emerald-200 text-left hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-emerald-700 flex items-center justify-between">
              <span>🎟 Attendee Portal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Browse and attend events with complimentary passes.</p>
          </button>

          <button
            onClick={() => setActiveView('create-event')}
            className="p-4 bg-white rounded-2xl border border-emerald-200 text-left hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-emerald-700 flex items-center justify-between">
              <span>🎯 Host an Event</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Launch a sponsored hackathon, summit, or meetup.</p>
          </button>

          <button
            onClick={() => onRoleChange && onRoleChange('speaker')}
            className="p-4 bg-white rounded-2xl border border-emerald-200 text-left hover:border-emerald-500 transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-emerald-700 flex items-center justify-between">
              <span>🎤 Apply as Speaker</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Represent your brand with keynote presentations.</p>
          </button>
        </div>
      </div>

      {/* Direct Sponsor Offer Modal */}
      {selectedReqEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-4 animate-scaleUp text-left">
            <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
              <h3 className="font-geist text-base font-bold text-[#00355f]">Offer Event Sponsorship</h3>
              <button onClick={() => setSelectedReqEvent(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            {offerSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-geist font-bold text-emerald-700">Sponsorship Proposal Dispatched!</h4>
                <p className="font-inter text-xs text-gray-500">The event organizer will receive your direct corporate sponsorship offer.</p>
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} className="space-y-4 text-xs font-inter">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Event</span>
                  <div className="font-bold text-[#00355f] text-sm mt-0.5">{selectedReqEvent.title}</div>
                  <div className="text-[11px] text-gray-500">{selectedReqEvent.city} • {selectedReqEvent.startDate}</div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Requirement to Fund</label>
                  <select
                    value={sponsorOfferReq}
                    onChange={(e) => setSponsorOfferReq(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-bold"
                  >
                    <option value="Venue">Venue & Hall Rental</option>
                    <option value="Speakers">Keynote Speakers & Travel</option>
                    <option value="Goodies">Swag Boxes & Merchandise</option>
                    <option value="Catering">Gourmet Catering & Coffee</option>
                    <option value="AV">A/V Equipment & Streaming</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Grant Amount (€)</label>
                  <input
                    type="number"
                    required
                    value={sponsorOfferAmount}
                    onChange={(e) => setSponsorOfferAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-bold text-[#00355f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Sponsorship Terms / Expectations</label>
                  <textarea
                    rows={3}
                    value={sponsorOfferPitch}
                    onChange={(e) => setSponsorOfferPitch(e.target.value)}
                    placeholder="e.g. Logo placement on all screens, booth in the main atrium, 3 VIP tickets..."
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReqEvent(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                  >
                    Send Sponsor Offer
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
export default SponsorDashboardView;
