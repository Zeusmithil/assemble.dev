import React, { useState } from 'react';
import { INITIAL_VENUES, INITIAL_SPEAKERS, INITIAL_SERVICES } from '../../data/initialData';

export const CreateEventView = ({
  onCancel,
  onSaveEvent,
  sponsorshipCodes,
}) => {
  // Configurator capabilities state
  const [enabledServices, setEnabledServices] = useState({
    venue: true,
    speakers: true,
    catering: true,
    goodies: true,
    ticketing: true
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Form State - Basics
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [format, setFormat] = useState('In-Person');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [city, setCity] = useState('Chennai');
  const [expectedAttendees, setExpectedAttendees] = useState(250);
  const [budget, setBudget] = useState(5000);
  const [budgetType, setBudgetType] = useState('set-budget');
  const [budgetSponsorCode, setBudgetSponsorCode] = useState('');
  const [budgetSponsorInfo, setBudgetSponsorInfo] = useState(null);
  const [budgetVerifyError, setBudgetVerifyError] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop'
  );

  // Venue state
  const [venueOption, setVenueOption] = useState('marketplace');
  const [selectedVenue, setSelectedVenue] = useState(INITIAL_VENUES[0]);
  const [customVenueName, setCustomVenueName] = useState('');
  const [customVenueAddress, setCustomVenueAddress] = useState('');

  // Speakers state
  const [selectedSpeakers, setSelectedSpeakers] = useState([INITIAL_SPEAKERS[0]]);

  // Services state
  const [selectedServices, setSelectedServices] = useState([INITIAL_SERVICES[1]]);

  // Swag / Goodies State
  const [swagProduct, setSwagProduct] = useState('T-shirts');
  const [swagQuantity, setSwagQuantity] = useState(250);
  const [swagSize, setSwagSize] = useState('M');
  const [swagDesign, setSwagDesign] = useState('');
  const [swagBudget, setSwagBudget] = useState(500);
  const [swagDelivery, setSwagDelivery] = useState('2026-11-10');

  // Ticketing state (Multiple Ticket Tiers)
  const [ticketTiers, setTicketTiers] = useState([
    { name: 'General Pass', price: 120, capacity: 200, deadline: '2026-11-10', description: 'General access ticket.' }
  ]);

  // Funding types state
  const [venueBudgetType, setVenueBudgetType] = useState('set-budget');
  const [venueBudgetVal, setVenueBudgetVal] = useState(1000);
  const [venueSponsorCode, setVenueSponsorCode] = useState('');
  const [venueSponsorInfo, setVenueSponsorInfo] = useState(null);
  const [venueVerifyError, setVenueVerifyError] = useState('');

  const [speakersBudgetType, setSpeakersBudgetType] = useState('set-budget');
  const [speakersBudgetVal, setSpeakersBudgetVal] = useState(1500);
  const [speakersSponsorCode, setSpeakersSponsorCode] = useState('');
  const [speakersSponsorInfo, setSpeakersSponsorInfo] = useState(null);
  const [speakersVerifyError, setSpeakersVerifyError] = useState('');

  const [cateringBudgetType, setCateringBudgetType] = useState('set-budget');
  const [cateringBudgetVal, setCateringBudgetVal] = useState(800);
  const [cateringSponsorCode, setCateringSponsorCode] = useState('');
  const [cateringSponsorInfo, setCateringSponsorInfo] = useState(null);
  const [cateringVerifyError, setCateringVerifyError] = useState('');

  const [goodiesBudgetType, setGoodiesBudgetType] = useState('set-budget');
  const [goodiesBudgetVal, setGoodiesBudgetVal] = useState(500);
  const [goodiesSponsorCode, setGoodiesSponsorCode] = useState('');
  const [goodiesSponsorInfo, setGoodiesSponsorInfo] = useState(null);
  const [goodiesVerifyError, setGoodiesVerifyError] = useState('');

  const handleVerifySponsorCode = (serviceName, code, setSponsorInfo, setVerifyError) => {
    if (!code.trim()) {
      setVerifyError('Please enter a sponsorship code.');
      return;
    }
    const matched = sponsorshipCodes[code.trim()];
    if (matched) {
      if (matched.requirement.toLowerCase() !== serviceName.toLowerCase()) {
        setVerifyError(`⚠️ This code is linked to a sponsorship for ${matched.requirement}, not ${serviceName}.`);
        setSponsorInfo(null);
        return;
      }
      setSponsorInfo(matched);
      setVerifyError('');
    } else {
      setVerifyError('✕ Invalid sponsorship code or code not found.');
      setSponsorInfo(null);
    }
  };

  const renderFundingOptions = (
    serviceName,
    budgetType,
    setBudgetType,
    budgetVal,
    setBudgetVal,
    sponsorCode,
    setSponsorCode,
    verifyError,
    setVerifyError,
    sponsorInfo,
    setSponsorInfo
  ) => {
    return (
      <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-4 mt-6">
        <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
          {serviceName} Funding Allocation
        </span>

        <div className="flex gap-6 text-xs font-semibold text-[#00355f]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${serviceName}-funding`}
              checked={budgetType === 'set-budget'}
              onChange={() => setBudgetType('set-budget')}
              className="text-[#0f4c81]"
            />
            <span>Set Budget</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${serviceName}-funding`}
              checked={budgetType === 'no-budget'}
              onChange={() => setBudgetType('no-budget')}
              className="text-[#0f4c81]"
            />
            <span>No Budget</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${serviceName}-funding`}
              checked={budgetType === 'sponsorship'}
              onChange={() => setBudgetType('sponsorship')}
              className="text-[#0f4c81]"
            />
            <span>Sponsorship</span>
          </label>
        </div>

        {budgetType === 'set-budget' && (
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider block">Requirement Budget ($)</label>
            <input
              type="number"
              value={budgetVal}
              onChange={(e) => setBudgetVal(Number(e.target.value))}
              className="px-3.5 py-2 border border-[#c2c7d1] bg-white rounded-xl text-xs font-bold w-32 outline-none"
            />
          </div>
        )}

        {budgetType === 'no-budget' && (
          <p className="text-[11px] text-gray-500 italic">
            ✓ No fixed budget requested or specified at this stage.
          </p>
        )}

        {budgetType === 'sponsorship' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold">Enter Sponsorship Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sponsorCode}
                  onChange={(e) => setSponsorCode(e.target.value)}
                  placeholder="e.g. TN2026-75K"
                  className="px-3.5 py-2 border border-[#c2c7d1] bg-white rounded-xl text-xs font-mono font-bold text-[#00355f]"
                  disabled={!!sponsorInfo}
                />
                {!sponsorInfo ? (
                  <button
                    type="button"
                    onClick={() => handleVerifySponsorCode(serviceName, sponsorCode, setSponsorInfo, setVerifyError)}
                    className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Verify Code
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSponsorInfo(null);
                      setSponsorCode('');
                    }}
                    className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Reset Code
                  </button>
                )}
              </div>
            </div>

            {verifyError && (
              <p className="text-[11px] text-red-600 font-bold">{verifyError}</p>
            )}

            {sponsorInfo && (
              <div className="p-3 bg-[#e2f7e2] border border-[#b4e7b4] text-[#1a853e] rounded-xl text-[11px]">
                <div className="font-bold flex items-center gap-1">
                  <span>✓ Sponsorship Verified</span>
                </div>
                <div className="mt-1 font-inter space-y-0.5">
                  <p>Sponsor: <span className="font-bold">{sponsorInfo.sponsor}</span></p>
                  <p>Sponsored Amount: <span className="font-bold">${sponsorInfo.amount.toLocaleString()}</span></p>
                  <p>Status: Active</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Determine active steps dynamically
  const getActiveSteps = () => {
    const steps = [1]; // Step 1 (Basics) is always active
    if (enabledServices.venue) steps.push(2);
    if (enabledServices.speakers) steps.push(3);
    if (enabledServices.catering) steps.push(4);
    if (enabledServices.goodies) steps.push(5);
    if (enabledServices.ticketing) steps.push(6);
    steps.push(7); // Step 7 (Review) is always active
    return steps;
  };

  const activeStepsList = getActiveSteps();

  // Navigation handlers
  const handleNext = () => {
    const currentIndex = activeStepsList.indexOf(currentStep);
    if (currentIndex < activeStepsList.length - 1) {
      setCurrentStep(activeStepsList[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = activeStepsList.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(activeStepsList[currentIndex - 1]);
    }
  };

  // Toggle checklist services in sidebar
  const handleToggleService = (srvKey) => {
    const updated = { ...enabledServices, [srvKey]: !enabledServices[srvKey] };
    setEnabledServices(updated);

    const newActiveSteps = [1];
    if (updated.venue) newActiveSteps.push(2);
    if (updated.speakers) newActiveSteps.push(3);
    if (updated.catering) newActiveSteps.push(4);
    if (updated.goodies) newActiveSteps.push(5);
    if (updated.ticketing) newActiveSteps.push(6);
    newActiveSteps.push(7);

    // Redirect to Basics to prevent stepping index bounds
    if (!newActiveSteps.includes(currentStep)) {
      setCurrentStep(1);
    }
  };

  // Pre-configured Bundle Packages
  const handleApplyPackage = (pkgType) => {
    let updated = { venue: false, speakers: false, catering: false, goodies: false, ticketing: false };
    
    if (pkgType === 'complete') {
      updated = { venue: true, speakers: true, catering: true, goodies: true, ticketing: true };
    } else if (pkgType === 'venue-only') {
      updated.venue = true;
    } else if (pkgType === 'venue-speaker') {
      updated.venue = true;
      updated.speakers = true;
    } else if (pkgType === 'venue-speaker-tickets') {
      updated.venue = true;
      updated.speakers = true;
      updated.ticketing = true;
    } else if (pkgType === 'venue-speaker-tickets-goodies') {
      updated.venue = true;
      updated.speakers = true;
      updated.ticketing = true;
      updated.goodies = true;
    }

    setEnabledServices(updated);
    setCurrentStep(1); // Safely return to step 1
  };

  // Multiple Ticketing list actions
  const handleAddTier = () => {
    setTicketTiers([
      ...ticketTiers,
      { name: 'VIP Pass', price: 299, capacity: 50, deadline: '2026-11-10', description: 'VIP front-row seating + networking dinner.' }
    ]);
  };

  const handleRemoveTier = (idx) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== idx));
  };

  const handleUpdateTier = (idx, key, val) => {
    setTicketTiers(
      ticketTiers.map((t, i) => (i === idx ? { ...t, [key]: val } : t))
    );
  };

  // Estimated budget is replaced with manual budget state variable

  const handlePublish = (status) => {
    const venueName =
      enabledServices.venue && venueOption === 'marketplace' && selectedVenue
        ? selectedVenue.name
        : customVenueName || 'Main Convention Hall';
    
    const venueAddress =
      enabledServices.venue && venueOption === 'marketplace' && selectedVenue
        ? `${selectedVenue.location}, ${selectedVenue.city}`
        : customVenueAddress || `${city} Center`;

    const newEvent = {
      id: `evt-created-${Date.now()}`,
      title: title || 'New Horizon Gathering',
      description: description || 'Exclusive community gathering curated via assemble.dev.',
      category,
      format,
      startDate,
      endDate: endDate || undefined,
      time,
      location: venueName,
      city,
      organizer: 'Curated Organizer',
      price: enabledServices.ticketing && ticketTiers.length > 0 ? ticketTiers[0].price : 0,
      isFree: enabledServices.ticketing ? ticketTiers.every((t) => t.price === 0) : true,
      imageUrl,
      expectedAttendees: Number(expectedAttendees),
      registeredCount: 0,
      checkedInCount: 0,
      revenue: 0,
      status,
      speakers: enabledServices.speakers ? selectedSpeakers : [],
      venueDetails: {
        name: venueName,
        address: venueAddress,
        facilities: selectedVenue?.amenities || ['A/V & Stage', 'Wi-Fi']
      },
      whatsIncluded: ['Full Session Access', 'Event Swag Bag', 'Networking Tea & Snacks'],
      visibility: 'Public',
      budget: budgetType === 'set-budget' ? Number(budget) : (budgetType === 'sponsorship' && budgetSponsorInfo ? budgetSponsorInfo.amount : 0),
      budgetType: budgetType,
      budgetSponsorInfo: budgetSponsorInfo,
      budgetSponsorCode: budgetType === 'sponsorship' ? budgetSponsorCode : null,
      ticketTiers: enabledServices.ticketing ? ticketTiers.map((t) => ({ ...t, sold: 0 })) : [],
      swagOrder: enabledServices.goodies ? {
        product: swagProduct,
        quantity: Number(swagQuantity),
        size: swagSize,
        design: swagDesign,
        budget: Number(swagBudget),
        delivery: swagDelivery
      } : null
    };

    onSaveEvent(newEvent);
  };

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-6">
        <div>
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider">
            Step {activeStepsList.indexOf(currentStep) + 1} of {activeStepsList.length}
          </span>
          <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
            {currentStep === 1 && '1. Event Basics'}
            {currentStep === 2 && '2. Venue Selection'}
            {currentStep === 3 && '3. Keynote Speakers'}
            {currentStep === 4 && '4. Catering & Event Services'}
            {currentStep === 5 && '5. Swag & Goodies'}
            {currentStep === 6 && '6. Registration & Ticketing'}
            {currentStep === 7 && '7. Review & Publish'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {budgetType === 'set-budget' && budget > 0 && (
            <div className="px-3 py-1.5 bg-[#d2e4ff] text-[#00355f] rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#0f4c81]">receipt_long</span>
              <span>Event Budget: ${budget}</span>
            </div>
          )}
          {budgetType === 'no-budget' && (
            <div className="px-3 py-1.5 bg-[#f3f4f5] text-[#5f5e5e] rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#727780]">receipt_long</span>
              <span>Event Budget: No Budget</span>
            </div>
          )}
          {budgetType === 'sponsorship' && budgetSponsorInfo && (
            <div className="px-3 py-1.5 bg-[#e2f7e2] text-[#1a853e] rounded-lg text-xs font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#1a853e]">handshake</span>
              <span>Sponsored Budget: ${budgetSponsorInfo.amount}</span>
            </div>
          )}
          <button
            onClick={onCancel}
            className="px-3 py-1.5 border border-[#c2c7d1] rounded-lg text-xs font-semibold text-[#5f5e5e] hover:bg-[#e7e8e9] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Progress Indicators Bar */}
      <div className="grid gap-1.5 h-2 bg-[#e7e8e9] rounded-full overflow-hidden" style={{ gridTemplateColumns: `repeat(${activeStepsList.length}, minmax(0, 1fr))` }}>
        {activeStepsList.map((s, index) => (
          <div
            key={s}
            className={`h-full transition-all duration-300 ${
              index <= activeStepsList.indexOf(currentStep) ? 'bg-[#0f4c81]' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Grid Layout: Form vs Configurator Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Step 1: Event Basics */}
          {currentStep === 1 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="space-y-2">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design Systems Architecture Summit 2026"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Design">Design</option>
                    <option value="Music">Music</option>
                    <option value="Culinary">Culinary</option>
                    <option value="AI & ML">AI & ML</option>
                    <option value="Conferences">Conferences</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Arts">Arts</option>
                    <option value="Startups">Startups</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                  />
                </div>
              </div>

              {/* Event Budget Funding Selector */}
              {renderFundingOptions(
                'Event',
                budgetType,
                setBudgetType,
                budget,
                setBudget,
                budgetSponsorCode,
                setBudgetSponsorCode,
                budgetVerifyError,
                setBudgetVerifyError,
                budgetSponsorInfo,
                setBudgetSponsorInfo
              )}

              <div className="space-y-2">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['In-Person', 'Online', 'Hybrid'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        format === f
                          ? 'border-[#0f4c81] bg-[#0f4c81] text-white shadow-xs'
                          : 'border-[#c2c7d1] bg-[#f8f9fa] text-[#42474f] hover:bg-[#e7e8e9]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                    City / Location
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d]"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the objective, key takeaways, and experience for attendees..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-xs text-[#191c1d]"
                />
              </div>
            </div>
          )}

          {/* Step 2: Venue Selection */}
          {currentStep === 2 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="flex gap-4 border-b border-[#e1e3e4] pb-4">
                <button
                  type="button"
                  onClick={() => setVenueOption('marketplace')}
                  className={`pb-2 text-xs font-bold transition-all cursor-pointer ${
                    venueOption === 'marketplace'
                      ? 'border-b-2 border-[#00355f] text-[#00355f]'
                      : 'text-[#5f5e5e]'
                  }`}
                >
                  Browse Venue Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => setVenueOption('custom')}
                  className={`pb-2 text-xs font-bold transition-all cursor-pointer ${
                    venueOption === 'custom'
                      ? 'border-b-2 border-[#00355f] text-[#00355f]'
                      : 'text-[#5f5e5e]'
                  }`}
                >
                  I Have My Own Venue / Virtual Link
                </button>
              </div>

              {venueOption === 'marketplace' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INITIAL_VENUES.map((ven) => (
                    <div
                      key={ven.id}
                      onClick={() => setSelectedVenue(ven)}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex gap-4 ${
                        selectedVenue?.id === ven.id
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/20 shadow-xs ring-2 ring-[#0f4c81]'
                          : 'border-[#e1e3e4] bg-white hover:border-[#c2c7d1]'
                      }`}
                    >
                      <img
                        src={ven.image}
                        alt={ven.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="space-y-1 flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-geist font-bold text-[#00355f] text-sm">{ven.name}</h4>
                          <span className="font-geist text-xs font-bold text-[#0f4c81]">${ven.pricePerHour}/hr</span>
                        </div>
                        <p className="font-inter text-xs text-[#5f5e5e]">{ven.location}, {ven.city}</p>
                        <p className="font-inter text-[11px] text-[#727780]">Capacity: {ven.capacity} seats • Vibe: {ven.vibe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00355f]">Venue Name</label>
                    <input
                      type="text"
                      value={customVenueName}
                      onChange={(e) => setCustomVenueName(e.target.value)}
                      placeholder="e.g. Sir Mutha Venkatasubba Rao Concert Hall"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#00355f]">Full Address / Link</label>
                    <input
                      type="text"
                      value={customVenueAddress}
                      onChange={(e) => setCustomVenueAddress(e.target.value)}
                      placeholder="e.g. 7, Lady McNichols Rd, Chetpet, Chennai"
                      className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Step 3: Keynote Speakers */}
          {currentStep === 3 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">Select Keynote Speakers & Panellists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_SPEAKERS.map((spk) => {
                  const isSelected = selectedSpeakers.some((s) => s.id === spk.id);
                  return (
                    <div
                      key={spk.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSpeakers(selectedSpeakers.filter((s) => s.id !== spk.id));
                        } else {
                          setSelectedSpeakers([...selectedSpeakers, spk]);
                        }
                      }}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex gap-4 items-start ${
                        isSelected
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/20 shadow-xs ring-2 ring-[#0f4c81]'
                          : 'border-[#e1e3e4] bg-white hover:border-[#c2c7d1]'
                      }`}
                    >
                      <img
                        src={spk.photo}
                        alt={spk.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="space-y-1 flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-geist font-bold text-[#00355f] text-sm">{spk.name}</h4>
                          <span className="text-[11px] font-bold text-[#0f4c81]">{spk.fee}</span>
                        </div>
                        <p className="font-inter text-xs text-[#5f5e5e]">{spk.designation} at {spk.company}</p>
                        <p className="font-inter text-[11px] text-[#727780] line-clamp-2">{spk.bio}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Catering & Event Services */}
          {currentStep === 4 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="flex justify-between items-center">
                <h3 className="font-geist text-lg font-bold text-[#00355f]">Select Catering & Event Services</h3>
                <span className="text-xs font-bold text-[#0f4c81] bg-[#d2e4ff] px-3 py-1 rounded-full">
                  {selectedServices.length} Selected • ${selectedServices.reduce((a, b) => a + (b.estPrice || 0), 0)} Est.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_SERVICES.map((srv) => {
                  const isSelected = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedServices(selectedServices.filter((s) => s.id !== srv.id));
                        } else {
                          setSelectedServices([...selectedServices, srv]);
                        }
                      }}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex gap-4 ${
                        isSelected
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/20 shadow-xs ring-2 ring-[#0f4c81]'
                          : 'border-[#e1e3e4] bg-white hover:border-[#c2c7d1]'
                      }`}
                    >
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="space-y-1 flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-geist font-bold text-[#00355f] text-sm">{srv.name}</h4>
                          <span className="text-xs font-bold text-[#0f4c81]">${srv.estPrice}</span>
                        </div>
                        <p className="font-inter text-xs text-[#5f5e5e]">{srv.category}</p>
                        <p className="font-inter text-[11px] text-[#727780] line-clamp-1">{srv.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* Step 5: Swag & Goodies (Interactive Order Configurator) */}
          {currentStep === 5 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div>
                <h3 className="font-geist text-lg font-bold text-[#00355f]">Swag & Goodies Configurator</h3>
                <p className="font-inter text-xs text-[#5f5e5e] mt-1">
                  Specify details for customized attendee gifts, goodies, and certificates.
                </p>
              </div>

              {/* Product Selector grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Select Product Item
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['T-shirts', 'Hoodies', 'Bags', 'Notebooks', 'Pens', 'Welcome Kits', 'Custom Swag'].map((prod) => (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => setSwagProduct(prod)}
                      className={`py-3 px-4 border rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        swagProduct === prod
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#00355f] shadow-xs'
                          : 'border-gray-200 bg-[#f8f9fa] text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity, Size, and Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={swagQuantity}
                    onChange={(e) => setSwagQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Size Selection
                  </label>
                  <select
                    value={swagSize}
                    onChange={(e) => setSwagSize(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs outline-none"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="Free Size">Free Size (One size fits all)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Total Swag Budget ($)
                  </label>
                  <input
                    type="number"
                    value={swagBudget}
                    onChange={(e) => setSwagBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Design instructions */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Customization Design / Logo Notes
                  </label>
                  <textarea
                    rows={2}
                    value={swagDesign}
                    onChange={(e) => setSwagDesign(e.target.value)}
                    placeholder="e.g. Place company logo centered on chest, font colour white."
                    className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>

                {/* Delivery Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Swag Delivery Date
                  </label>
                  <input
                    type="date"
                    value={swagDelivery}
                    onChange={(e) => setSwagDelivery(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Step 6: Registration & Ticketing (Multiple Ticket Tiers Builder) */}
          {currentStep === 6 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="flex justify-between items-center border-b border-[#edeeef] pb-4">
                <div>
                  <h3 className="font-geist text-lg font-bold text-[#00355f]">Ticketing Setup</h3>
                  <p className="font-inter text-xs text-[#5f5e5e] mt-0.5">
                    Configure multiple ticket tiers for registrations (General admission, VIP seating, workshops).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddTier}
                  className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  + Add Ticket Tier
                </button>
              </div>

              {/* Tiers list builder */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {ticketTiers.map((tier, idx) => (
                  <div key={idx} className="p-4 border border-[#e1e3e4] bg-[#f8f9fa] rounded-2xl space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                    
                    <h4 className="text-xs font-bold text-[#0f4c81]">Tier #{idx + 1} Settings</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Tier Name</label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleUpdateTier(idx, 'name', e.target.value)}
                          placeholder="e.g. VIP Pass"
                          className="w-full px-3 py-1.5 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Price ($)</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handleUpdateTier(idx, 'price', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Capacity Limit</label>
                        <input
                          type="number"
                          value={tier.capacity}
                          onChange={(e) => handleUpdateTier(idx, 'capacity', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Registration Deadline</label>
                        <input
                          type="date"
                          value={tier.deadline}
                          onChange={(e) => handleUpdateTier(idx, 'deadline', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Description</label>
                        <input
                          type="text"
                          value={tier.description}
                          onChange={(e) => handleUpdateTier(idx, 'description', e.target.value)}
                          placeholder="VIP exclusive seating and goodies."
                          className="w-full px-3 py-1.5 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Review & Publish */}
          {currentStep === 7 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="text-center space-y-2 max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-[#0f4c81]">auto_awesome</span>
                <h2 className="font-geist text-2xl font-bold text-[#00355f]">Your Event Is Ready</h2>
                <p className="font-inter text-xs text-[#5f5e5e]">
                  Review your event details before publishing to the live assemble.dev discovery feed.
                </p>
              </div>

              {/* Event Preview Card */}
              <div className="max-w-md mx-auto border border-[#e1e3e4] rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="h-44 relative overflow-hidden bg-[#e7e8e9]">
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded font-geist text-[10px] font-bold text-[#00355f]">
                    {category}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-geist font-bold text-[#00355f] text-base">{title || 'Untitled Gathering'}</h3>
                  <p className="font-inter text-xs text-[#5f5e5e]">{startDate} • {time}</p>
                  <p className="font-inter text-xs text-[#5f5e5e] truncate">
                    📍 {enabledServices.venue && selectedVenue ? selectedVenue.name : customVenueName || city}
                  </p>
                  <div className="pt-3 border-t border-[#edeeef] flex justify-between items-center">
                    <span className="font-geist text-sm font-bold text-[#00355f]">
                      {enabledServices.ticketing && ticketTiers.length > 0
                        ? ticketTiers.map(t => `${t.name}: $${t.price}`).join(' | ')
                        : 'Free Registration'}
                    </span>
                    <span className="text-[10px] bg-[#d2e4ff] text-[#0f4c81] px-2 py-0.5 font-bold rounded">
                      {format}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => handlePublish('draft')}
                  className="px-6 py-3 border border-[#727780] rounded-xl font-geist font-bold text-xs text-[#00355f] hover:bg-[#f3f4f5] cursor-pointer"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handlePublish('published')}
                  className="px-8 py-3 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl font-geist font-bold text-xs shadow-xs cursor-pointer"
                >
                  Publish Event Live
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons Row */}
          <div className="flex justify-between items-center pt-4 border-t border-[#e1e3e4]">
            {activeStepsList.indexOf(currentStep) > 0 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 border border-[#c2c7d1] rounded-xl text-xs font-bold text-[#42474f] hover:bg-[#e7e8e9] transition-all cursor-pointer"
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 7 && (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* Persistent Configurator Sidebar */}
        <aside className="lg:col-span-4 bg-white border border-[#e1e3e4] rounded-[2rem] p-6 shadow-2xs space-y-6">
          <div className="space-y-2 border-b border-[#edeeef] pb-4">
            <h3 className="font-geist text-base font-bold text-[#00355f] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl text-[#0f4c81]">design_services</span>
              <span>Services Configurator</span>
            </h3>
            <p className="font-inter text-[11px] text-[#5f5e5e] leading-relaxed">
              Add or remove services at any stage. assemble.dev automatically builds your custom event package and plan.
            </p>
          </div>

          {/* Pre-configured Bundles */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Pre-configured Bundles
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleApplyPackage('venue-only')}
                className="w-full text-left px-3 py-2 border border-[#c2c7d1] hover:bg-[#f8f9fa] rounded-xl text-xs font-semibold text-[#00355f] flex justify-between items-center transition-all cursor-pointer"
              >
                <span>🏢 Venue Only</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPackage('venue-speaker')}
                className="w-full text-left px-3 py-2 border border-[#c2c7d1] hover:bg-[#f8f9fa] rounded-xl text-xs font-semibold text-[#00355f] flex justify-between items-center transition-all cursor-pointer"
              >
                <span>🎤 Speaker + Venue</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPackage('venue-speaker-tickets')}
                className="w-full text-left px-3 py-2 border border-[#c2c7d1] hover:bg-[#f8f9fa] rounded-xl text-xs font-semibold text-[#00355f] flex justify-between items-center transition-all cursor-pointer"
              >
                <span>🎟️ Venue + Speaker + Tickets</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPackage('venue-speaker-tickets-goodies')}
                className="w-full text-left px-3 py-2 border border-[#c2c7d1] hover:bg-[#f8f9fa] rounded-xl text-xs font-semibold text-[#00355f] flex justify-between items-center transition-all cursor-pointer"
              >
                <span>🎁 Venue + Speaker + Tickets + Swag</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPackage('complete')}
                className="w-full text-left px-3.5 py-2.5 bg-[#0f4c81] hover:bg-[#00355f] rounded-xl text-xs font-bold text-white flex justify-between items-center transition-all shadow-2xs cursor-pointer"
              >
                <span>⭐ Complete Event Package</span>
                <span className="material-symbols-outlined text-sm">done_all</span>
              </button>
            </div>
          </div>

          {/* Toggle capabilities */}
          <div className="space-y-3 pt-4 border-t border-[#edeeef]">
            <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Toggle Service Steps
            </span>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-[#00355f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledServices.venue}
                  onChange={() => handleToggleService('venue')}
                  className="w-4 h-4 text-[#0f4c81] border-[#c2c7d1] rounded focus:ring-0 cursor-pointer"
                />
                <span>🏢 Venue Selection</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#00355f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledServices.speakers}
                  onChange={() => handleToggleService('speakers')}
                  className="w-4 h-4 text-[#0f4c81] border-[#c2c7d1] rounded focus:ring-0 cursor-pointer"
                />
                <span>🎤 Keynote Speakers</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#00355f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledServices.catering}
                  onChange={() => handleToggleService('catering')}
                  className="w-4 h-4 text-[#0f4c81] border-[#c2c7d1] rounded focus:ring-0 cursor-pointer"
                />
                <span>☕ Catering & Vendor Services</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#00355f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledServices.goodies}
                  onChange={() => handleToggleService('goodies')}
                  className="w-4 h-4 text-[#0f4c81] border-[#c2c7d1] rounded focus:ring-0 cursor-pointer"
                />
                <span>🎁 Swag & Goodies</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#00355f] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledServices.ticketing}
                  onChange={() => handleToggleService('ticketing')}
                  className="w-4 h-4 text-[#0f4c81] border-[#c2c7d1] rounded focus:ring-0 cursor-pointer"
                />
                <span>🎟️ Registration & Tickets</span>
              </label>
            </div>
          </div>

          {/* Centralized Event Plan */}
          <div className="space-y-3 pt-4 border-t border-[#edeeef]">
            <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
              Centralized Event Plan
            </span>
            <div className="space-y-2.5 text-[11px] font-inter text-[#5f5e5e] max-h-48 overflow-y-auto">
              <div className="flex gap-2 items-start">
                <span className="text-[#0f4c81]">📋</span>
                <div>
                  <span className="font-bold text-[#00355f]">Basics: </span>
                  {title || 'Untitled Gathering'}
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[#0f4c81]">🏢</span>
                <div>
                  <span className="font-bold text-[#00355f]">Venue: </span>
                  {enabledServices.venue ? (selectedVenue ? selectedVenue.name : customVenueName || 'Pending Selection') : 'Not Required'}
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[#0f4c81]">🎤</span>
                <div>
                  <span className="font-bold text-[#00355f]">Speakers: </span>
                  {enabledServices.speakers ? `${selectedSpeakers.length} Speaker(s) selected` : 'Not Required'}
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[#0f4c81]">☕</span>
                <div>
                  <span className="font-bold text-[#00355f]">Catering & AV: </span>
                  {enabledServices.catering ? `${selectedServices.length} Vendor service(s) configured` : 'Not Required'}
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[#0f4c81]">🎁</span>
                <div>
                  <span className="font-bold text-[#00355f]">Swag & Goodies: </span>
                  {enabledServices.goodies ? `${swagProduct} (${swagQuantity} units)` : 'Not Required'}
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[#0f4c81]">🎟️</span>
                <div>
                  <span className="font-bold text-[#00355f]">Ticketing: </span>
                  {enabledServices.ticketing ? `${ticketTiers.length} Tier(s) configured` : 'Not Required'}
                </div>
              </div>
            </div>
          </div>
        </aside>
        
      </div>
    </div>
  );
};
export default CreateEventView;
