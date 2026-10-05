import React, { useState, useMemo } from 'react';
import { INITIAL_VENUES } from '../../data/initialData';

export const VenueMarketplaceView = ({ onBack, onRequestVenueBooking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [selectedVenueForBooking, setSelectedVenueForBooking] = useState(null);
  const [bookingEventName, setBookingEventName] = useState('Design Systems Summit');
  const [bookingDate, setBookingDate] = useState('2026-11-15');
  const [bookingHours, setBookingHours] = useState('6');
  const [bookingAttendees, setBookingAttendees] = useState('250');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Combine initial venues with dynamically listed venues
  const allVenues = useMemo(() => {
    const local = JSON.parse(localStorage.getItem('assemble_venues') || '[]');
    const combined = [...local, ...INITIAL_VENUES];
    const unique = [];
    const seen = new Set();
    combined.forEach((v) => {
      const key = v.id || v.name;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(v);
      }
    });
    return unique;
  }, []);

  // Extract all amenities for filter dropdown
  const allAmenities = useMemo(() => {
    const set = new Set();
    allVenues.forEach((v) => {
      if (Array.isArray(v.amenities)) {
        v.amenities.forEach((a) => set.add(a));
      }
    });
    return Array.from(set);
  }, [allVenues]);

  // Extract cities
  const allCities = useMemo(() => {
    const set = new Set();
    allVenues.forEach((v) => {
      if (v.city) set.add(v.city);
    });
    return ['All', ...Array.from(set)];
  }, [allVenues]);

  // Advanced filtering memo
  const filteredVenues = useMemo(() => {
    return allVenues.filter((v) => {
      // City filter
      if (selectedCity !== 'All' && v.city?.toLowerCase() !== selectedCity.toLowerCase()) return false;

      // Vibe/Event Type filter
      if (selectedVibe !== 'All' && v.vibe !== selectedVibe) return false;

      // Capacity filter
      if (selectedCapacity === 'small' && v.capacity >= 150) return false;
      if (selectedCapacity === 'medium' && (v.capacity < 150 || v.capacity > 500)) return false;
      if (selectedCapacity === 'large' && v.capacity <= 500) return false;

      // Price filter
      if (selectedPrice === 'budget' && v.pricePerHour >= 100) return false;
      if (selectedPrice === 'standard' && (v.pricePerHour < 100 || v.pricePerHour > 250)) return false;
      if (selectedPrice === 'premium' && v.pricePerHour <= 250) return false;

      // Amenity / Facilities filter
      if (selectedAmenity !== 'All') {
        const hasAm = v.amenities && v.amenities.some((a) => a.toLowerCase() === selectedAmenity.toLowerCase());
        if (!hasAm) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = v.name?.toLowerCase().includes(query);
        const matchesLocation = v.location?.toLowerCase().includes(query) || v.address?.toLowerCase().includes(query);
        const matchesVibe = v.vibe?.toLowerCase().includes(query);
        const matchesDesc = v.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation && !matchesVibe && !matchesDesc) return false;
      }

      return true;
    });
  }, [allVenues, selectedCity, selectedVibe, selectedCapacity, selectedPrice, selectedAmenity, searchTerm]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (selectedVenueForBooking) {
      const bookings = JSON.parse(localStorage.getItem('assemble_venue_bookings') || '[]');
      const newBooking = {
        id: `bk-${Date.now()}`,
        venueId: selectedVenueForBooking.id,
        venueName: selectedVenueForBooking.name,
        eventName: bookingEventName,
        date: bookingDate,
        durationHours: Number(bookingHours) || 6,
        expectedAttendees: Number(bookingAttendees) || 200,
        estimatedTotal: (Number(bookingHours) || 6) * (selectedVenueForBooking.pricePerHour || 150),
        status: 'pending',
        organizerName: 'Current Organizer',
        organizerEmail: 'organizer@eventhorizon.dev',
      };
      bookings.unshift(newBooking);
      localStorage.setItem('assemble_venue_bookings', JSON.stringify(bookings));

      if (onRequestVenueBooking) {
        onRequestVenueBooking(newBooking);
      }

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedVenueForBooking(null);
      }, 1500);
    }
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-6 animate-fadeIn text-left">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <span>← Back to Home</span>
        </button>
      )}

      {/* Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a2d42] via-[#0f4c81] to-[#00355f] p-8 md:p-10 text-white shadow-xl shadow-slate-900/15 border border-white/20 backdrop-blur-md">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-blue-100">
            <span>📍</span>
            <span>Venue Infrastructure Marketplace</span>
          </div>
          <h1 className="font-geist text-3xl md:text-4xl font-extrabold tracking-tight">
            Venue Marketplace
          </h1>
          <p className="font-inter text-sm text-blue-100/90 leading-relaxed">
            Discover verified auditoriums, industrial lofts, and executive boardrooms. Filter by capacity, acoustic stage, and amenities.
          </p>
        </div>
      </div>

      {/* Advanced Filters Bento Card */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-[#e1e3e4] shadow-xs space-y-4">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-5 text-gray-400">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venues by name, landmark address, capacity, or vibe type..."
            className="w-full pl-14 pr-10 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-2xl font-inter text-xs text-black focus:outline-none focus:border-[#0f4c81] focus:bg-white transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-400 hover:text-black">
              ✕
            </button>
          )}
        </div>

        {/* Filter selectors grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-semibold">
          {/* City */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">City</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              {allCities.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* Vibe / Type */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Vibe Type</span>
            <select
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Vibe Types</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Conference Loft">Conference Loft</option>
              <option value="Modern Industrial">Modern Industrial</option>
              <option value="Open Air / Amphitheater">Open Air / Amphitheater</option>
              <option value="Culinary Studio">Culinary Studio</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Capacity</span>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Sizes</option>
              <option value="small">Boutique (&lt; 150 guests)</option>
              <option value="medium">Mid-Sized (150 - 500 guests)</option>
              <option value="large">Grand Scale (500+ guests)</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Hourly Rate</span>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Rates</option>
              <option value="budget">Budget (&lt; $100/hr)</option>
              <option value="standard">Standard ($100 - $250/hr)</option>
              <option value="premium">Premium ($250+/hr)</option>
            </select>
          </div>

          {/* Amenity */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Specific Amenity</span>
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Amenities ({allAmenities.length})</option>
              {allAmenities.map((am) => (
                <option key={am} value={am}>{am}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e1e3e4] p-8 space-y-2">
          <span className="material-symbols-outlined text-4xl text-gray-300">domain_disabled</span>
          <h3 className="font-geist text-lg font-bold text-[#00355f]">No Matching Venues Found</h3>
          <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
            Try expanding your capacity bounds, changing cities, or clearing amenity filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((v) => {
            const hasImages = (v.images && v.images.length > 0) || Boolean(v.image);
            return (
              <div
                key={v.id}
                className="bg-white/90 backdrop-blur-md border border-[#e1e3e4] rounded-[2rem] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo or STRICT REQUIRED NOTICE */}
                  {hasImages ? (
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <img
                        src={v.images?.[0] || v.image}
                        alt={v.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {v.vibe}
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#00355f] text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                        ${v.pricePerHour}/hr
                      </div>
                    </div>
                  ) : (
                    /* MANDATORY NOTICE WHEN NO IMAGE IS AVAILABLE */
                    <div className="h-48 w-full bg-amber-50/90 border-b border-amber-100 p-6 flex flex-col items-center justify-center text-center space-y-2">
                      <span className="material-symbols-outlined text-amber-600 text-3xl">image_not_supported</span>
                      <div className="text-xs font-bold text-amber-900">
                        No venue images available.
                      </div>
                      <p className="text-[11px] text-amber-700 max-w-xs leading-relaxed">
                        Organizers may need to arrange an in-person viewing before booking.
                      </p>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-geist font-bold text-base text-[#00355f] leading-snug group-hover:text-[#0f4c81] transition-colors">
                          {v.name}
                        </h3>
                        <p className="font-inter text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span>{v.location || v.address}, {v.city}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-inter text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                      <span>👥 Capacity: <strong>{v.capacity}</strong></span>
                      <span>⭐ Rating: <strong>{v.rating || 4.9}</strong></span>
                    </div>

                    {v.amenities && v.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {v.amenities.slice(0, 3).map((am, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50/60 text-[#00355f] text-[10px] font-semibold rounded-md border border-blue-100/50">
                            {am}
                          </span>
                        ))}
                        {v.amenities.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] text-gray-400 font-bold">
                            +{v.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {v.description && (
                      <p className="font-inter text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {v.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-3 mt-2">
                  <span className="text-[11px] text-gray-400 font-mono">
                    ID: {v.id}
                  </span>
                  <button
                    onClick={() => setSelectedVenueForBooking(v)}
                    className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Booking Modal */}
      {selectedVenueForBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 animate-scaleUp text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-geist text-base font-bold text-[#00355f]">Reserve Venue Space</h3>
              <button onClick={() => setSelectedVenueForBooking(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <h4 className="font-geist font-bold text-emerald-700">Booking Request Sent!</h4>
                <p className="font-inter text-xs text-gray-500">The venue provider will review your reservation request on their dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-inter">
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="font-bold text-[#00355f]">{selectedVenueForBooking.name}</div>
                  <div className="text-[11px] text-gray-500">{selectedVenueForBooking.city} • Rate: ${selectedVenueForBooking.pricePerHour}/hr</div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Event Name</label>
                  <input
                    type="text"
                    required
                    value={bookingEventName}
                    onChange={(e) => setBookingEventName(e.target.value)}
                    placeholder="e.g. AI Innovation Summit 2026"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Reservation Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Duration (Hours)</label>
                    <input
                      type="number"
                      required
                      value={bookingHours}
                      onChange={(e) => setBookingHours(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#00355f] uppercase text-[10px] tracking-wider block">Expected Attendees</label>
                  <input
                    type="number"
                    required
                    value={bookingAttendees}
                    onChange={(e) => setBookingAttendees(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500">Estimated Total:</span>
                  <span className="font-geist text-base font-extrabold text-[#00355f]">
                    ${(Number(bookingHours) || 6) * (selectedVenueForBooking.pricePerHour || 150)}
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVenueForBooking(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0f4c81] text-white rounded-xl font-bold shadow-xs hover:bg-[#00355f]"
                  >
                    Submit Booking Request
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
export default VenueMarketplaceView;
