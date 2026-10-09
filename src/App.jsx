import React, { useState, useEffect } from 'react';
import { INITIAL_EVENTS, INITIAL_TICKETS, INITIAL_COMMUNITIES, INITIAL_VENUES, INITIAL_SPEAKERS } from './data/initialData';
import { CommunityRoomView } from './components/views/CommunityRoomView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { DiscoverView } from './components/views/DiscoverView';
import { EventDetailsView } from './components/views/EventDetailsView';
import { CommunityAnalysisView } from './components/views/CommunityAnalysisView';
import { CreateEventView } from './components/views/CreateEventView';
import { OrganizerDashboardView } from './components/views/OrganizerDashboardView';
import { AttendeeDashboardView } from './components/views/AttendeeDashboardView';
import { SpeakerDashboardView } from './components/views/SpeakerDashboardView';
import { SponsorDashboardView } from './components/views/SponsorDashboardView';
import { VenueProviderDashboardView } from './components/views/VenueProviderDashboardView';
import { VenueMarketplaceView } from './components/views/VenueMarketplaceView';
import { SpeakerMarketplaceView } from './components/views/SpeakerMarketplaceView';
import { HowItWorksView } from './components/views/HowItWorksView';
import { AboutView } from './components/views/AboutView';
import { TicketModal } from './components/modals/TicketModal';
import { LoginView } from './components/views/LoginView';
import { SignupView } from './components/views/SignupView';
import { ProfileView } from './components/views/ProfileView';
import { BecomeSponsorView } from './components/views/BecomeSponsorView';
import { RoleSetupPendingView } from './components/views/RoleSetupPendingView';
import { RoleSetupView } from './components/views/RoleSetupView';
import { getUserCapabilities, persistUserRecord, userHasRoleSetup } from './utils/roles';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('assemble_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem('assemble_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.role || 'attendee';
      } catch (e) {
        return 'attendee';
      }
    }
    return 'attendee';
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [communities, setCommunities] = useState(() => {
    const saved = localStorage.getItem('assemble_communities');
    if (!saved) return INITIAL_COMMUNITIES;
    try {
      const parsed = JSON.parse(saved);
      const merged = INITIAL_COMMUNITIES.map((initCom) => {
        const existing = parsed.find((p) => p.id === initCom.id || p.name === initCom.name);
        return existing
          ? {
              ...initCom,
              ...existing,
              pastEvents: initCom.pastEvents || existing.pastEvents,
              sponsorshipHistory: initCom.sponsorshipHistory || existing.sponsorshipHistory,
            }
          : initCom;
      });
      parsed.forEach((p) => {
        if (!merged.some((m) => m.id === p.id || m.name === p.name)) {
          merged.push(p);
        }
      });
      return merged;
    } catch {
      return INITIAL_COMMUNITIES;
    }
  });
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [preSelectedCommunity, setPreSelectedCommunity] = useState(null);

  const [analyzedCommunity, setAnalyzedCommunity] = useState(() => {
    const saved = localStorage.getItem('assemble_analyzed_community');
    return saved ? JSON.parse(saved) : null;
  });
  const [analyzedEvent, setAnalyzedEvent] = useState(() => {
    const saved = localStorage.getItem('assemble_analyzed_event');
    return saved ? JSON.parse(saved) : null;
  });

  const handleAnalyzeCommunity = (community, event) => {
    setAnalyzedCommunity(community);
    setAnalyzedEvent(event);
    localStorage.setItem('assemble_analyzed_community', JSON.stringify(community));
    localStorage.setItem('assemble_analyzed_event', JSON.stringify(event));
    navigate('/community-analysis');
  };

  const [savedEventIds, setSavedEventIds] = useState(() => {
    const saved = localStorage.getItem('assemble_saved_events');
    return saved ? JSON.parse(saved) : [];
  });

  const handleToggleSaveEvent = (eventId) => {
    setSavedEventIds((prev) => {
      const updated = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      localStorage.setItem('assemble_saved_events', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreateCommunityRoom = (name, description, logoUrl, basicInfo) => {
    // Generate unique 8-character uppercase room code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure unique code
    while (communities.some(c => c.code === code)) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    const newCommunity = {
      name,
      description,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=200&auto=format&fit=crop',
      basicInfo: basicInfo || 'General Community',
      code,
      members: 1 // Creator is automatically a member
    };

    const updatedCommunities = [...communities, newCommunity];
    setCommunities(updatedCommunities);
    localStorage.setItem('assemble_communities', JSON.stringify(updatedCommunities));

    // Automatically join the current user to this community
    if (currentUser) {
      const userCommunities = currentUser.communities || [];
      if (!userCommunities.includes(name)) {
        const updatedUser = {
          ...currentUser,
          communities: [...userCommunities, name]
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('assemble_session', JSON.stringify(updatedUser));
        
        // Update user in localUsers list
        const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');
        const updatedLocal = localUsers.map(u => 
          u.email === currentUser.email ? { ...u, communities: updatedUser.communities } : u
        );
        localStorage.setItem('assemble_users', JSON.stringify(updatedLocal));
      }
    }

    return newCommunity;
  };

  const addUserToCommunity = (community) => {
    if (!currentUser) return;
    const userCommunities = currentUser.communities || [];
    if (userCommunities.includes(community.name)) return;
    const updatedUser = {
      ...currentUser,
      communities: [...userCommunities, community.name]
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('assemble_session', JSON.stringify(updatedUser));
    
    // Update in users database
    const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');
    const updatedUsers = localUsers.map(u => 
      u.email.toLowerCase() === currentUser.email.toLowerCase()
        ? { ...u, communities: updatedUser.communities }
        : u
    );
    localStorage.setItem('assemble_users', JSON.stringify(updatedUsers));
  };

  const handleJoinCommunity = (code) => {
    if (!currentUser) {
      return { success: false, message: 'Please sign in to join a community.' };
    }
    if (code.trim().toUpperCase() === 'EXPIRED') {
      return { success: false, message: 'This Community Code Is No Longer Active' };
    }
    const matched = communities.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (matched) {
      const userCommunities = currentUser.communities || [];
      if (userCommunities.includes(matched.name)) {
        return { success: true, message: 'You have already joined this community.' };
      }
      addUserToCommunity(matched);
      return { success: true, message: '✓ Community Joined Successfully' };
    }
    return { success: false, message: 'Invalid Community Code. Please check the code and try again.' };
  };

  // Main state collections
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('assemble_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('assemble_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [venues, setVenues] = useState(() => {
    const saved = localStorage.getItem('assemble_venues');
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });
  const [speakers, setSpeakers] = useState(() => {
    const saved = localStorage.getItem('assemble_speakers');
    return saved ? JSON.parse(saved) : INITIAL_SPEAKERS;
  });
  const [speakingInvites, setSpeakingInvites] = useState(() => {
    const saved = localStorage.getItem('assemble_speaking_invites');
    return saved ? JSON.parse(saved) : [
      {
        id: 'inv-demo-1',
        speakerName: 'Dr. Elena Rostova',
        speakerEmail: 'speaker@eventhorizon.dev',
        eventTitle: 'Design Systems Architecture Summit',
        message: 'We would love to invite you for a 45-minute keynote on scalable component tokens.',
        status: 'pending',
        date: '2026-10-10'
      }
    ];
  });
  const [venueBookings, setVenueBookings] = useState(() => {
    const saved = localStorage.getItem('assemble_venue_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 'bk-demo-1',
        venueId: 'ven-1',
        venueName: 'Sir Mutha Venkatasubba Rao Concert Hall',
        eventName: 'AI Frontier Summit 2026',
        date: '2026-11-20',
        durationHours: 8,
        expectedAttendees: 400,
        estimatedTotal: 1800,
        status: 'pending',
        organizerName: 'Design Scale India',
        organizerEmail: 'organizer@eventhorizon.dev'
      }
    ];
  });

  // Selected item states
  const [selectedEvent, setSelectedEvent] = useState(() => {
    const saved = localStorage.getItem('assemble_selected_event');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_EVENTS[0];
      }
    }
    return INITIAL_EVENTS[0];
  });
  const [viewedTicket, setViewedTicket] = useState(null);

  // Goodies E-commerce states
  const [goodiesCart, setGoodiesCart] = useState([]);
  const [goodiesOrders, setGoodiesOrders] = useState([
    {
      orderId: 'MERCH-81204',
      eventId: 'evt-1',
      eventTitle: 'AI & Web3 Synergy Summit',
      date: '2026-08-10',
      items: [
        {
          id: 'item-1',
          productName: 'Event T-Shirt',
          price: 299,
          quantity: 100,
          sizes: { S: 10, M: 30, L: 40, XL: 15, XXL: 5 },
          color: 'Black',
          designUrl: '',
          customText: 'AI Summit Chennai 2026',
          customizationCost: 500,
          deliveryCost: 200,
          totalCost: 30600
        }
      ],
      totalAmount: 30600,
      status: 'production', // 'submitted', 'confirmed', 'production', 'quality', 'shipped', 'delivered'
      deliveryDate: '2026-09-02'
    }
  ]);

  const handleAddGoodiesToCart = (item) => {
    setGoodiesCart([...goodiesCart, item]);
  };

  const handleRemoveGoodiesFromCart = (itemId) => {
    setGoodiesCart(goodiesCart.filter(item => item.id !== itemId));
  };

  const handlePlaceGoodiesOrder = (eventId, eventTitle, items, totalAmount) => {
    const newOrder = {
      orderId: `MERCH-${Math.floor(10000 + Math.random() * 90000)}`,
      eventId,
      eventTitle,
      date: new Date().toISOString().split('T')[0],
      items,
      totalAmount,
      status: 'submitted',
      deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setGoodiesOrders([newOrder, ...goodiesOrders]);
    setGoodiesCart([]);
    return newOrder;
  };

  // Sponsorship States
  const [sponsorshipCodes, setSponsorshipCodes] = useState({
    'TN2026-AI50': { sponsor: 'TechNova Solutions', amount: 50000, requirement: 'Venue', status: 'Active', code: 'TN2026-AI50' },
    'TN2026-75K': { sponsor: 'TechNova Solutions', amount: 75000, requirement: 'Venue', status: 'Active', code: 'TN2026-75K' },
    'BX2026-30K': { sponsor: 'BrandX Media', amount: 30000, requirement: 'Goodies', status: 'Active', code: 'BX2026-30K' },
    'GG2026-10K': { sponsor: 'GigaTech Energy', amount: 10000, requirement: 'Speakers', status: 'Active', code: 'GG2026-10K' }
  });

  const [sponsorshipRequests, setSponsorshipRequests] = useState([
    {
      requestId: 'REQ-1092',
      sponsorId: 'sp-1',
      sponsorName: 'TechNova Solutions',
      eventId: 'evt-1',
      eventTitle: 'Design Systems Architecture Summit',
      requirement: 'Venue',
      amount: 75000,
      status: 'Sponsorship Code Generated',
      code: 'TN2026-75K',
      date: '2026-08-12',
      appliedBy: 'Aravind Swaminathan',
      appliedByEmail: 'organizer@eventhorizon.dev'
    },
    {
      requestId: 'REQ-2201',
      sponsorId: 'sp-2',
      sponsorName: 'BrandX Media',
      eventId: 'evt-1',
      eventTitle: 'Design Systems Architecture Summit',
      requirement: 'Goodies',
      amount: 30000,
      status: 'Requested',
      code: '',
      date: '2026-08-13',
      appliedBy: 'Meera Sen',
      appliedByEmail: 'meera@eventhorizon.dev'
    }
  ]);

  const handleRequestSponsorship = (request) => {
    setSponsorshipRequests([request, ...sponsorshipRequests]);
  };

  const handleSimulateSponsorApprove = (requestId) => {
    const req = sponsorshipRequests.find(r => r.requestId === requestId || r.id === requestId);
    if (!req) return;

    const sponsorAbbr = (req.sponsorName || 'TN').split(' ')[0].substring(0, 2).toUpperCase();
    const amountVal = req.amount >= 1000 ? `${Math.round(req.amount / 1000)}K` : req.amount;
    const generatedCode = `${sponsorAbbr}2026-${amountVal}-${Math.floor(100 + Math.random() * 900)}`;

    // Add to valid codes database
    setSponsorshipCodes({
      ...sponsorshipCodes,
      [generatedCode]: {
        sponsor: req.sponsorName || 'TechNova Solutions',
        amount: req.amount,
        requirement: req.requirement,
        status: 'Active',
        code: generatedCode
      }
    });

    // Update request status
    setSponsorshipRequests(
      sponsorshipRequests.map(r =>
        (r.requestId === requestId || r.id === requestId)
          ? { ...r, status: 'approved', code: generatedCode, generatedCode: generatedCode }
          : r
      )
    );
  };

  const handleSimulateSponsorReject = (requestId) => {
    setSponsorshipRequests(
      sponsorshipRequests.map(r =>
        (r.requestId === requestId || r.id === requestId)
          ? { ...r, status: 'rejected' }
          : r
      )
    );
  };

  // Sync state with HTML5 History
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auth Action Handlers
  const applyActiveRole = (user, newRole) => {
    const capabilities = getUserCapabilities(user);
    if (!capabilities.includes(newRole)) capabilities.push(newRole);
    if (!capabilities.includes('attendee')) capabilities.push('attendee');
    const updatedUser = { ...user, role: newRole, capabilities };
    setCurrentUser(updatedUser);
    setUserRole(newRole);
    persistUserRecord(updatedUser);
    navigate('/dashboard');
  };

  const handleLoginSuccess = (user) => {
    persistUserRecord(user);
    const intendedRole = localStorage.getItem('assemble_intended_role');
    localStorage.removeItem('assemble_intended_role');
    if (intendedRole && intendedRole !== 'attendee') {
      handleRoleChange(intendedRole, user);
      return;
    }
    setCurrentUser(user);
    setUserRole(user.role);
    const redirectPath = localStorage.getItem('assemble_redirect') || '/dashboard';
    localStorage.removeItem('assemble_redirect');
    navigate(redirectPath);
  };

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    persistUserRecord(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('assemble_session');
    localStorage.removeItem('assemble_intended_role');
    setCurrentUser(null);
    setUserRole('attendee');
    navigate('/');
  };

  const handleRoleChange = (newRole, userOverride) => {
    const user = userOverride || currentUser;

    if (newRole === 'attendee') {
      if (!user) {
        setUserRole('attendee');
        navigate('/discover');
        return;
      }
      applyActiveRole(user, 'attendee');
      navigate('/dashboard');
      return;
    }

    if (!user) {
      localStorage.setItem('assemble_intended_role', newRole);
      localStorage.setItem('assemble_redirect', `/setup-role/${newRole}`);
      navigate('/login');
      return;
    }

    if (userHasRoleSetup(user, newRole)) {
      applyActiveRole(user, newRole);
      navigate('/dashboard');
      return;
    }

    setCurrentUser(user);
    setUserRole(user.role || 'attendee');
    persistUserRecord(user);

    navigate(`/setup-role/${newRole}`);
  };

  const handleActivateRole = (role, roleData = {}) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const capabilities = getUserCapabilities(currentUser);
    if (!capabilities.includes(role)) capabilities.push(role);

    let updatedUser = {
      ...currentUser,
      role,
      capabilities,
    };

    if (role === 'speaker') {
      updatedUser.speakerProfile = {
        ...(currentUser.speakerProfile || {}),
        ...roleData,
      };

      // Also register into global assemble_speakers so organizers can discover them in marketplace
      const currentSpeakers = JSON.parse(localStorage.getItem('assemble_speakers') || '[]');
      const existingIdx = currentSpeakers.findIndex(
        (s) => s.email?.toLowerCase() === currentUser.email?.toLowerCase()
      );
      const speakerEntry = {
        id: existingIdx >= 0 ? currentSpeakers[existingIdx].id : `spk-${Date.now()}`,
        name: currentUser.name,
        email: currentUser.email,
        designation: roleData.title || 'Keynote Speaker',
        company: roleData.organization || 'Independent',
        photo: currentUser.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
        expertise: roleData.topics || ['Technology'],
        bio: roleData.bio || '',
        fee:
          roleData.feeType === 'free'
            ? 'Free / Pro-bono'
            : `${roleData.currency || '€'}${roleData.feeAmount || '2000'} / event`,
        videoUrl: roleData.videoUrl || '',
        videoFileName: roleData.videoFileName || '',
        videoFileSize: roleData.videoFileSize || '',
        location: currentUser.location || 'Chennai',
      };
      if (existingIdx >= 0) {
        currentSpeakers[existingIdx] = { ...currentSpeakers[existingIdx], ...speakerEntry };
      } else {
        currentSpeakers.unshift(speakerEntry);
      }
      setSpeakers(currentSpeakers);
      localStorage.setItem('assemble_speakers', JSON.stringify(currentSpeakers));
    } else if (role === 'sponsor') {
      updatedUser.sponsorProfile = {
        ...(currentUser.sponsorProfile || {}),
        ...roleData,
      };
    } else if (role === 'venue') {
      updatedUser.venueProfile = {
        ...(currentUser.venueProfile || {}),
        ...roleData,
      };

      // Also register into global assemble_venues so organizers can discover them in marketplace
      const currentVenues = JSON.parse(localStorage.getItem('assemble_venues') || '[]');
      const venueEntry = {
        id: `ven-${Date.now()}`,
        name: roleData.venueName || 'Venue Space',
        location: roleData.address || currentUser.location || 'Chennai',
        address: roleData.address || '',
        city: roleData.city || currentUser.location || 'Chennai',
        capacity: Number(roleData.capacity) || 300,
        vibe: roleData.venueType || 'Auditorium',
        pricePerHour: Number(roleData.pricePerHour) || 150,
        description: roleData.description || '',
        amenities: roleData.facilities || [],
        image: (roleData.images && roleData.images[0]) || '',
        images: roleData.images || [],
        providerEmail: currentUser.email,
        providerName: currentUser.name,
        rating: 4.9,
        reviews: 1,
        available: true,
      };
      currentVenues.unshift(venueEntry);
      setVenues(currentVenues);
      localStorage.setItem('assemble_venues', JSON.stringify(currentVenues));
    } else if (role === 'organizer') {
      updatedUser.organizerProfile = {
        ...(currentUser.organizerProfile || {}),
        ...roleData,
      };
      updatedUser.organizationName = roleData.organizationName;

      // Handle community creation or joining if provided
      if (roleData.communityAction === 'create' && roleData.communityName) {
        const createdCom = handleCreateCommunityRoom(
          roleData.communityName,
          roleData.communityDesc || '',
          '',
          roleData.communityCat || 'Technology & AI'
        );
        if (createdCom && !updatedUser.communities?.includes(createdCom.name)) {
          updatedUser.communities = [...(updatedUser.communities || []), createdCom.name];
        }
      } else if (roleData.communityAction === 'join' && roleData.communityCode) {
        handleJoinCommunity(roleData.communityCode);
      }
    } else if (role === 'attendee') {
      if (roleData && roleData.interests) {
        updatedUser.interests = roleData.interests;
      }
    }

    setCurrentUser(updatedUser);
    setUserRole(role);
    persistUserRecord(updatedUser);
    navigate('/dashboard');
  };

  const handleActivateSponsor = (sponsorProfile) => {
    handleActivateRole('sponsor', sponsorProfile);
  };

  const handleAcceptSpeakingInvite = (inviteId) => {
    const updated = speakingInvites.map(inv => inv.id === inviteId ? { ...inv, status: 'accepted' } : inv);
    setSpeakingInvites(updated);
    localStorage.setItem('assemble_speaking_invites', JSON.stringify(updated));
  };

  const handleDeclineSpeakingInvite = (inviteId) => {
    const updated = speakingInvites.map(inv => inv.id === inviteId ? { ...inv, status: 'declined' } : inv);
    setSpeakingInvites(updated);
    localStorage.setItem('assemble_speaking_invites', JSON.stringify(updated));
  };

  const handleApplyForSpeaking = (eventId, pitch) => {
    const targetEvent = events.find(e => e.id === eventId);
    const newApp = {
      id: `spk-app-${Date.now()}`,
      eventId,
      eventTitle: targetEvent?.title || 'Conference Keynote',
      speakerName: currentUser?.name || 'Applicant Speaker',
      speakerEmail: currentUser?.email || 'speaker@eventhorizon.dev',
      message: pitch,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newApp, ...speakingInvites];
    setSpeakingInvites(updated);
    localStorage.setItem('assemble_speaking_invites', JSON.stringify(updated));
  };

  const handleUpdateSpeakerProfile = (profileData) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      speakerProfile: {
        ...(currentUser.speakerProfile || {}),
        ...profileData
      }
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('assemble_session', JSON.stringify(updatedUser));

    const updatedSpeakers = speakers.map(s => 
      s.email === currentUser.email ? { ...s, ...profileData, name: currentUser.name } : s
    );
    setSpeakers(updatedSpeakers);
    localStorage.setItem('assemble_speakers', JSON.stringify(updatedSpeakers));
  };

  const handleAddVenue = (newVenue) => {
    const updated = [newVenue, ...venues];
    setVenues(updated);
    localStorage.setItem('assemble_venues', JSON.stringify(updated));
  };

  const handleUpdateVenue = (updatedVenue) => {
    const updated = venues.map(v => v.id === updatedVenue.id ? updatedVenue : v);
    setVenues(updated);
    localStorage.setItem('assemble_venues', JSON.stringify(updated));
  };

  const handleAcceptVenueBooking = (bookingId) => {
    const updated = venueBookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b);
    setVenueBookings(updated);
    localStorage.setItem('assemble_venue_bookings', JSON.stringify(updated));
  };

  const handleDeclineVenueBooking = (bookingId) => {
    const updated = venueBookings.map(b => b.id === bookingId ? { ...b, status: 'declined' } : b);
    setVenueBookings(updated);
    localStorage.setItem('assemble_venue_bookings', JSON.stringify(updated));
  };

  const handleUpdateCapabilities = (newCap) => {
    if (!currentUser) return;
    const currentCaps = currentUser.capabilities || [currentUser.role, 'attendee'];
    if (!currentCaps.includes(newCap)) {
      const updatedUser = {
        ...currentUser,
        capabilities: [...currentCaps, newCap]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('assemble_session', JSON.stringify(updatedUser));
    }
  };

  // Handler: Select Event Details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    localStorage.setItem('assemble_selected_event', JSON.stringify(event));
    navigate('/event-details');
  };

  // Handler: Register for Event
  const handleRegisterForEvent = (event, selectedTier, applicationDetails) => {
    if (!currentUser) {
      localStorage.setItem('assemble_redirect', '/event-details');
      navigate('/login');
      return;
    }
    const finalPrice = selectedTier ? selectedTier.price : event.price;
    const finalTierName = selectedTier ? selectedTier.name : null;
    const newTicketId = `EH-${Math.floor(10000 + Math.random() * 90000)}`;
    
    let registrationType = 'Attendee';
    let volunteerStatus = 'None';
    let communityStatus = 'None';
    let communityInterest = false;

    if (applicationDetails) {
      const { willVolunteer, willJoinCommunity } = applicationDetails;
      if (willVolunteer && willJoinCommunity) {
        registrationType = 'Volunteer + Community';
        volunteerStatus = 'Applied';
        communityStatus = 'Applied';
        communityInterest = true;
      } else if (willVolunteer) {
        registrationType = 'Volunteer';
        volunteerStatus = 'Applied';
      } else if (willJoinCommunity) {
        registrationType = 'Community';
        communityStatus = 'Applied';
        communityInterest = true;
      }
    }

    const newTicket = {
      ticketId: newTicketId,
      eventId: event.id,
      eventTitle: event.title,
      userName: applicationDetails?.fullName || (currentUser ? currentUser.name : 'Guest User'),
      userEmail: applicationDetails?.email || (currentUser ? currentUser.email : 'guest@example.com'),
      gender: applicationDetails?.gender || 'None',
      phone: applicationDetails?.phone || (currentUser?.phone || ''),
      location: applicationDetails?.city || (currentUser?.city || ''),
      state: applicationDetails?.state || '',
      country: applicationDetails?.country || '',
      occupation: applicationDetails?.occupation || '',
      occupationDetails: applicationDetails?.occupationDetails || '',
      linkedin: applicationDetails?.linkedin || '',
      registrationType,
      volunteerStatus,
      communityStatus,
      volunteerWhy: applicationDetails?.volunteerWhy || '',
      communityWhy: applicationDetails?.communityWhy || '',
      date: event.startDate,
      time: event.time,
      venue: `${event.location}, ${event.city}`,
      price: finalPrice,
      ticketTierName: finalTierName,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      qrCodeData: `${newTicketId}-${(applicationDetails?.fullName || (currentUser ? currentUser.name : 'GUEST')).replace(/\s+/g, '-').toUpperCase()}-${event.id.toUpperCase()}`,
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('assemble_tickets', JSON.stringify(updatedTickets));

    // If they checked communityInterest, join the associated communities of the event
    if (communityInterest && event.associatedCommunities) {
      event.associatedCommunities.forEach(comName => {
        const matchedCom = communities.find(c => c.name === comName);
        if (matchedCom) {
          addUserToCommunity(matchedCom);
        }
      });
    }

    // Update event stats
    const updatedEvents = events.map((e) =>
      e.id === event.id
        ? {
            ...e,
            registeredCount: e.registeredCount + 1,
            revenue: e.revenue + finalPrice,
            ticketTiers: e.ticketTiers
              ? e.ticketTiers.map((t) =>
                  t.name === finalTierName ? { ...t, sold: (t.sold || 0) + 1 } : t
                )
              : undefined,
          }
        : e
    );
    setEvents(updatedEvents);
    localStorage.setItem('assemble_events', JSON.stringify(updatedEvents));

    // Show pass modal
    setViewedTicket(newTicket);
  };

  // Handler: Save / Publish Created Event
  const handleSaveEvent = (newEvent) => {
    const updatedEvents = [newEvent, ...events];
    setEvents(updatedEvents);
    localStorage.setItem('assemble_events', JSON.stringify(updatedEvents));
    navigate('/dashboard');
  };

  // Handler: Door Check-In Ticket
  const handleCheckInTicket = (ticketId) => {
    const targetTicket = tickets.find(
      (t) => t.ticketId.toLowerCase() === ticketId.toLowerCase()
    );

    if (!targetTicket) return false;

    // Mark ticket checked-in
    const updatedTickets = tickets.map((t) =>
      t.ticketId.toLowerCase() === ticketId.toLowerCase()
        ? { ...t, status: 'checked-in' }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('assemble_tickets', JSON.stringify(updatedTickets));

    // Update event checked in count
    const updatedEvents = events.map((e) =>
      e.id === targetTicket.eventId
        ? { ...e, checkedInCount: e.checkedInCount + 1 }
        : e
    );
    setEvents(updatedEvents);
    localStorage.setItem('assemble_events', JSON.stringify(updatedEvents));

    return true;
  };

  const handleUpdateTicket = (updatedTicket) => {
    const updatedTickets = tickets.map((t) =>
      t.ticketId === updatedTicket.ticketId ? updatedTicket : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('assemble_tickets', JSON.stringify(updatedTickets));
  };

  const handleUpdateEventExpenses = (eventId, updatedExpenses, newBudget) => {
    const updatedEvents = events.map((e) => {
      if (e.id === eventId) {
        return {
          ...e,
          expenses: updatedExpenses,
          budget: newBudget !== undefined ? newBudget : e.budget,
        };
      }
      return e;
    });
    setEvents(updatedEvents);
    localStorage.setItem('assemble_events', JSON.stringify(updatedEvents));
  };

  const handleActiveViewChange = (view) => {
    switch (view) {
      case 'home':
        navigate('/');
        break;
      case 'discover':
        navigate('/discover');
        break;
      case 'create-event':
        navigate('/create-event');
        break;
      case 'organizer-dashboard':
      case 'attendee-dashboard':
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'venues-marketplace':
        navigate('/venues-marketplace');
        break;
      case 'speakers-marketplace':
        navigate('/speakers-marketplace');
        break;
      case 'my-communities':
        navigate('/my-communities');
        break;
      case 'how-it-works':
        navigate('/how-it-works');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  // Custom Router view rendering
  const renderView = () => {
    const currentActiveRole = userRole || currentUser?.role || 'attendee';
    const protectedPaths = ['/dashboard', '/my-events', '/create-event', '/profile', '/community-room', '/my-communities', '/become-sponsor'];
    if ((protectedPaths.includes(currentPath) || currentPath.startsWith('/setup-role')) && !currentUser) {
      localStorage.setItem('assemble_redirect', currentPath);
      // Defer navigation to prevent state updates during render
      setTimeout(() => navigate('/login'), 0);
      return null;
    }

    if (currentPath.startsWith('/setup-role/')) {
      const targetRole = currentPath.split('/')[2] || 'speaker';
      return (
        <RoleSetupView
          role={targetRole}
          currentUser={currentUser}
          onComplete={(roleData) => handleActivateRole(targetRole, roleData)}
          onCancel={() => navigate('/dashboard')}
        />
      );
    }

    switch (currentPath) {
      case '/':
        return (
          <HomeView
            events={events}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            navigate={navigate}
            onSelectEvent={handleSelectEvent}
            currentUser={currentUser}
          />
        );
      case '/login':
        return <LoginView navigate={navigate} onLoginSuccess={handleLoginSuccess} />;
      case '/signup':
        return <SignupView navigate={navigate} onSignupSuccess={handleSignupSuccess} communities={communities} />;
      case '/become-sponsor':
      case '/setup-role/speaker':
      case '/setup-role/sponsor':
      case '/setup-role/venue':
      case '/setup-role/venue-provider':
      case '/setup-role/organizer':
      case '/setup-role/attendee': {
        const targetRole = currentPath === '/become-sponsor' ? 'sponsor' : currentPath.split('/').pop();
        return (
          <RoleSetupView
            role={targetRole}
            currentUser={currentUser}
            onComplete={(roleData) => handleActivateRole(targetRole, roleData)}
            onCancel={() => navigate('/dashboard')}
          />
        );
      }
      case '/profile':
        return (
          <ProfileView
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onLogout={handleLogout}
            communities={communities}
            onJoinCommunity={handleJoinCommunity}
            onOpenCommunityRoom={(com) => {
              setActiveCommunity(com);
              navigate('/community-room');
            }}
            onCreateCommunityRoom={handleCreateCommunityRoom}
            onUpdateCapabilities={handleUpdateCapabilities}
          />
        );
      case '/community-room':
        if (activeCommunity) {
          return (
            <CommunityRoomView
              community={activeCommunity}
              events={events}
              onBack={() => navigate('/profile')}
              onSelectEvent={handleSelectEvent}
              onPlanCommunityEvent={(comName) => {
                setPreSelectedCommunity(comName);
                navigate('/create-event');
              }}
              sponsorshipRequests={sponsorshipRequests}
              currentUser={currentUser}
            />
          );
        }
        setTimeout(() => navigate('/profile'), 0);
        return null;
      case '/dashboard':
      case '/my-events': {
        if (currentActiveRole === 'organizer') {
          return (
            <OrganizerDashboardView
              events={events}
              tickets={tickets}
              onCheckInTicket={handleCheckInTicket}
              onOpenCreateEvent={() => navigate('/create-event')}
              onSelectEvent={handleSelectEvent}
              setActiveView={handleActiveViewChange}
              goodiesCart={goodiesCart}
              goodiesOrders={goodiesOrders}
              onAddGoodiesToCart={handleAddGoodiesToCart}
              onRemoveGoodiesFromCart={handleRemoveGoodiesFromCart}
              onPlaceGoodiesOrder={handlePlaceGoodiesOrder}
              sponsorshipCodes={sponsorshipCodes}
              sponsorshipRequests={sponsorshipRequests}
              onRequestSponsorship={handleRequestSponsorship}
              onSimulateSponsorApprove={handleSimulateSponsorApprove}
              currentUser={currentUser}
              communities={communities}
              onUpdateTicket={handleUpdateTicket}
              onUpdateEventExpenses={handleUpdateEventExpenses}
              onRoleChange={handleRoleChange}
            />
          );
        }

        if (currentActiveRole === 'speaker') {
          return (
            <SpeakerDashboardView
              currentUser={currentUser}
              events={events}
              speakers={speakers}
              speakingInvites={speakingInvites}
              onAcceptInvite={handleAcceptSpeakingInvite}
              onDeclineInvite={handleDeclineSpeakingInvite}
              onApplyForSpeaking={handleApplyForSpeaking}
              onUpdateSpeakerProfile={handleUpdateSpeakerProfile}
              setActiveView={handleActiveViewChange}
              onSelectEvent={handleSelectEvent}
              onRoleChange={handleRoleChange}
            />
          );
        }

        if (currentActiveRole === 'sponsor') {
          return (
            <SponsorDashboardView
              currentUser={currentUser}
              events={events}
              sponsorshipRequests={sponsorshipRequests}
              sponsorshipCodes={sponsorshipCodes}
              onSimulateSponsorApprove={handleSimulateSponsorApprove}
              onSimulateSponsorReject={handleSimulateSponsorReject}
              onRequestSponsorship={handleRequestSponsorship}
              setActiveView={handleActiveViewChange}
              onSelectEvent={handleSelectEvent}
              onRoleChange={handleRoleChange}
            />
          );
        }

        if (currentActiveRole === 'venue') {
          return (
            <VenueProviderDashboardView
              currentUser={currentUser}
              venues={venues}
              venueBookings={venueBookings}
              onAddVenue={handleAddVenue}
              onUpdateVenue={handleUpdateVenue}
              onAcceptBooking={handleAcceptVenueBooking}
              onDeclineBooking={handleDeclineVenueBooking}
              setActiveView={handleActiveViewChange}
              onRoleChange={handleRoleChange}
            />
          );
        }

        // Default: Attendee Dashboard
        return (
          <AttendeeDashboardView
            currentUser={currentUser}
            tickets={currentUser ? tickets.filter(t => t.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()) : tickets}
            events={events}
            savedEventIds={savedEventIds}
            communities={communities}
            onViewTicket={(t) => setViewedTicket(t)}
            setActiveView={handleActiveViewChange}
            onSelectEvent={handleSelectEvent}
            onJoinCommunity={handleJoinCommunity}
            onCreateCommunityRoom={handleCreateCommunityRoom}
            onOpenCommunityRoom={(com) => {
              setActiveCommunity(com);
              navigate('/community-room');
            }}
            onRoleChange={handleRoleChange}
          />
        );
      }
      case '/create-event':
        return (
          <CreateEventView
            onCancel={() => {
              setPreSelectedCommunity(null);
              navigate('/dashboard');
            }}
            onSaveEvent={(newEvent) => {
              handleSaveEvent(newEvent);
              setPreSelectedCommunity(null);
            }}
            sponsorshipCodes={sponsorshipCodes}
            currentUser={currentUser}
            preSelectedCommunity={preSelectedCommunity}
          />
        );
      case '/discover':
        return (
          <DiscoverView
            events={events}
            onSelectEvent={handleSelectEvent}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
          />
        );
      case '/event-details':
        if (selectedEvent) {
          return (
            <EventDetailsView
              event={selectedEvent}
              onBack={() => navigate('/discover')}
              onBackToDashboard={() => handleActiveViewChange('dashboard')}
              onRegister={handleRegisterForEvent}
              isSaved={savedEventIds.includes(selectedEvent.id)}
              onToggleSave={() => handleToggleSaveEvent(selectedEvent.id)}
              currentUser={currentUser}
              userRole={userRole}
              activeRole={currentActiveRole}
              tickets={tickets}
              communities={communities}
              onAnalyzeCommunity={handleAnalyzeCommunity}
              onRequestSponsorship={handleRequestSponsorship}
            />
          );
        }
        setTimeout(() => navigate('/discover'), 0);
        return null;
      case '/community-analysis':
        return (
          <CommunityAnalysisView
            community={analyzedCommunity}
            event={analyzedEvent || selectedEvent}
            allEvents={events}
            sponsorshipRequests={sponsorshipRequests}
            currentUser={currentUser}
            onBack={() => {
              if (selectedEvent) {
                navigate('/event-details');
              } else if (currentActiveRole === 'sponsor') {
                handleActiveViewChange('dashboard');
              } else {
                navigate('/discover');
              }
            }}
            onSponsorEvent={(evt) => {
              setSelectedEvent(evt);
              navigate('/event-details');
            }}
          />
        );
      case '/venues-marketplace':
        return (
          <VenueMarketplaceView
            onBack={() => handleActiveViewChange('dashboard')}
            onRequestVenueBooking={(newBooking) => {
              const updated = [newBooking, ...venueBookings];
              setVenueBookings(updated);
              localStorage.setItem('assemble_venue_bookings', JSON.stringify(updated));
            }}
          />
        );
      case '/speakers-marketplace':
        return (
          <SpeakerMarketplaceView
            onBack={() => handleActiveViewChange('dashboard')}
            onInviteSpeaker={(newInvite) => {
              const updated = [newInvite, ...speakingInvites];
              setSpeakingInvites(updated);
              localStorage.setItem('assemble_speaking_invites', JSON.stringify(updated));
            }}
          />
        );
      case '/my-communities':
        return (
          <div className="px-4 md:px-10 max-w-[800px] mx-auto py-8 space-y-6 text-left animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-6">
              <div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors mb-2 cursor-pointer"
                >
                  <span>← Back to Home</span>
                </button>
                <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider block">
                  Organizer Space
                </span>
                <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] mt-0.5">
                  My Communities
                </h1>
              </div>
            </div>

            <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-10 shadow-2xs space-y-6">
              <p className="font-inter text-xs text-[#5f5e5e] text-left leading-relaxed">
                Click on any community room you belong to, to enter the private member message boards and upcoming events feeds.
              </p>

              {!(currentUser?.communities && currentUser.communities.length > 0) ? (
                <div className="p-4 bg-gray-50 border border-dashed border-[#c2c7d1] rounded-xl text-center text-xs text-gray-400 italic">
                  You haven't joined any communities yet. Join one in your Profile using a room code!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentUser.communities.map((comName) => {
                    const matchedCom = communities.find((c) => c.name === comName);
                    return (
                      <div
                        key={comName}
                        onClick={() => {
                          if (matchedCom) {
                            setActiveCommunity(matchedCom);
                            navigate('/community-room');
                          }
                        }}
                        className="p-4 border border-[#e1e3e4] rounded-xl bg-[#f8f9fa] hover:bg-[#d2e4ff]/10 hover:border-[#0f4c81] transition-all cursor-pointer flex justify-between items-center text-left"
                      >
                        <div>
                          <h4 className="font-geist font-bold text-xs text-[#00355f]">{comName}</h4>
                          <span className="font-mono text-[9px] text-[#5f5e5e]">Code: {matchedCom?.code || '—'}</span>
                        </div>
                        <span className="material-symbols-outlined text-base text-[#0f4c81]">chevron_right</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      case '/how-it-works':
        return <HowItWorksView setActiveView={handleActiveViewChange} />;
      case '/about':
        return <AboutView />;
      default:
        return (
          <HomeView
            events={events}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            navigate={navigate}
            onSelectEvent={handleSelectEvent}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#191c1d] selection:bg-[#d2e4ff] selection:text-[#00355f]">
      {/* Navigation Header */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        userRole={userRole}
        onRoleChange={handleRoleChange}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        {renderView()}
      </main>

      {/* Footer */}
      <Footer setActiveView={handleActiveViewChange} />

      {/* Digital Ticket Modal */}
      <TicketModal ticket={viewedTicket} onClose={() => setViewedTicket(null)} />
    </div>
  );
}

export default App;
