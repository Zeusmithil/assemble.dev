import React, { useState, useMemo } from 'react';
import { INITIAL_VENUES } from '../../data/initialData';

export const VenueMarketplaceView = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [bookedVenue, setBookedVenue] = useState(null);

  // Advanced filtering memo
  const filteredVenues = useMemo(() => {
    return INITIAL_VENUES.filter((v) => {
      // City filter
      if (selectedCity !== 'All' && v.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

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
      if (selectedAmenity !== 'All' && !v.amenities.includes(selectedAmenity)) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesLocation = v.location.toLowerCase().includes(query);
        const matchesVibe = v.vibe.toLowerCase().includes(query);
        if (!matchesName && !matchesLocation && !matchesVibe) return false;
      }

      return true;
    });
  }, [selectedCity, selectedVibe, selectedCapacity, selectedPrice, selectedAmenity, searchTerm]);

  // Extract all amenities for filter dropdown
  const allAmenities = useMemo(() => {
    const set = new Set();
    INITIAL_VENUES.forEach(v => v.amenities.forEach(a => set.add(a)));
    return Array.from(set);
  }, []);

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-6 animate-fadeIn">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors cursor-pointer"
        >
          <span>← Back to Dashboard</span>
        </button>
      )}

      {/* Header */}
      <div>
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          Event Infrastructure
        </span>
        <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
          Venue Marketplace
        </h1>
        <p className="font-inter text-sm text-[#5f5e5e] mt-1">
          Discover and book verified auditoriums, industrial lofts, and outdoor amphitheaters.
        </p>
      </div>

      {/* Advanced Filters Bento Card */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xs space-y-5">
        {/* Search */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-5 text-gray-400">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venues by name, vibe type, or landmark location..."
            className="w-full pl-14 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl font-inter text-xs text-black focus:outline-none focus:border-black focus:bg-white transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 text-gray-400 hover:text-black">
              <span className="material-symbols-outlined text-sm">close</span>
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
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Cities</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          {/* Vibe / Type */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Vibe Type</span>
            <select
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Vibes</option>
              <option value="Professional">Professional</option>
              <option value="Chic">Chic</option>
              <option value="Industrial">Industrial</option>
              <option value="Historic">Historic</option>
              <option value="Modern">Modern</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Capacity</span>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Capacities</option>
              <option value="small">Small (&lt; 150 seats)</option>
              <option value="medium">Medium (150 - 500 seats)</option>
              <option value="large">Large (500+ seats)</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price / Hour</span>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Prices</option>
              <option value="budget">Budget (&lt; $100/hr)</option>
              <option value="standard">Standard ($100 - $250/hr)</option>
              <option value="premium">Premium ($250+/hr)</option>
            </select>
          </div>

          {/* Facilities */}
          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Facilities</span>
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#00355f] cursor-pointer font-bold outline-none"
            >
              <option value="All">All Facilities</option>
              {allAmenities.map(am => (
                <option key={am} value={am}>{am}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e1e3e4] p-8 space-y-2">
          <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
          <h3 className="font-geist text-lg font-bold text-black">No matching venues found</h3>
          <p className="font-inter text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your location, vibe, capacity, or search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredVenues.map((ven) => (
            <div
              key={ven.id}
              className="bg-white border border-[#e1e3e4] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row"
            >
              <div className="w-full md:w-2/5 h-48 md:h-auto relative bg-[#e7e8e9]">
                <img src={ven.image} alt={ven.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded font-geist text-[10px] font-bold text-[#00355f]">
                  {ven.vibe}
                </div>
              </div>

              <div className="w-full md:w-3/5 p-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-geist font-bold text-[#00355f] text-base leading-snug">{ven.name}</h3>
                    <span className="font-geist font-bold text-[#0f4c81] text-sm whitespace-nowrap">${ven.pricePerHour}<span className="text-[10px] text-[#727780]">/hr</span></span>
                  </div>
                  <p className="font-inter text-xs text-[#5f5e5e] mt-1">📍 {ven.location}, {ven.city}</p>
                  <p className="font-inter text-xs text-[#00355f] font-semibold mt-1">Capacity: up to {ven.capacity} guests</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {ven.amenities.map((am, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#f8f9fa] border border-[#e1e3e4] text-[9px] text-[#42474f] font-semibold rounded">
                      {am}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#edeeef] flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#1a853e]">⭐ {ven.rating} Rating</span>
                  <button
                    onClick={() => setBookedVenue(ven)}
                    className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Request Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Confirmation Toast / Modal */}
      {bookedVenue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-scaleUp">
            <div className="w-12 h-12 bg-[#e2f7e2] text-[#1a853e] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <h3 className="font-geist text-xl font-bold text-[#00355f] text-center">Booking Request Sent!</h3>
            <p className="font-inter text-xs text-[#5f5e5e] text-center">
              Your inquiry for <span className="font-bold text-[#00355f]">{bookedVenue.name}</span> (${bookedVenue.pricePerHour}/hr) has been submitted. The venue host will confirm availability shortly.
            </p>
            <button
              onClick={() => setBookedVenue(null)}
              className="w-full py-3 bg-[#0f4c81] text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default VenueMarketplaceView;
