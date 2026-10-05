import React, { useState, useMemo } from 'react';

export const AttendeeDashboardView = ({
  currentUser,
  tickets = [],
  events = [],
  savedEventIds = [],
  communities = [],
  onViewTicket,
  setActiveView,
  onSelectEvent,
  onJoinCommunity,
  onCreateCommunityRoom,
  onOpenCommunityRoom,
  onRoleChange,
}) => {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-events' | 'communities'
  const [exploreSubFilter, setExploreSubFilter] = useState('recommended'); // 'recommended' | 'nearby' | 'upcoming' | 'popular'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [communityCode, setCommunityCode] = useState('');
  const [communityStatusMsg, setCommunityStatusMsg] = useState('');
  const [isCommunityError, setIsCommunityError] = useState(false);

  // Filter tickets into upcoming vs past
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingTickets = tickets.filter((t) => {
    const ticketDate = new Date(t.date);
    return ticketDate >= today;
  });

  const pastTickets = tickets.filter((t) => {
    const ticketDate = new Date(t.date);
    return ticketDate < today;
  });

  const savedEvents = events.filter((evt) => savedEventIds.includes(evt.id));

  // Explore filtering
  const categories = ['All', 'Technology', 'Design', 'Culinary', 'Music', 'Business', 'Startup'];

  const filteredExploreEvents = useMemo(() => {
    let list = [...events];

    // Category
    if (selectedCategory !== 'All') {
      list = list.filter((e) => e.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((e) => 
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.city?.toLowerCase().includes(q) ||
        e.organizer?.toLowerCase().includes(q)
      );
    }

    // Sub-filters
    if (exploreSubFilter === 'recommended') {
      // Sort by high rating / expected attendees
      return list.sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0));
    }
    if (exploreSubFilter === 'nearby') {
      // Prioritize city or in-person
      return list.filter((e) => e.format === 'In-Person');
    }
    if (exploreSubFilter === 'upcoming') {
      return list.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }
    if (exploreSubFilter === 'popular') {
      return list.filter((e) => (e.registeredCount || 0) > 40);
    }

    return list;
  }, [events, selectedCategory, searchTerm, exploreSubFilter]);

  const handleJoinCommunitySubmit = (e) => {
    e.preventDefault();
    if (!communityCode.trim()) return;
    if (onJoinCommunity) {
      const res = onJoinCommunity(communityCode.trim());
      if (res.success) {
        setIsCommunityError(false);
        setCommunityStatusMsg(res.message);
        setCommunityCode('');
      } else {
        setIsCommunityError(true);
        setCommunityStatusMsg(res.message);
      }
    }
  };

  const userCommunityNames = currentUser?.communities || [];

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn text-left">
      {/* Hero Welcome Banner (Emphasis: "Discover what's happening around you.") */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#00355f] via-[#0f4c81] to-[#0066b2] p-8 md:p-10 text-white shadow-xl shadow-blue-900/10 border border-white/20 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
              <span>🎟</span>
              <span>Attendee Home</span>
            </div>
            <h1 className="font-geist text-3xl md:text-4xl font-extrabold tracking-tight">
              Discover what’s happening around you.
            </h1>
            <p className="font-inter text-sm text-blue-100/90 leading-relaxed">
              Explore premier tech summits, masterclasses, and networking mixers. Track your digital passes and connect in active community rooms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="px-5 py-2.5 bg-white text-[#00355f] hover:bg-gray-100 rounded-2xl font-geist font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              <span>Explore Events</span>
            </button>
            <button
              onClick={() => setActiveTab('my-events')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-geist font-bold text-xs border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-sm">confirmation_number</span>
              <span>My Passes ({tickets.length})</span>
            </button>
          </div>
        </div>

        {/* Glow circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-[#e1e3e4] gap-6 text-sm font-semibold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('explore')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'explore'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">travel_explore</span>
          <span>Explore Events</span>
        </button>

        <button
          onClick={() => setActiveTab('my-events')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-events'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">confirmation_number</span>
          <span>My Events & Tickets ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'communities'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">groups</span>
          <span>Communities & Rooms ({userCommunityNames.length})</span>
        </button>
      </div>

      {/* SECTION 1: Explore Events */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Search & Categories Bento Card */}
          <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-400">search</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events by title, description, host, or city..."
                  className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-2xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-400 hover:text-black">
                    ✕
                  </button>
                )}
              </div>

              {/* Sub-Filters Tabs */}
              <div className="flex bg-[#f8f9fa] p-1 rounded-2xl border border-[#e1e3e4] text-xs font-semibold">
                {[
                  { id: 'recommended', label: '⭐ Recommended' },
                  { id: 'nearby', label: '📍 Nearby' },
                  { id: 'upcoming', label: '📅 Upcoming' },
                  { id: 'popular', label: '🔥 Popular' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExploreSubFilter(item.id)}
                    className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      exploreSubFilter === item.id
                        ? 'bg-white text-[#00355f] font-bold shadow-2xs'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 mr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0f4c81] text-white shadow-2xs'
                      : 'bg-[#f8f9fa] border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {filteredExploreEvents.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-2">
              <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Matching Events</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                Try searching for another topic, city, or clearing your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExploreEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent && onSelectEvent(evt)}
                  className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2rem] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img
                        src={evt.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800'}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {evt.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#00355f] text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                        {evt.isFree ? 'Free' : `$${evt.price}`}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="text-xs font-inter text-[#0f4c81] font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span>{evt.startDate} • {evt.time}</span>
                      </div>

                      <h3 className="font-geist font-bold text-base text-[#00355f] leading-snug group-hover:text-[#0f4c81] transition-colors line-clamp-2">
                        {evt.title}
                      </h3>

                      <p className="font-inter text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                        <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                        <span className="truncate">{evt.location}, {evt.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-3">
                    <span className="text-[11px] text-gray-500 font-medium">
                      Host: <strong className="text-black">{evt.organizer || 'Community Guild'}</strong>
                    </span>
                    <button className="px-3.5 py-1.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold shadow-2xs group-hover:bg-[#00355f] transition-colors">
                      View Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: My Events & Tickets */}
      {activeTab === 'my-events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="font-geist text-xl font-bold text-[#00355f]">My Registered Tickets & Passes</h2>
              <p className="font-inter text-xs text-gray-500">Present your digital pass with QR code at the door for entry.</p>
            </div>
            <button
              onClick={() => setActiveTab('explore')}
              className="px-4 py-2 bg-[#0f4c81] text-white rounded-xl text-xs font-bold hover:bg-[#00355f] cursor-pointer"
            >
              + Find More Events
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-gray-300">confirmation_number</span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Registered Passes Yet</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                You haven't registered for any events yet. Browse events in the Explore tab to reserve your spot!
              </p>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-6 py-2.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Browse Events Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((t) => (
                <div
                  key={t.ticketId}
                  className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          t.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-[#0f4c81]'
                        }`}>
                          {t.status === 'checked-in' ? '✓ Checked In' : 'Confirmed Pass'}
                        </span>
                        <h3 className="font-geist text-base font-bold text-[#00355f] mt-2 leading-snug">{t.eventTitle}</h3>
                        <p className="font-inter text-xs text-gray-500">Tier: <strong className="text-black">{t.ticketTierName || 'General Attendee'}</strong></p>
                      </div>
                      <div className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        {t.ticketId}
                      </div>
                    </div>

                    <div className="bg-gray-50/80 p-3 rounded-2xl border border-gray-100 text-xs font-inter text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-gray-400">calendar_today</span>
                        <span>{t.date} • {t.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-gray-400">location_on</span>
                        <span>{t.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-gray-400">person</span>
                        <span>Passholder: <strong>{t.userName}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <span className="font-geist font-bold text-sm text-[#00355f]">
                      {t.price === 0 ? 'Free Pass' : `$${t.price}`}
                    </span>
                    <button
                      onClick={() => onViewTicket && onViewTicket(t)}
                      className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_2</span>
                      <span>View Pass QR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Communities & Rooms */}
      {activeTab === 'communities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="font-geist text-xl font-bold text-[#00355f]">Community Hub & Rooms</h2>
              <p className="font-inter text-xs text-gray-500">Connect with fellow attendees, join private discussion rooms, and co-plan experiences.</p>
            </div>
          </div>

          {/* Join Community with Code Form */}
          <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4] rounded-[2rem] p-6 shadow-xs space-y-3">
            <h3 className="font-geist text-sm font-bold text-[#00355f] uppercase tracking-wider">
              🔑 Join Community with Code
            </h3>
            <p className="font-inter text-xs text-gray-500">
              Have a room code from an organizer or friend (e.g. <code>EH-AI2026</code>)? Enter it below to join immediately.
            </p>
            <form onSubmit={handleJoinCommunitySubmit} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={communityCode}
                onChange={(e) => setCommunityCode(e.target.value)}
                placeholder="e.g. EH-AI2026"
                className="flex-grow px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-mono font-bold text-[#00355f]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-geist font-bold text-xs shadow-xs cursor-pointer"
              >
                Join Room
              </button>
            </form>

            {communityStatusMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold w-fit ${
                isCommunityError ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-green-50 border border-green-100 text-green-600'
              }`}>
                {communityStatusMsg}
              </div>
            )}
          </div>

          {/* Communities List */}
          <div className="space-y-3">
            <h3 className="font-geist text-base font-bold text-[#00355f]">Your Joined Communities</h3>
            {userCommunityNames.length === 0 ? (
              <div className="p-8 bg-white/70 backdrop-blur-md border border-[#e1e3e4] rounded-3xl text-center text-xs text-gray-500">
                You haven't joined any communities yet. Enter a room code above or create your own community space in your Profile.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userCommunityNames.map((name) => {
                  const matched = communities.find((c) => c.name === name);
                  return (
                    <div
                      key={name}
                      onClick={() => {
                        if (matched && onOpenCommunityRoom) {
                          onOpenCommunityRoom(matched);
                        }
                      }}
                      className="p-5 bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl shadow-xs hover:border-[#0f4c81] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={matched?.logoUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=200'}
                          alt={name}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-100"
                        />
                        <div>
                          <h4 className="font-geist font-bold text-sm text-[#00355f]">{name}</h4>
                          <span className="font-mono text-[10px] text-gray-400">Code: {matched?.code || '—'}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs text-[#0f4c81] font-bold">
                        <span>Enter Community Room</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cross-Role Banner */}
      <div className="bg-gradient-to-r from-blue-50/80 to-slate-100 border border-blue-100 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f4c81]">hub</span>
          <h3 className="font-geist text-base font-bold text-[#00355f]">More Ways to Participate</h3>
        </div>
        <p className="font-inter text-xs text-gray-600 max-w-2xl leading-relaxed">
          Ready to share your insights on stage, host your own event, or represent a sponsor? You can switch roles or activate new capabilities at any time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => onRoleChange && onRoleChange('speaker')}
            className="p-4 bg-white rounded-2xl border border-blue-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎤 Become a Speaker</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Build your public speaker profile and get invited to keynotes.</p>
          </button>

          <button
            onClick={() => setActiveView('create-event')}
            className="p-4 bg-white rounded-2xl border border-blue-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎯 Host an Event</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Switch to Organizer mode to plan, ticket, and run events.</p>
          </button>

          <button
            onClick={() => onRoleChange && onRoleChange('sponsor')}
            className="p-4 bg-white rounded-2xl border border-blue-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>💼 Corporate Sponsor</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Fund upcoming events and access sponsor benefits.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AttendeeDashboardView;
