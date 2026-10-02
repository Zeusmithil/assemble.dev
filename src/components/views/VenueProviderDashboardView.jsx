import React, { useState } from 'react';

export const VenueProviderDashboardView = ({
  currentUser,
  venues = [],
  venueBookings = [],
  onAddVenue,
  onUpdateVenue,
  onAcceptBooking,
  onDeclineBooking,
  setActiveView,
  onRoleChange,
}) => {
  const [activeTab, setActiveTab] = useState('my-venues');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  // Form states for adding/editing venue
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCity, setVenueCity] = useState('Chennai');
  const [venueCapacity, setVenueCapacity] = useState('350');
  const [venueType, setVenueType] = useState('Auditorium');
  const [venuePrice, setVenuePrice] = useState('180');
  const [venueDesc, setVenueDesc] = useState('');
  const [venueFacilities, setVenueFacilities] = useState(['High-Speed Wi-Fi', 'Acoustic Stage', 'VIP Green Room', 'Valet Parking']);
  const [newFacility, setNewFacility] = useState('');
  const [venueImages, setVenueImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImgs = [];
    Array.from(files).forEach((file) => {
      const objUrl = URL.createObjectURL(file);
      newImgs.push(objUrl);

      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (loadEvent.target?.result) {
            setVenueImages((prev) =>
              prev.map((img) => (img === objUrl ? loadEvent.target.result : img))
            );
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setVenueImages((prev) => [...prev, ...newImgs]);
  };

  // Filter user's venues vs all venues
  const myVenues = venues.filter((v) => 
    v.providerEmail === currentUser?.email || 
    v.providerName === currentUser?.name ||
    v.id === 'ven-my-1'
  );

  const displayedVenues = myVenues.length > 0 ? myVenues : venues.slice(0, 2);

  const pendingBookings = venueBookings.filter((b) => b.status === 'pending');
  const confirmedBookings = venueBookings.filter((b) => b.status === 'confirmed');

  const handleOpenAdd = () => {
    setEditingVenue(null);
    setVenueName('');
    setVenueAddress('');
    setVenueCity('Chennai');
    setVenueCapacity('350');
    setVenueType('Auditorium');
    setVenuePrice('180');
    setVenueDesc('');
    setVenueFacilities(['High-Speed Wi-Fi', 'Acoustic Stage', 'VIP Green Room', 'Valet Parking']);
    setVenueImages([]);
    setShowAddModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingVenue(v);
    setVenueName(v.name || '');
    setVenueAddress(v.location || v.address || '');
    setVenueCity(v.city || 'Chennai');
    setVenueCapacity(String(v.capacity || 300));
    setVenueType(v.vibe || 'Auditorium');
    setVenuePrice(String(v.pricePerHour || 150));
    setVenueDesc(v.description || '');
    setVenueFacilities(v.amenities || ['High-Speed Wi-Fi', 'Stage']);
    setVenueImages(v.images || (v.image ? [v.image] : []));
    setShowAddModal(true);
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !venueFacilities.includes(newFacility.trim())) {
      setVenueFacilities([...venueFacilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (fac) => {
    setVenueFacilities(venueFacilities.filter((f) => f !== fac));
  };

  const handleRemoveImage = (index) => {
    setVenueImages(venueImages.filter((_, i) => i !== index));
  };

  const handleSubmitVenue = (e) => {
    e.preventDefault();
    const newVenueData = {
      id: editingVenue ? editingVenue.id : `ven-${Date.now()}`,
      name: venueName,
      location: venueAddress,
      address: venueAddress,
      city: venueCity,
      capacity: Number(venueCapacity) || 300,
      vibe: venueType,
      pricePerHour: Number(venuePrice) || 150,
      description: venueDesc,
      amenities: venueFacilities,
      image: venueImages[0] || '',
      images: venueImages,
      providerEmail: currentUser?.email,
      providerName: currentUser?.name,
      rating: editingVenue ? editingVenue.rating : 4.9,
      reviews: editingVenue ? editingVenue.reviews : 1,
      available: true,
    };

    if (editingVenue && onUpdateVenue) {
      onUpdateVenue(newVenueData);
    } else if (onAddVenue) {
      onAddVenue(newVenueData);
    }
    setShowAddModal(false);
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn text-left">
      {/* Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a2d42] via-[#0f4c81] to-[#00355f] p-8 md:p-10 text-white shadow-xl shadow-slate-900/15 border border-white/20 backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
              <span>📍</span>
              <span>Venue Management Console</span>
            </div>
            <h1 className="font-geist text-3xl md:text-4xl font-extrabold tracking-tight">
              Manage Your Venue Spaces
            </h1>
            <p className="font-inter text-sm text-blue-100/90 leading-relaxed">
              Showcase auditoriums, conference lofts, and outdoor amphitheaters. Accept bookings and coordinate with event organizers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-white text-[#00355f] hover:bg-gray-100 rounded-2xl font-geist font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <span className="material-symbols-outlined text-sm">add_business</span>
              <span>Add New Venue</span>
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

        {/* Glow circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0f4c81] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">apartment</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{displayedVenues.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Listed Venues</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{pendingBookings.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Pending Requests</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">{confirmedBookings.length}</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Confirmed Bookings</div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#e1e3e4]/80 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">grade</span>
          </div>
          <div>
            <div className="font-geist text-2xl font-black text-[#00355f]">4.9 / 5.0</div>
            <div className="font-inter text-xs text-gray-500 font-medium">Average Venue Rating</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e1e3e4] gap-6 text-sm font-semibold overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('my-venues')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-venues'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">domain</span>
          <span>My Venues ({displayedVenues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('booking-requests')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'booking-requests'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">inbox</span>
          <span>Booking Requests ({pendingBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'border-b-2 border-[#00355f] text-[#00355f] font-bold'
              : 'text-[#5f5e5e] hover:text-[#00355f]'
          }`}
        >
          <span className="material-symbols-outlined text-base">event_available</span>
          <span>Upcoming Schedule ({confirmedBookings.length})</span>
        </button>
      </div>

      {/* TAB 1: My Venues */}
      {activeTab === 'my-venues' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-geist text-lg font-bold text-[#00355f]">Active Venue Listings</h2>
              <p className="font-inter text-xs text-gray-500">Venues made available for organizers to discover and book.</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#0f4c81] text-white rounded-xl text-xs font-bold hover:bg-[#00355f] cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>List Another Venue</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedVenues.map((v) => {
              const hasImages = (v.images && v.images.length > 0) || Boolean(v.image);
              return (
                <div
                  key={v.id}
                  className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2rem] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image or Notice Box */}
                    {hasImages ? (
                      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                        <img
                          src={v.images?.[0] || v.image}
                          alt={v.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                          {v.vibe}
                        </div>
                      </div>
                    ) : (
                      /* STRICT REQUIREMENT: Clearly display in-person viewing notice */
                      <div className="h-44 w-full bg-amber-50/80 border-b border-amber-100 p-6 flex flex-col items-center justify-center text-center space-y-2">
                        <span className="material-symbols-outlined text-amber-600 text-3xl">image_not_supported</span>
                        <div className="text-xs font-bold text-amber-900">
                          No venue images available.
                        </div>
                        <p className="text-[11px] text-amber-700 max-w-xs leading-relaxed">
                          Organizers may need to arrange an in-person viewing before booking.
                        </p>
                      </div>
                    )}

                    {/* Venue Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-geist text-lg font-bold text-[#00355f]">{v.name}</h3>
                          <span className="font-geist font-black text-sm text-[#0f4c81] whitespace-nowrap">
                            ${v.pricePerHour}/hr
                          </span>
                        </div>
                        <p className="font-inter text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{v.location || v.address}, {v.city}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-inter text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-gray-400">group</span>
                          <span>Capacity: <strong>{v.capacity}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-gray-400">category</span>
                          <span>Type: <strong>{v.vibe}</strong></span>
                        </div>
                      </div>

                      {v.amenities && v.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {v.amenities.map((am, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-blue-50/60 text-[#00355f] text-[10px] font-semibold rounded-lg border border-blue-100/60">
                              {am}
                            </span>
                          ))}
                        </div>
                      )}

                      {v.description && (
                        <p className="font-inter text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {v.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-3 mt-4">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Ready for Bookings</span>
                    </span>
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Edit Venue Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Booking Requests */}
      {activeTab === 'booking-requests' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-geist text-lg font-bold text-[#00355f]">Incoming Booking Requests</h2>
            <p className="font-inter text-xs text-gray-500">Organizers wishing to reserve your venue for upcoming dates.</p>
          </div>

          {pendingBookings.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Pending Booking Requests</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                When organizers request to book your venue spaces, their proposals will appear here for your review and confirmation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingBookings.map((b) => (
                <div key={b.id} className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full">
                        Pending Confirmation
                      </span>
                      <h3 className="font-geist text-base font-bold text-[#00355f] mt-2">{b.eventName}</h3>
                      <p className="font-inter text-xs text-gray-500">Requested for: <span className="font-bold text-[#0f4c81]">{b.venueName}</span></p>
                    </div>
                    <div className="font-geist text-lg font-black text-[#00355f]">${b.estimatedTotal || 1200}</div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
                    <div>Date: <strong>{b.date}</strong> ({b.durationHours || 6} hours)</div>
                    <div>Organizer: <strong>{b.organizerName}</strong> ({b.organizerEmail})</div>
                    <div>Expected Attendance: <strong>{b.expectedAttendees || 200} guests</strong></div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onDeclineBooking && onDeclineBooking(b.id)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onAcceptBooking && onAcceptBooking(b.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                    >
                      Accept Booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <h2 className="font-geist text-lg font-bold text-[#00355f]">Confirmed Venue Schedule</h2>
          {confirmedBookings.length === 0 ? (
            <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-3">
              <span className="material-symbols-outlined text-4xl text-gray-300">event_available</span>
              <h3 className="font-geist text-lg font-bold text-[#00355f]">No Confirmed Bookings Yet</h3>
              <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
                Accepted booking requests will appear here on your venue calendar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {confirmedBookings.map((b) => (
                <div key={b.id} className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-3xl p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                      Confirmed Host Date
                    </span>
                    <h3 className="font-geist font-bold text-[#00355f] text-base mt-2">{b.eventName}</h3>
                    <p className="font-inter text-xs text-gray-500">{b.venueName} • Date: {b.date}</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cross-Role Banner */}
      <div className="bg-gradient-to-r from-slate-100 to-blue-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f4c81]">hub</span>
          <h3 className="font-geist text-base font-bold text-[#00355f]">Cross-Role Capabilities</h3>
        </div>
        <p className="font-inter text-xs text-gray-600 max-w-2xl leading-relaxed">
          As a Venue Provider, you are also empowered to organize your own community events, join existing rooms, or register as an attendee.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => onRoleChange && onRoleChange('attendee')}
            className="p-4 bg-white rounded-2xl border border-gray-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎟 Attendee Portal</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Discover experiences happening in other spaces.</p>
          </button>

          <button
            onClick={() => setActiveView('create-event')}
            className="p-4 bg-white rounded-2xl border border-gray-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎯 Host an Event</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Launch your own community meetup inside your venue.</p>
          </button>

          <button
            onClick={() => onRoleChange && onRoleChange('speaker')}
            className="p-4 bg-white rounded-2xl border border-gray-200 text-left hover:border-[#0f4c81] transition-all cursor-pointer shadow-xs group"
          >
            <div className="text-base font-bold text-[#00355f] group-hover:text-[#0f4c81] flex items-center justify-between">
              <span>🎤 Become a Speaker</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Share your knowledge on stage as a keynote presenter.</p>
          </button>
        </div>
      </div>

      {/* Add / Edit Venue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#e1e3e4] space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-center border-b border-[#edeeef] pb-3">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">
                {editingVenue ? '✏️ Edit Venue Space' : '📍 List a New Venue'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitVenue} className="space-y-4 text-xs font-inter">
              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Venue Name</label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Grand Auditorium Hall"
                  className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">City</label>
                  <select
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-semibold"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Tokyo">Tokyo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Venue Type</label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-semibold"
                  >
                    <option value="Auditorium">Auditorium</option>
                    <option value="Conference Loft">Conference Loft</option>
                    <option value="Modern Industrial">Modern Industrial</option>
                    <option value="Open Air / Amphitheater">Open Air / Amphitheater</option>
                    <option value="Executive Boardroom">Executive Boardroom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Full Address & Landmarks</label>
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="e.g. 14 Marina Beach Road, Anna Square"
                  className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Max Guest Capacity</label>
                  <input
                    type="number"
                    required
                    value={venueCapacity}
                    onChange={(e) => setVenueCapacity(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Rate ($ / hr)</label>
                  <input
                    type="number"
                    required
                    value={venuePrice}
                    onChange={(e) => setVenuePrice(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">
                    Venue Photos / Images (Upload from Device)
                  </label>
                  {venueImages.length > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      ✓ {venueImages.length} photo{venueImages.length > 1 ? 's' : ''} uploaded
                    </span>
                  )}
                </div>

                <label className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] bg-[#f8f9fa] hover:bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
                  <span className="material-symbols-outlined text-2xl text-gray-400 group-hover:text-[#0f4c81] transition-colors mb-1">
                    add_photo_alternate
                  </span>
                  <span className="text-xs font-bold text-[#00355f] group-hover:text-[#0f4c81]">
                    Click or drag images from your device
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    JPG, PNG, WebP supported (select single or multiple files)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {venueImages.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-[11px] font-medium leading-relaxed">
                    ⚠️ <strong>No venue images uploaded yet.</strong> The notice: <em>"No venue images available. Organizers may need to arrange an in-person viewing before booking."</em> will be shown.
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-2.5">
                      {venueImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-16 rounded-xl overflow-hidden border border-gray-200 group shadow-xs">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors shadow-xs"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Key Facilities & Amenities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    placeholder="e.g. LED Wall"
                    className="flex-grow px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="px-4 py-2 bg-[#0f4c81] text-white rounded-xl font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {venueFacilities.map((fac) => (
                    <span key={fac} className="px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-semibold flex items-center gap-1.5">
                      {fac}
                      <button type="button" onClick={() => handleRemoveFacility(fac)} className="text-gray-400 hover:text-black">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Description</label>
                <textarea
                  rows={3}
                  value={venueDesc}
                  onChange={(e) => setVenueDesc(e.target.value)}
                  placeholder="Describe the architectural style, acoustic quality, parking facilities..."
                  className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#edeeef] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                >
                  {editingVenue ? 'Save Changes' : 'Publish Venue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default VenueProviderDashboardView;
