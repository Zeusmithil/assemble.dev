import React, { useState } from 'react';

export const EventDetailsView = ({
  event,
  onBack,
  onRegister,
  isSaved,
  onToggleSave,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTier, setSelectedTier] = useState(() => {
    return event.ticketTiers && event.ticketTiers.length > 0 ? event.ticketTiers[0] : null;
  });

  // Volunteer & Community Application States
  const [willVolunteer, setWillVolunteer] = useState(false);
  const [willJoinCommunity, setWillJoinCommunity] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Male',
    age: '18-24',
    phone: '',
    email: '',
    city: '',
    state: '',
    occupation: 'Student',
    occupationDetails: '',
    linkedin: '',
    volunteerWhy: '',
    communityWhy: ''
  });
  const [linkedinError, setLinkedinError] = useState('');

  const handleRegisterClick = () => {
    if (willVolunteer || willJoinCommunity) {
      setShowApplicationForm(true);
    } else {
      onRegister(event, selectedTier);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.linkedin.trim().match(/^https:\/\/(www\.)?linkedin\.com\/.*$/i)) {
      setLinkedinError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username).');
      return;
    }
    setLinkedinError('');
    onRegister(event, selectedTier, {
      willVolunteer,
      willJoinCommunity,
      ...formData
    });
    setShowApplicationForm(false);
  };

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
            onClick={onToggleSave}
            className={`px-4 py-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-gray-200 text-black hover:bg-gray-50'
            }`}
          >
            <span>{isSaved ? '❤️ Saved' : '🤍 Save'}</span>
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
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                activeTab === 'budget'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Budget & Expenses
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

            {activeTab === 'budget' && (
              <div className="space-y-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 text-left">
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h3 className="font-geist text-lg font-bold text-black">Event Budget & Amount Spent Tracker</h3>
                    <p className="font-inter text-xs text-gray-500 mt-0.5">Track allocated funds vs actual expenditure for {event.title}.</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    (event.budget || 0) === 0 ? 'bg-gray-100 text-gray-600' :
                    ((event.expenses || []).reduce((a, b) => a + (b.spent || 0), 0) <= (event.budget || 0))
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {(event.budget || 0) === 0 ? 'Budget Unassigned' :
                     ((event.expenses || []).reduce((a, b) => a + (b.spent || 0), 0) <= (event.budget || 0))
                       ? '✓ Within Allocated Budget'
                       : '⚠️ Over Budget'}
                  </span>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Allocated Budget</span>
                    <span className="font-geist text-2xl font-bold text-black">
                      ${(event.budget || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 block">Total budget for event</span>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Amount Spent</span>
                    <span className="font-geist text-2xl font-bold text-[#0f4c81]">
                      ${((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 block">Sum of logged expenses</span>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Remaining Balance</span>
                    <span className={`font-geist text-2xl font-bold ${
                      (event.budget || 0) - ((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) >= 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}>
                      ${((event.budget || 0) - ((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0))).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 block">Available funds left</span>
                  </div>
                </div>

                {/* Utilization Progress Bar */}
                {(event.budget || 0) > 0 && (
                  <div className="space-y-1.5 p-4 bg-blue-50/40 border border-blue-100 rounded-2xl">
                    <div className="flex justify-between text-xs font-bold text-black">
                      <span>Budget Utilization</span>
                      <span>
                        {Math.min(100, Math.round((((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) / event.budget) * 100))}% Used
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all rounded-full ${
                          ((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) > event.budget
                            ? 'bg-rose-500'
                            : ((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) / event.budget > 0.85
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (((event.expenses || []).reduce((acc, exp) => acc + (exp.spent || 0), 0)) / event.budget) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Expenses Table */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-geist font-bold text-sm text-black">Itemized Expenditure Breakdown</h4>
                  {event.expenses && event.expenses.length > 0 ? (
                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-3xs">
                      <table className="w-full text-left text-xs font-inter">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3.5">Expense Item</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Allocated</th>
                            <th className="p-3.5">Amount Spent</th>
                            <th className="p-3.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {event.expenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="p-3.5 font-bold text-black">{exp.title}</td>
                              <td className="p-3.5">
                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 font-bold rounded text-[10px]">
                                  {exp.category}
                                </span>
                              </td>
                              <td className="p-3.5 font-medium text-gray-500">${(exp.allocated || 0).toLocaleString()}</td>
                              <td className="p-3.5 font-bold text-black">${(exp.spent || 0).toLocaleString()}</td>
                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  exp.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {exp.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-1">
                      <p className="font-geist text-sm font-bold text-black">No expense records logged yet</p>
                      <p className="font-inter text-xs text-gray-500">The organizer can log itemized expenses from the Organizer Dashboard.</p>
                    </div>
                  )}
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
             {event.volunteersNeeded > 0 && (
               <div className="bg-[#fff3d6] border border-[#ffe09e] p-3.5 rounded-2xl text-left text-xs font-inter text-[#b46d00] flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm font-bold">groups</span>
                 <span><strong>Volunteers Needed:</strong> {event.volunteersNeeded} Volunteers</span>
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

             <div className="space-y-2 border-t border-gray-100 pt-4 text-left">
               {event.volunteersNeeded > 0 && (
                 <label className="flex items-center gap-2.5 text-xs font-semibold text-[#00355f] cursor-pointer">
                   <input
                     type="checkbox"
                     checked={willVolunteer}
                     onChange={(e) => setWillVolunteer(e.target.checked)}
                     className="rounded border-gray-300 text-[#0f4c81] focus:ring-[#0f4c81]"
                   />
                   <span>Willing to Volunteer</span>
                 </label>
               )}
               <label className="flex items-center gap-2.5 text-xs font-semibold text-[#00355f] cursor-pointer">
                 <input
                   type="checkbox"
                   checked={willJoinCommunity}
                   onChange={(e) => setWillJoinCommunity(e.target.checked)}
                   className="rounded border-gray-300 text-[#0f4c81] focus:ring-[#0f4c81]"
                 />
                   <span>Willing to Join the Community</span>
               </label>
             </div>

             <button
               onClick={handleRegisterClick}
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

       {/* Volunteer & Community Application Form Modal */}
       {showApplicationForm && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e1e3e4] space-y-6 animate-scaleUp relative overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center border-b border-[#edeeef] pb-4">
               <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-[#0f4c81] text-2xl font-bold">assignment</span>
                 <span className="font-geist text-lg font-bold text-[#00355f]">Application Form</span>
               </div>
               <button onClick={() => setShowApplicationForm(false)} className="p-1 text-[#727780] hover:text-[#191c1d] cursor-pointer">
                 <span className="material-symbols-outlined text-lg">close</span>
               </button>
             </div>
             
             <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
               <div className="p-3 bg-[#d2e4ff]/30 text-[#0f4c81] rounded-xl text-xs font-bold">
                 Applying for: {willVolunteer && willJoinCommunity ? 'Volunteer + Community' : willVolunteer ? 'Volunteer' : 'Community'}
               </div>
               
               {/* Personal Information */}
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Full Name</label>
                 <input
                   type="text"
                   required
                   value={formData.fullName}
                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                   placeholder="John Doe"
                   className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Gender</label>
                   <select
                     value={formData.gender}
                     onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                     className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                   >
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Age Group</label>
                   <select
                     value={formData.age}
                     onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                     className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                   >
                     <option value="Under 18">Under 18</option>
                     <option value="18-24">18-24</option>
                     <option value="25-34">25-34</option>
                     <option value="35-44">35-44</option>
                     <option value="45+">45+</option>
                   </select>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Phone Number</label>
                   <input
                     type="tel"
                     required
                     value={formData.phone}
                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     placeholder="+91 XXXXX XXXXX"
                     className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Email Address</label>
                   <input
                     type="email"
                     required
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     placeholder="you@domain.com"
                     className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                   />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">City / Location</label>
                   <input
                     type="text"
                     required
                     value={formData.city}
                     onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                     placeholder="Chennai"
                     className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">State / Country</label>
                   <input
                     type="text"
                     required
                     value={formData.state}
                     onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                     placeholder="Tamil Nadu, India"
                     className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                   />
                 </div>
               </div>
               
               {/* Professional / Educational Information */}
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">What are you currently doing?</label>
                 <select
                   value={formData.occupation}
                   onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                   className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                 >
                   <option value="Student">Student</option>
                   <option value="Working Professional">Working Professional</option>
                   <option value="Entrepreneur">Entrepreneur</option>
                   <option value="Freelancer">Freelancer</option>
                   <option value="Researcher">Researcher</option>
                   <option value="Looking for Opportunities">Looking for Opportunities</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
               
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Tell us about what you are currently doing</label>
                 <textarea
                   value={formData.occupationDetails}
                   onChange={(e) => setFormData({ ...formData, occupationDetails: e.target.value })}
                   rows="2"
                   placeholder="Briefly describe your background..."
                   className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                 />
               </div>
               
               <div className="space-y-1">
                 <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">LinkedIn Profile URL</label>
                 <input
                   type="text"
                   required
                   value={formData.linkedin}
                   onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                   placeholder="https://linkedin.com/in/username"
                   className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-mono text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                 />
                 {linkedinError && <p className="text-[10px] font-bold text-red-500 mt-1">{linkedinError}</p>}
               </div>

               {willVolunteer && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Why do you want to volunteer for this event?</label>
                    <textarea
                      required
                      value={formData.volunteerWhy}
                      onChange={(e) => setFormData({ ...formData, volunteerWhy: e.target.value })}
                      rows="2"
                      placeholder="Share your interest in volunteering..."
                      className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                    />
                  </div>
                )}

                {willJoinCommunity && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Why do you want to join this community?</label>
                    <textarea
                      required
                      value={formData.communityWhy}
                      onChange={(e) => setFormData({ ...formData, communityWhy: e.target.value })}
                      rows="2"
                      placeholder="Share your interest in joining the community..."
                      className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                    />
                  </div>
                )}
               
               <button
                 type="submit"
                 className="w-full py-4 bg-[#0f4c81] hover:bg-[#00355f] text-white transition-all rounded-xl font-geist font-bold text-xs shadow-xs cursor-pointer animate-fadeIn"
               >
                 Submit Application
               </button>
             </form>
           </div>
         </div>
       )}
      </div>
    );
  };
