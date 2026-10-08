import React, { useState } from 'react';
import { ROLE_LABELS, budgetAmountFromRange } from '../../utils/roles';

const BUDGET_RANGES = [
  'Under €500',
  '€500–€1,000',
  '€1,000–€5,000',
  '€5,000–€10,000',
  '€10,000+',
  'Custom amount',
];

const SPONSOR_EVENT_TYPES = [
  'Technology',
  'Business',
  'Education',
  'Community',
  'Sports',
  'Startup',
  'Entertainment',
  'Other',
];

const INDUSTRIES = [
  'Technology & Software',
  'Fintech & Banking',
  'Marketing & Design',
  'Clean Energy & Infrastructure',
  'Healthcare & BioTech',
  'Education & EdTech',
  'Consumer & Retail',
  'Other',
];

const VENUE_TYPES = [
  'Auditorium',
  'Conference Center',
  'Banquet Hall',
  'Rooftop Lounge',
  'Co-working Hub',
  'Amphitheater',
  'Creative Studio',
  'Other',
];

const DEFAULT_VENUE_FACILITIES = [
  'High-Speed Wi-Fi',
  'Acoustic Stage',
  'A/V Sound System',
  'VIP Green Room',
  'Projector & Screen',
  'Valet Parking',
  'Catering Kitchen',
  'Wheelchair Accessible',
];

const SPEAKER_TOPIC_SUGGESTIONS = [
  'Artificial Intelligence & ML',
  'System Architecture',
  'Developer Experience',
  'Product Design & UX',
  'Startup Growth & Fundraising',
  'Cybersecurity & Trust',
  'Cloud Infrastructure',
  'Web3 & Distributed Systems',
];

const ATTENDEE_INTERESTS = [
  'Technology & AI',
  'Product Design',
  'Startups & Venture',
  'Creative Arts & Culture',
  'Developer Tools',
  'Community & Networking',
];

