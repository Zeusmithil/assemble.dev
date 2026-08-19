import React, { useState, useRef } from 'react';
import { INITIAL_VENUES, INITIAL_SPEAKERS, INITIAL_SERVICES } from '../../data/initialData';

export const CreateEventView = ({
  onCancel,
  onSaveEvent,
  sponsorshipCodes,
  currentUser,
  preSelectedCommunity,
}) => {
  // Configurator capabilities state
  const [enabledServices, setEnabledServices] = useState({
    venue: true,
    speakers: true,
    goodies: true,
    ticketing: true
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Volunteer & Community states
  const [volunteersNeededOption, setVolunteersNeededOption] = useState('none');
  const [volunteersCount, setVolunteersCount] = useState(10);
  const [selectedCommunities, setSelectedCommunities] = useState(preSelectedCommunity ? [preSelectedCommunity] : []);

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

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  // Search & Filter State
  const [venueSearch, setVenueSearch] = useState('');
  const [venueFilterOpen, setVenueFilterOpen] = useState(false);
  const [venueFilters, setVenueFilters] = useState({
    location: '',
    capacity: '',
    price: '',
    type: '',
    availability: '',
    facilities: ''
  });

  // Speakers Search & Topic Domain State
  const [selectedSpeakerDomains, setSelectedSpeakerDomains] = useState([]);
  const [speakerSearch, setSpeakerSearch] = useState('');

  // Selected Goodies list state
  const [selectedGoodies, setSelectedGoodies] = useState([]);

  const handleAddGoodie = (item) => {
    const defaultGoodie = {
      id: `goodie-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: item.name,
      type: item.type,
      color: 'Black',
      sizes: item.type === 'printed' ? { XS: 0, S: 10, M: 20, L: 20, XL: 10, XXL: 0, XXXL: 0 } : null,
      designImage: '',
      printPlacements: item.type === 'printed' ? ['Front'] : null,
      quantity: 100,
      engravingText: '',
      specifications: ''
    };
    setSelectedGoodies([...selectedGoodies, defaultGoodie]);
  };

  const handleRemoveGoodie = (id) => {
    setSelectedGoodies(selectedGoodies.filter((g) => g.id !== id));
  };

  const handleUpdateGoodie = (id, key, val) => {
    setSelectedGoodies(
      selectedGoodies.map((g) => (g.id === id ? { ...g, [key]: val } : g))
    );
  };

  const handleGoodieImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid design file (PNG, JPG, JPEG, SVG, or PDF).');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      handleUpdateGoodie(id, 'designImage', previewUrl);
    }
  };

  const [skippedSteps, setSkippedSteps] = useState([]);

  // Own Venue Custom options
  const [customVenueType, setCustomVenueType] = useState('physical');
  const [virtualEventLink, setVirtualEventLink] = useState('');
  const [customVenueImage, setCustomVenueImage] = useState('');
  const venueImageInputRef = useRef(null);

  const handleVenueImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setCustomVenueImage(previewUrl);
    }
  };

  const handleRemoveVenueImage = () => {
    setCustomVenueImage('');
  };

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
    if (enabledServices.goodies) steps.push(5);
    if (enabledServices.ticketing) steps.push(6);
    steps.push(7); // Step 7 (Review) is always active
    return steps;
  };

  const activeStepsList = getActiveSteps();

  const filteredVenues = INITIAL_VENUES.filter((ven) => {
    const matchSearch =
      venueSearch.trim() === '' ||
      ven.name.toLowerCase().includes(venueSearch.toLowerCase()) ||
      ven.location.toLowerCase().includes(venueSearch.toLowerCase()) ||
      ven.city.toLowerCase().includes(venueSearch.toLowerCase());

    if (!matchSearch) return false;

    if (venueFilters.location && ven.city.toLowerCase() !== venueFilters.location.toLowerCase() && ven.location.toLowerCase() !== venueFilters.location.toLowerCase()) {
      return false;
    }

    if (venueFilters.capacity) {
      if (venueFilters.capacity === 'small' && ven.capacity > 100) return false;
      if (venueFilters.capacity === 'medium' && (ven.capacity < 100 || ven.capacity > 300)) return false;
      if (venueFilters.capacity === 'large' && ven.capacity < 300) return false;
    }

    if (venueFilters.price) {
      if (venueFilters.price === 'low' && ven.pricePerHour >= 150) return false;
      if (venueFilters.price === 'medium' && (ven.pricePerHour < 150 || ven.pricePerHour > 300)) return false;
      if (venueFilters.price === 'high' && ven.pricePerHour < 300) return false;
    }

    if (venueFilters.type && ven.vibe.toLowerCase() !== venueFilters.type.toLowerCase()) {
      return false;
    }

    if (venueFilters.availability && ven.availability.toLowerCase() !== venueFilters.availability.toLowerCase()) {
      return false;
    }

    if (venueFilters.facilities) {
      const hasFacility = ven.amenities.some((a) =>
        a.toLowerCase().includes(venueFilters.facilities.toLowerCase())
      );
      if (!hasFacility) return false;
    }

    return true;
  });

  const speakerDomainsMap = {
    'Artificial Intelligence': ['ai', 'autonomous', 'llm', 'robotics', 'machine learning'],
    'Design': ['design', 'ui', 'ux', 'spatial'],
    'Technology': ['technology', 'serverless', 'kubernetes', 'devops', 'cloud', 'architecture'],
    'Business': ['business', 'enterprise', 'strategy'],
    'Entrepreneurship': ['startup', 'founder', 'entrepreneurship'],
    'Data Science': ['data', 'analytics'],
    'Marketing': ['marketing', 'brand', 'growth'],
    'Finance': ['finance', 'fintech', 'capital'],
    'Cybersecurity': ['security', 'cybersecurity', 'cryptography', 'network'],
    'Education': ['education', 'teach', 'academic'],
    'Leadership': ['leader', 'leadership', 'management']
  };

  const matchesDomain = (speaker, domain) => {
    const terms = speakerDomainsMap[domain] || [domain.toLowerCase()];
    const searchString = [
      speaker.name,
      speaker.designation,
      speaker.company,
      speaker.bio,
      ...(speaker.expertise || [])
    ].join(' ').toLowerCase();

    return terms.some((term) => searchString.includes(term.toLowerCase()));
  };

  const filteredSpeakers = INITIAL_SPEAKERS.filter((spk) => {
    const matchSearch =
      speakerSearch.trim() === '' ||
      spk.name.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      spk.designation.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      spk.company.toLowerCase().includes(speakerSearch.toLowerCase()) ||
      spk.expertise.some((exp) => exp.toLowerCase().includes(speakerSearch.toLowerCase()));

    if (!matchSearch) return false;

    if (selectedSpeakerDomains.length > 0) {
      const matchDomain = selectedSpeakerDomains.some((dom) => matchesDomain(spk, dom));
      if (!matchDomain) return false;
    }

    return true;
  });

  // Navigation handlers
  const handleNext = () => {
    setSkippedSteps((prev) => prev.filter((s) => s !== currentStep));
    const currentIndex = activeStepsList.indexOf(currentStep);
    if (currentIndex < activeStepsList.length - 1) {
      setCurrentStep(activeStepsList[currentIndex + 1]);
    }
  };

  const handleSkip = () => {
    if (!skippedSteps.includes(currentStep)) {
      setSkippedSteps((prev) => [...prev, currentStep]);
    }
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
    let updated = { venue: false, speakers: false, goodies: false, ticketing: false };
    
    if (pkgType === 'complete') {
      updated = { venue: true, speakers: true, goodies: true, ticketing: true };
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
    const isVirtual = enabledServices.venue && venueOption === 'custom' && customVenueType === 'virtual';

    const venueName =
      enabledServices.venue && venueOption === 'marketplace' && selectedVenue
        ? selectedVenue.name
        : isVirtual
        ? 'Virtual Event'
        : customVenueName || 'Main Convention Hall';
    
    const venueAddress =
      enabledServices.venue && venueOption === 'marketplace' && selectedVenue
        ? `${selectedVenue.location}, ${selectedVenue.city}`
        : isVirtual
        ? virtualEventLink || 'Virtual Meeting Link'
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
      organizer: currentUser?.name || 'Curated Organizer',
      organizerEmail: currentUser?.email || 'organizer@assemble.dev',
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
        facilities: selectedVenue?.amenities || ['A/V & Stage', 'Wi-Fi'],
        image: enabledServices.venue && venueOption === 'marketplace' && selectedVenue
          ? selectedVenue.image
          : customVenueImage || null
      },
      whatsIncluded: ['Full Session Access', 'Event Swag Bag', 'Networking Tea & Snacks'],
      visibility: 'Public',
      volunteersNeeded: volunteersNeededOption === 'number' ? Number(volunteersCount) : 0,
      associatedCommunities: selectedCommunities,
      budget: budgetType === 'set-budget' ? Number(budget) : (budgetType === 'sponsorship' && budgetSponsorInfo ? budgetSponsorInfo.amount : 0),
      budgetType: budgetType,
      budgetSponsorInfo: budgetSponsorInfo,
      budgetSponsorCode: budgetType === 'sponsorship' ? budgetSponsorCode : null,
      ticketTiers: enabledServices.ticketing ? ticketTiers.map((t) => ({ ...t, sold: 0 })) : [],
      swagOrder: enabledServices.goodies ? selectedGoodies.map((g) => ({
        product: g.name,
        type: g.type,
        quantity: g.type === 'printed' ? Object.values(g.sizes || {}).reduce((a, b) => a + b, 0) : g.quantity,
        sizes: g.type === 'printed' ? g.sizes : null,
        color: g.color || null,
        design: g.designImage || null,
        printPlacement: g.printPlacements || null,
        engravingText: g.engravingText || null,
        specifications: g.specifications || null
      })) : null
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
            {currentStep === 5 && '4. Swag & Goodies'}
            {currentStep === 6 && '5. Registration & Ticketing'}
            {currentStep === 7 && '6. Review & Publish'}
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

              {/* Volunteers Needed Configuration */}
              <div className="space-y-3 pt-2 text-left">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Volunteers Needed
                </label>
                <div className="flex gap-6 text-xs font-semibold text-[#00355f] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="volunteersNeededOption"
                      checked={volunteersNeededOption === 'none'}
                      onChange={() => setVolunteersNeededOption('none')}
                      className="text-[#0f4c81]"
                    />
                    <span>None Needed</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="volunteersNeededOption"
                      checked={volunteersNeededOption === 'number'}
                      onChange={() => setVolunteersNeededOption('number')}
                      className="text-[#0f4c81]"
                    />
                    <span>Number of Volunteers</span>
                  </label>
                </div>

                {volunteersNeededOption === 'number' && (
                  <div className="space-y-1 max-w-[200px] pt-1 text-left">
                    <label className="block font-inter text-[10px] text-gray-500 font-bold uppercase">Required Count</label>
                    <input
                      type="number"
                      min="1"
                      value={volunteersCount}
                      onChange={(e) => setVolunteersCount(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                    />
                  </div>
                )}
              </div>

              {/* Communities Association */}
              <div className="space-y-3 pt-2 text-left">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Associate with Communities
                </label>
                {preSelectedCommunity ? (
                  <div className="p-3 bg-[#d2e4ff]/30 text-[#0f4c81] rounded-xl text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm font-bold">link</span>
                    <span>Automatically associated with: <strong>{preSelectedCommunity}</strong></span>
                  </div>
                ) : (
                  <>
                    <p className="font-inter text-[11px] text-gray-500">
                      Select one or more communities you belong to, to list this event in their Community Rooms.
                    </p>
                    {!(currentUser?.communities && currentUser.communities.length > 0) ? (
                      <div className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 p-3.5 rounded-xl">
                        You do not belong to any communities. You can join them in your Profile.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {currentUser.communities.map((comName) => (
                          <label key={comName} className="flex items-center gap-2 text-xs font-inter text-[#42474f] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCommunities.includes(comName)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCommunities([...selectedCommunities, comName]);
                                } else {
                                  setSelectedCommunities(selectedCommunities.filter(c => c !== comName));
                                }
                              }}
                              className="rounded border-[#c2c7d1] text-[#0f4c81] focus:ring-[#0f4c81]"
                            />
                            <span>{comName}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                )}
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

              <div className="space-y-2 text-left">
                <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                  Event Cover Image
                </label>
                
                {imageUrl ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-[#e1e3e4] bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold font-geist">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[#0f4c81] hover:underline cursor-pointer"
                      >
                        Change Image
                      </button>
                      <span className="text-[#c2c7d1]">|</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] rounded-2xl p-8 text-center bg-[#f8f9fa] hover:bg-[#d2e4ff]/10 transition-all cursor-pointer space-y-2"
                  >
                    <span className="material-symbols-outlined text-3xl text-gray-400">image</span>
                    <p className="font-geist text-sm font-bold text-[#00355f]">Upload Cover Image</p>
                    <p className="font-inter text-xs text-[#5f5e5e]">Drag and drop or click to choose file</p>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />
                
                <p className="font-inter text-[11px] text-[#727780] mt-1 leading-normal">
                  Supported formats: JPG, JPEG, PNG, WEBP. Recommended dimensions: 1200 x 630 px. Max file size: 5MB.
                </p>
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
                <div className="space-y-6">
                  {/* Search and Filter Row */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="relative flex-1 text-left">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                        <input
                          type="text"
                          placeholder="Search city, area, or location (e.g. Chennai, London, West End)"
                          value={venueSearch}
                          onChange={(e) => setVenueSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setVenueFilterOpen(!venueFilterOpen)}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          venueFilterOpen
                            ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#0f4c81] shadow-2xs'
                            : 'border-[#c2c7d1] bg-white text-[#5f5e5e] hover:bg-[#f8f9fa]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">filter_list</span>
                        <span>Filter</span>
                      </button>
                    </div>

                    {/* Filter Panel */}
                    {venueFilterOpen && (
                      <div className="bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-4 md:p-6 space-y-4 text-left animate-fadeIn">
                        <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-2">
                          <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider">Refine Venues</span>
                          <button
                            type="button"
                            onClick={() => setVenueFilters({ location: '', capacity: '', price: '', type: '', availability: '', facilities: '' })}
                            className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Clear All
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {/* Location Filter */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#00355f] uppercase">Location</label>
                            <select
                              value={venueFilters.location}
                              onChange={(e) => setVenueFilters({ ...venueFilters, location: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                            >
                              <option value="">Any Location</option>
                              <option value="New York">New York</option>
                              <option value="London">London</option>
                              <option value="San Francisco">San Francisco</option>
                              <option value="Chennai">Chennai</option>
                              <option value="Downtown Arts District">Downtown Arts District</option>
                              <option value="West End">West End</option>
                              <option value="City Center Park">City Center Park</option>
                              <option value="Tech Hub Park">Tech Hub Park</option>
                            </select>
                          </div>

                          {/* Capacity Filter */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#00355f] uppercase">Capacity</label>
                            <select
                              value={venueFilters.capacity}
                              onChange={(e) => setVenueFilters({ ...venueFilters, capacity: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                            >
                              <option value="">Any Capacity</option>
                              <option value="small">Small (&lt; 100 seats)</option>
                              <option value="medium">Medium (100 - 300 seats)</option>
                              <option value="large">Large (&gt; 300 seats)</option>
                            </select>
                          </div>

                          {/* Price Filter */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#00355f] uppercase">Price Range</label>
                            <select
                              value={venueFilters.price}
                              onChange={(e) => setVenueFilters({ ...venueFilters, price: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                            >
                              <option value="">Any Price</option>
                              <option value="low">Under $150/hr</option>
                              <option value="medium">150 - 300 / hr</option>
                              <option value="high">Over $300/hr</option>
                            </select>
                          </div>

                          {/* Venue Type Filter */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#00355f] uppercase">Venue Type</label>
                            <select
                              value={venueFilters.type}
                              onChange={(e) => setVenueFilters({ ...venueFilters, type: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                            >
                              <option value="">Any Type</option>
                              <option value="Industrial">Industrial</option>
                              <option value="Minimalist">Minimalist</option>
                              <option value="Outdoor / Indoor">Outdoor / Indoor</option>
                              <option value="Modern Conference">Modern Conference</option>
                            </select>
                          </div>

                          {/* Availability Filter */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#00355f] uppercase">Availability</label>
                            <select
                              value={venueFilters.availability}
                              onChange={(e) => setVenueFilters({ ...venueFilters, availability: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                            >
                              <option value="">Any Availability</option>
                              <option value="Available Next Week">Available Next Week</option>
                              <option value="Available Daily">Available Daily</option>
                              <option value="Weekend Availability">Weekend Availability</option>
                              <option value="Immediate Booking">Immediate Booking</option>
                            </select>
                          </div>

                          {/* Facilities Filter */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-[#00355f] uppercase">Facilities</label>
                            <select
                              value={venueFilters.facilities}
                              onChange={(e) => setVenueFilters({ ...venueFilters, facilities: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-lg text-xs"
                            >
                              <option value="">Any Facility</option>
                              <option value="Wi-Fi">Wi-Fi / Internet</option>
                              <option value="Stage">Stage Lighting / Backdrop</option>
                              <option value="Kitchen">Kitchen / Catering Prep</option>
                              <option value="Acoustic">Acoustic / Wall Panels</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {filteredVenues.length === 0 ? (
                    <div className="text-center py-12 bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6">
                      <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                      <p className="font-geist font-bold text-sm text-[#00355f] mt-2">No matching venues found</p>
                      <p className="font-inter text-xs text-[#5f5e5e]">Try refining your search terms or clearing filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      {filteredVenues.map((ven) => (
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
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Custom option toggle */}
                  <div className="flex gap-4 border-b border-[#e1e3e4] pb-2 text-left">
                    <button
                      type="button"
                      onClick={() => setCustomVenueType('physical')}
                      className={`pb-1 text-xs font-bold transition-all cursor-pointer ${
                        customVenueType === 'physical'
                          ? 'border-b-2 border-[#00355f] text-[#00355f]'
                          : 'text-[#5f5e5e] hover:text-[#00355f]'
                      }`}
                    >
                      🏢 Physical Venue
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomVenueType('virtual')}
                      className={`pb-1 text-xs font-bold transition-all cursor-pointer ${
                        customVenueType === 'virtual'
                          ? 'border-b-2 border-[#00355f] text-[#00355f]'
                          : 'text-[#5f5e5e] hover:text-[#00355f]'
                      }`}
                    >
                      🌐 Virtual Event / Link
                    </button>
                  </div>

                  {customVenueType === 'physical' ? (
                    <div className="space-y-4 text-left">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00355f]">Venue Name</label>
                        <input
                          type="text"
                          value={customVenueName}
                          onChange={(e) => setCustomVenueName(e.target.value)}
                          placeholder="e.g. Sir Mutha Venkatasubba Rao Concert Hall"
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm focus:outline-none focus:border-[#0f4c81]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00355f]">Full Address</label>
                        <input
                          type="text"
                          value={customVenueAddress}
                          onChange={(e) => setCustomVenueAddress(e.target.value)}
                          placeholder="e.g. 7, Lady McNichols Rd, Chetpet, Chennai"
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm focus:outline-none focus:border-[#0f4c81]"
                        />
                      </div>

                      {/* Image Upload for physical custom venue */}
                      <div className="space-y-2">
                        <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                          Venue Image
                        </label>
                        {customVenueImage ? (
                          <div className="space-y-3">
                            <div className="relative rounded-2xl overflow-hidden border border-[#e1e3e4] bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center">
                              <img
                                src={customVenueImage}
                                alt="Venue Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold font-geist">
                              <button
                                type="button"
                                onClick={() => venueImageInputRef.current?.click()}
                                className="text-[#0f4c81] hover:underline cursor-pointer"
                              >
                                Change Image
                              </button>
                              <span className="text-[#c2c7d1]">|</span>
                              <button
                                type="button"
                                onClick={handleRemoveVenueImage}
                                className="text-rose-600 hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => venueImageInputRef.current?.click()}
                            className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] rounded-2xl p-8 text-center bg-[#f8f9fa] hover:bg-[#d2e4ff]/10 transition-all cursor-pointer space-y-2"
                          >
                            <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                            <p className="font-geist text-sm font-bold text-[#00355f]">Upload Venue Image</p>
                            <p className="font-inter text-xs text-[#5f5e5e]">Choose a JPG, PNG or WEBP image from your laptop</p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={venueImageInputRef}
                          onChange={handleVenueImageChange}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00355f]">Virtual Event Link</label>
                        <input
                          type="text"
                          value={virtualEventLink}
                          onChange={(e) => setVirtualEventLink(e.target.value)}
                          placeholder="e.g. Zoom or Google Meet Link"
                          className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-sm focus:outline-none focus:border-[#0f4c81]"
                        />
                      </div>

                      {/* Optional Image Upload for virtual custom venue */}
                      <div className="space-y-2 opacity-90">
                        <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                          Venue Image (Optional)
                        </label>
                        {customVenueImage ? (
                          <div className="space-y-3">
                            <div className="relative rounded-2xl overflow-hidden border border-[#e1e3e4] bg-[#f8f9fa] h-48 md:h-64 flex items-center justify-center">
                              <img
                                src={customVenueImage}
                                alt="Venue Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold font-geist">
                              <button
                                type="button"
                                onClick={() => venueImageInputRef.current?.click()}
                                className="text-[#0f4c81] hover:underline cursor-pointer"
                              >
                                Change Image
                              </button>
                              <span className="text-[#c2c7d1]">|</span>
                              <button
                                type="button"
                                onClick={handleRemoveVenueImage}
                                className="text-rose-600 hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => venueImageInputRef.current?.click()}
                            className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] rounded-2xl p-8 text-center bg-[#f8f9fa] hover:bg-[#d2e4ff]/10 transition-all cursor-pointer space-y-2"
                          >
                            <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
                            <p className="font-geist text-sm font-bold text-[#00355f]">Upload Venue Image</p>
                            <p className="font-inter text-xs text-[#5f5e5e]">Choose a JPG, PNG or WEBP image from your laptop</p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={venueImageInputRef}
                          onChange={handleVenueImageChange}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Step 3: Keynote Speakers */}
          {currentStep === 3 && (
            <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-4">
                <h3 className="font-geist text-lg font-bold text-[#00355f] text-left">Select Keynote Speakers & Panellists</h3>
                <span className="text-xs font-bold text-[#0f4c81] bg-[#d2e4ff] px-3 py-1 rounded-full">
                  {selectedSpeakers.length} Selected
                </span>
              </div>

              {/* Selected Speakers Summary list */}
              {selectedSpeakers.length > 0 && (
                <div className="bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-4 text-left space-y-3">
                  <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Selected Speakers ({selectedSpeakers.length})
                  </span>
                  <div className="divide-y divide-[#e1e3e4]">
                    {selectedSpeakers.map((spk) => (
                      <div key={spk.id} className="py-2 flex justify-between items-center first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <img src={spk.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-[#00355f]">{spk.name}</p>
                            <p className="text-[10px] text-gray-500">{spk.designation} at {spk.company}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedSpeakers(selectedSpeakers.filter((s) => s.id !== spk.id))}
                          className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speaker Domain Selection */}
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  1. Filter by Topic Domains
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Artificial Intelligence', 'Data Science', 'Technology', 'Business',
                    'Marketing', 'Entrepreneurship', 'Finance', 'Cybersecurity',
                    'Design', 'Education', 'Leadership', 'Other'
                  ].map((dom) => {
                    const isSelected = selectedSpeakerDomains.includes(dom);
                    return (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSpeakerDomains(selectedSpeakerDomains.filter((d) => d !== dom));
                          } else {
                            setSelectedSpeakerDomains([...selectedSpeakerDomains, dom]);
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f4c81] border-[#0f4c81] text-white shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {dom}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speaker search input */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  2. Search Speakers
                </span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, expertise, organization, or topic (e.g. Elena, Robotics, CloudScale)"
                    value={speakerSearch}
                    onChange={(e) => setSpeakerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl font-inter text-sm text-[#191c1d] focus:outline-none focus:border-[#0f4c81]"
                  />
                </div>
              </div>

              {/* Speakers Grid Results */}
              {filteredSpeakers.length === 0 ? (
                <div className="text-center py-12 bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6">
                  <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
                  <p className="font-geist font-bold text-sm text-[#00355f] mt-2">No matching speakers found</p>
                  <p className="font-inter text-xs text-[#5f5e5e]">Try clearing some domain topic filters or updating search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  {filteredSpeakers.map((spk) => {
                    const isSelected = selectedSpeakers.some((s) => s.id === spk.id);
                    return (
                      <div
                        key={spk.id}
                        className={`p-4 border rounded-2xl transition-all flex gap-4 items-start bg-white ${
                          isSelected
                            ? 'border-[#0f4c81] bg-[#d2e4ff]/10 shadow-xs ring-2 ring-[#0f4c81]'
                            : 'border-[#e1e3e4] hover:border-[#c2c7d1]'
                        }`}
                      >
                        <img
                          src={spk.photo}
                          alt={spk.name}
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="space-y-1.5 flex-grow min-w-0">
                          <div>
                            <h4 className="font-geist font-bold text-[#00355f] text-sm truncate">{spk.name}</h4>
                            <p className="font-inter text-xs text-gray-500 truncate">{spk.designation} at {spk.company}</p>
                          </div>
                          <p className="font-inter text-[11px] text-[#5f5e5e] line-clamp-2 leading-relaxed">{spk.bio}</p>
                          <div className="flex flex-wrap gap-1">
                            {spk.expertise.map((exp) => (
                              <span key={exp} className="bg-gray-100 text-[#42474f] px-2 py-0.5 rounded text-[9px] font-medium">
                                {exp}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-[#edeeef] mt-2">
                            <span className="text-[10px] font-bold text-gray-400">{spk.availability || 'Available'}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSpeakers(selectedSpeakers.filter((s) => s.id !== spk.id));
                                } else {
                                  setSelectedSpeakers([...selectedSpeakers, spk]);
                                }
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100/50'
                                  : 'bg-[#0f4c81] text-white hover:bg-[#00355f]'
                              }`}
                            >
                              {isSelected ? 'Deselect' : 'Select Speaker'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <h3 className="font-geist text-lg font-bold text-[#00355f] text-left">Swag & Goodies Configurator</h3>
                <p className="font-inter text-xs text-[#5f5e5e] mt-1 text-left">
                  Configure multiple types of custom event goodies, sizes, colors, printing locations, or engravings.
                </p>
              </div>

              {/* Product Selector grid */}
              <div className="space-y-3 text-left">
                <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Select Swag Items to Add
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { name: 'T-Shirts', type: 'printed' },
                    { name: 'Hoodies', type: 'printed' },
                    { name: 'Tote Bags', type: 'printed' },
                    { name: 'Caps', type: 'printed' },
                    { name: 'Notebooks', type: 'none' },
                    { name: 'Mugs', type: 'engraved' },
                    { name: 'Pens', type: 'engraved' },
                    { name: 'Metal Bottles', type: 'engraved' },
                    { name: 'Keychains', type: 'engraved' },
                    { name: 'Plaques', type: 'engraved' },
                    { name: 'ID Cards', type: 'none' },
                    { name: 'Other Merchandise', type: 'none' }
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleAddGoodie(item)}
                      className="py-3 px-4 border border-[#c2c7d1] bg-[#f8f9fa] hover:bg-gray-100 rounded-xl text-xs font-bold text-center transition-all cursor-pointer text-[#00355f] flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-[#0f4c81]">+ Add</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configured Goodies List */}
              <div className="space-y-4 pt-4 border-t border-[#edeeef]">
                <span className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block text-left">
                  Configured Swag Items ({selectedGoodies.length})
                </span>
                
                {selectedGoodies.length === 0 ? (
                  <div className="text-center py-12 bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6 text-gray-500 text-xs">
                    No swag items configured. Select items from the menu above to customize them.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedGoodies.map((goodie, idx) => (
                      <div key={goodie.id} className="p-6 border border-[#e1e3e4] bg-[#f8f9fa]/50 rounded-2xl space-y-5 relative text-left">
                        <button
                          type="button"
                          onClick={() => handleRemoveGoodie(goodie.id)}
                          className="absolute top-4 right-4 text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          Remove Item
                        </button>
                        
                        <div>
                          <span className="text-[10px] font-bold text-[#0f4c81] uppercase tracking-wider">
                            Swag Configuration #{idx + 1}
                          </span>
                          <h4 className="font-geist text-lg font-bold text-[#00355f] mt-0.5">
                            {goodie.name}
                          </h4>
                        </div>

                        {/* Printed Config form */}
                        {goodie.type === 'printed' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#00355f] uppercase">Product Color</label>
                                <input
                                  type="text"
                                  value={goodie.color || ''}
                                  onChange={(e) => handleUpdateGoodie(goodie.id, 'color', e.target.value)}
                                  placeholder="e.g. Black, Navy Blue, White"
                                  className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#00355f] uppercase block mb-1">Print Placement (Select Multiple)</label>
                                <div className="flex flex-wrap gap-3">
                                  {['Front', 'Back', 'Left Chest', 'Right Chest', 'Sleeve', 'Other'].map((loc) => {
                                    const isChecked = goodie.printPlacements?.includes(loc);
                                    return (
                                      <label key={loc} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer font-medium">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => {
                                            const newLocs = isChecked
                                              ? goodie.printPlacements.filter((l) => l !== loc)
                                              : [...(goodie.printPlacements || []), loc];
                                            handleUpdateGoodie(goodie.id, 'printPlacements', newLocs);
                                          }}
                                          className="w-4 h-4 text-[#0f4c81] rounded focus:ring-0 cursor-pointer"
                                        />
                                        <span>{loc}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Sized items configuration */}
                            <div className="space-y-2.5">
                              <label className="block text-[10px] font-bold text-[#00355f] uppercase">Select Available Sizes & Quantities</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => {
                                  const qty = goodie.sizes?.[size] ?? 0;
                                  const hasSize = qty > 0;
                                  return (
                                    <div key={size} className="p-2 border border-[#e1e3e4] bg-white rounded-xl flex flex-col items-center gap-1.5 shadow-2xs">
                                      <label className="flex items-center gap-1 text-xs font-bold text-gray-700 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={hasSize}
                                          onChange={() => {
                                            const newSizes = { ...goodie.sizes, [size]: hasSize ? 0 : 10 };
                                            handleUpdateGoodie(goodie.id, 'sizes', newSizes);
                                          }}
                                          className="w-3.5 h-3.5 text-[#0f4c81] rounded focus:ring-0 cursor-pointer"
                                        />
                                        <span>{size}</span>
                                      </label>
                                      {hasSize && (
                                        <input
                                          type="number"
                                          value={qty}
                                          onChange={(e) => {
                                            const val = Math.max(0, Number(e.target.value));
                                            const newSizes = { ...goodie.sizes, [size]: val };
                                            handleUpdateGoodie(goodie.id, 'sizes', newSizes);
                                          }}
                                          className="w-16 px-1.5 py-0.5 border border-[#c2c7d1] rounded bg-white text-center text-xs font-bold text-[#00355f] focus:outline-none"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-[#0f4c81] font-bold pt-1">
                                Total Quantity: {Object.values(goodie.sizes || {}).reduce((a, b) => a + b, 0)} Pieces
                              </p>
                            </div>

                            {/* Printing Design Upload */}
                            <div className="space-y-2">
                              <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                                Upload Printing Design / Logo
                              </label>
                              {goodie.designImage ? (
                                <div className="space-y-3">
                                  <div className="relative rounded-2xl overflow-hidden border border-[#e1e3e4] bg-white h-40 flex items-center justify-center">
                                    <img
                                      src={goodie.designImage}
                                      alt="Design Preview"
                                      className="w-full h-full object-contain p-2"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                                      Placement: {goodie.printPlacements?.join(' + ') || 'Front'}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs font-bold font-geist">
                                    <button
                                      type="button"
                                      onClick={() => document.getElementById(`file-goodie-${goodie.id}`)?.click()}
                                      className="text-[#0f4c81] hover:underline cursor-pointer"
                                    >
                                      Change Design
                                    </button>
                                    <span className="text-[#c2c7d1]">|</span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateGoodie(goodie.id, 'designImage', '')}
                                      className="text-rose-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => document.getElementById(`file-goodie-${goodie.id}`)?.click()}
                                  className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] rounded-2xl p-6 text-center bg-white hover:bg-[#d2e4ff]/10 transition-all cursor-pointer space-y-1.5"
                                >
                                  <span className="material-symbols-outlined text-2xl text-gray-400">upload_file</span>
                                  <p className="font-geist text-xs font-bold text-[#00355f]">Upload Design File</p>
                                  <p className="font-inter text-[10px] text-gray-400">PNG, JPG, JPEG, SVG or PDF</p>
                                </div>
                              )}
                              <input
                                type="file"
                                id={`file-goodie-${goodie.id}`}
                                onChange={(e) => handleGoodieImageChange(goodie.id, e)}
                                accept="image/png, image/jpeg, image/jpg, image/svg+xml, application/pdf"
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}

                        {/* Engraved Config form */}
                        {goodie.type === 'engraved' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#00355f] uppercase">Quantity</label>
                                <input
                                  type="number"
                                  value={goodie.quantity || 100}
                                  onChange={(e) => handleUpdateGoodie(goodie.id, 'quantity', Math.max(0, Number(e.target.value)))}
                                  className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#00355f] uppercase">What would you like to engrave?</label>
                                <textarea
                                  rows={2}
                                  value={goodie.engravingText || ''}
                                  onChange={(e) => handleUpdateGoodie(goodie.id, 'engravingText', e.target.value)}
                                  placeholder="e.g. Evently 2026 AI Innovation Summit"
                                  className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                                />
                              </div>
                            </div>

                            {/* Engraving Design Upload */}
                            <div className="space-y-2">
                              <label className="block font-geist text-xs font-bold text-[#00355f] uppercase tracking-wider">
                                Upload Engraving Design / Logo
                              </label>
                              {goodie.designImage ? (
                                <div className="space-y-3">
                                  <div className="relative rounded-2xl overflow-hidden border border-[#e1e3e4] bg-white h-40 flex items-center justify-center">
                                    <img
                                      src={goodie.designImage}
                                      alt="Engraving Preview"
                                      className="w-full h-full object-contain p-2"
                                    />
                                    {goodie.engravingText && (
                                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                                        Text: "{goodie.engravingText}"
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs font-bold font-geist">
                                    <button
                                      type="button"
                                      onClick={() => document.getElementById(`file-goodie-${goodie.id}`)?.click()}
                                      className="text-[#0f4c81] hover:underline cursor-pointer"
                                    >
                                      Change Design
                                    </button>
                                    <span className="text-[#c2c7d1]">|</span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateGoodie(goodie.id, 'designImage', '')}
                                      className="text-rose-600 hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => document.getElementById(`file-goodie-${goodie.id}`)?.click()}
                                  className="border-2 border-dashed border-[#c2c7d1] hover:border-[#0f4c81] rounded-2xl p-6 text-center bg-white hover:bg-[#d2e4ff]/10 transition-all cursor-pointer space-y-1.5"
                                >
                                  <span className="material-symbols-outlined text-2xl text-gray-400">upload_file</span>
                                  <p className="font-geist text-xs font-bold text-[#00355f]">Upload Engraving Design</p>
                                  <p className="font-inter text-[10px] text-gray-400">PNG, JPG, JPEG, SVG or PDF</p>
                                </div>
                              )}
                              <input
                                type="file"
                                id={`file-goodie-${goodie.id}`}
                                onChange={(e) => handleGoodieImageChange(goodie.id, e)}
                                accept="image/png, image/jpeg, image/jpg, image/svg+xml, application/pdf"
                                className="hidden"
                              />
                            </div>
                          </div>
                        )}

                        {/* Non-Customized Config form */}
                        {goodie.type === 'none' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#00355f] uppercase">Quantity</label>
                                <input
                                  type="number"
                                  value={goodie.quantity || 100}
                                  onChange={(e) => handleUpdateGoodie(goodie.id, 'quantity', Math.max(0, Number(e.target.value)))}
                                  className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-[#00355f] uppercase">Product Specifications / Notes</label>
                                <textarea
                                  rows={2}
                                  value={goodie.specifications || ''}
                                  onChange={(e) => handleUpdateGoodie(goodie.id, 'specifications', e.target.value)}
                                  placeholder="e.g. Standard lined pages, black hard cover"
                                  className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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

              {/* Event Setup Summary */}
              <div className="bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
                <h3 className="font-geist text-sm font-bold text-[#00355f] border-b border-[#e1e3e4] pb-2">
                  Event Setup Summary
                </h3>
                <div className="space-y-3">
                  {/* Event Basics (Step 1) */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      {skippedSteps.includes(1) ? (
                        <>
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span className="text-gray-500 font-medium font-geist">1. Event Basics — Skipped</span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-[#00355f] font-semibold font-geist">1. Event Basics</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
                    >
                      {skippedSteps.includes(1) ? 'Complete Section' : 'Edit'}
                    </button>
                  </div>

                  {/* Venue (Step 2) */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      {!enabledServices.venue ? (
                        <>
                          <span className="text-gray-400 font-bold">○</span>
                          <span className="text-gray-400 font-geist">2. Venue Selection — Not Required</span>
                        </>
                      ) : skippedSteps.includes(2) ? (
                        <>
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span className="text-gray-500 font-medium font-geist">2. Venue Selection — Skipped</span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-[#00355f] font-semibold font-geist">2. Venue Selection</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!enabledServices.venue) {
                          handleToggleService('venue');
                        }
                        setCurrentStep(2);
                      }}
                      className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
                    >
                      {!enabledServices.venue ? 'Enable & Configure' : skippedSteps.includes(2) ? 'Complete Section' : 'Edit'}
                    </button>
                  </div>

                  {/* Keynote Speakers (Step 3) */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      {!enabledServices.speakers ? (
                        <>
                          <span className="text-gray-400 font-bold">○</span>
                          <span className="text-gray-400 font-geist">3. Keynote Speakers — Not Required</span>
                        </>
                      ) : skippedSteps.includes(3) ? (
                        <>
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span className="text-gray-500 font-medium font-geist">3. Keynote Speakers — Skipped</span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-[#00355f] font-semibold font-geist">3. Keynote Speakers</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!enabledServices.speakers) {
                          handleToggleService('speakers');
                        }
                        setCurrentStep(3);
                      }}
                      className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
                    >
                      {!enabledServices.speakers ? 'Enable & Configure' : skippedSteps.includes(3) ? 'Complete Section' : 'Edit'}
                    </button>
                  </div>

                  {/* Swag & Goodies (Step 5) */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      {!enabledServices.goodies ? (
                        <>
                          <span className="text-gray-400 font-bold">○</span>
                          <span className="text-gray-400 font-geist">4. Swag & Goodies — Not Required</span>
                        </>
                      ) : skippedSteps.includes(5) ? (
                        <>
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span className="text-gray-500 font-medium font-geist">4. Swag & Goodies — Skipped</span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-[#00355f] font-semibold font-geist">4. Swag & Goodies</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!enabledServices.goodies) {
                          handleToggleService('goodies');
                        }
                        setCurrentStep(5);
                      }}
                      className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
                    >
                      {!enabledServices.goodies ? 'Enable & Configure' : skippedSteps.includes(5) ? 'Complete Section' : 'Edit'}
                    </button>
                  </div>

                  {/* Registration & Ticketing (Step 6) */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5">
                      {!enabledServices.ticketing ? (
                        <>
                          <span className="text-gray-400 font-bold">○</span>
                          <span className="text-gray-400 font-geist">5. Registration & Ticketing — Not Required</span>
                        </>
                      ) : skippedSteps.includes(6) ? (
                        <>
                          <span className="text-amber-500 font-bold">⚠</span>
                          <span className="text-gray-500 font-medium font-geist">5. Registration & Ticketing — Skipped</span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-[#00355f] font-semibold font-geist">5. Registration & Ticketing</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!enabledServices.ticketing) {
                          handleToggleService('ticketing');
                        }
                        setCurrentStep(6);
                      }}
                      className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
                    >
                      {!enabledServices.ticketing ? 'Enable & Configure' : skippedSteps.includes(6) ? 'Complete Section' : 'Edit'}
                    </button>
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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-5 py-2.5 border border-[#c2c7d1] rounded-xl text-xs font-bold text-[#5f5e5e] hover:bg-[#e7e8e9] transition-all cursor-pointer"
                >
                  Skip
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
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
                <span className="text-[#0f4c81]">🎁</span>
                <div>
                  <span className="font-bold text-[#00355f]">Swag & Goodies: </span>
                  {enabledServices.goodies ? `${selectedGoodies.length} item(s) configured` : 'Not Required'}
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
