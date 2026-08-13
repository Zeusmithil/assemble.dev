import React from 'react';

export const HomeView = ({
  events,
  selectedCity,
  setSelectedCity,
  navigate,
  onSelectEvent,
  currentUser,
}) => {
  // Filter events by selected city or fall back to general list
  const cityEvents = events.filter(
    (e) => e.city.toLowerCase() === selectedCity.toLowerCase() && e.status === 'published'
  );
  const displayEvents = cityEvents.length > 0 ? cityEvents.slice(0, 3) : events.slice(0, 3);
  const featuredEvent = events[0] || displayEvents[0];

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-12">
      
      {/* Hero Header Section */}
      <header id="home" className="flex flex-col gap-6 max-w-3xl pt-4">
        <div className="space-y-3">
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-widest">
            Welcome to assemble.dev
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black leading-tight">
            Discover Events. <br />
            <span className="text-[#0f4c81]">Create Experiences.</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
            Find exciting events happening around you, register in seconds, or create and manage your own event — all from one simple platform.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
            className="px-6 py-3 bg-[#0f4c81] hover:bg-[#00355f] text-white font-geist font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            Explore Events
          </button>
          <button
            onClick={() => navigate(currentUser ? '/create-event' : '/login')}
            className="px-6 py-3 border border-[#c2c7d1] bg-white hover:bg-gray-100 text-[#00355f] font-geist font-bold text-xs rounded-xl transition-all active:scale-98 cursor-pointer"
          >
            Organize an Event
          </button>
          {!currentUser && (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 text-[#0f4c81] hover:underline font-geist font-bold text-xs cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Primary Bento Grid Layout (Hero Visual) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Tile 1: Big Featured Event Card (col-span-8) */}
        <div
          onClick={() => onSelectEvent(featuredEvent)}
          className="col-span-12 md:col-span-8 min-h-[380px] md:min-h-[440px] bg-gray-900 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-white flex flex-col justify-end group cursor-pointer border border-black shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <img
            src={featuredEvent.imageUrl}
            alt={featuredEvent.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          <div className="absolute top-8 right-8 z-20 flex flex-wrap gap-2">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white border border-white/10">
              Featured
            </span>
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest">
              Selling Fast
            </span>
          </div>
          <div className="z-20">
            <p className="text-orange-400 font-mono text-sm mb-2">
              {featuredEvent.startDate} • {featuredEvent.time}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight font-geist">
              {featuredEvent.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 font-inter">
              <span className="flex items-center gap-1.5">📍 {featuredEvent.location}, {featuredEvent.city}</span>
              <span className="flex items-center gap-1.5">🎟️ {featuredEvent.isFree ? 'Free Pass' : `$${featuredEvent.price}`}</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Near You Card (col-span-4) */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-black font-geist">Near You</h3>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 cursor-pointer outline-none hover:text-black transition-colors"
            >
              <option value="Chennai">📍 Chennai</option>
              <option value="San Francisco">📍 San Francisco</option>
              <option value="New York">📍 New York</option>
              <option value="London">📍 London</option>
              <option value="Bangalore">📍 Bangalore</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 overflow-hidden">
            {displayEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
              >
                <img src={evt.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight text-black truncate group-hover:text-blue-600 transition-colors">
                    {evt.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {evt.startDate} • {evt.location}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${evt.isFree ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-100'}`}>
                  {evt.isFree ? 'Free' : `$${evt.price}`}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
            className="mt-auto w-full py-3.5 bg-gray-100 text-black font-bold rounded-2xl text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            View All Local Events
          </button>
        </div>

        {/* Tile 3: Organize Your Own (col-span-4) */}
        <div className="col-span-12 md:col-span-4 bg-[#EBF4FF] rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between border border-blue-100">
          <div>
            <h3 className="font-bold text-xl mb-2 text-black font-geist">Organize your own</h3>
            <p className="text-sm text-blue-800/70 leading-relaxed font-inter">
              From speakers to venues, we handle every detail for you in one workspace.
            </p>
          </div>
          <button
            onClick={() => navigate(currentUser ? '/create-event' : '/login')}
            className="w-fit px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm shadow-md hover:bg-blue-700 transition-all mt-6 active:scale-95 cursor-pointer"
          >
            Start Planning
          </button>
        </div>

        {/* Tile 4: Speaker Network (col-span-3) */}
        <div
          onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
          className="col-span-12 sm:col-span-6 md:col-span-3 bg-[#F6F6F6] rounded-[2.5rem] p-6 border border-gray-100 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-2xs text-xl">
            🎤
          </div>
          <p className="font-bold text-sm text-black font-geist">Speaker Network</p>
          <p className="text-xs text-gray-400 mt-1 font-inter">2,400+ Experts</p>
        </div>

        {/* Tile 5: Venue Rental (col-span-3) */}
        <div
          onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
          className="col-span-12 sm:col-span-6 md:col-span-3 bg-[#F6F6F6] rounded-[2.5rem] p-6 border border-gray-100 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white hover:shadow-sm transition-all"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-2xs text-xl">
            🏢
          </div>
          <p className="font-bold text-sm text-black font-geist">Venue Rental</p>
          <p className="text-xs text-gray-400 mt-1 font-inter">Top City Spaces</p>
        </div>

        {/* Tile 6: Active Users Stats (col-span-2) */}
        <div className="col-span-12 md:col-span-2 bg-black rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-white text-center">
          <p className="text-3xl font-black mb-1 font-geist">12k+</p>
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 font-inter">Active Users</p>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-8 md:p-12 shadow-2xs space-y-8">
        <div className="max-w-2xl space-y-3">
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
            All-In-One Event Hub
          </span>
          <h2 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f]">
            Everything You Need for Your Next Event
          </h2>
          <p className="font-inter text-sm text-[#5f5e5e] leading-relaxed">
            assemble.dev is an all-in-one platform designed to make discovering and organizing events simple. Whether you’re looking for an event to attend or planning one of your own, assemble.dev brings everything together in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#edeeef]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0f4c81]">
              <span className="material-symbols-outlined font-bold">explore</span>
              <h3 className="font-geist font-bold text-base text-[#00355f]">For Attendees</h3>
            </div>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Discover events that match your interests, explore what’s happening around you, and register for events with ease.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#0f4c81]">
              <span className="material-symbols-outlined font-bold">event_note</span>
              <h3 className="font-geist font-bold text-base text-[#00355f]">For Organizers</h3>
            </div>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Create, plan, and manage events while keeping registrations, venues, speakers, services, and attendees organized in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f]">
            Everything Your Event Needs
          </h2>
          <p className="font-inter text-xs text-[#5f5e5e]">
            Our platform provides end-to-end features designed to streamline the event ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#e1e3e4] p-6 rounded-3xl space-y-3 shadow-2xs">
            <span className="text-lg font-bold text-[#0f4c81]">01</span>
            <h3 className="font-geist font-bold text-sm text-[#00355f]">Discover Events</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Find events happening around you based on your interests, location, and preferred categories.
            </p>
          </div>

          <div className="bg-white border border-[#e1e3e4] p-6 rounded-3xl space-y-3 shadow-2xs">
            <span className="text-lg font-bold text-[#0f4c81]">02</span>
            <h3 className="font-geist font-bold text-sm text-[#00355f]">Easy Registration</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Register for events quickly and receive your event ticket or digital pass.
            </p>
          </div>

          <div className="bg-white border border-[#e1e3e4] p-6 rounded-3xl space-y-3 shadow-2xs">
            <span className="text-lg font-bold text-[#0f4c81]">03</span>
            <h3 className="font-geist font-bold text-sm text-[#00355f]">Create Events</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Create and publish your own events with details such as date, location, schedule, and registration information.
            </p>
          </div>

          <div className="bg-white border border-[#e1e3e4] p-6 rounded-3xl space-y-3 shadow-2xs">
            <span className="text-lg font-bold text-[#0f4c81]">04</span>
            <h3 className="font-geist font-bold text-sm text-[#00355f]">Event Management</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Manage attendees, registrations, schedules, speakers, venues, and other event requirements from one place.
            </p>
          </div>

          <div className="bg-white border border-[#e1e3e4] p-6 rounded-3xl space-y-3 shadow-2xs">
            <span className="text-lg font-bold text-[#0f4c81]">05</span>
            <h3 className="font-geist font-bold text-sm text-[#00355f]">Venues & Speakers</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Find suitable venues and connect with speakers who can make your event more impactful.
            </p>
          </div>

          <div className="bg-white border border-[#e1e3e4] p-6 rounded-3xl space-y-3 shadow-2xs">
            <span className="text-lg font-bold text-[#0f4c81]">06</span>
            <h3 className="font-geist font-bold text-sm text-[#00355f]">Event Services</h3>
            <p className="font-inter text-xs text-[#5f5e5e] leading-relaxed">
              Manage goodies, merchandise, catering, photography, branding, and other event services.
            </p>
          </div>
        </div>
      </section>

      {/* Events Near You Grid */}
      <section className="space-y-6 pt-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Local Gathering</span>
            <h2 className="text-2xl md:text-3xl font-bold text-black mt-1 font-geist">
              Explore Events in {selectedCity}
            </h2>
          </div>

          <button
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
            className="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-black px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Browse All Categories →
          </button>
        </div>

        {/* Event Cards Grid in Bento Aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayEvents.map((evt) => (
            <article
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col group hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer"
            >
              <div className="h-52 relative overflow-hidden bg-gray-100">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-black uppercase tracking-wider">
                  {evt.category}
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${evt.isFree ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}>
                  {evt.isFree ? 'Free' : `$${evt.price}`}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <h3 className="font-geist text-lg font-bold text-black line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {evt.title}
                  </h3>
                  <div className="mt-3 space-y-1 text-xs text-gray-500 font-inter">
                    <p>📅 {evt.startDate} • {evt.time}</p>
                    <p>📍 {evt.location}, {evt.city}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-black">
                  <span>{evt.organizer}</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">Details →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#EBF4FF] border border-blue-100 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6">
        <h2 className="font-geist text-2xl md:text-3xl font-bold text-black max-w-xl mx-auto leading-tight">
          Ready to Make Your Next Event Happen?
        </h2>
        <p className="font-inter text-sm text-blue-800/70 max-w-md mx-auto">
          Discover something exciting or start planning your own event today.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(currentUser ? '/dashboard' : '/login')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-geist font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            Explore Events
          </button>
          <button
            onClick={() => navigate(currentUser ? '/create-event' : '/login')}
            className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-geist font-bold text-xs rounded-xl transition-all active:scale-98 cursor-pointer"
          >
            Create an Event
          </button>
        </div>
      </section>
    </div>
  );
};