export const RoleSetupView = ({
  role = 'speaker',
  currentUser,
  onComplete,
  onCancel,
}) => {
  const normalizedRole = role === 'venue-provider' ? 'venue' : role;
  const roleLabel = ROLE_LABELS[normalizedRole] || 'Role';

  // ----------------------------------------------------
  // SPEAKER STATE
  // ----------------------------------------------------
  const [speakerTitle, setSpeakerTitle] = useState(
    currentUser?.speakerProfile?.title || ''
  );
  const [speakerOrg, setSpeakerOrg] = useState(
    currentUser?.speakerProfile?.organization || ''
  );
  const [speakerBio, setSpeakerBio] = useState(
    currentUser?.speakerProfile?.bio || ''
  );
  const [speakerTopics, setSpeakerTopics] = useState(
    currentUser?.speakerProfile?.topics && currentUser.speakerProfile.topics.length > 0
      ? currentUser.speakerProfile.topics
      : ['Artificial Intelligence & ML', 'System Architecture']
  );
  const [speakerTopicInput, setSpeakerTopicInput] = useState('');
  const [speakerYearsExp, setSpeakerYearsExp] = useState(
    currentUser?.speakerProfile?.yearsExperience || '5'
  );
  const [speakerVideoUrl, setSpeakerVideoUrl] = useState(
    currentUser?.speakerProfile?.videoUrl || ''
  );
  const [speakerVideoFileName, setSpeakerVideoFileName] = useState(
    currentUser?.speakerProfile?.videoFileName || ''
  );
  const [speakerVideoFileSize, setSpeakerVideoFileSize] = useState(
    currentUser?.speakerProfile?.videoFileSize || ''
  );
  const [speakerFeeType, setSpeakerFeeType] = useState(
    currentUser?.speakerProfile?.feeType || 'fee'
  );
  const [speakerFeeAmount, setSpeakerFeeAmount] = useState(
    currentUser?.speakerProfile?.feeAmount || '2000'
  );
  const [speakerFeeCurrency, setSpeakerFeeCurrency] = useState(
    currentUser?.speakerProfile?.currency || '€'
  );
  const [speakerAvailability, setSpeakerAvailability] = useState(
    currentUser?.speakerProfile?.availability || 'Available for Bookings'
  );

  // ----------------------------------------------------
  // SPONSOR STATE
  // ----------------------------------------------------
  const [companyName, setCompanyName] = useState(
    currentUser?.sponsorProfile?.companyName || ''
  );
  const [companyWebsite, setCompanyWebsite] = useState(
    currentUser?.sponsorProfile?.website || ''
  );
  const [industry, setIndustry] = useState(
    currentUser?.sponsorProfile?.industry || 'Technology & Software'
  );
  const [companyDesc, setCompanyDesc] = useState(
    currentUser?.sponsorProfile?.description || ''
  );
  const [companyLogo, setCompanyLogo] = useState(
    currentUser?.sponsorProfile?.logo || ''
  );
  const [budgetRange, setBudgetRange] = useState(
    currentUser?.sponsorProfile?.budgetRange || '€1,000–€5,000'
  );
  const [customAmount, setCustomAmount] = useState('');
  const [supportedEventTypes, setSupportedEventTypes] = useState(
    currentUser?.sponsorProfile?.supportedEventTypes &&
      currentUser.sponsorProfile.supportedEventTypes.length > 0
      ? currentUser.sponsorProfile.supportedEventTypes
      : ['Technology', 'Startup']
  );
  const [sponsorContactEmail, setSponsorContactEmail] = useState(
    currentUser?.sponsorProfile?.contactEmail || currentUser?.email || ''
  );

  // ----------------------------------------------------
  // VENUE PROVIDER STATE
  // ----------------------------------------------------
  const [venueName, setVenueName] = useState(
    currentUser?.venueProfile?.venueName || currentUser?.venueProfile?.name || ''
  );
  const [venueType, setVenueType] = useState(
    currentUser?.venueProfile?.vibe || currentUser?.venueProfile?.venueType || 'Auditorium'
  );
  const [venueAddress, setVenueAddress] = useState(
    currentUser?.venueProfile?.address || currentUser?.venueProfile?.location || ''
  );
  const [venueCity, setVenueCity] = useState(
    currentUser?.venueProfile?.city || currentUser?.location || 'Chennai'
  );
  const [venueCapacity, setVenueCapacity] = useState(
    String(currentUser?.venueProfile?.capacity || '300')
  );
  const [venuePrice, setVenuePrice] = useState(
    String(currentUser?.venueProfile?.pricePerHour || '150')
  );
  const [venueDesc, setVenueDesc] = useState(
    currentUser?.venueProfile?.description || ''
  );
  const [venueFacilities, setVenueFacilities] = useState(
    currentUser?.venueProfile?.amenities ||
      currentUser?.venueProfile?.facilities || [
        'High-Speed Wi-Fi',
        'Acoustic Stage',
        'A/V Sound System',
        'VIP Green Room',
      ]
  );
  const [newFacilityInput, setNewFacilityInput] = useState('');
  const [venueImages, setVenueImages] = useState(
    currentUser?.venueProfile?.images ||
      (currentUser?.venueProfile?.image ? [currentUser.venueProfile.image] : [])
  );
  const [venueContactPhone, setVenueContactPhone] = useState(
    currentUser?.venueProfile?.contactPhone || currentUser?.phone || ''
  );

  // ----------------------------------------------------
  // ORGANIZER STATE
  // ----------------------------------------------------
  const [orgName, setOrgName] = useState(
    currentUser?.organizerProfile?.organizationName ||
      currentUser?.organizationName ||
      ''
  );
  const [orgType, setOrgType] = useState(
    currentUser?.organizerProfile?.orgType || 'Tech Community / Meetup'
  );
  const [orgDesc, setOrgDesc] = useState(
    currentUser?.organizerProfile?.description || ''
  );
  const [communityAction, setCommunityAction] = useState('create');
  const [commName, setCommName] = useState('');
  const [commCat, setCommCat] = useState('Technology & AI');
  const [commDesc, setCommDesc] = useState('');
  const [commJoinCode, setCommJoinCode] = useState('');
  const [generatedCommCode] = useState(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomSuffix =
      letters[Math.floor(Math.random() * letters.length)] +
      letters[Math.floor(Math.random() * letters.length)];
    return `EH-${randomSuffix}2026`;
  });

  // ----------------------------------------------------
  // ATTENDEE STATE
  // ----------------------------------------------------
  const [attendeeInterests, setAttendeeInterests] = useState(
    currentUser?.interests || ['Technology & AI', 'Product Design']
  );

  // Common UI State
  const [error, setError] = useState('');

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------
  const handleToggleTopic = (topic) => {
    if (speakerTopics.includes(topic)) {
      if (speakerTopics.length === 1) return;
      setSpeakerTopics(speakerTopics.filter((t) => t !== topic));
    } else {
      setSpeakerTopics([...speakerTopics, topic]);
    }
  };

  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    if (speakerTopicInput.trim() && !speakerTopics.includes(speakerTopicInput.trim())) {
      setSpeakerTopics([...speakerTopics, speakerTopicInput.trim()]);
      setSpeakerTopicInput('');
    }
  };

  const handleSpeakerVideoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSpeakerVideoUrl(objectUrl);
    setSpeakerVideoFileName(file.name);
    setSpeakerVideoFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

    if (file.size <= 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSpeakerVideoUrl(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVenueImageUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImgs = [];
    Array.from(files).forEach((file) => {
      const objUrl = URL.createObjectURL(file);
      newImgs.push(objUrl);

      if (file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (loadEvent.target?.result) {
            setVenueImages((prev) =>
              prev.map((img) => (img === objUrl ? loadEvent.target.result : img))
            );
          }
        };
        reader.readAsDataURL(file);
      }
    });

    setVenueImages((prev) => [...prev, ...newImgs]);
  };

  const handleToggleFacility = (fac) => {
    if (venueFacilities.includes(fac)) {
      setVenueFacilities(venueFacilities.filter((f) => f !== fac));
    } else {
      setVenueFacilities([...venueFacilities, fac]);
    }
  };

  const handleAddCustomFacility = (e) => {
    e.preventDefault();
    if (newFacilityInput.trim() && !venueFacilities.includes(newFacilityInput.trim())) {
      setVenueFacilities([...venueFacilities, newFacilityInput.trim()]);
      setNewFacilityInput('');
    }
  };

  const handleToggleSponsorType = (type) => {
    if (supportedEventTypes.includes(type)) {
      setSupportedEventTypes(supportedEventTypes.filter((t) => t !== type));
    } else {
      setSupportedEventTypes([...supportedEventTypes, type]);
    }
  };

  const handleToggleAttendeeInterest = (item) => {
    if (attendeeInterests.includes(item)) {
      setAttendeeInterests(attendeeInterests.filter((i) => i !== item));
    } else {
      setAttendeeInterests([...attendeeInterests, item]);
    }
  };

  // ----------------------------------------------------
  // SUBMISSION
  // ----------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (normalizedRole === 'speaker') {
      if (!speakerTitle.trim()) {
        setError('Please enter your professional speaking title.');
        return;
      }
      if (!speakerBio.trim()) {
        setError('Please provide a short biography.');
        return;
      }
      if (speakerTopics.length === 0) {
        setError('Please select at least one speaking topic or domain.');
        return;
      }

      onComplete({
        title: speakerTitle.trim(),
        organization: speakerOrg.trim() || 'Independent',
        bio: speakerBio.trim(),
        topics: speakerTopics,
        yearsExperience: speakerYearsExp,
        videoUrl: speakerVideoUrl,
        videoFileName: speakerVideoFileName,
        videoFileSize: speakerVideoFileSize,
        feeType: speakerFeeType,
        feeAmount: speakerFeeType === 'free' ? '0' : speakerFeeAmount,
        currency: speakerFeeCurrency,
        availability: speakerAvailability,
      });
      return;
    }

    if (normalizedRole === 'sponsor') {
      if (!companyName.trim()) {
        setError('Please enter your company or organization name.');
        return;
      }
      if (budgetRange === 'Custom amount' && !(Number(customAmount) > 0)) {
        setError('Please enter a valid custom sponsorship budget amount.');
        return;
      }

      onComplete({
        companyName: companyName.trim(),
        website: companyWebsite.trim(),
        industry,
        description: companyDesc.trim(),
        logo: companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
        budgetRange,
        budgetAmount: budgetAmountFromRange(budgetRange, customAmount),
        supportedEventTypes,
        contactEmail: sponsorContactEmail.trim() || currentUser?.email,
      });
      return;
    }

    if (normalizedRole === 'venue') {
      if (!venueName.trim()) {
        setError('Please enter the venue name.');
        return;
      }
      if (!venueAddress.trim()) {
        setError('Please provide the physical venue address.');
        return;
      }
      if (!venueCapacity || Number(venueCapacity) <= 0) {
        setError('Please provide a valid attendee capacity.');
        return;
      }

      onComplete({
        venueName: venueName.trim(),
        name: venueName.trim(),
        vibe: venueType,
        venueType,
        address: venueAddress.trim(),
        location: venueAddress.trim(),
        city: venueCity.trim(),
        capacity: Number(venueCapacity) || 300,
        pricePerHour: Number(venuePrice) || 150,
        description: venueDesc.trim(),
        facilities: venueFacilities,
        amenities: venueFacilities,
        images: venueImages,
        image: venueImages[0] || '',
        contactPhone: venueContactPhone.trim(),
        available: true,
      });
      return;
    }

    if (normalizedRole === 'organizer') {
      if (!orgName.trim()) {
        setError('Please enter your organization or community name.');
        return;
      }

      if (communityAction === 'create' && !commName.trim()) {
        setError('Please specify a community name or choose to skip for now.');
        return;
      }

      if (communityAction === 'join' && !commJoinCode.trim()) {
        setError('Please enter a valid community code (e.g. EH-AI2026).');
        return;
      }

      onComplete({
        organizationName: orgName.trim(),
        orgType,
        description: orgDesc.trim(),
        communityAction,
        communityName: commName.trim(),
        communityCat: commCat,
        communityDesc: commDesc.trim(),
        communityCode: communityAction === 'create' ? generatedCommCode : commJoinCode.trim(),
      });
      return;
    }

    if (normalizedRole === 'attendee') {
      onComplete({
        interests: attendeeInterests,
      });
      return;
    }

    onComplete({});
  };

  return (
    <div className="px-4 md:px-10 max-w-[760px] mx-auto py-8 animate-fadeIn text-left">
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-blue-900/10 space-y-6">
        {/* Dynamic Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0f4c81] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
              Activate {roleLabel} Role
            </span>
            <h1 className="font-geist text-2xl md:text-3xl font-extrabold text-[#00355f] mt-2">
              Set up your {roleLabel} profile
            </h1>
            <p className="font-inter text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              {normalizedRole === 'speaker' &&
                'Showcase your expertise, topics, and fee preferences to get invited to speak at events.'}
              {normalizedRole === 'sponsor' &&
                'Discover sponsorship opportunities, support high-impact events, and fund innovation.'}
              {normalizedRole === 'venue' &&
                'List your space, set your hourly rate, and make it available for verified event organizers.'}
              {normalizedRole === 'organizer' &&
                'Command center for curating events, issuing tickets, managing sponsors, and hosting communities.'}
              {normalizedRole === 'attendee' &&
                'Discover what’s happening around you, register for events, and join communities.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-gray-400 hover:text-black transition-colors px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer flex-shrink-0"
          >
            Cancel
          </button>
        </div>

        {/* Reused Existing Account Data Banner */}
        <div className="rounded-2xl bg-blue-50/70 border border-blue-100/90 p-4 text-xs text-[#00355f] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#0f4c81] text-[11px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>Existing Account Data Linked</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">
            We already have your core details. You only need to provide the additional information specific to becoming a{' '}
            <strong>{roleLabel}</strong>.
          </p>
          <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-gray-700">
            <span>
              <strong className="text-[#00355f]">Name:</strong> {currentUser?.name || 'User'}
            </span>
            <span>
              <strong className="text-[#00355f]">Email:</strong> {currentUser?.email}
            </span>
            {currentUser?.location && (
              <span>
                <strong className="text-[#00355f]">Location:</strong> {currentUser?.location}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ======================================================== */}
          {/* 1. SPEAKER ROLE SETUP FIELDS */}
          {/* ======================================================== */}
          {normalizedRole === 'speaker' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={speakerTitle}
                    onChange={(e) => setSpeakerTitle(e.target.value)}
                    placeholder="e.g. Principal AI Researcher & Keynote Speaker"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Organization / Affiliation
                  </label>
                  <input
                    type="text"
                    value={speakerOrg}
                    onChange={(e) => setSpeakerOrg(e.target.value)}
                    placeholder="e.g. Stanford AI Lab or Independent"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Short Biography *
                </label>
                <textarea
                  required
                  rows={3}
                  value={speakerBio}
                  onChange={(e) => setSpeakerBio(e.target.value)}
                  placeholder="Summarize your background, speaking experience, and domain expertise..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white resize-none"
                />
              </div>

              {/* Topics & Domains */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Speaking Topics & Domains *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SPEAKER_TOPIC_SUGGESTIONS.map((topic) => {
                    const isSelected = speakerTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleToggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81] shadow-2xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? `✓ ${topic}` : `+ ${topic}`}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={speakerTopicInput}
                    onChange={(e) => setSpeakerTopicInput(e.target.value)}
                    placeholder="Add a custom topic (press enter or click Add)..."
                    className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTopic(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTopic}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Video upload from device */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Introduction / Keynote Demo Reel (Upload from Device)
                </label>
                {speakerVideoUrl ? (
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <div className="rounded-xl overflow-hidden bg-black max-h-48 flex items-center justify-center">
                      <video
                        src={speakerVideoUrl}
                        controls
                        className="w-full max-h-48 object-contain"
                      >
                        Your browser does not support HTML5 video.
                      </video>
                    </div>
                    <div className="flex items-center justify-between text-xs px-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-emerald-600 text-base">
                          check_circle
                        </span>
                        <span className="font-semibold text-gray-800 truncate">
                          {speakerVideoFileName || 'Video File Ready'}
                        </span>
                        {speakerVideoFileSize && (
                          <span className="text-gray-400 text-[11px]">
                            ({speakerVideoFileSize})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <label className="text-[11px] font-bold text-[#0f4c81] hover:underline cursor-pointer">
                          Change
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                            onChange={handleSpeakerVideoUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSpeakerVideoUrl('');
                            setSpeakerVideoFileName('');
                            setSpeakerVideoFileSize('');
                          }}
                          className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-[#0f4c81] bg-white/60 hover:bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#0f4c81] transition-colors mb-1">
                      video_file
                    </span>
                    <span className="text-xs font-bold text-[#00355f] group-hover:text-[#0f4c81]">
                      Select keynote video demo from device
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5">
                      MP4, WebM, or MOV format (sample keynote or introduction)
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                      onChange={handleSpeakerVideoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Pricing & Fee */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Do you charge a speaking fee?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'free', label: 'No — Free / Pro-bono' },
                    { id: 'fee', label: 'Yes — Fixed fee' },
                    { id: 'depends', label: 'Depends on event' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSpeakerFeeType(opt.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        speakerFeeType === opt.id
                          ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {speakerFeeType !== 'free' && (
                  <div className="flex gap-2 pt-1 animate-fadeIn">
                    <select
                      value={speakerFeeCurrency}
                      onChange={(e) => setSpeakerFeeCurrency(e.target.value)}
                      className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#00355f]"
                    >
                      <option value="€">EUR (€)</option>
                      <option value="$">USD ($)</option>
                      <option value="£">GBP (£)</option>
                      <option value="₹">INR (₹)</option>
                    </select>
                    <input
                      type="number"
                      value={speakerFeeAmount}
                      onChange={(e) => setSpeakerFeeAmount(e.target.value)}
                      placeholder="Approximate fee amount (e.g. 2000)"
                      className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. SPONSOR ROLE SETUP FIELDS */}
          {/* ======================================================== */}
          {normalizedRole === 'sponsor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. TechNova Solutions"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Company Website
                  </label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://technova.io"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#00355f]"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Sponsorship Contact Email
                  </label>
                  <input
                    type="email"
                    value={sponsorContactEmail}
                    onChange={(e) => setSponsorContactEmail(e.target.value)}
                    placeholder="sponsorships@technova.io"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Company Description & Objectives
                </label>
                <textarea
                  rows={3}
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                  placeholder="Describe your company and the types of initiatives you are looking to support..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white resize-none"
                />
              </div>

              {/* Budget options */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Approximate Sponsorship Budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setBudgetRange(range)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        budgetRange === range
                          ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                {budgetRange === 'Custom amount' && (
                  <div className="pt-2 animate-fadeIn">
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter custom budget in € (e.g. 15000)"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                    />
                  </div>
                )}
              </div>

              {/* Event types */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Event Categories Interested in Supporting
                </label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SPONSOR_EVENT_TYPES.map((type) => {
                    const isSelected = supportedEventTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleToggleSponsorType(type)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81] shadow-2xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? `✓ ${type}` : `+ ${type}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. VENUE PROVIDER ROLE SETUP FIELDS */}
          {/* ======================================================== */}
          {normalizedRole === 'venue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Sir Mutha Concert Hall"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Venue Type
                  </label>
                  <select
                    value={venueType}
                    onChange={(e) => setVenueType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#00355f]"
                  >
                    {VENUE_TYPES.map((vt) => (
                      <option key={vt} value={vt}>
                        {vt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Address / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g. 12 Cathedral Road, Chennai"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    City
                  </label>
                  <input
                    type="text"
                    value={venueCity}
                    onChange={(e) => setVenueCity(e.target.value)}
                    placeholder="Chennai"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Attendee Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    value={venueCapacity}
                    onChange={(e) => setVenueCapacity(e.target.value)}
                    placeholder="350"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Hourly Booking Rate (€ / hr) *
                  </label>
                  <input
                    type="number"
                    required
                    value={venuePrice}
                    onChange={(e) => setVenuePrice(e.target.value)}
                    placeholder="150"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Venue Description
                </label>
                <textarea
                  rows={3}
                  value={venueDesc}
                  onChange={(e) => setVenueDesc(e.target.value)}
                  placeholder="Describe your acoustics, seating layout, parking, and stage capabilities..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter resize-none"
                />
              </div>

              {/* Venue Images with device upload & mandatory notice */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Venue Images (Upload from Device)
                  </label>
                  {venueImages.length > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      ✓ {venueImages.length} photo{venueImages.length > 1 ? 's' : ''} uploaded
                    </span>
                  )}
                </div>

                <label className="border-2 border-dashed border-gray-300 hover:border-[#0f4c81] bg-white/60 hover:bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
                  <span className="material-symbols-outlined text-2xl text-gray-400 group-hover:text-[#0f4c81] transition-colors mb-1">
                    add_photo_alternate
                  </span>
                  <span className="text-xs font-bold text-[#00355f] group-hover:text-[#0f4c81]">
                    Click or drag venue photos from your device
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5">
                    JPG, PNG, WebP supported (select single or multiple files)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleVenueImageUpload}
                    className="hidden"
                  />
                </label>

                {/* MANDATORY NOTICE IF NO IMAGE UPLOADED */}
                {venueImages.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-[11px] font-medium leading-relaxed">
                    ⚠️ <strong>No venue images uploaded.</strong> The notice:{' '}
                    <em>
                      "No venue images available. Organizers may need to arrange an in-person viewing
                      before booking."
                    </em>{' '}
                    will be shown on your public listing.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {venueImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-16 rounded-xl overflow-hidden border border-gray-200 group shadow-xs"
                      >
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setVenueImages(venueImages.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors shadow-xs cursor-pointer"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Facilities / Amenities */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Facilities & Amenities
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_VENUE_FACILITIES.map((fac) => {
                    const isSelected = venueFacilities.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => handleToggleFacility(fac)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? `✓ ${fac}` : `+ ${fac}`}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newFacilityInput}
                    onChange={(e) => setNewFacilityInput(e.target.value)}
                    placeholder="Add custom facility (e.g. Green Room Backstage)..."
                    className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomFacility(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFacility}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. ORGANIZER ROLE SETUP FIELDS */}
          {/* ======================================================== */}
          {normalizedRole === 'organizer' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Organization / Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. TechPulse Community or Event Horizon Team"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Organization Type
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#00355f]"
                  >
                    <option value="Tech Community / Meetup">Tech Community / Meetup</option>
                    <option value="Corporate / Enterprise">Corporate / Enterprise</option>
                    <option value="University / Student Club">University / Student Club</option>
                    <option value="Independent Host">Independent Host</option>
                    <option value="Non-profit / NGO">Non-profit / NGO</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Organizer Description & Bio
                </label>
                <textarea
                  rows={2}
                  value={orgDesc}
                  onChange={(e) => setOrgDesc(e.target.value)}
                  placeholder="What experiences do you curate? What is your event mission?"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter resize-none"
                />
              </div>

              {/* Community Setup Choice */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div>
                  <h3 className="font-geist font-bold text-xs uppercase tracking-wider text-[#00355f]">
                    Community Space Setup
                  </h3>
                  <p className="font-inter text-xs text-gray-500 mt-0.5">
                    Communities allow you to engage followers, coordinate team staff, and organize repeated events.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'create', icon: 'add_circle', label: 'Create Community' },
                    { id: 'join', icon: 'key', label: 'Join with Code' },
                    { id: 'skip', icon: 'arrow_forward', label: 'Skip for Now' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCommunityAction(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        communityAction === opt.id
                          ? 'border-[#0f4c81] bg-blue-50/80 text-[#00355f] font-bold ring-2 ring-blue-500/20'
                          : 'border-gray-200 bg-gray-50/80 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                      <span className="text-[11px] font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {communityAction === 'create' && (
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                        Community Name *
                      </label>
                      <input
                        type="text"
                        value={commName}
                        onChange={(e) => setCommName(e.target.value)}
                        placeholder="e.g. AI Engineers Collective"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-inter"
                      />
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-blue-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                          Auto-generated Join Code
                        </span>
                        <span className="font-mono text-sm font-extrabold text-[#00355f]">
                          {generatedCommCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500">Share with members</span>
                    </div>
                  </div>
                )}

                {communityAction === 'join' && (
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2 animate-fadeIn">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                      Enter Community Code *
                    </label>
                    <input
                      type="text"
                      value={commJoinCode}
                      onChange={(e) => setCommJoinCode(e.target.value)}
                      placeholder="e.g. EH-AI2026"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#00355f]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. ATTENDEE ROLE SETUP FIELDS */}
          {/* ======================================================== */}
          {normalizedRole === 'attendee' && (
            <div className="space-y-4">
              <p className="font-inter text-xs text-gray-600 leading-relaxed">
                As an Attendee, your account is configured to explore live events, reserve tickets,
                participate in discussions, and join communities.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                  Event Categories You Like
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ATTENDEE_INTERESTS.map((interest) => {
                    const isSelected = attendeeInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleToggleAttendeeInterest(interest)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#00355f] to-[#0f4c81] hover:from-[#002747] hover:to-[#083a65] text-white rounded-2xl font-geist font-bold text-sm sm:text-base shadow-xl shadow-blue-900/15 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
            >
              <span>Complete {roleLabel} Setup & Activate Role →</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
