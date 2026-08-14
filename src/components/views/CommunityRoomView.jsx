import React, { useState } from 'react';

export const CommunityRoomView = ({
  community,
  events = [],
  onBack,
  onSelectEvent,
  onPlanCommunityEvent
}) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Aravind Swaminathan', role: 'Organizer', text: 'Hey everyone! Excited to associate our upcoming AI Summit with this community. Any ideas for volunteer tasks?', time: '10:24 AM' },
    { id: 2, sender: 'Meera Sen', role: 'Member', text: 'I would love to help coordinate the keynote speakers or stage setup!', time: '10:45 AM' },
    { id: 3, sender: 'Vikram Grover', role: 'Member', text: 'Let’s organize a pre-event mixer for community members in the room.', time: '11:02 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'You',
      role: 'Member',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  // Filter events associated with this community
  const communityEvents = events.filter(
    (evt) => evt.associatedCommunities && evt.associatedCommunities.includes(community.name)
  );

  // Categorize events dynamically
  const now = new Date();
  const ongoingEvents = [];
  const upcomingEvents = [];
  const pastEvents = [];

  communityEvents.forEach((evt) => {
    const start = new Date(evt.startDate);
    const end = evt.endDate ? new Date(evt.endDate) : start;
    if (end < now && end.toDateString() !== now.toDateString()) {
      pastEvents.push(evt);
    } else if (start > now && start.toDateString() !== now.toDateString()) {
      upcomingEvents.push(evt);
    } else {
      ongoingEvents.push(evt);
    }
  });

  const renderEventCard = (evt) => (
    <div
      key={evt.id}
      onClick={() => onSelectEvent(evt)}
      className="p-4 border border-gray-200 rounded-xl bg-[#f8f9fa] hover:border-[#c2c7d1] hover:bg-white cursor-pointer transition-all space-y-2 text-left"
    >
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-bold text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded uppercase">
          {evt.category}
        </span>
        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
          evt.status === 'Active' || !evt.status ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {evt.status || 'Active'}
        </span>
      </div>

      <h4 className="font-geist font-bold text-xs text-black leading-tight">{evt.title}</h4>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-gray-500 font-inter border-t border-gray-100 pt-2">
        <div><strong>Date:</strong> {evt.startDate}</div>
        <div><strong>Time:</strong> {evt.time}</div>
        <div className="col-span-2 truncate"><strong>Venue:</strong> {evt.location}, {evt.city}</div>
        <div className="col-span-2"><strong>Organizer:</strong> {evt.organizer || 'Community Admin'}</div>
        {evt.speakers && evt.speakers.length > 0 && (
          <div className="col-span-2 truncate"><strong>Speakers:</strong> {evt.speakers.map(s => s.name).join(', ')}</div>
        )}
        <div><strong>Registrations:</strong> {evt.registeredCount || 0}</div>
        <div><strong>Volunteers:</strong> {evt.volunteersNeeded > 0 ? `${evt.volunteersNeeded} req` : 'None'}</div>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-6">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors mb-2 cursor-pointer"
          >
            <span>← Back to My Communities</span>
          </button>
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider block text-left">
            Private Space
          </span>
          <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] text-left">
            {community.name} Room
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-white border border-[#e1e3e4] px-5 py-3 rounded-2xl shadow-2xs text-xs font-inter text-[#5f5e5e]">
          <div>
            <span className="font-bold text-[#00355f] block">Members</span>
            <span>👥 {community.memberCount + (messages.filter(m => m.sender === 'You').length ? 1 : 0)} joined</span>
          </div>
          <div className="border-l border-[#e1e3e4] pl-4">
            <span className="font-bold text-[#00355f] block">Room Code</span>
            <span className="font-mono bg-gray-50 px-2 py-0.5 border border-gray-100 rounded text-[10px] font-bold text-[#0f4c81]">
              {community.code}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Feed/Chat Room */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6 flex flex-col h-[580px] justify-between">
            <div className="text-left">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">Community Message Board</h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-1">Connect, collaborate, and share with other members of the room.</p>
            </div>

            {/* Scrollable Message List */}
            <div className="flex-grow overflow-y-auto my-4 space-y-4 pr-2 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1 max-w-[85%] ${
                    msg.sender === 'You' ? 'ml-auto items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-inter text-gray-500">
                    <span className="font-bold text-[#00355f]">{msg.sender}</span>
                    {msg.role && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase ${
                        msg.role === 'Organizer' ? 'bg-[#fff3d6] text-[#b46d00]' : 'bg-[#d2e4ff] text-[#0f4c81]'
                      }`}>
                        {msg.role}
                      </span>
                    )}
                    <span>• {msg.time}</span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs font-inter leading-relaxed text-left ${
                      msg.sender === 'You'
                        ? 'bg-[#0f4c81] text-white rounded-tr-none'
                        : 'bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Send Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-[#edeeef]">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message to post to the board..."
                className="flex-grow px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-geist font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Upcoming Events & Members list */}
        <div className="lg:col-span-5 space-y-6">
          {/* Events Box */}
          <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-geist text-base font-bold text-[#00355f]">Community Events</h3>
              <button
                onClick={() => onPlanCommunityEvent(community.name)}
                className="px-3 py-1.5 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-[10px] font-bold shadow-3xs cursor-pointer transition-all active:scale-95 flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[12px] font-bold">add</span>
                <span>Create Event</span>
              </button>
            </div>
            <p className="font-inter text-xs text-[#5f5e5e] text-left">Discover experiences planned by this community.</p>

            <div className="space-y-4 pt-2">
              {/* Ongoing */}
              {ongoingEvents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold uppercase text-green-700 bg-green-50 px-2 py-0.5 rounded tracking-wider block w-fit">
                    Ongoing Events
                  </span>
                  <div className="space-y-3">
                    {ongoingEvents.map(renderEventCard)}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              {upcomingEvents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold uppercase text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded tracking-wider block w-fit">
                    Upcoming Events
                  </span>
                  <div className="space-y-3">
                    {upcomingEvents.map(renderEventCard)}
                  </div>
                </div>
              )}

              {/* Past */}
              {pastEvents.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider block w-fit">
                    Past Events
                  </span>
                  <div className="space-y-3">
                    {pastEvents.map(renderEventCard)}
                  </div>
                </div>
              )}

              {communityEvents.length === 0 && (
                <p className="text-xs text-gray-400 italic">No events associated with this community yet.</p>
              )}
            </div>
          </div>

          {/* Members list preview */}
          <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-4">
            <h3 className="font-geist text-base font-bold text-[#00355f] text-left">Active Members</h3>
            <div className="space-y-3 pt-2">
              {[
                { name: 'Aravind Swaminathan', initials: 'AS', role: 'Organizer', desc: 'Host & Director' },
                { name: 'Meera Sen', initials: 'MS', role: 'Member', desc: 'Product Designer' },
                { name: 'Vikram Grover', initials: 'VG', role: 'Member', desc: 'Developer Relations' },
                { name: 'You', initials: 'Y', role: 'Member', desc: 'Active Member' }
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#d2e4ff] text-[#0f4c81] font-geist font-bold text-xs flex items-center justify-center">
                    {member.initials}
                  </div>
                  <div className="text-left flex-grow">
                    <h4 className="font-geist text-xs font-bold text-[#00355f]">{member.name}</h4>
                    <p className="font-inter text-[10px] text-gray-500 leading-none">{member.desc}</p>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded-full text-[7px] font-extrabold uppercase ${
                    member.role === 'Organizer' ? 'bg-[#fff3d6] text-[#b46d00]' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
