import React, { useState } from 'react';
import { PageHeader, Button, Tabs, StatTile, StatGrid } from '../ui';
import * as XLSX from 'xlsx';
import { GoodiesMerchSection } from './GoodiesMerchSection';
import { SponsorshipSection } from './SponsorshipSection';
import { VenueMarketplaceView } from './VenueMarketplaceView';
import { SpeakerMarketplaceView } from './SpeakerMarketplaceView';

const STATUS_STYLES = {
  published: 'bg-[rgb(147_211_164/0.16)] text-[color:var(--volunteer-ink)]',
  draft: 'bg-[rgb(226_203_152/0.2)] text-[color:var(--sponsor-ink)]',
};

const EventStatus = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[status] || 'bg-fg/[0.07] text-fg/60'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {status}
  </span>
);

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
  currentUser,
  communities,
  onUpdateTicket,
  onUpdateEventExpenses,
  venueBookings = [],
  onRequestVenueBooking,
  speakingInvites = [],
  onInviteSpeaker,
  onRoleChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ticketInput, setTicketInput] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [selectedAnalyticsEvent, setSelectedAnalyticsEvent] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('attendees');
  const [checkInSearchTerm, setCheckInSearchTerm] = useState('');
  const [checkInFilter, setCheckInFilter] = useState('all'); // 'all', 'pending', 'checked'

  // Event Budget & Expense Management States
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [editingBudgetAmount, setEditingBudgetAmount] = useState('');
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Venue',
    allocated: '',
    spent: '',
    status: 'Paid',
    date: new Date().toISOString().split('T')[0]
  });

  const handleUpdateVolunteerStatus = (ticket, newStatus) => {
    const updated = {
      ...ticket,
      volunteerStatus: newStatus
    };
    onUpdateTicket(updated);
  };

  const handleUpdateCommunityStatus = (ticket, newStatus) => {
    const updated = {
      ...ticket,
      communityStatus: newStatus
    };
    onUpdateTicket(updated);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!selectedAnalyticsEvent || !expenseForm.title.trim()) return;

    const newExpItem = {
      id: `exp-${Date.now()}`,
      title: expenseForm.title,
      category: expenseForm.category,
      allocated: Number(expenseForm.allocated) || 0,
      spent: Number(expenseForm.spent) || 0,
      status: expenseForm.status,
      date: expenseForm.date
    };

    const currentExpenses = selectedAnalyticsEvent.expenses || [];
    const updatedExpenses = [newExpItem, ...currentExpenses];

    if (onUpdateEventExpenses) {
      onUpdateEventExpenses(selectedAnalyticsEvent.id, updatedExpenses, selectedAnalyticsEvent.budget);
    }

    // Update local state for immediate UI feedback
    setSelectedAnalyticsEvent({
      ...selectedAnalyticsEvent,
      expenses: updatedExpenses
    });

    setExpenseForm({
      title: '',
      category: 'Venue',
      allocated: '',
      spent: '',
      status: 'Paid',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddExpenseModal(false);
  };

  const handleDeleteExpense = (expId) => {
    if (!selectedAnalyticsEvent) return;
    const currentExpenses = selectedAnalyticsEvent.expenses || [];
    const updatedExpenses = currentExpenses.filter(e => e.id !== expId);

    if (onUpdateEventExpenses) {
      onUpdateEventExpenses(selectedAnalyticsEvent.id, updatedExpenses, selectedAnalyticsEvent.budget);
    }

    setSelectedAnalyticsEvent({
      ...selectedAnalyticsEvent,
      expenses: updatedExpenses
    });
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!selectedAnalyticsEvent) return;
    const newBudgetNum = Number(editingBudgetAmount) || 0;

    if (onUpdateEventExpenses) {
      onUpdateEventExpenses(selectedAnalyticsEvent.id, selectedAnalyticsEvent.expenses || [], newBudgetNum);
    }

    setSelectedAnalyticsEvent({
      ...selectedAnalyticsEvent,
      budget: newBudgetNum
    });

    setShowEditBudgetModal(false);
  };

  const handleDownloadCSV = (event) => {
    const eventTickets = tickets.filter(t => t.eventId === event.id);
    const headers = ['Name', 'Gender', 'Phone', 'Email', 'Location', 'Current Status', 'LinkedIn', 'Ticket Type', 'Registration Date', 'Volunteer Status', 'Community Application Status'];
    
    const rows = eventTickets.map(t => [
      t.userName,
      t.gender || 'None',
      t.phone || '',
      t.userEmail,
      t.location || '',
      t.occupation || '',
      t.linkedin || '',
      t.registrationType || 'Attendee',
      t.registrationDate || '',
      t.volunteerStatus || 'None',
      t.communityStatus || 'None'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title.replace(/\s+/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExcel = (event) => {
    const eventTickets = tickets.filter(t => t.eventId === event.id);
    const data = eventTickets.map(t => ({
      'Name': t.userName,
      'Gender': t.gender || 'None',
      'Phone': t.phone || '',
      'Email': t.userEmail,
      'Location': t.location || '',
      'Current Status': t.occupation || '',
      'LinkedIn': t.linkedin || '',
      'Ticket Type': t.registrationType || 'Attendee',
      'Registration Date': t.registrationDate || '',
      'Volunteer Status': t.volunteerStatus || 'None',
      'Community Application Status': t.communityStatus || 'None'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");
    XLSX.writeFile(workbook, `${event.title.replace(/\s+/g, '_')}_Attendees.xlsx`);
  };

  // Filter events belonging to current organizer
  const managedEvents = events.filter((evt) => {
    if (!currentUser) return false;
    if (evt.organizerEmail && currentUser.email) {
      return evt.organizerEmail.toLowerCase() === currentUser.email.toLowerCase();
    }
    if (evt.organizer && currentUser.name) {
      return evt.organizer.toLowerCase() === currentUser.name.toLowerCase();
    }
    return false;
  });

  // Compute aggregate metrics
  const totalRevenue = managedEvents.reduce((acc, e) => acc + (e.revenue || 0), 0);
  const totalRegistrations = managedEvents.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
  const totalCheckedIn = managedEvents.reduce((acc, e) => acc + (e.checkedInCount || 0), 0);

  const handleScanTicket = (e, targetEventId = null) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    const queryId = ticketInput.trim().toLowerCase();
    const matchedTicket = tickets.find(
      (t) => t.ticketId.toLowerCase() === queryId
    );

    if (!matchedTicket) {
      setCheckInResult({
        success: false,
        message: '✕ Ticket Not Found. Please check the ticket code and try again.',
      });
      return;
    }

    if (targetEventId && matchedTicket.eventId !== targetEventId) {
      setCheckInResult({
        success: false,
        message: `✕ Wrong Event! Ticket ${matchedTicket.ticketId} is registered for "${matchedTicket.eventTitle}".`,
      });
      return;
    }

    if (matchedTicket.status === 'checked-in') {
      setCheckInResult({
        success: false,
        message: `⚠️ Already Admitted! ${matchedTicket.userName} (${matchedTicket.ticketId}) was already checked in.`,
        ticket: matchedTicket,
      });
      return;
    }

    const success = onCheckInTicket(matchedTicket.ticketId);
    if (success) {
      setCheckInResult({
        success: true,
        message: `✓ Admitted! ${matchedTicket.userName} checked in successfully for ${matchedTicket.eventTitle}.`,
        ticket: matchedTicket,
      });
      setTicketInput('');
    } else {
      setCheckInResult({
        success: false,
        message: '✕ Could not complete check in. Please try again.',
      });
    }
  };

  const handleDirectCheckIn = (ticket) => {
    if (ticket.status === 'checked-in') return;
    const success = onCheckInTicket(ticket.ticketId);
    if (success) {
      setCheckInResult({
        success: true,
        message: `✓ Admitted! ${ticket.userName} (${ticket.ticketId}) checked in successfully.`,
        ticket,
      });
    }
  };

  // Open the per-event console straight on a given tab
  const openCheckIn = (evt) => {
    setSelectedAnalyticsEvent(evt);
    setDashboardTab('checkin');
    setCheckInResult(null);
    setTicketInput('');
  };
  const openAnalytics = (evt) => {
    setSelectedAnalyticsEvent(evt);
    setDashboardTab('attendees');
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      <PageHeader
        icon="edit_calendar"
        kicker="Organizer · Console"
        title="Run every event"
        accent="from one place."
        description="Coordinate schedules, track registrations, manage budgets, book venues and invite speakers."
        actions={
          <>
            <Button icon="add" onClick={onOpenCreateEvent}>Create new event</Button>
            {onRoleChange && (
              <Button variant="secondary" icon="explore" onClick={() => onRoleChange('attendee')}>
                Switch to attendee
              </Button>
            )}
          </>
        }
      />

      <StatGrid>
        <StatTile icon="event" label="Managed events" value={managedEvents.length} />
        <StatTile icon="group" label="Registrations" value={managedEvents.reduce((sum, e) => sum + (e.registeredCount || 0), 0).toLocaleString()} />
        <StatTile icon="payments" label="Revenue" value={`$${managedEvents.reduce((sum, e) => sum + (e.revenue || 0), 0).toLocaleString()}`} />
        <StatTile icon="how_to_reg" label="Checked in" value={managedEvents.reduce((sum, e) => sum + (e.checkedInCount || 0), 0).toLocaleString()} />
      </StatGrid>

      <Tabs
        label="Organizer sections"
        value={activeTab === 'overview' && selectedAnalyticsEvent ? null : activeTab}
        onChange={(id) => {
          setActiveTab(id);
          setSelectedAnalyticsEvent(null);
        }}
        items={[
          { id: 'overview', label: 'Overview & events', icon: 'dashboard' },
          { id: 'goodies', label: 'Goodies & merch', icon: 'local_mall' },
          { id: 'sponsors', label: 'Sponsorships', icon: 'handshake' },
          { id: 'venues', label: 'Venues', icon: 'domain' },
          { id: 'speakers', label: 'Speakers', icon: 'record_voice_over' },
          { id: 'communities', label: 'My communities', icon: 'groups', onClick: () => setActiveView('my-communities') },
        ]}
      />


      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {!selectedAnalyticsEvent ? (
            <>
              {/* Event Table View */}
              <div className="flex justify-between items-center">
                <h3 className="font-geist text-lg font-bold text-[#00355f]">My Managed Events</h3>
                <span className="text-xs text-[#5f5e5e]">{managedEvents.length} Total Events</span>
              </div>

              {managedEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#e1e3e4] p-8 space-y-4 shadow-2xs">
                  <div className="w-12 h-12 bg-[#d2e4ff] text-[#0f4c81] rounded-2xl flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-2xl">event_busy</span>
                  </div>
                  <h3 className="font-geist text-xl font-bold text-[#00355f]">No Managed Events Yet</h3>
                  <p className="font-inter text-xs text-[#5f5e5e] max-w-md mx-auto">
                    You haven't created or managed any events yet. Click "Create New Event" below to set up your first event.
                  </p>
                  <button
                    onClick={onOpenCreateEvent}
                    className="px-6 py-3 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span>Create Your First Event</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop: table */}
                  <div className="hidden md:block glass rounded-[24px] overflow-hidden">
                    <table className="w-full text-left text-[13px]">
                      <thead className="text-[11px] uppercase tracking-[0.14em] text-fg/45 border-b border-fg/[0.08]">
                        <tr>
                          <th className="px-5 py-4 font-medium">Event</th>
                          <th className="px-5 py-4 font-medium">Date</th>
                          <th className="px-5 py-4 font-medium">Status</th>
                          <th className="px-5 py-4 font-medium">Registrations</th>
                          <th className="px-5 py-4 font-medium">Revenue</th>
                          <th className="px-5 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-fg/[0.06]">
                        {managedEvents.map((evt) => (
                          <tr key={evt.id} className="hover:bg-fg/[0.025] transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img src={evt.imageUrl} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                                <div className="min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => onSelectEvent(evt)}
                                    className="font-geist font-semibold text-fg hover:underline underline-offset-4 cursor-pointer text-left block truncate max-w-[260px]"
                                  >
                                    {evt.title}
                                  </button>
                                  <span className="text-[12px] text-fg/50 truncate block max-w-[260px]">{evt.location}, {evt.city}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-fg/75 whitespace-nowrap">
                              {evt.startDate}
                              <span className="block text-[12px] text-fg/45">{evt.time}</span>
                            </td>
                            <td className="px-5 py-4"><EventStatus status={evt.status} /></td>
                            <td className="px-5 py-4 font-semibold text-fg whitespace-nowrap">
                              {evt.registeredCount} <span className="text-fg/40 font-normal">/ {evt.expectedAttendees}</span>
                            </td>
                            <td className="px-5 py-4 font-semibold text-fg whitespace-nowrap">${evt.revenue.toLocaleString()}</td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1.5">
                                <Button variant="secondary" icon="qr_code_scanner" className="!px-3.5 !py-1.5 !text-[12px]" onClick={() => openCheckIn(evt)} title="Open live door check-in for this event">
                                  Check-in
                                </Button>
                                <Button className="!px-3.5 !py-1.5 !text-[12px]" onClick={() => openAnalytics(evt)}>Analytics</Button>
                                <Button variant="ghost" className="!px-3 !py-1.5 !text-[12px]" onClick={() => onSelectEvent(evt)}>View</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile: one card per event */}
                  <ul className="md:hidden space-y-3">
                    {managedEvents.map((evt) => (
                      <li key={evt.id} className="glass rounded-[22px] p-4">
                        <button type="button" onClick={() => onSelectEvent(evt)} className="flex items-center gap-3 text-left w-full cursor-pointer">
                          <img src={evt.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <span className="min-w-0">
                            <span className="font-geist font-semibold text-fg block truncate">{evt.title}</span>
                            <span className="text-[12px] text-fg/50 block truncate">{evt.startDate} · {evt.time} · {evt.city}</span>
                          </span>
                        </button>
                        <div className="flex items-center justify-between gap-3 mt-3 text-[13px]">
                          <EventStatus status={evt.status} />
                          <span className="text-fg/70">
                            <span className="font-semibold text-fg">{evt.registeredCount}</span> / {evt.expectedAttendees} · <span className="font-semibold text-fg">${evt.revenue.toLocaleString()}</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <Button variant="secondary" icon="qr_code_scanner" className="!px-2 !text-[12px]" onClick={() => openCheckIn(evt)}>Check-in</Button>
                          <Button className="!px-2 !text-[12px]" onClick={() => openAnalytics(evt)}>Analytics</Button>
                          <Button variant="ghost" className="!px-2 !text-[12px]" onClick={() => onSelectEvent(evt)}>View</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
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

              {/* Event Registrations & Staffing with Downloads */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#edeeef] pb-3 text-left">
                  <div>
                    <h4 className="font-geist font-bold text-sm text-[#00355f]">Staffing & Registrations</h4>
                    <p className="font-inter text-[11px] text-gray-500">Review registrations, manage volunteer applications, and join requests.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadCSV(selectedAnalyticsEvent)}
                      className="px-3 py-1.5 bg-white border border-[#c2c7d1] hover:bg-gray-50 text-[#00355f] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
                    >
                      <span className="material-symbols-outlined text-xs">download</span>
                      <span>Download CSV</span>
                    </button>
                    <button
                      onClick={() => handleDownloadExcel(selectedAnalyticsEvent)}
                      className="px-3 py-1.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-3xs"
                    >
                      <span className="material-symbols-outlined text-xs">download</span>
                      <span>Download Excel</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tabs inside selected event dashboard */}
                <div className="flex border-b border-[#e1e3e4] gap-6 text-xs font-semibold pt-1">
                  <button
                    onClick={() => setDashboardTab('attendees')}
                    className={`pb-2 transition-all whitespace-nowrap cursor-pointer ${
                      dashboardTab === 'attendees'
                        ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
                        : 'text-[#5f5e5e] hover:text-[#00355f]'
                    }`}
                  >
                    Registered Attendees ({tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length})
                  </button>
                  <button
                    onClick={() => setDashboardTab('volunteers')}
                    className={`pb-2 transition-all whitespace-nowrap cursor-pointer ${
                      dashboardTab === 'volunteers'
                        ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
                        : 'text-[#5f5e5e] hover:text-[#00355f]'
                    }`}
                  >
                    Volunteers ({tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && (t.registrationType === 'Volunteer' || t.registrationType === 'Volunteer + Community')).length})
                  </button>
                  <button
                    onClick={() => setDashboardTab('community')}
                    className={`pb-2 transition-all whitespace-nowrap cursor-pointer ${
                      dashboardTab === 'community'
                        ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
                        : 'text-[#5f5e5e] hover:text-[#00355f]'
                    }`}
                  >
                    Community Applicants ({tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && (t.registrationType === 'Community' || t.registrationType === 'Volunteer + Community')).length})
                  </button>
                  <button
                    onClick={() => {
                      setDashboardTab('checkin');
                      setCheckInResult(null);
                    }}
                    className={`pb-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      dashboardTab === 'checkin'
                        ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
                        : 'text-[#5f5e5e] hover:text-[#00355f]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                    <span>
                      Live Door Check-In ({tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && t.status === 'checked-in').length}/{tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length})
                    </span>
                  </button>

                  <button
                    onClick={() => setDashboardTab('budget')}
                    className={`pb-2 transition-all whitespace-nowrap cursor-pointer ${
                      dashboardTab === 'budget'
                        ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
                        : 'text-[#5f5e5e] hover:text-[#00355f]'
                    }`}
                  >
                    💰 Budget & Expense Tracker
                  </button>
                </div>

                {/* Tab Rendering content */}
                {dashboardTab === 'attendees' && (
                  <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden overflow-x-auto text-left">
                    <table className="w-full text-left text-xs font-inter min-w-[950px]">
                      <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Attendee Name</th>
                          <th className="p-3">Phone / Call Action</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3">LinkedIn</th>
                          <th className="p-3">Reg Date</th>
                          <th className="p-3">Reg Type</th>
                          <th className="p-3">Volunteer Status</th>
                          <th className="p-3">Community Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edeeef]">
                        {tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).length === 0 ? (
                          <tr>
                            <td colSpan="10" className="p-6 text-center text-gray-400 italic">
                              No attendees registered yet for this event.
                            </td>
                          </tr>
                        ) : (
                          tickets.filter(t => t.eventId === selectedAnalyticsEvent.id).map((t) => (
                            <tr key={t.ticketId} className="hover:bg-gray-50 transition-colors">
                              <td className="p-3 font-semibold text-[#00355f]">{t.userName}</td>
                              <td className="p-3 text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium">{t.phone || '—'}</span>
                                  {t.phone && (
                                    <a
                                      href={`tel:${t.phone}`}
                                      className="px-2 py-0.5 bg-[#d2e4ff] text-[#0f4c81] font-bold text-[9px] hover:bg-[#00355f] hover:text-white rounded transition-all whitespace-nowrap"
                                    >
                                      Call
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-gray-500">{t.userEmail}</td>
                              <td className="p-3 text-gray-500">{t.location ? `${t.location}${t.state ? `, ${t.state}` : ''}` : '—'}</td>
                              <td className="p-3 text-gray-500">{t.occupation || '—'}</td>
                              <td className="p-3 text-gray-500">
                                {t.linkedin ? (
                                  <a href={t.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">
                                    Profile
                                  </a>
                                ) : '—'}
                              </td>
                              <td className="p-3 text-gray-500">{t.registrationDate || '—'}</td>
                              <td className="p-3">
                                <span className="text-[9px] font-bold bg-[#fff3d6] text-[#b46d00] px-2 py-0.5 rounded uppercase">
                                  {t.registrationType || 'Attendee'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  t.volunteerStatus === 'Selected' ? 'bg-[#e2f7e2] text-[#1a853e]' :
                                  t.volunteerStatus === 'Applied' ? 'bg-[#d2e4ff] text-[#0f4c81]' :
                                  t.volunteerStatus === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                                  t.volunteerStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {t.volunteerStatus || 'None'}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  t.communityStatus === 'Selected' ? 'bg-[#e2f7e2] text-[#1a853e]' :
                                  t.communityStatus === 'Applied' ? 'bg-[#d2e4ff] text-[#0f4c81]' :
                                  t.communityStatus === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                                  t.communityStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {t.communityStatus || 'None'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {dashboardTab === 'volunteers' && (
                  <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden overflow-x-auto text-left">
                    <table className="w-full text-left text-xs font-inter min-w-[950px]">
                      <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Applicant Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3">LinkedIn</th>
                          <th className="p-3">Why Volunteer</th>
                          <th className="p-3">Application Date</th>
                          <th className="p-3">Volunteer Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edeeef]">
                        {tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && (t.registrationType === 'Volunteer' || t.registrationType === 'Volunteer + Community')).length === 0 ? (
                          <tr>
                            <td colSpan="9" className="p-6 text-center text-gray-400 italic">
                              No volunteer applications submitted yet.
                            </td>
                          </tr>
                        ) : (
                          tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && (t.registrationType === 'Volunteer' || t.registrationType === 'Volunteer + Community')).map((t) => (
                            <tr key={t.ticketId} className="hover:bg-gray-50 transition-colors">
                              <td className="p-3 font-semibold text-[#00355f]">{t.userName}</td>
                              <td className="p-3 text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium">{t.phone || '—'}</span>
                                  {t.phone && (
                                    <a
                                      href={`tel:${t.phone}`}
                                      className="px-2 py-0.5 bg-[#d2e4ff] text-[#0f4c81] font-bold text-[9px] hover:bg-[#00355f] hover:text-white rounded transition-all whitespace-nowrap"
                                    >
                                      Call
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-gray-500">{t.userEmail}</td>
                              <td className="p-3 text-gray-500">{t.location || '—'}</td>
                              <td className="p-3 text-gray-500">{t.occupation || '—'}</td>
                              <td className="p-3 text-gray-500">
                                {t.linkedin ? (
                                  <a href={t.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">
                                    Profile
                                  </a>
                                ) : '—'}
                              </td>
                              <td className="p-3 text-gray-500 max-w-[180px] truncate font-medium text-gray-600" title={t.volunteerWhy}>
                                {t.volunteerWhy || '—'}
                              </td>
                              <td className="p-3 text-gray-500">{t.registrationDate || '—'}</td>
                              <td className="p-3">
                                <select
                                  value={t.volunteerStatus || 'Applied'}
                                  onChange={(e) => handleUpdateVolunteerStatus(t, e.target.value)}
                                  className="px-2 py-1 bg-white border border-[#c2c7d1] rounded-lg text-[10px] font-bold text-[#00355f] focus:outline-none"
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Selected">Selected</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {dashboardTab === 'community' && (
                  <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden overflow-x-auto text-left">
                    <table className="w-full text-left text-xs font-inter min-w-[950px]">
                      <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Applicant Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3">LinkedIn</th>
                          <th className="p-3">Why Join Community</th>
                          <th className="p-3">Application Date</th>
                          <th className="p-3">Community Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edeeef]">
                        {tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && (t.registrationType === 'Community' || t.registrationType === 'Volunteer + Community')).length === 0 ? (
                          <tr>
                            <td colSpan="9" className="p-6 text-center text-gray-400 italic">
                              No community join requests submitted yet.
                            </td>
                          </tr>
                        ) : (
                          tickets.filter(t => t.eventId === selectedAnalyticsEvent.id && (t.registrationType === 'Community' || t.registrationType === 'Volunteer + Community')).map((t) => (
                            <tr key={t.ticketId} className="hover:bg-gray-50 transition-colors">
                              <td className="p-3 font-semibold text-[#00355f]">{t.userName}</td>
                              <td className="p-3 text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium">{t.phone || '—'}</span>
                                  {t.phone && (
                                    <a
                                      href={`tel:${t.phone}`}
                                      className="px-2 py-0.5 bg-[#d2e4ff] text-[#0f4c81] font-bold text-[9px] hover:bg-[#00355f] hover:text-white rounded transition-all whitespace-nowrap"
                                    >
                                      Call
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 text-gray-500">{t.userEmail}</td>
                              <td className="p-3 text-gray-500">{t.location || '—'}</td>
                              <td className="p-3 text-gray-500">{t.occupation || '—'}</td>
                              <td className="p-3 text-gray-500">
                                {t.linkedin ? (
                                  <a href={t.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">
                                    Profile
                                  </a>
                                ) : '—'}
                              </td>
                              <td className="p-3 text-gray-500 max-w-[180px] truncate font-medium text-gray-600" title={t.communityWhy}>
                                {t.communityWhy || '—'}
                              </td>
                              <td className="p-3 text-gray-500">{t.registrationDate || '—'}</td>
                              <td className="p-3">
                                <select
                                  value={t.communityStatus || 'Applied'}
                                  onChange={(e) => handleUpdateCommunityStatus(t, e.target.value)}
                                  className="px-2 py-1 bg-white border border-[#c2c7d1] rounded-lg text-[10px] font-bold text-[#00355f] focus:outline-none"
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Selected">Selected</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {dashboardTab === 'budget' && (
                  <div className="space-y-6 text-left animate-fadeIn">
                    {/* Budget Overview Header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-5">
                      <div>
                        <h4 className="font-geist font-bold text-base text-[#00355f] flex items-center gap-2">
                          <span>💰 Event Budget & Expenditure Manager</span>
                        </h4>
                        <p className="font-inter text-xs text-[#5f5e5e] mt-0.5">
                          Set allocated funds, log spent amounts, and track category-wise expense variance.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBudgetAmount(selectedAnalyticsEvent.budget || '');
                            setShowEditBudgetModal(true);
                          }}
                          className="px-3.5 py-2 bg-white border border-[#c2c7d1] hover:bg-gray-50 text-[#00355f] rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
                        >
                          ✏️ Edit Allocated Budget
                        </button>
                        <button
                          onClick={() => setShowAddExpenseModal(true)}
                          className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <span>➕ Log Expense</span>
                        </button>
                      </div>
                    </div>

                    {/* Financial Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-[#e1e3e4] rounded-2xl space-y-1 shadow-3xs">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Allocated Event Budget</span>
                        <span className="font-geist text-2xl font-bold text-[#00355f]">
                          ${(selectedAnalyticsEvent.budget || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500 block">Total budget ceiling</span>
                      </div>

                      <div className="p-4 bg-white border border-[#e1e3e4] rounded-2xl space-y-1 shadow-3xs">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Amount Spent</span>
                        <span className="font-geist text-2xl font-bold text-[#0f4c81]">
                          ${((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500 block">Logged expenditures</span>
                      </div>

                      <div className="p-4 bg-white border border-[#e1e3e4] rounded-2xl space-y-1 shadow-3xs">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Remaining Balance</span>
                        <span className={`font-geist text-2xl font-bold ${
                          (selectedAnalyticsEvent.budget || 0) - ((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) >= 0
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}>
                          ${((selectedAnalyticsEvent.budget || 0) - ((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0))).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500 block">Remaining unspent funds</span>
                      </div>
                    </div>

                    {/* Progress Bar & Status */}
                    {(selectedAnalyticsEvent.budget || 0) > 0 && (
                      <div className="p-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl space-y-2">
                        <div className="flex justify-between text-xs font-bold text-[#00355f]">
                          <span>Budget Utilization Rate</span>
                          <span>
                            {Math.min(100, Math.round((((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) / selectedAnalyticsEvent.budget) * 100))}% Used
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all rounded-full ${
                              ((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) > selectedAnalyticsEvent.budget
                                ? 'bg-rose-500'
                                : ((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) / selectedAnalyticsEvent.budget > 0.85
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (((selectedAnalyticsEvent.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) / selectedAnalyticsEvent.budget) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Expenses Table */}
                    <div className="space-y-3">
                      <h5 className="font-geist font-bold text-sm text-[#00355f]">Logged Expense Items</h5>
                      <div className="bg-white border border-[#e1e3e4] rounded-2xl overflow-hidden overflow-x-auto text-left shadow-3xs">
                        <table className="w-full text-left text-xs font-inter min-w-[700px]">
                          <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Expense Item Title</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Allocated ($)</th>
                              <th className="p-3">Amount Spent ($)</th>
                              <th className="p-3">Variance ($)</th>
                              <th className="p-3">Payment Status</th>
                              <th className="p-3">Date</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#edeeef]">
                            {(!selectedAnalyticsEvent.expenses || selectedAnalyticsEvent.expenses.length === 0) ? (
                              <tr>
                                <td colSpan="8" className="p-8 text-center text-gray-400 italic">
                                  No expenses logged for this event yet. Click "➕ Log Expense" to add one.
                                </td>
                              </tr>
                            ) : (
                              selectedAnalyticsEvent.expenses.map((exp) => {
                                const diff = (exp.allocated || 0) - (exp.spent || 0);
                                return (
                                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-semibold text-[#00355f]">{exp.title}</td>
                                    <td className="p-3">
                                      <span className="px-2.5 py-1 bg-[#f0f4f8] text-[#0f4c81] font-bold rounded text-[10px]">
                                        {exp.category}
                                      </span>
                                    </td>
                                    <td className="p-3 text-gray-600 font-medium">${(exp.allocated || 0).toLocaleString()}</td>
                                    <td className="p-3 text-[#00355f] font-bold">${(exp.spent || 0).toLocaleString()}</td>
                                    <td className="p-3 font-semibold">
                                      <span className={diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                        {diff >= 0 ? `+$${diff.toLocaleString()}` : `-$${Math.abs(diff).toLocaleString()}`}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        exp.status === 'Paid' ? 'bg-[#e2f7e2] text-[#1a853e]' : 'bg-[#fff3d6] text-[#b46d00]'
                                      }`}>
                                        {exp.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-gray-500 text-[11px]">{exp.date || '—'}</td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => handleDeleteExpense(exp.id)}
                                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event-Scoped Live Door Check-In Tab */}
                {dashboardTab === 'checkin' && (() => {
                  const eventTickets = tickets.filter(t => t.eventId === selectedAnalyticsEvent.id);
                  const checkedInTickets = eventTickets.filter(t => t.status === 'checked-in');
                  const pendingTickets = eventTickets.filter(t => t.status !== 'checked-in');
                  const checkInRate = eventTickets.length > 0
                    ? Math.round((checkedInTickets.length / eventTickets.length) * 100)
                    : 0;

                  const filteredRoster = eventTickets.filter((t) => {
                    if (checkInFilter === 'pending' && t.status === 'checked-in') return false;
                    if (checkInFilter === 'checked' && t.status !== 'checked-in') return false;
                    if (checkInSearchTerm.trim()) {
                      const query = checkInSearchTerm.toLowerCase();
                      const matchesName = t.userName?.toLowerCase().includes(query);
                      const matchesEmail = t.userEmail?.toLowerCase().includes(query);
                      const matchesId = t.ticketId?.toLowerCase().includes(query);
                      if (!matchesName && !matchesEmail && !matchesId) return false;
                    }
                    return true;
                  });

                  return (
                    <div className="space-y-6 text-left animate-fadeIn">
                      {/* Check-In Telemetry Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white border border-[#e1e3e4] rounded-2xl text-center space-y-1 shadow-2xs">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Registered</span>
                          <span className="font-geist text-2xl font-black text-[#00355f]">{eventTickets.length}</span>
                          <span className="text-[10px] text-gray-500 block">Event Attendee Pool</span>
                        </div>

                        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-center space-y-1 shadow-2xs">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Checked In</span>
                          <span className="font-geist text-2xl font-black text-emerald-700">{checkedInTickets.length}</span>
                          <span className="text-[10px] text-emerald-600 block">Admitted at Door</span>
                        </div>

                        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl text-center space-y-1 shadow-2xs">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending Arrival</span>
                          <span className="font-geist text-2xl font-black text-amber-700">{pendingTickets.length}</span>
                          <span className="text-[10px] text-amber-600 block">Awaiting Check-In</span>
                        </div>

                        <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-center space-y-1 shadow-2xs">
                          <span className="text-[10px] font-bold text-[#0f4c81] uppercase tracking-wider block">Check-In Rate</span>
                          <span className="font-geist text-2xl font-black text-[#00355f]">{checkInRate}%</span>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
                            <div className="bg-[#1a853e] h-full transition-all duration-500" style={{ width: `${checkInRate}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Ticket Scanner & Validator Card */}
                      <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-4 shadow-2xs">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <h4 className="font-geist font-bold text-base text-[#00355f] flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#0f4c81]">qr_code_scanner</span>
                              <span>Scan or Validate Door Ticket</span>
                            </h4>
                            <p className="font-inter text-xs text-[#5f5e5e]">
                              Enter or scan attendee Ticket ID specifically for <strong>{selectedAnalyticsEvent.title}</strong>.
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-[#0f4c81] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full w-fit">
                            Live Scanner Active
                          </span>
                        </div>

                        <form onSubmit={(e) => handleScanTicket(e, selectedAnalyticsEvent.id)} className="space-y-3">
                          <div className="flex gap-2">
                            <div className="relative flex-grow">
                              <span className="material-symbols-outlined absolute left-3.5 top-3 text-gray-400 text-lg">
                                pin
                              </span>
                              <input
                                type="text"
                                value={ticketInput}
                                onChange={(e) => setTicketInput(e.target.value)}
                                placeholder="Scan or enter Ticket ID (e.g. EH-89241)"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-geist font-bold text-[#00355f] outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
                              />
                            </div>
                            <button
                              type="submit"
                              className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0"
                            >
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              <span>Verify & Check In</span>
                            </button>
                          </div>

                          {/* Quick test pills from pending attendees */}
                          {pendingTickets.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                              <span className="text-[11px] text-gray-400">Sample pending tickets:</span>
                              {pendingTickets.slice(0, 4).map((t) => (
                                <button
                                  key={t.ticketId}
                                  type="button"
                                  onClick={() => setTicketInput(t.ticketId)}
                                  className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#00355f] font-mono text-[10px] font-bold rounded cursor-pointer transition-colors"
                                >
                                  {t.ticketId} ({t.userName?.split(' ')[0]})
                                </button>
                              ))}
                            </div>
                          )}
                        </form>

                        {/* Scanner Result Alert */}
                        {checkInResult && (
                          <div
                            className={`p-4 rounded-xl text-xs font-bold text-center border animate-fadeIn ${
                              checkInResult.success
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-base">
                                {checkInResult.success ? 'verified' : 'error'}
                              </span>
                              <span>{checkInResult.message}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Attendee Door Roster with 1-Click Check In */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <h4 className="font-geist font-bold text-sm text-[#00355f]">
                              Door Attendance Roster ({filteredRoster.length})
                            </h4>
                            <p className="font-inter text-xs text-[#5f5e5e]">
                              Search or tap Check In to admit guests directly without entering codes.
                            </p>
                          </div>

                          {/* Search + Filter Controls */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-sm">
                                search
                              </span>
                              <input
                                type="text"
                                value={checkInSearchTerm}
                                onChange={(e) => setCheckInSearchTerm(e.target.value)}
                                placeholder="Search attendee name or ID..."
                                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-[#0f4c81] w-48"
                              />
                            </div>

                            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50 text-xs">
                              <button
                                onClick={() => setCheckInFilter('all')}
                                className={`px-2.5 py-1 font-bold cursor-pointer ${
                                  checkInFilter === 'all' ? 'bg-[#0f4c81] text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                All ({eventTickets.length})
                              </button>
                              <button
                                onClick={() => setCheckInFilter('pending')}
                                className={`px-2.5 py-1 font-bold cursor-pointer ${
                                  checkInFilter === 'pending' ? 'bg-[#0f4c81] text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                Pending ({pendingTickets.length})
                              </button>
                              <button
                                onClick={() => setCheckInFilter('checked')}
                                className={`px-2.5 py-1 font-bold cursor-pointer ${
                                  checkInFilter === 'checked' ? 'bg-[#0f4c81] text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                Admitted ({checkedInTickets.length})
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Roster Table */}
                        <div className="bg-white border border-[#e1e3e4] rounded-xl overflow-hidden shadow-2xs">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-inter">
                              <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4] text-[#727780] font-bold uppercase tracking-wider">
                                <tr>
                                  <th className="p-3">Attendee Name</th>
                                  <th className="p-3">Ticket ID</th>
                                  <th className="p-3">Ticket Tier</th>
                                  <th className="p-3">Phone</th>
                                  <th className="p-3">Door Status</th>
                                  <th className="p-3 text-right">Door Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#edeeef]">
                                {filteredRoster.length === 0 ? (
                                  <tr>
                                    <td colSpan="6" className="p-6 text-center text-gray-400 italic">
                                      No attendees match the current filter or search criteria.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredRoster.map((t) => {
                                    const isChecked = t.status === 'checked-in';
                                    return (
                                      <tr key={t.ticketId} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 font-semibold text-[#00355f]">
                                          <div>{t.userName}</div>
                                          <div className="text-[10px] text-gray-400 font-normal">{t.userEmail}</div>
                                        </td>
                                        <td className="p-3">
                                          <span className="font-mono text-[11px] font-bold text-[#0f4c81] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                            {t.ticketId}
                                          </span>
                                        </td>
                                        <td className="p-3 text-gray-600">
                                          {t.ticketTierName || (t.isFree ? 'Free Admission' : 'Standard')}
                                        </td>
                                        <td className="p-3 text-gray-500">
                                          {t.phone ? (
                                            <a href={`tel:${t.phone}`} className="hover:text-[#0f4c81] hover:underline">
                                              {t.phone}
                                            </a>
                                          ) : '—'}
                                        </td>
                                        <td className="p-3">
                                          <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                              isChecked
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                          >
                                            {isChecked ? '✓ Admitted' : 'Pending'}
                                          </span>
                                        </td>
                                        <td className="p-3 text-right">
                                          {isChecked ? (
                                            <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                                              <span className="material-symbols-outlined text-sm">done_all</span>
                                              <span>Admitted</span>
                                            </span>
                                          ) : (
                                            <button
                                              onClick={() => handleDirectCheckIn(t)}
                                              className="px-3 py-1 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-lg text-xs font-bold transition-all shadow-3xs cursor-pointer active:scale-95 inline-flex items-center gap-1"
                                            >
                                              <span className="material-symbols-outlined text-xs">login</span>
                                              <span>Check In</span>
                                            </button>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Modal: Add Expense */}
          {showAddExpenseModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-5 animate-scaleUp text-left">
                <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
                  <h3 className="font-geist text-lg font-bold text-[#00355f]">➕ Log New Event Expense</h3>
                  <button onClick={() => setShowAddExpenseModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-4 text-xs font-inter">
                  <div className="space-y-1">
                    <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Expense Title / Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stage AV & Lighting Systems"
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl focus:outline-none focus:border-[#0f4c81]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Category</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl focus:outline-none focus:border-[#0f4c81]"
                      >
                        <option value="Venue">Venue & Hall</option>
                        <option value="Equipment">Equipment & A/V</option>
                        <option value="Catering">Catering & Food</option>
                        <option value="Speakers">Speakers & Travel</option>
                        <option value="Marketing">Marketing & Ads</option>
                        <option value="Swag">Swag & Goodies</option>
                        <option value="Operations">Operations & Staff</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Payment Status</label>
                      <select
                        value={expenseForm.status}
                        onChange={(e) => setExpenseForm({ ...expenseForm, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl focus:outline-none focus:border-[#0f4c81]"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Allocated Cost ($)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={expenseForm.allocated}
                        onChange={(e) => setExpenseForm({ ...expenseForm, allocated: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl focus:outline-none focus:border-[#0f4c81]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Actual Amount Spent ($)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="0"
                        value={expenseForm.spent}
                        onChange={(e) => setExpenseForm({ ...expenseForm, spent: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl focus:outline-none focus:border-[#0f4c81]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Expense Date</label>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl focus:outline-none focus:border-[#0f4c81]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddExpenseModal(false)}
                      className="px-4 py-2.5 border border-[#c2c7d1] rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Save Expense Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Edit Allocated Budget */}
          {showEditBudgetModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-[#e1e3e4] space-y-5 animate-scaleUp text-left">
                <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
                  <h3 className="font-geist text-lg font-bold text-[#00355f]">✏️ Set Allocated Budget</h3>
                  <button onClick={() => setShowEditBudgetModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveBudget} className="space-y-4 text-xs font-inter">
                  <div className="space-y-1">
                    <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Total Event Budget ($)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 50000"
                      value={editingBudgetAmount}
                      onChange={(e) => setEditingBudgetAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm font-geist font-bold focus:outline-none focus:border-[#0f4c81]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEditBudgetModal(false)}
                      className="px-4 py-2.5 border border-[#c2c7d1] rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Update Budget
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Event Selection Prompt if Check-In accessed directly */}
      {activeTab === 'checkin' && !selectedAnalyticsEvent && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2rem] p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-sm text-left">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#d2e4ff] text-[#0f4c81] rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </div>
            <h2 className="font-geist text-2xl font-bold text-[#00355f]">Select Event for Door Check-In</h2>
            <p className="font-inter text-xs text-[#5f5e5e]">
              Pick which event you are managing door admissions for to launch its live ticket validator.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {managedEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  setSelectedAnalyticsEvent(evt);
                  setDashboardTab('checkin');
                  setActiveTab('overview');
                }}
                className="p-4 rounded-xl border border-gray-200 hover:border-[#0f4c81] hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img src={evt.imageUrl} alt={evt.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-geist font-bold text-sm text-[#00355f] group-hover:text-[#0f4c81]">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      📅 {evt.startDate} • 👥 {evt.registeredCount} Registered
                    </p>
                  </div>
                </div>
                <button className="px-3.5 py-1.5 bg-[#0f4c81] text-white rounded-lg text-xs font-bold">
                  Open Scanner →
                </button>
              </div>
            ))}
          </div>
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
          currentUser={currentUser}
        />
      )}

      {activeTab === 'venues' && (
        <VenueMarketplaceView
          events={events}
          venueBookings={venueBookings}
          onRequestVenueBooking={onRequestVenueBooking}
          currentUser={currentUser}
          isEmbedded={true}
        />
      )}

      {activeTab === 'speakers' && (
        <SpeakerMarketplaceView
          events={events}
          speakingInvites={speakingInvites}
          onInviteSpeaker={onInviteSpeaker}
          currentUser={currentUser}
          isEmbedded={true}
        />
      )}
    </div>
  );
};
export default OrganizerDashboardView;
