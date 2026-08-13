import React, { useState } from 'react';
import { GoodiesMerchSection } from './GoodiesMerchSection';
import { SponsorshipSection } from './SponsorshipSection';

export const OrganizerDashboardView = ({
  events,
  tickets,
  onCheckInTicket,
  onOpenCreateEvent,
  onSelectEvent,
  setActiveView,
  goodiesCart,
  goodiesOrders,
  onAddGoodiesToCart,
  onRemoveGoodiesFromCart,
  onPlaceGoodiesOrder,
  sponsorshipCodes,
  sponsorshipRequests,
  onRequestSponsorship,
  onSimulateSponsorApprove,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ticketInput, setTicketInput] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [selectedAnalyticsEvent, setSelectedAnalyticsEvent] = useState(null);

  // Compute aggregate metrics
  const totalRevenue = events.reduce((acc, e) => acc + e.revenue, 0);
  const totalRegistrations = events.reduce((acc, e) => acc + e.registeredCount, 0);
  const totalCheckedIn = events.reduce((acc, e) => acc + e.checkedInCount, 0);

  const handleScanTicket = (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    const success = onCheckInTicket(ticketInput.trim());
    const matchedTicket = tickets.find(
      (t) => t.ticketId.toLowerCase() === ticketInput.trim().toLowerCase()
    );

    if (success && matchedTicket) {
      setCheckInResult({
        success: true,
        message: `✓ Ticket Verified! ${matchedTicket.userName} checked in successfully for ${matchedTicket.eventTitle}.`,
        ticket: matchedTicket,
      });
    } else {
      setCheckInResult({
        success: false,
        message: '✕ Ticket Not Found or Already Checked In.',
      });
    }
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-6">
        <div>
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
            Organizer Portal
          </span>
          <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
            Event Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('checkin');
              setSelectedAnalyticsEvent(null);
            }}
            className="px-4 py-2.5 bg-white border border-[#c2c7d1] hover:bg-[#f3f4f5] text-[#00355f] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#0f4c81]">qr_code_scanner</span>
            <span>Live Door Check-In</span>
          </button>

          <button
            onClick={onOpenCreateEvent}
            className="px-4 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Sidebar / Tabs Row */}
      <div className="flex border-b border-[#e1e3e4] gap-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('overview');
            setSelectedAnalyticsEvent(null);
          }}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview' && !selectedAnalyticsEvent
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          Overview & Events
        </button>


        <button
          onClick={() => {
            setActiveTab('goodies');
            setSelectedAnalyticsEvent(null);
          }}
          className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'goodies'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base font-bold">local_mall</span>
          <span>Goodies & Merchandise</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('sponsors');
            setSelectedAnalyticsEvent(null);
          }}
          className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'sponsors'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base font-bold">handshake</span>
          <span>Sponsorships</span>
        </button>

        <button
          onClick={() => setActiveView('venues-marketplace')}
          className="pb-3 text-[#5f5e5e] hover:text-[#00355f] whitespace-nowrap cursor-pointer"
        >
          Venue Marketplace
        </button>

        <button
          onClick={() => setActiveView('speakers-marketplace')}
          className="pb-3 text-[#5f5e5e] hover:text-[#00355f] whitespace-nowrap cursor-pointer"
        >
          Speakers Marketplace
        </button>

        <button
          onClick={() => setActiveView('services-marketplace')}
          className="pb-3 text-[#5f5e5e] hover:text-[#00355f] whitespace-nowrap cursor-pointer"
        >
          Services & Vendors
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {!selectedAnalyticsEvent ? (
            <>
              {/* Event Table View */}
              <div className="flex justify-between items-center">
                <h3 className="font-geist text-lg font-bold text-[#00355f]">My Managed Events</h3>
                <span className="text-xs text-[#5f5e5e]">{events.length} Total Events</span>
              </div>

              <div className="bg-white border border-[#e1e3e4] rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-inter">
                    <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Event Name</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Registrations</th>
                        <th className="p-4">Revenue</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edeeef]">
                      {events.map((evt) => (
                        <tr key={evt.id} className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={evt.imageUrl}
                                alt={evt.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <span
                                  onClick={() => onSelectEvent(evt)}
                                  className="font-geist font-bold text-[#00355f] hover:underline cursor-pointer text-sm block animate-pulse-once"
                                >
                                  {evt.title}
                                </span>
                                <span className="text-[11px] text-[#727780]">{evt.location}, {evt.city}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-[#42474f]">
                            {evt.startDate} <br />
                            <span className="text-[11px] text-[#727780]">{evt.time}</span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                evt.status === 'published'
                                  ? 'bg-[#e2f7e2] text-[#1a853e]'
                                  : evt.status === 'draft'
                                  ? 'bg-[#fff3d6] text-[#b46d00]'
                                  : 'bg-[#e7e8e9] text-[#5f5e5e]'
                              }`}
                            >
                              {evt.status}
                            </span>
                          </td>
                          <td className="p-4 text-[#00355f] font-bold">
                            {evt.registeredCount} / {evt.expectedAttendees}
                          </td>
                          <td className="p-4 text-[#00355f] font-bold">
                            ${evt.revenue.toLocaleString()}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedAnalyticsEvent(evt)}
                              className="px-3 py-1.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-lg font-bold cursor-pointer"
                            >
                              Analytics
                            </button>
                            <button
                              onClick={() => onSelectEvent(evt)}
                              className="px-3 py-1.5 border border-[#c2c7d1] hover:bg-[#e7e8e9] rounded-lg font-bold text-[#00355f] cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            // Collapsible Event Analytics Dashboard View
            <div className="bg-white border border-[#e1e3e4] rounded-[2rem] p-6 md:p-8 space-y-6 shadow-xs animate-scaleUp">
              <div className="flex justify-between items-start border-b border-[#edeeef] pb-4">
                <div>
                  <button
                    onClick={() => setSelectedAnalyticsEvent(null)}
                    className="text-xs font-bold text-[#0f4c81] hover:underline mb-1 flex items-center gap-1 cursor-pointer"
                  >
                    <span>← Back to events list</span>
                  </button>
                  <h3 className="font-geist text-xl font-bold text-[#00355f]">
                    {selectedAnalyticsEvent.title} — Performance Analytics
                  </h3>
                  <p className="font-inter text-xs text-[#5f5e5e]">
                    📍 {selectedAnalyticsEvent.location}, {selectedAnalyticsEvent.city} • Date: {selectedAnalyticsEvent.startDate}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedAnalyticsEvent.status === 'published'
                      ? 'bg-[#e2f7e2] text-[#1a853e]'
                      : 'bg-[#fff3d6] text-[#b46d00]'
                  }`}
                >
                  {selectedAnalyticsEvent.status}
                </span>
              </div>

              {/* Analytics Mini-Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tickets Sold</span>
                  <span className="font-geist text-2xl font-bold text-[#00355f]">
                    {tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length}
                  </span>
                  <span className="text-[10px] text-gray-500 block">/ {selectedAnalyticsEvent.expectedAttendees} Capacity</span>
                </div>

                <div className="p-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Remaining Passes</span>
                  <span className="font-geist text-2xl font-bold text-[#0f4c81]">
                    {Math.max(0, selectedAnalyticsEvent.expectedAttendees - tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length)}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Available to purchase</span>
                </div>

                <div className="p-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Event Revenue</span>
                  <span className="font-geist text-2xl font-bold text-[#1a853e]">
                    ${tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).reduce((acc, t) => acc + t.price, 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 block">Gross revenue generated</span>
                </div>
              </div>

              {/* Tiers list metrics */}
              <div className="space-y-3">
                <h4 className="font-geist font-bold text-sm text-[#00355f]">Ticket Tier Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedAnalyticsEvent.ticketTiers && selectedAnalyticsEvent.ticketTiers.length > 0 ? (
                    selectedAnalyticsEvent.ticketTiers.map((tier) => {
                      const soldCount = tickets.filter(
                        (t) => t.eventId === selectedAnalyticsEvent.id && t.ticketTierName === tier.name
                      ).length;
                      return (
                        <div key={tier.name} className="p-4 border border-[#e1e3e4] rounded-xl space-y-1.5 bg-white">
                          <div className="flex justify-between items-start">
                            <span className="font-geist font-bold text-xs text-[#00355f]">{tier.name}</span>
                            <span className="text-[10px] font-bold text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded">
                              ${tier.price}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#5f5e5e] line-clamp-1">{tier.description}</p>
                          <div className="flex justify-between items-center text-[10px] font-semibold pt-1 text-gray-500">
                            <span>Sold: {soldCount} / {tier.capacity}</span>
                            <span>{Math.max(0, tier.capacity - soldCount)} Left</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Default Tier fallback
                    <div className="p-4 border border-[#e1e3e4] rounded-xl space-y-1.5 bg-white">
                      <div className="flex justify-between items-start">
                        <span className="font-geist font-bold text-xs text-[#00355f]">General Admission</span>
                        <span className="text-[10px] font-bold text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded">
                          {selectedAnalyticsEvent.isFree ? 'Free' : `$${selectedAnalyticsEvent.price}`}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5f5e5e]">Standard registration tier.</p>
                      <div className="flex justify-between items-center text-[10px] font-semibold pt-1 text-gray-500">
                        <span>Sold: {tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length} / {selectedAnalyticsEvent.expectedAttendees}</span>
                        <span>{Math.max(0, selectedAnalyticsEvent.expectedAttendees - tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length)} Left</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Swag / Goodies details */}
              {selectedAnalyticsEvent.swagOrder && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-geist font-bold text-sm text-[#00355f]">Swag & Goodies Order Status</h4>
                  <div className="p-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl flex gap-3 items-start text-xs leading-relaxed font-inter">
                    <span className="text-xl">🎁</span>
                    <div>
                      <p className="font-bold text-[#00355f]">{selectedAnalyticsEvent.swagOrder.product} order confirmed</p>
                      <p className="text-[#5f5e5e]">
                        Quantity: {selectedAnalyticsEvent.swagOrder.quantity} units (Size: {selectedAnalyticsEvent.swagOrder.size}) • Estimated Budget: ${selectedAnalyticsEvent.swagOrder.budget}
                      </p>
                      <p className="text-[#727780] mt-0.5">
                        Design requirements: {selectedAnalyticsEvent.swagOrder.design || 'None'} • Delivery Target: {selectedAnalyticsEvent.swagOrder.delivery}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendee registrations table */}
              <div className="space-y-3">
                <h4 className="font-geist font-bold text-sm text-[#00355f]">Registered Attendees</h4>
                <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs font-inter">
                    <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Attendee Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Ticket ID</th>
                        <th className="p-3">Tier</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#edeeef]">
                      {tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-gray-400 italic">
                            No attendees registered yet for this event.
                          </td>
                        </tr>
                      ) : (
                        tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).map((t) => (
                          <tr key={t.ticketId} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-semibold text-[#00355f]">{t.userName}</td>
                            <td className="p-3 text-gray-500">{t.userEmail}</td>
                            <td className="p-3 font-mono text-xs">{t.ticketId}</td>
                            <td className="p-3">
                              <span className="text-[10px] font-bold bg-[#fff3d6] text-[#b46d00] px-2 py-0.5 rounded uppercase">
                                {t.ticketTierName || 'General'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  t.status === 'checked-in'
                                    ? 'bg-[#e2f7e2] text-[#1a853e]'
                                    : 'bg-[#d2e4ff] text-[#0f4c81]'
                                }`}
                              >
                                {t.status}
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
        </div>
      )}

      {/* Live Door Check-In Scanner Tool */}
      {activeTab === 'checkin' && (
        <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 max-w-xl mx-auto shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#d2e4ff] text-[#0f4c81] rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </div>
            <h2 className="font-geist text-2xl font-bold text-[#00355f]">Live Door Ticket Validator</h2>
            <p className="font-inter text-xs text-[#5f5e5e]">
              Enter or scan attendee Ticket ID to verify validity and grant venue access.
            </p>
          </div>

          <form onSubmit={handleScanTicket} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#00355f] uppercase tracking-wider block">
                Enter Ticket ID or Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. EH-89241 or EH-44102"
                  className="flex-grow px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-geist font-bold text-[#00355f]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0f4c81] text-white font-bold rounded-xl text-xs hover:bg-[#00355f] cursor-pointer"
                >
                  Verify Ticket
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] text-[#727780]">Sample valid IDs for test: </span>
              <button
                type="button"
                onClick={() => setTicketInput('EH-89241')}
                className="text-[11px] font-bold text-[#0f4c81] underline mx-1 cursor-pointer"
              >
                EH-89241
              </button>
              <button
                type="button"
                onClick={() => setTicketInput('EH-44102')}
                className="text-[11px] font-bold text-[#0f4c81] underline mx-1 cursor-pointer"
              >
                EH-44102
              </button>
            </div>
          </form>

          {checkInResult && (
            <div
              className={`p-4 rounded-xl text-xs font-bold text-center border ${
                checkInResult.success
                  ? 'bg-[#e2f7e2] text-[#1a853e] border-[#b4e7b4]'
                  : 'bg-[#ffe3e3] text-[#d32f2f] border-[#ffb4b4]'
              }`}
            >
              {checkInResult.message}
            </div>
          )}
        </div>
      )}

      {activeTab === 'goodies' && (
        <GoodiesMerchSection
          events={events}
          goodiesCart={goodiesCart}
          goodiesOrders={goodiesOrders}
          onAddGoodiesToCart={onAddGoodiesToCart}
          onRemoveGoodiesFromCart={onRemoveGoodiesFromCart}
          onPlaceGoodiesOrder={onPlaceGoodiesOrder}
        />
      )}

      {activeTab === 'sponsors' && (
        <SponsorshipSection
          events={events}
          sponsorshipRequests={sponsorshipRequests}
          onRequestSponsorship={onRequestSponsorship}
          onSimulateSponsorApprove={onSimulateSponsorApprove}
        />
      )}
    </div>
  );
};
export default OrganizerDashboardView;
