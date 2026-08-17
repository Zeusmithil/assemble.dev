import React, { useState } from 'react';
import * as XLSX from 'xlsx';
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
  currentUser,
  communities,
  onUpdateTicket,
  onUpdateEventExpenses
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ticketInput, setTicketInput] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [selectedAnalyticsEvent, setSelectedAnalyticsEvent] = useState(null);
  const [dashboardTab, setDashboardTab] = useState('attendees');

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
          onClick={() => setActiveView('my-communities')}
          className="pb-3 text-[#5f5e5e] hover:text-[#00355f] whitespace-nowrap cursor-pointer"
        >
          My Communities
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
                        {managedEvents.map((evt) => (
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
