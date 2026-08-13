import React from 'react';

export const HowItWorksView = ({ setActiveView }) => {
  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          Platform Architecture
        </span>
        <h1 className="font-geist text-3xl md:text-4xl font-bold text-[#00355f]">
          How assemble.dev Works
        </h1>
        <p className="font-inter text-sm text-[#5f5e5e] leading-relaxed">
          Designed for seamless interaction between attendees and organizers. Simple enough for first-time attendees, powerful enough for multi-day summits.
        </p>
      </div>

      {/* For Attendees Section */}
      <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-10 shadow-2xs space-y-8">
        <div className="flex items-center gap-3 border-b border-[#edeeef] pb-4">
          <span className="material-symbols-outlined text-2xl text-[#0f4c81]">confirmation_number</span>
          <h2 className="font-geist text-2xl font-bold text-[#00355f]">For Attendees</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">01</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Discover Events</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Explore local workshops, design summits, acoustic shows, and masterclasses using location-aware filters.
            </p>
          </div>

          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">02</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Instant Registration</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Register with a single click and receive a dynamic digital pass complete with location details and agenda.
            </p>
          </div>

          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">03</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">QR Door Entry</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Present your QR ticket at the venue door for instant contactless check-in and access to swag kits.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveView('discover')}
            className="px-6 py-3 bg-[#0f4c81] text-white rounded-xl font-bold text-xs hover:bg-[#00355f] transition-all"
          >
            Explore Events Now
          </button>
        </div>
      </div>

      {/* For Organizers Section */}
      <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-10 shadow-2xs space-y-8">
        <div className="flex items-center gap-3 border-b border-[#edeeef] pb-4">
          <span className="material-symbols-outlined text-2xl text-[#0f4c81]">dashboard</span>
          <h2 className="font-geist text-2xl font-bold text-[#00355f]">For Organizers & Creators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">01</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Create & Draft</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Define event titles, schedules, expected attendee capacity, and ticket pricing.
            </p>
          </div>

          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">02</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Book Venues & Vendors</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Source verified lofts, keynote speakers, coffee bars, and 4K videographers directly.
            </p>
          </div>

          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">03</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Publish Live</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Launch your event to the global discovery feed with real-time revenue analytics.
            </p>
          </div>

          <div className="p-5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] space-y-2">
            <span className="font-geist text-2xl font-bold text-[#0f4c81]">04</span>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Execute & Check-In</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Use the built-in QR ticket validator at the door to track real-time attendance stats.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setActiveView('create-event')}
            className="px-6 py-3 bg-[#0f4c81] text-white rounded-xl font-bold text-xs hover:bg-[#00355f] transition-all"
          >
            Create an Event
          </button>
        </div>
      </div>
    </div>
  );
};
