import React from 'react';

export const AboutView = () => {
  return (
    <div className="px-4 md:px-10 max-w-[1000px] mx-auto py-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
          Our Vision
        </span>
        <h1 className="font-geist text-3xl md:text-4xl font-bold text-[#00355f]">
          Making Events Easier for Everyone
        </h1>
        <p className="font-inter text-sm md:text-base text-[#5f5e5e] max-w-xl mx-auto leading-relaxed">
          Event Horizon was created to simplify the event ecosystem—connecting curious attendees with passionate organizers, inspiring venues, keynote speakers, and local vendors.
        </p>
      </div>

      <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-10 shadow-2xs space-y-6">
        <h2 className="font-geist text-xl font-bold text-[#00355f]">The Event Horizon Principle</h2>
        <p className="font-inter text-sm text-[#42474f] leading-relaxed">
          Traditional event platforms suffer from visual clutter, confusing multi-step checkouts, and disconnected vendor communications. Event Horizon combines discovery, ticketing, venue sourcing, speaker management, catering, and live door check-ins into one elegant, fast, and minimal interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#edeeef]">
          <div>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Minimalist Aesthetics</h3>
            <p className="font-inter text-xs text-[#5f5e5e] mt-1">
              Clean spacing, mathematical typography hierarchy, and zero visual clutter.
            </p>
          </div>

          <div>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Unified Marketplace</h3>
            <p className="font-inter text-xs text-[#5f5e5e] mt-1">
              Venues, keynote speakers, coffee bars, and swag kits in one workspace.
            </p>
          </div>

          <div>
            <h3 className="font-geist font-bold text-[#00355f] text-base">Digital Ticket Passes</h3>
            <p className="font-inter text-xs text-[#5f5e5e] mt-1">
              Dynamic QR code generation with instant door check-in validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
