import React, { useState } from 'react';

export const EventDetailsView = ({
  event,
  onBack,
  onRegister,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);
  const [selectedTier, setSelectedTier] = useState(() => {
    return event.ticketTiers && event.ticketTiers.length > 0 ? event.ticketTiers[0] : null;
  });

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors"
        >
          <span>← Back to Discovery</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`px-4 py-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-gray-200 text-black hover:bg-gray-50'
            }`}
          >
            <span>{saved ? '❤️ Saved' : '🤍 Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Hero Image */}
          <div className="h-[300px] sm:h-[400px] w-full rounded-[2.5rem] overflow-hidden border border-gray-100 relative bg-gray-900 shadow-sm">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full font-geist text-xs font-bold text-black uppercase tracking-wider">
              {event.category}
            </div>
            <div className="absolute top-6 right-6 bg-black/80 text-white backdrop-blur-md px-4 py-1.5 rounded-full font-geist text-xs font-bold uppercase tracking-wider">
              {event.format}
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="font-geist text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
              {event.title}
            </h1>

            <div className="flex items-center gap-3 text-xs md:text-sm font-inter text-gray-500 flex-wrap">
              <span className="font-bold text-black">Organized by {event.organizer}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-blue-600 font-bold">
                ✓ Verified Host
              </span>
              <span>•</span>
              <span>{event.registeredCount} Attendees Registered</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 text-xs font-bold w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('speakers')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'speakers'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Speakers ({event.speakers?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('venue')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'venue'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Venue & Map
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="space-y-6 pt-2">
            {activeTab === 'overview' && (
              <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-gray-100">
                <div>
                  <h3 className="font-geist text-lg font-bold text-black">About This Experience</h3>
                  <p className="font-inter text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>

                {event.whatsIncluded && event.whatsIncluded.length > 0 && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-3">
                    <h4 className="font-geist text-xs font-bold text-black uppercase tracking-wider">
                      What's Included in Your Ticket
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event.whatsIncluded.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-inter text-black font-medium">
                          <span className="text-blue-600 font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="space-y-4 bg-white p-8 rounded-[2.5rem] border border-gray-100">
                <h3 className="font-geist text-lg font-bold text-black">Featured Keynotes & Panelists</h3>
                {event.speakers && event.speakers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.speakers.map((spk) => (
                      <div key={spk.id} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4 items-start">
                        <img
                          src={spk.photo}
                          alt={spk.name}
                          className="w-14 h-14 rounded-full object-cover border border-gray-200"
                        />
                        <div className="space-y-1">
                          <h4 className="font-geist font-bold text-black text-sm">{spk.name}</h4>
                          <p className="font-inter text-xs text-gray-500">
                            {spk.designation} at <span className="font-bold text-black">{spk.company}</span>
                          </p>
                          <p className="font-inter text-[11px] text-gray-400 line-clamp-2 mt-1">{spk.bio}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {spk.expertise.map((exp, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 text-gray-600 text-[10px] rounded-full font-bold">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Speakers will be announced shortly by the organizer.</p>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4 bg-white p-8 rounded-[2.5rem] border border-gray-100">
                <h3 className="font-geist text-lg font-bold text-black">Event Agenda & Timeline</h3>
                {event.schedule && event.schedule.length > 0 ? (
                  <div className="space-y-3 relative pl-4 border-l-2 border-black">
                    {event.schedule.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-black" />
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                          <span className="font-geist text-xs font-bold text-blue-600">{item.time}</span>
                          <h4 className="font-geist text-sm font-bold text-black">{item.title}</h4>
                          {item.description && <p className="font-inter text-xs text-gray-500">{item.description}</p>}
                          {item.speaker && <p className="font-inter text-xs font-bold text-black">Presenter: {item.speaker}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Detailed schedule will be released closer to the event date.</p>
                )}
              </div>
            )}

            {activeTab === 'venue' && (
              <div className="space-y-4 bg-white p-8 rounded-[2.5rem] border border-gray-100">
                <h3 className="font-geist text-lg font-bold text-black">Venue & Location Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h4 className="font-geist font-bold text-black text-base">
                        {event.venueDetails?.name || event.location}
                      </h4>
                      <p className="font-inter text-xs text-gray-500 mt-0.5">
                        {event.venueDetails?.address || `${event.location}, ${event.city}`}
                      </p>
                    </div>
                  </div>

                  {event.venueDetails?.facilities && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                      {event.venueDetails.facilities.map((fac, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-full">
                          {fac}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Simulated Map Preview Card */}
                  <div className="h-44 bg-gray-100 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-200">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm text-center border border-gray-200 z-10">
                      <p className="font-geist text-xs font-bold text-black">📍 {event.location}</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">GPS Location Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Registration Card */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xs sticky top-24 space-y-6">
            <div className="flex justify-between items-baseline border-b border-gray-100 pb-4">
              <span className="font-inter text-xs text-gray-400 font-bold uppercase tracking-wider">Ticket Price</span>
              <div className="text-right">
                <span className="font-geist text-3xl font-black text-black">
                  {selectedTier ? (selectedTier.price === 0 ? 'Free' : `$${selectedTier.price}`) : (event.isFree ? 'Free' : `$${event.price}`)}
                </span>
                {!(selectedTier ? selectedTier.price === 0 : event.isFree) && <span className="text-xs text-gray-400 block">/ attendee</span>}
              </div>
            </div>

            {event.ticketTiers && event.ticketTiers.length > 0 && (
              <div className="space-y-2 border-b border-gray-100 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Select Ticket Tier
                </span>
                <div className="flex flex-col gap-2">
                  {event.ticketTiers.map((tier) => (
                    <div
                      key={tier.name}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                        selectedTier?.name === tier.name
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/10 shadow-2xs'
                          : 'border-gray-200 bg-[#f8f9fa] hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-left">
                        <h4 className="font-geist font-bold text-xs text-[#00355f]">{tier.name}</h4>
                        <p className="font-inter text-[9px] text-[#5f5e5e] truncate max-w-[150px]">{tier.description}</p>
                      </div>
                      <span className="font-geist text-xs font-bold text-[#0f4c81]">
                        {tier.price === 0 ? 'Free' : `$${tier.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs font-inter text-gray-600">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span className="font-bold text-black">{event.startDate} {event.endDate ? `- ${event.endDate}` : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span className="font-bold text-black">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="truncate font-bold text-black">{event.location}, {event.city}</span>
              </div>
            </div>

            <button
              onClick={() => onRegister(event, selectedTier)}
              className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-all rounded-2xl font-geist font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>🎟️ Register Now</span>
            </button>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed font-inter">
              Instant digital pass issuance with dynamic QR code verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
