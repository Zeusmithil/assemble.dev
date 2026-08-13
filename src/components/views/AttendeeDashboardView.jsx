import React, { useState } from 'react';

export const AttendeeDashboardView = ({
  tickets,
  events,
  onViewTicket,
  setActiveView,
}) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Filter tickets into upcoming vs past
  const upcomingTickets = tickets.filter((t) => {
    const ticketDate = new Date(t.date);
    return ticketDate >= today;
  });

  const pastTickets = tickets.filter((t) => {
    const ticketDate = new Date(t.date);
    return ticketDate < today;
  });

  const displayTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-6">
        <div>
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
            Attendee Portal
          </span>
          <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
            My Registered Tickets & Passes
          </h1>
        </div>

        <button
          onClick={() => setActiveView('discover')}
          className="px-4 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">explore</span>
          <span>Explore More Events</span>
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#e1e3e4] gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          Upcoming Events ({upcomingTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'past'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          Past Events ({pastTickets.length})
        </button>
      </div>

      {/* Tickets List Grid */}
      {displayTickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e1e3e4] p-8 space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#727780]">confirmation_number</span>
          <h3 className="font-geist text-lg font-bold text-[#00355f]">
            No {activeTab} tickets found
          </h3>
          <p className="font-inter text-xs text-[#5f5e5e] max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'Explore upcoming workshops, summit keynotes, and concerts to register for your next experience.'
              : 'Your past registered events history is empty.'}
          </p>
          {activeTab === 'upcoming' && (
            <button
              onClick={() => setActiveView('discover')}
              className="px-6 py-2.5 bg-[#0f4c81] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Browse Discovery Feed
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayTickets.map((t) => (
            <div
              key={t.ticketId}
              className="bg-white border border-[#e1e3e4] rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#d2e4ff] text-[#0f4c81] px-2.5 py-1 rounded">
                    Ticket ID: {t.ticketId}
                  </span>
                  {t.ticketTierName && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fff3d6] text-[#b46d00] px-2.5 py-1 rounded ml-2">
                      {t.ticketTierName}
                    </span>
                  )}
                  <h3 className="font-geist text-lg font-bold text-[#00355f] mt-2">{t.eventTitle}</h3>
                  <p className="font-inter text-xs text-[#5f5e5e]">Attendee: {t.userName}</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    t.status === 'checked-in'
                      ? 'bg-[#e2f7e2] text-[#1a853e]'
                      : 'bg-[#d2e4ff] text-[#0f4c81]'
                  }`}
                >
                  {t.status === 'checked-in' ? '✓ Checked In' : 'Confirmed Pass'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#5f5e5e] font-inter border-t border-b border-[#edeeef] py-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#0f4c81]">calendar_month</span>
                  <span>{t.date} • {t.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#0f4c81]">location_on</span>
                  <span className="truncate">{t.venue}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-geist text-sm font-bold text-[#00355f]">
                  {t.price === 0 ? 'Free Pass' : `$${t.price}`}
                </span>

                <button
                  onClick={() => onViewTicket(t)}
                  className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">qr_code</span>
                  <span>View Digital Ticket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AttendeeDashboardView;
