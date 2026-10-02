import React, { useState } from 'react';

const ROLES = [
  {
    id: 'attendee',
    icon: '🎟',
    title: 'Attendee',
    description: 'Discover and participate in events.',
    accent: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'speaker',
    icon: '🎤',
    title: 'Speaker',
    description: 'Showcase your expertise and get invited to speak at events.',
    accent: 'from-purple-500 to-violet-600',
  },
  {
    id: 'sponsor',
    icon: '💼',
    title: 'Sponsor',
    description: 'Discover sponsorship opportunities and support events.',
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'venue',
    icon: '📍',
    title: 'Venue Provider',
    description: 'List your venue and make it available for event organizers.',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    id: 'organizer',
    icon: '🎯',
    title: 'Organizer',
    description: 'Create and manage events and communities.',
    accent: 'from-cyan-500 to-blue-600',
  },
];

export const SignupView = ({ navigate, onSignupSuccess, communities = [] }) => {
  const [step, setStep] = useState(1); // 1 = Role Selection, 2 = Role-specific Form, 3 = Organizer Community Setup
  const [selectedRole, setSelectedRole] = useState('attendee');
  const [error, setError] = useState('');

  // Common General Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('Chennai');
  const [demographics, setDemographics] = useState('Young Professional (22-30)');

  // Attendee Specific
  const [attendeeBio, setAttendeeBio] = useState('');
  const [attendeeInterests, setAttendeeInterests] = useState(['Technology', 'Design']);

  // Organizer Specific
  const [organizationName, setOrganizationName] = useState('');
  const [orgType, setOrgType] = useState('Company / Enterprise');
  // Community Setup Step (for organizer)
  const [communityChoice, setCommunityChoice] = useState('create'); // 'create' | 'join' | 'skip'
  const [commName, setCommName] = useState('');
  const [commDesc, setCommDesc] = useState('');
  const [commCat, setCommCat] = useState('Technology & AI');
  const [commJoinCode, setCommJoinCode] = useState('');
  const [generatedCommCode, setGeneratedCommCode] = useState('');

  // Speaker Specific
  const [speakerTitle, setSpeakerTitle] = useState('');
  const [speakerOrg, setSpeakerOrg] = useState('');
  const [speakerTopics, setSpeakerTopics] = useState(['Artificial Intelligence', 'System Architecture']);
  const [topicInput, setTopicInput] = useState('');
  const [yearsExp, setYearsExp] = useState('5');
  const [speakerBio, setSpeakerBio] = useState('');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [introVideoFileName, setIntroVideoFileName] = useState('');
  const [introVideoFileSize, setIntroVideoFileSize] = useState('');
  const [chargeForSpeaking, setChargeForSpeaking] = useState('fee'); // 'free' | 'fee' | 'depends'
  const [speakingFee, setSpeakingFee] = useState('2000');
  const [feeCurrency, setFeeCurrency] = useState('€');

  const handleSignupVideoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setIntroVideoUrl(objectUrl);
    setIntroVideoFileName(file.name);
    setIntroVideoFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

    if (file.size <= 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setIntroVideoUrl(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sponsor Specific
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [companyDesc, setCompanyDesc] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [sponsorBudgetRange, setSponsorBudgetRange] = useState('€1,000–€5,000');
  const [supportedEventTypes, setSupportedEventTypes] = useState(['Technology', 'Startup']);

  // Venue Provider Specific
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('300');
  const [venueType, setVenueType] = useState('Auditorium');
  const [venueFacilities, setVenueFacilities] = useState('A/V Sound, High-speed Wi-Fi, Stage, VIP Lounge');
  const [venueDesc, setVenueDesc] = useState('');
  const [venuePricing, setVenuePricing] = useState('150');
  const [venueImages, setVenueImages] = useState([]);

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

  const toggleInterest = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !speakerTopics.includes(topicInput.trim())) {
      setSpeakerTopics([...speakerTopics, topicInput.trim()]);
      setTopicInput('');
    }
  };



  const handleInitialFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check duplicate email
    const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');
    const defaultEmails = ['john.doe@example.com', 'attendee@assemble.dev', 'organizer@assemble.dev', 'speaker@assemble.dev', 'sponsor@assemble.dev', 'venue@assemble.dev'];
    const emailExists = defaultEmails.includes(email.toLowerCase()) || localUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      setError('An account with this email already exists. Please log in instead.');
      return;
    }

    // If Organizer, advance to Community Setup step
    if (selectedRole === 'organizer') {
      const code = `EH-${Math.random().toString(36).substring(2, 6).toUpperCase()}${new Date().getFullYear()}`;
      setGeneratedCommCode(code);
      setStep(3);
      return;
    }

    // Finalize signup for other roles
    finalizeSignup();
  };

  const finalizeSignup = (createdCommunity = null) => {
    const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');

    const newUser = {
      name: fullName,
      email: email,
      phone: phone,
      password: password,
      role: selectedRole,
      location: location,
      demographics: demographics,
      communities: createdCommunity ? [createdCommunity.name] : [],
      capabilities: [selectedRole, 'attendee'],
    };

    // Role-specific payload packing
    if (selectedRole === 'speaker') {
      newUser.speakerProfile = {
        title: speakerTitle || 'Keynote Speaker',
        organization: speakerOrg || 'Independent',
        topics: speakerTopics,
        yearsExperience: yearsExp,
        bio: speakerBio,
        videoUrl: introVideoUrl,
        videoFileName: introVideoFileName,
        videoFileSize: introVideoFileSize,
        feeType: chargeForSpeaking,
        feeAmount: speakingFee,
        currency: feeCurrency,
        availability: 'Available for Bookings',
      };

      // Add to global speakers list
      const currentSpeakers = JSON.parse(localStorage.getItem('assemble_speakers') || '[]');
      currentSpeakers.unshift({
        id: `spk-${Date.now()}`,
        name: fullName,
        email: email,
        designation: speakerTitle || 'Keynote Speaker',
        company: speakerOrg || 'Independent',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        expertise: speakerTopics,
        bio: speakerBio,
        fee: chargeForSpeaking === 'free' ? 'Free / Pro-bono' : `${feeCurrency}${speakingFee} / event`,
        videoUrl: introVideoUrl,
        videoFileName: introVideoFileName,
        location: location,
      });
      localStorage.setItem('assemble_speakers', JSON.stringify(currentSpeakers));
    } else if (selectedRole === 'sponsor') {
      newUser.sponsorProfile = {
        companyName,
        website: companyWebsite,
        industry,
        description: companyDesc,
        logo: companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150',
        budgetRange: sponsorBudgetRange,
        budgetAmount: sponsorBudgetRange.includes('10,000') ? 25000 : 5000,
        supportedEventTypes,
      };
    } else if (selectedRole === 'venue') {
      newUser.venueProfile = {
        venueName,
        address: venueAddress,
        capacity: Number(venueCapacity) || 300,
        type: venueType,
        facilities: venueFacilities.split(',').map((f) => f.trim()),
        description: venueDesc,
        pricePerHour: Number(venuePricing) || 150,
        images: venueImages,
      };

      // Add to global venues list
      const currentVenues = JSON.parse(localStorage.getItem('assemble_venues') || '[]');
      currentVenues.unshift({
        id: `ven-${Date.now()}`,
        name: venueName,
        city: location,
        location: venueAddress,
        capacity: Number(venueCapacity) || 300,
        vibe: venueType,
        pricePerHour: Number(venuePricing) || 150,
        description: venueDesc,
        amenities: venueFacilities.split(',').map((f) => f.trim()),
        image: venueImages[0] || '',
        images: venueImages,
        providerEmail: email,
        providerName: fullName,
        rating: 5.0,
        reviews: 1,
      });
      localStorage.setItem('assemble_venues', JSON.stringify(currentVenues));
    } else if (selectedRole === 'organizer') {
      newUser.organizerProfile = {
        organizationName,
        orgType,
      };
    }

    localUsers.push(newUser);
    localStorage.setItem('assemble_users', JSON.stringify(localUsers));

    // Sign in user session
    onSignupSuccess(newUser);
    alert(`Account created successfully as ${selectedRole.toUpperCase()}! Welcome to Event Horizon.`);
    navigate('/dashboard');
  };

  const handleOrganizerCommunitySubmit = (e) => {
    e.preventDefault();
    if (communityChoice === 'create') {
      if (!commName.trim()) {
        setError('Please enter a community name.');
        return;
      }
      const newCom = {
        name: commName,
        description: commDesc || 'A dedicated community room on Event Horizon.',
        logoUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=200',
        basicInfo: commCat,
        code: generatedCommCode || 'EH-AI2026',
        members: 1,
      };

      const allComs = JSON.parse(localStorage.getItem('assemble_communities') || '[]');
      allComs.push(newCom);
      localStorage.setItem('assemble_communities', JSON.stringify(allComs));

      finalizeSignup(newCom);
    } else if (communityChoice === 'join') {
      const allComs = JSON.parse(localStorage.getItem('assemble_communities') || '[]');
      const matched = allComs.find((c) => c.code?.toUpperCase() === commJoinCode.trim().toUpperCase());
      finalizeSignup(matched || null);
    } else {
      finalizeSignup(null);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12 animate-fadeIn text-left">
      <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-6 sm:p-10 max-w-2xl w-full shadow-2xl shadow-blue-900/10 space-y-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-[#edeeef] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold font-geist">E</span>
            <span className="font-geist text-xl font-bold text-[#00355f]">Event Horizon</span>
          </div>
          <span className="text-xs font-semibold text-gray-400">Step {step} of {selectedRole === 'organizer' ? '3' : '2'}</span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* STEP 1: Role Selection Cards */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="font-geist text-2xl sm:text-3xl font-extrabold text-[#00355f]">
                How do you want to use Event Horizon?
              </h2>
              <p className="font-inter text-xs text-gray-500">
                Select your primary role. You will still have full access to explore, attend, and participate across the entire platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                      isSelected
                        ? 'border-[#0f4c81] bg-gradient-to-br from-blue-50/90 to-indigo-50/90 shadow-md ring-2 ring-[#0f4c81]/30'
                        : 'border-gray-200 bg-white/70 hover:border-gray-300 hover:bg-gray-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{r.icon}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#0f4c81] bg-[#0f4c81] text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <span className="material-symbols-outlined text-xs">check</span>}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-geist font-bold text-base text-[#00355f] group-hover:text-[#0f4c81] transition-colors">
                        {r.title}
                      </h3>
                      <p className="font-inter text-xs text-gray-500 leading-relaxed mt-0.5">
                        {r.description}
                      </p>
                    </div>

                    {/* Explicit Select button on each role card */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRole(r.id);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-[#0f4c81] text-white shadow-blue-900/10'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <span className="material-symbols-outlined text-xs">check</span>
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Select</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRole(r.id);
                          setStep(2);
                        }}
                        className="text-xs font-bold text-[#0f4c81] hover:text-[#00355f] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Continue →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Primary Action Button: Continue → Role-specific Sign Up */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#00355f] to-[#0f4c81] hover:from-[#002747] hover:to-[#083a65] text-white rounded-2xl font-geist font-bold text-sm sm:text-base shadow-xl shadow-blue-900/15 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
              >
                <span>Continue → Role-specific Sign Up ({ROLES.find((r) => r.id === selectedRole)?.title || 'Attendee'})</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Role-Specific Sign Up Form */}
        {step === 2 && (
          <form onSubmit={handleInitialFormSubmit} className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4c81]">
                  Role: {ROLES.find((r) => r.id === selectedRole)?.title}
                </span>
                <h2 className="font-geist text-xl font-bold text-[#00355f]">
                  Complete Your {ROLES.find((r) => r.id === selectedRole)?.title} Registration
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <span>← Change Role</span>
              </button>
            </div>

            {/* General Info (Collected for all roles) */}
            <div className="space-y-4">
              <h3 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">
                1. General Account Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Location / City</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#00355f]"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="New York">New York</option>
                    <option value="London">London</option>
                    <option value="Tokyo">Tokyo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* ROLE-SPECIFIC FIELDS */}

            {/* ATTENDEE FIELDS */}
            {selectedRole === 'attendee' && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Attendee Preferences (Optional)
                </h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Interests & Topics</label>
                  <div className="flex flex-wrap gap-2">
                    {['Technology', 'Design', 'Culinary', 'Music', 'Gaming', 'Business', 'Startup'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item, attendeeInterests, setAttendeeInterests)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          attendeeInterests.includes(item)
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ORGANIZER FIELDS */}
            {selectedRole === 'organizer' && (
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Organization & Entity Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Organization / Company Name</label>
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="e.g. Design Scale India"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Organization Type</label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Company / Enterprise">Company / Enterprise</option>
                      <option value="Independent Community">Independent Community</option>
                      <option value="Non-Profit / NGO">Non-Profit / NGO</option>
                      <option value="Educational Institution">Educational Institution</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* SPEAKER FIELDS */}
            {selectedRole === 'speaker' && (
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <h3 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Speaker Profile & Topic Specialization
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Professional Title</label>
                    <input
                      type="text"
                      required
                      value={speakerTitle}
                      onChange={(e) => setSpeakerTitle(e.target.value)}
                      placeholder="e.g. Principal UX Architect"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Organization / Affiliation</label>
                    <input
                      type="text"
                      required
                      value={speakerOrg}
                      onChange={(e) => setSpeakerOrg(e.target.value)}
                      placeholder="e.g. Google / Atlassian"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Speaking Topics (Allow multiple)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="Add topic (e.g. Distributed Systems)"
                      className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTopic}
                      className="px-4 py-2 bg-[#0f4c81] text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {speakerTopics.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-blue-50 text-[#00355f] rounded-lg text-[11px] font-bold border border-blue-100">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Short Biography</label>
                  <textarea
                    required
                    rows={2}
                    value={speakerBio}
                    onChange={(e) => setSpeakerBio(e.target.value)}
                    placeholder="Provide a brief overview of your background, industry experience, and keynote focus..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">
                    Introduction / Demo Reel Video (Upload from Device)
                  </label>
                  {introVideoUrl ? (
                    <div className="p-3 bg-white/90 rounded-2xl border border-gray-200 space-y-2">
                      <div className="rounded-xl overflow-hidden bg-black max-h-44 flex items-center justify-center">
                        <video
                          src={introVideoUrl}
                          controls
                          className="w-full max-h-44 object-contain"
                        >
                          Your browser does not support HTML5 video.
                        </video>
                      </div>
                      <div className="flex items-center justify-between text-xs px-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                          <span className="font-semibold text-gray-800 truncate">{introVideoFileName || 'Video File Ready'}</span>
                          {introVideoFileSize && <span className="text-gray-400 text-[11px]">({introVideoFileSize})</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <label className="text-[11px] font-bold text-[#0f4c81] hover:underline cursor-pointer">
                            Change
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                              onChange={handleSignupVideoUpload}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setIntroVideoUrl('');
                              setIntroVideoFileName('');
                              setIntroVideoFileSize('');
                            }}
                            className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-300 hover:border-[#0f4c81] bg-white/60 hover:bg-blue-50/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
                      <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-[#0f4c81] transition-colors mb-1">
                        video_file
                      </span>
                      <span className="text-xs font-bold text-[#00355f] group-hover:text-[#0f4c81]">
                        Select video demo from your device
                      </span>
                      <span className="text-[11px] text-gray-500 mt-0.5">
                        MP4, WebM, or MOV format (sample keynote or introduction)
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                        onChange={handleSignupVideoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Do you charge for speaking?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'free', label: 'No — I speak for free' },
                      { id: 'fee', label: 'Yes — I charge a fee' },
                      { id: 'depends', label: 'Depends on the event' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setChargeForSpeaking(opt.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          chargeForSpeaking === opt.id
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {chargeForSpeaking !== 'free' && (
                    <div className="flex gap-2 pt-2">
                      <select
                        value={feeCurrency}
                        onChange={(e) => setFeeCurrency(e.target.value)}
                        className="w-20 px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xs"
                      >
                        <option value="€">€ (EUR)</option>
                        <option value="$">$ (USD)</option>
                        <option value="₹">₹ (INR)</option>
                        <option value="£">£ (GBP)</option>
                      </select>
                      <input
                        type="number"
                        value={speakingFee}
                        onChange={(e) => setSpeakingFee(e.target.value)}
                        placeholder="Approximate fee amount"
                        className="flex-grow px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SPONSOR FIELDS */}
            {selectedRole === 'sponsor' && (
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <h3 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Company Information & Sponsorship Scope
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. TechNova Solutions"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Company Website</label>
                    <input
                      type="url"
                      required
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://technova.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Technology & Software">Technology & Software</option>
                    <option value="Fintech & Banking">Fintech & Banking</option>
                    <option value="Marketing & Design">Marketing & Design</option>
                    <option value="Clean Energy & Infrastructure">Clean Energy & Infrastructure</option>
                    <option value="Healthcare & BioTech">Healthcare & BioTech</option>
                    <option value="Education & EdTech">Education & EdTech</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Company Description</label>
                  <textarea
                    rows={2}
                    value={companyDesc}
                    onChange={(e) => setCompanyDesc(e.target.value)}
                    placeholder="Briefly describe what your company does and your sponsorship goals..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Approximate Sponsorship Budget</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Under €500', '€500–€1,000', '€1,000–€5,000', '€5,000–€10,000', '€10,000+', 'Custom amount'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setSponsorBudgetRange(range)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          sponsorBudgetRange === range
                            ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Event Types Interested in Supporting (Multiple)</label>
                  <div className="flex flex-wrap gap-2">
                    {['Technology', 'Business', 'Education', 'Community', 'Sports', 'Startup', 'Entertainment', 'Other'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleInterest(t, supportedEventTypes, setSupportedEventTypes)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          supportedEventTypes.includes(t)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VENUE PROVIDER FIELDS */}
            {selectedRole === 'venue' && (
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <h3 className="font-geist text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Venue Space Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Venue Name</label>
                    <input
                      type="text"
                      required
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Sir Mutha Concert Hall"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Venue Type</label>
                    <select
                      value={venueType}
                      onChange={(e) => setVenueType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Auditorium">Auditorium</option>
                      <option value="Conference Loft">Conference Loft</option>
                      <option value="Modern Industrial">Modern Industrial</option>
                      <option value="Open Air / Amphitheater">Open Air / Amphitheater</option>
                      <option value="Executive Boardroom">Executive Boardroom</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Full Address</label>
                  <input
                    type="text"
                    required
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="e.g. 7 Lady McNichols Rd, Chetpet"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Guest Capacity</label>
                    <input
                      type="number"
                      required
                      value={venueCapacity}
                      onChange={(e) => setVenueCapacity(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Rate ($ / Hour)</label>
                    <input
                      type="number"
                      required
                      value={venuePricing}
                      onChange={(e) => setVenuePricing(e.target.value)}
                      placeholder="e.g. 180"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

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
                      ⚠️ <strong>No venue images uploaded.</strong> The notice: <em>"No venue images available. Organizers may need to arrange an in-person viewing before booking."</em> will be shown on your public listing.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {venueImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-16 rounded-xl overflow-hidden border border-gray-200 group shadow-xs">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setVenueImages(venueImages.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors shadow-xs"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Facilities / Amenities</label>
                  <input
                    type="text"
                    value={venueFacilities}
                    onChange={(e) => setVenueFacilities(e.target.value)}
                    placeholder="e.g. Acoustic Stage, VIP Green Room, Valet Parking"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#00355f] to-[#0f4c81] hover:from-[#002747] hover:to-[#083a65] text-white rounded-2xl font-geist font-bold text-sm shadow-xl shadow-blue-900/15 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
            >
              <span>
                {selectedRole === 'organizer'
                  ? 'Continue to Organizer Community Setup →'
                  : `Complete ${ROLES.find((r) => r.id === selectedRole)?.title || ''} Sign Up →`}
              </span>
            </button>
          </form>
        )}

        {/* STEP 3: Organizer Community Setup */}
        {step === 3 && (
          <form onSubmit={handleOrganizerCommunitySubmit} className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4c81]">Community Onboarding</span>
              <h2 className="font-geist text-xl font-bold text-[#00355f] mt-0.5">
                Are you creating or joining a community?
              </h2>
              <p className="font-inter text-xs text-gray-500 mt-1">
                Communities allow organizers to build a sustained follower base and private rooms for events.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'create', icon: 'add_circle', label: 'Create a Community' },
                { id: 'join', icon: 'key', label: 'Join with Code' },
                { id: 'skip', icon: 'arrow_forward', label: 'Skip for Now' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCommunityChoice(opt.id)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    communityChoice === opt.id
                      ? 'bg-[#0f4c81] text-white border-[#0f4c81] shadow-xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              ))}
            </div>

            {communityChoice === 'create' && (
              <div className="p-5 bg-blue-50/60 rounded-3xl border border-blue-100 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Community Name</label>
                  <input
                    type="text"
                    required
                    value={commName}
                    onChange={(e) => setCommName(e.target.value)}
                    placeholder="e.g. AI Founders Guild"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c2c7d1] rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Category</label>
                  <select
                    value={commCat}
                    onChange={(e) => setCommCat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c2c7d1] rounded-xl text-xs font-semibold"
                  >
                    <option value="Technology & AI">Technology & AI</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Culinary & Dining">Culinary & Dining</option>
                    <option value="Startups & Founders">Startups & Founders</option>
                    <option value="Creative Arts">Creative Arts</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Description</label>
                  <textarea
                    rows={2}
                    value={commDesc}
                    onChange={(e) => setCommDesc(e.target.value)}
                    placeholder="What is this community about? Who is it for?"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#c2c7d1] rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Your Community Code</span>
                    <span className="font-mono text-base font-extrabold text-[#00355f]">{generatedCommCode}</span>
                  </div>
                  <span className="text-xs text-gray-500">Auto-generated for team invites</span>
                </div>
              </div>
            )}

            {communityChoice === 'join' && (
              <div className="p-5 bg-blue-50/60 rounded-3xl border border-blue-100 space-y-3">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Enter Community Code</label>
                <input
                  type="text"
                  required
                  value={commJoinCode}
                  onChange={(e) => setCommJoinCode(e.target.value)}
                  placeholder="e.g. EH-AI2026"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#c2c7d1] rounded-xl text-xs font-mono font-bold text-[#00355f]"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-5 border border-gray-200 text-gray-600 rounded-2xl font-bold text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-grow py-3.5 bg-gradient-to-r from-[#00355f] to-[#0f4c81] hover:from-[#002747] hover:to-[#083a65] text-white rounded-2xl font-geist font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Complete Organizer Sign Up & Go to Dashboard →
              </button>
            </div>
          </form>
        )}

        {/* Footer Login Link */}
        <div className="text-center pt-2 border-t border-[#edeeef]">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-[#0f4c81] hover:underline cursor-pointer"
          >
            Already have an account? Log In
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignupView;
