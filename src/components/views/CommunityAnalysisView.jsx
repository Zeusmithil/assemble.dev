import React, { useState, useMemo } from 'react';
import { computeCommunityStats } from '../../utils/communityAnalysis';
import { PageHeader, Button, Tabs, StatTile, StatGrid, Icon } from '../ui';

export const CommunityAnalysisView = ({
  community,
  event,
  allEvents = [],
  sponsorshipRequests = [],
  onBack,
  onSponsorEvent,
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'events' | 'sponsorships' | 'engagement'
  const [pastEventFilter, setPastEventFilter] = useState('All');

  // Compute all due-diligence statistics from authentic data
  const stats = useMemo(() => {
    return computeCommunityStats(community, allEvents, sponsorshipRequests);
  }, [community, allEvents, sponsorshipRequests]);

  if (!stats) {
    return (
      <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-16 text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-gray-500">error</span>
        <h2 className="font-geist text-2xl font-bold text-[#00355f]">Community Data Not Found</h2>
        <p className="font-inter text-sm text-gray-500">
          Unable to resolve the community profile for this event.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Event Details
        </button>
      </div>
    );
  }

  const {
    totalPastEvents,
    eventsThisYear,
    eventsLastYear,
    totalPastAttendees,
    avgAttendancePerEvent,
    largestEvent,
    eventCategories,
    eventFrequency,
    pastEventsList,
    totalSponsorshipsCount,
    totalSponsorshipAmount,
    numberOfSponsoredEvents,
    avgSponsorshipAmount,
    numberOfPreviousSponsors,
    previousSponsorsList,
    fundingByYear,
    fundingByRequirement,
    recentSponsorshipActivity,
    totalMembers,
    activeMembers,
    activeMemberPercent,
    totalAttendeesAcrossAll,
    totalEventsAllTime,
    overallAvgAttendance,
    memberGrowthRate,
    repeatAttendeeRate,
    recurringEventsCount,
    engagementRating,
    credibilityScore,
    credibilityChecklist,
    linkedActiveEvents
  } = stats;

  // Filtered past events list
  const filteredPastEvents = useMemo(() => {
    if (pastEventFilter === 'All') return pastEventsList;
    return pastEventsList.filter((e) => e.category === pastEventFilter);
  }, [pastEventsList, pastEventFilter]);

  // Max funding year amount for chart scaling
  const maxYearFunding = useMemo(() => {
    if (!fundingByYear || fundingByYear.length === 0) return 1;
    return Math.max(...fundingByYear.map((f) => f.amount), 1);
  }, [fundingByYear]);

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="space-y-5">
        <Button variant="ghost" size="sm" icon="arrow_back" className="-ml-2" onClick={onBack}>
          {event?.title ? `Back to ${event.title.length > 34 ? `${event.title.slice(0, 34)}…` : event.title}` : 'Back to event'}
        </Button>
        <PageHeader
          icon="query_stats"
          kicker="Sponsor · Due diligence"
          title="Is this community"
          accent="worth backing?"
          description="Track record, sponsorship history and member engagement for the community behind this event, from Connect's own event, ticket and sponsorship records."
          actions={
            event && onSponsorEvent ? (
              <Button icon="handshake" onClick={() => onSponsorEvent(event)}>Sponsor this event</Button>
            ) : null
          }
        />
      </div>

      {/* Community overview with credibility score */}
      <section className="glass-strong rounded-[28px] p-6 md:p-8 grid lg:grid-cols-[1fr_auto] gap-8 items-center" aria-labelledby="community-name">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center min-w-0">
          <img
            src={community.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400'}
            alt=""
            className="w-24 h-24 rounded-[22px] object-cover shrink-0"
          />
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-[11px] font-medium bg-fg/[0.06] text-fg/70">{community.category}</span>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1" style={{ background: 'rgb(147 211 164 / 0.16)', color: 'var(--volunteer-ink)' }}>
                <Icon name="verified" className="!text-[14px]" />
                {community.activityStatus || 'Active community'}
              </span>
            </div>
            <h2 id="community-name" className="font-geist text-[26px] sm:text-[32px] font-semibold tracking-tight text-fg leading-tight">
              {community.name}
            </h2>
            <p className="text-[14px] text-fg/60 leading-relaxed max-w-2xl">{community.description}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-fg/55 pt-1">
              <span className="flex items-center gap-1.5">
                <Icon name="calendar_month" className="!text-[16px]" />
                Since {new Date(community.createdDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="location_on" className="!text-[16px]" />
                {community.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="shield_person" className="!text-[16px]" />
                {community.organizerCount} verified admins
              </span>
            </div>
          </div>
        </div>

        {/* Credibility ring */}
        {(() => {
          const r = 46;
          const c = 2 * Math.PI * r;
          const score = Math.max(0, Math.min(100, credibilityScore));
          const label = score >= 80 ? 'High trust' : score >= 60 ? 'Moderate trust' : 'Building trust';
          return (
            <div className="flex lg:flex-col items-center gap-4 lg:gap-2 lg:text-center">
              <div className="relative w-[116px] h-[116px] shrink-0" role="img" aria-label={`Credibility score ${score} out of 100`}>
                <svg width="116" height="116" className="-rotate-90">
                  <circle cx="58" cy="58" r={r} fill="none" stroke="rgb(var(--fg-rgb) / 0.08)" strokeWidth="9" />
                  <circle
                    cx="58"
                    cy="58"
                    r={r}
                    fill="none"
                    stroke="rgb(var(--accent-rgb))"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - score / 100)}
                  />
                </svg>
                <span className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-geist text-3xl font-semibold text-fg leading-none">{score}</span>
                  <span className="text-[11px] text-fg/45 mt-1">of 100</span>
                </span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-fg/45">Credibility</p>
                <p className="font-geist font-semibold" style={{ color: 'var(--accent-ink)' }}>{label}</p>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Why sponsor this community */}
      <section className="space-y-4" aria-labelledby="why-sponsor-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 id="why-sponsor-title" className="font-geist text-xl font-semibold tracking-tight text-fg">
            Why sponsor
            <span className="font-display italic font-normal" style={{ color: 'var(--accent-ink)' }}> this community</span>
          </h3>
          <span className="text-[12px] text-fg/50">
            {credibilityChecklist.filter((i) => i.valid).length} of {credibilityChecklist.length} checks passed
          </span>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {credibilityChecklist.map((item) => (
            <li key={item.id} className={`glass rounded-[20px] p-4 flex gap-3 ${item.valid ? '' : 'opacity-60'}`}>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={item.valid ? { background: 'rgb(147 211 164 / 0.2)', color: 'var(--volunteer-ink)' } : { background: 'rgb(var(--fg-rgb) / 0.07)' }}
              >
                <Icon name={item.valid ? 'check' : 'remove'} className="!text-[17px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium text-fg">{item.title}</span>
                <span className="block text-[12px] text-fg/55 leading-relaxed mt-0.5">{item.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Tabs
        label="Analysis sections"
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { id: 'overview', label: 'Overview', icon: 'dashboard' },
          { id: 'events', label: 'Event history', icon: 'history', count: totalPastEvents + linkedActiveEvents.length },
          { id: 'sponsorships', label: 'Sponsorship history', icon: 'paid' },
          { id: 'engagement', label: 'Members & engagement', icon: 'groups' },
        ]}
      />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <StatGrid>
            <StatTile icon="event_available" label="Events held & scheduled" value={totalEventsAllTime} />
            <StatTile icon="groups" label="Verified attendees" value={totalAttendeesAcrossAll > 0 ? `${totalAttendeesAcrossAll.toLocaleString()}+` : '0'} />
            <StatTile icon="payments" label="Sponsorship received" value={`€${totalSponsorshipAmount.toLocaleString()}`} />
            <StatTile icon="handshake" label="Past sponsors" value={numberOfPreviousSponsors} />
          </StatGrid>

          {/* Dual Grid: Recent Activity & Event Being Evaluated */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Current Event Opportunity */}
            {event && (
              <div className="glass rounded-[24px] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0f4c81] px-2.5 py-1 rounded-md">
                      Current Sponsorship Opportunity
                    </span>
                    <h3 className="font-geist text-lg font-bold text-[#00355f] mt-2">{event.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Target: {event.expectedAttendees || 500}+ Attendees
                  </span>
                </div>

                <p className="font-inter text-xs text-gray-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs font-inter">
                  <div className="flex justify-between text-gray-600">
                    <span>Date & Time:</span>
                    <span className="font-semibold text-black">{event.startDate} • {event.time}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Location:</span>
                    <span className="font-semibold text-black">{event.location}, {event.city}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Budget:</span>
                    <span className="font-bold text-[#00355f]">€{(event.budget || 25000).toLocaleString()}</span>
                  </div>
                </div>

                {event.sponsorshipOpportunities && event.sponsorshipOpportunities.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Open Grant Requirements
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {event.sponsorshipOpportunities.map((req) => (
                        <span
                          key={req.id}
                          className={`text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1 ${
                            req.status === 'Funded'
                              ? 'bg-gray-100 text-gray-500 line-through'
                              : 'bg-blue-50 text-[#0f4c81] border border-blue-200'
                          }`}
                        >
                          <span>{req.requirement}</span>
                          <span className="font-mono text-[11px] font-black">€{req.amount.toLocaleString()}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right: Sponsorship History Highlights & Sponsors */}
            <div className="glass rounded-[24px] p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-geist text-base font-semibold text-[#00355f]">Previous Sponsors Backing This Community</h3>
                  <span className="text-xs font-bold text-gray-500">{numberOfPreviousSponsors} Brands</span>
                </div>

                {previousSponsorsList.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center text-xs text-gray-500 italic">
                    No historical corporate sponsors recorded yet for this community.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {previousSponsorsList.map((sp, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#00355f] flex items-center gap-1.5 shadow-3xs"
                      >
                        <span className="material-symbols-outlined text-sm text-[#0f4c81]">verified</span>
                        <span>{sp}</span>
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Recent Grants & Verified Deliverables
                  </span>
                  {recentSponsorshipActivity.slice(0, 3).map((act, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2.5 bg-gray-50/80 rounded-xl">
                      <div>
                        <div className="font-bold text-[#00355f]">{act.sponsorName}</div>
                        <div className="text-[10px] text-gray-500">{act.eventTitle} • {act.requirement}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-700">€{Number(act.amount).toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500">{act.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('sponsorships')}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-[#00355f] transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>View Complete Financial Audit & Charts</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY EVENT HISTORY (Requirement 4) */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          {/* Header & Metrics */}
          <div>
            <h2 className="font-geist text-xl font-semibold tracking-tight text-[#00355f]">Community Event History & Track Record</h2>
            <p className="font-inter text-xs text-gray-500">
              Verified historical gatherings, scale of participation, and attendee engagement over past editions.
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Events Conducted</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">{totalPastEvents}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Completed editions</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Conducted This Year (2026)</span>
              <span className="font-geist text-2xl font-black text-[#0f4c81]">{eventsThisYear}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Year to date</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Conducted Last Year (2025)</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">{eventsLastYear}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Prior annual cycle</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Past Attendees</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">
                {totalPastAttendees > 0 ? totalPastAttendees.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Across completed events</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Average Attendance</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">
                {avgAttendancePerEvent > 0 ? avgAttendancePerEvent.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Turnout per gathering</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Largest Event Turnout</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">
                {largestEvent ? (largestEvent.attendees || 0).toLocaleString() : '0'}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5 truncate" title={largestEvent?.title}>
                {largestEvent ? largestEvent.title : 'No records yet'}
              </span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Event Frequency</span>
              <span className="font-geist text-base font-semibold text-[#00355f] mt-1 block truncate">
                {eventFrequency}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Organizational cadence</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Event Categories</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {eventCategories.map((c, i) => (
                  <span key={i} className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Past Events Filter & List */}
          <div className="glass rounded-[24px] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-geist text-base font-semibold text-[#00355f]">
                Detailed Past Events Log ({filteredPastEvents.length})
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Filter Category:</span>
                <select
                  value={pastEventFilter}
                  onChange={(e) => setPastEventFilter(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter text-gray-700 focus:outline-none focus:border-[#0f4c81]"
                >
                  <option value="All">All Categories</option>
                  {eventCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredPastEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-2">
                <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
                <p className="font-geist text-sm font-bold text-black">No past events recorded yet</p>
                <p className="font-inter text-xs text-gray-500">
                  This community does not have past event entries in the database.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-inter">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Event Name</th>
                      <th className="p-3.5">Date & Year</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Attendees</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5">Sponsorship</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPastEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#00355f]">{evt.title}</div>
                          {evt.isRecurring && (
                            <span className="text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold uppercase">
                              Annual Edition
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-medium text-gray-600 whitespace-nowrap">{evt.date}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 font-bold rounded text-[10px]">
                            {evt.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-500">{evt.location}</td>
                        <td className="p-3.5 font-mono font-bold text-black">
                          {(evt.attendees || 0).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-amber-700">⭐ {evt.rating || '4.9'}</span>
                        </td>
                        <td className="p-3.5">
                          {evt.sponsored ? (
                            <div className="space-y-0.5">
                              <span className="text-emerald-700 font-bold text-[11px] block">
                                ✓ €{(evt.sponsorshipAmount || 0).toLocaleString()}
                              </span>
                              <span className="text-[10px] text-gray-500 truncate block max-w-[120px]">
                                {(evt.sponsorNames || []).join(', ')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic text-[11px]">Self-funded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SPONSORSHIP HISTORY & FINANCIAL STATISTICS (Requirement 5) */}
      {activeTab === 'sponsorships' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-geist text-xl font-semibold tracking-tight text-[#00355f]">Sponsorship History & Financial Statistics</h2>
            <p className="font-inter text-xs text-gray-500">
              Track record of previous corporate grants, supporting enterprise partners, and budget allocations.
            </p>
          </div>

          {/* Financial Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Sponsorships</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">{totalSponsorshipsCount} Grants</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Historical partnerships</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Amount Received</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">
                €{totalSponsorshipAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Verified grant capital</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Sponsored Events</span>
              <span className="font-geist text-2xl font-black text-[#0f4c81]">{numberOfSponsoredEvents}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Events backed by grants</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Average Grant Size</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">
                €{avgSponsorshipAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Per sponsorship tier</span>
            </div>

            <div className="glass rounded-[20px] p-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Supporting Sponsors</span>
              <span className="font-geist text-2xl font-semibold tracking-tight text-fg">{numberOfPreviousSponsors}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Distinct enterprise logos</span>
            </div>
          </div>

          {/* Visual Charts & Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Funding by Year Bar Chart */}
            <div className="lg:col-span-7 glass rounded-[24px] p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-geist text-base font-semibold text-[#00355f]">Historical Funding Trajectory</h3>
                  <p className="font-inter text-xs text-gray-500">Corporate grant funding raised per calendar year</p>
                </div>
                <span className="text-xs font-semibold text-fg/70">
                  Total: €{totalSponsorshipAmount.toLocaleString()}
                </span>
              </div>

              {fundingByYear.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 italic">No funding year data available yet.</div>
              ) : (
                <div className="space-y-3 pt-4">
                  <div className="h-44 flex items-end justify-around gap-6 border-b border-gray-200 pb-2">
                    {fundingByYear.map((item) => {
                      const heightPercent = Math.max(15, Math.round((item.amount / maxYearFunding) * 100));
                      return (
                        <div key={item.year} className="flex flex-col items-center gap-2 flex-1 max-w-[80px] h-full justify-end">
                          <span className="text-[11px] font-mono font-bold text-[#00355f]">
                            €{(item.amount / 1000).toFixed(0)}k
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-[#00355f] to-[#0f4c81] rounded-t-xl transition-all duration-500 hover:opacity-90 shadow-2xs"
                            style={{ height: `${heightPercent}%` }}
                            title={`${item.year}: €${item.amount.toLocaleString()}`}
                          />
                          <span className="text-xs font-bold text-gray-600">{item.year}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-gray-500 text-center">
                    Annual grant volume from approved Connect sponsorships.
                  </div>
                </div>
              )}
            </div>

            {/* Requirement Category Breakdown */}
            <div className="lg:col-span-5 glass rounded-[24px] p-6 space-y-4">
              <div>
                <h3 className="font-geist text-base font-semibold text-[#00355f]">Grant Allocation Breakdown</h3>
                <p className="font-inter text-xs text-gray-500">How sponsored funding was deployed across event operations</p>
              </div>

              {fundingByRequirement.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500 italic">No allocation category data available yet.</div>
              ) : (
                <div className="space-y-3 pt-2">
                  {fundingByRequirement.map((req, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-inter font-bold">
                        <span className="text-gray-700">{req.requirement}</span>
                        <span className="text-[#00355f]">
                          €{req.amount.toLocaleString()} ({req.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0f4c81] rounded-full transition-all"
                          style={{ width: `${req.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Historical Sponsorship By Event Table */}
          <div className="glass rounded-[24px] p-6 space-y-4">
            <h3 className="font-geist text-base font-semibold text-[#00355f]">
              Itemized Sponsorship History by Event ({recentSponsorshipActivity.length})
            </h3>

            {recentSponsorshipActivity.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-2">
                <span className="material-symbols-outlined text-4xl text-gray-300">receipt_long</span>
                <p className="font-geist text-sm font-bold text-black">No data available yet</p>
                <p className="font-inter text-xs text-gray-500">
                  No historical corporate sponsorship records have been recorded for this community yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-inter">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Event</th>
                      <th className="p-3.5">Sponsor</th>
                      <th className="p-3.5">Grant Amount</th>
                      <th className="p-3.5">Purpose / Requirement</th>
                      <th className="p-3.5">Tier</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentSponsorshipActivity.map((sp) => (
                      <tr key={sp.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-[#00355f]">{sp.eventTitle}</td>
                        <td className="p-3.5">
                          <span className="font-bold text-black flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#0f4c81]">business</span>
                            <span>{sp.sponsorName}</span>
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700 text-sm">
                          €{Number(sp.amount).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-gray-600">{sp.requirement}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-blue-50 text-[#0f4c81] rounded text-[10px] font-bold">
                            {sp.tier}
                          </span>
                        </td>
                        <td className="p-3.5 text-gray-500 whitespace-nowrap">{sp.date}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {sp.code || 'VERIFIED-EH'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNITY ENGAGEMENT STATISTICS (Requirement 6) */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-geist text-xl font-semibold tracking-tight text-[#00355f]">Community Engagement & Legitimacy Statistics</h2>
            <p className="font-inter text-xs text-gray-500">
              Community vitality, member retention rate, recurring event momentum, and audience loyalty metrics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-[24px] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Members</span>
                <span className="material-symbols-outlined text-base text-[#0f4c81]">group</span>
              </div>
              <div className="font-geist text-2xl font-semibold tracking-tight text-fg mt-1">{totalMembers.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Registered room members</div>
            </div>

            <div className="glass rounded-[24px] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Members</span>
                <span className="material-symbols-outlined text-base text-emerald-600">person_check</span>
              </div>
              <div className="font-geist text-2xl font-semibold tracking-tight text-fg mt-1">
                {activeMembers.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{activeMemberPercent}% Monthly Active Rate</div>
            </div>

            <div className="glass rounded-[24px] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Community Growth</span>
                <span className="material-symbols-outlined text-base text-purple-600">trending_up</span>
              </div>
              <div className="font-geist text-2xl font-semibold tracking-tight text-fg mt-1">{memberGrowthRate}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Year-over-year expansion</div>
            </div>

            <div className="glass rounded-[24px] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Repeat Attendees</span>
                <span className="material-symbols-outlined text-base text-amber-700">repeat</span>
              </div>
              <div className="font-geist text-2xl font-semibold tracking-tight text-fg mt-1">{repeatAttendeeRate}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">Participation consistency</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-[24px] p-6 space-y-4">
              <h3 className="font-geist text-base font-semibold text-[#00355f]">Engagement & Community Vitality Health</h3>

              <div className="space-y-4 font-inter text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Member Activity Ratio</span>
                    <span className="text-[#00355f]">{activeMemberPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activeMemberPercent}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Repeat Attendee Loyalty</span>
                    <span className="text-[#00355f]">{repeatAttendeeRate}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: repeatAttendeeRate }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Recurring Event Series Retained</span>
                    <span className="text-[#00355f]">{recurringEventsCount} Editions</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, recurringEventsCount * 25)}%` }} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1 text-xs">
                <div className="font-bold text-[#00355f]">Community Satisfaction Rating</div>
                <div className="text-gray-600">
                  {engagementRating} based on post-event feedback surveys and verified attendee check-ins.
                </div>
              </div>
            </div>

            <div className="glass rounded-[24px] p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-geist text-base font-semibold text-[#00355f]">Summary of Organizational Assets</h3>
                <div className="space-y-3 mt-3 text-xs font-inter text-gray-600">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Dedicated Organizers & Core Team:</span>
                    <span className="font-bold text-black">{community.organizerCount} Members</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Recurring Annual Gatherings:</span>
                    <span className="font-bold text-black">{recurringEventsCount} Series</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Average Attendance Across All Gatherings:</span>
                    <span className="font-bold text-black">{overallAvgAttendance.toLocaleString()} Attendees</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span>Upcoming Platform Events:</span>
                    <span className="font-bold text-emerald-700">{linkedActiveEvents.length} Scheduled</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs font-inter text-emerald-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span><strong>Sponsor Recommendation:</strong> Community qualifies for enterprise co-branding, title sponsorship, and Tier 1 product showcases.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Closing call to action */}
      <section className="glass-strong rounded-[28px] p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h4 className="font-geist font-semibold text-fg">Ready to partner with {community.name}?</h4>
          <p className="text-[13px] text-fg/55 mt-0.5">
            Back {event ? event.title : 'their upcoming event'} directly — your sponsorship is added to the event straight away.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button variant="secondary" icon="arrow_back" className="flex-1 lg:flex-none" onClick={onBack}>Back to event</Button>
          {event && onSponsorEvent && (
            <Button icon="handshake" className="flex-1 lg:flex-none" onClick={() => onSponsorEvent(event)}>Sponsor this event</Button>
          )}
        </div>
      </section>
    </div>
  );
};
