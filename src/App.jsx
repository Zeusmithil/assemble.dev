import React, { useState, useEffect } from 'react';
import { INITIAL_EVENTS, INITIAL_TICKETS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { DiscoverView } from './components/views/DiscoverView';
import { EventDetailsView } from './components/views/EventDetailsView';
import { CreateEventView } from './components/views/CreateEventView';
import { OrganizerDashboardView } from './components/views/OrganizerDashboardView';
import { AttendeeDashboardView } from './components/views/AttendeeDashboardView';
import { VenueMarketplaceView } from './components/views/VenueMarketplaceView';
import { SpeakerMarketplaceView } from './components/views/SpeakerMarketplaceView';
import { ServicesMarketplaceView } from './components/views/ServicesMarketplaceView';
import { HowItWorksView } from './components/views/HowItWorksView';
import { AboutView } from './components/views/AboutView';
import { TicketModal } from './components/modals/TicketModal';
import { LoginView } from './components/views/LoginView';
import { SignupView } from './components/views/SignupView';
import { ProfileView } from './components/views/ProfileView';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('assemble_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [userRole, setUserRole] = useState('attendee');
  const [searchQuery, setSearchQuery] = useState('');

  // Main state collections
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);

  // Selected item states
  const [selectedEvent, setSelectedEvent] = useState(INITIAL_EVENTS[0]);
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
      eventTitle: 'Design Systems Architecture Summit',
      requirement: 'Venue',
      amount: 75000,
      status: 'Sponsorship Code Generated',
      code: 'TN2026-75K',
      date: '2026-08-12'
    },
    {
      requestId: 'REQ-2201',
      sponsorId: 'sp-2',
      sponsorName: 'BrandX Media',
      eventTitle: 'Design Systems Architecture Summit',
      requirement: 'Goodies',
      amount: 30000,
      status: 'Requested',
      code: '',
      date: '2026-08-13'
    }
  ]);

  const handleRequestSponsorship = (request) => {
    setSponsorshipRequests([request, ...sponsorshipRequests]);
  };

  const handleSimulateSponsorApprove = (requestId) => {
    const req = sponsorshipRequests.find(r => r.requestId === requestId);
    if (!req) return;

    const sponsorAbbr = req.sponsorName.split(' ')[0].substring(0, 2).toUpperCase();
    const amountVal = req.amount >= 1000 ? `${Math.round(req.amount / 1000)}K` : req.amount;
    const generatedCode = `${sponsorAbbr}2026-${amountVal}-${Math.floor(100 + Math.random() * 900)}`;

    // Add to valid codes database
    setSponsorshipCodes({
      ...sponsorshipCodes,
      [generatedCode]: {
        sponsor: req.sponsorName,
        amount: req.amount,
        requirement: req.requirement,
        status: 'Active',
        code: generatedCode
      }
    });

    // Update request status
    setSponsorshipRequests(
      sponsorshipRequests.map(r =>
        r.requestId === requestId
          ? { ...r, status: 'Sponsorship Code Generated', code: generatedCode }
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
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    localStorage.setItem('assemble_session', JSON.stringify(user));
  };

  const handleSignupSuccess = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    localStorage.setItem('assemble_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('assemble_session');
    setCurrentUser(null);
    navigate('/');
  };

  const handleRoleChange = (newRole) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      setUserRole(newRole);
      localStorage.setItem('assemble_session', JSON.stringify(updatedUser));
      navigate('/dashboard');
    }
  };

  // Handler: Select Event Details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    navigate('/event-details');
  };

  // Handler: Register for Event
  const handleRegisterForEvent = (event, selectedTier) => {
    const finalPrice = selectedTier ? selectedTier.price : event.price;
    const finalTierName = selectedTier ? selectedTier.name : null;
    const newTicketId = `EH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      ticketId: newTicketId,
      eventId: event.id,
      eventTitle: event.title,
      userName: currentUser ? currentUser.name : 'Guest User',
      userEmail: currentUser ? currentUser.email : 'guest@example.com',
      date: event.startDate,
      time: event.time,
      venue: `${event.location}, ${event.city}`,
      price: finalPrice,
      ticketTierName: finalTierName,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      qrCodeData: `${newTicketId}-${(currentUser ? currentUser.name : 'GUEST').replace(/\s+/g, '-').toUpperCase()}-${event.id.toUpperCase()}`,
    };

    setTickets([newTicket, ...tickets]);

    // Update event stats
    setEvents((prev) =>
      prev.map((e) =>
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
      )
    );

    // Show pass modal
    setViewedTicket(newTicket);
  };

  // Handler: Save / Publish Created Event
  const handleSaveEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
    navigate('/dashboard');
  };

  // Handler: Door Check-In Ticket
  const handleCheckInTicket = (ticketId) => {
    const targetTicket = tickets.find(
      (t) => t.ticketId.toLowerCase() === ticketId.toLowerCase()
    );

    if (!targetTicket) return false;

    // Mark ticket checked-in
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId.toLowerCase() === ticketId.toLowerCase()
          ? { ...t, status: 'checked-in' }
          : t
      )
    );

    // Update event checked in count
    setEvents((prev) =>
      prev.map((e) =>
        e.id === targetTicket.eventId
          ? { ...e, checkedInCount: e.checkedInCount + 1 }
          : e
      )
    );

    return true;
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
      case 'services-marketplace':
        navigate('/services-marketplace');
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
    const protectedPaths = ['/dashboard', '/my-events', '/create-event', '/profile'];
    if (protectedPaths.includes(currentPath) && !currentUser) {
      localStorage.setItem('assemble_redirect', currentPath);
      // Defer navigation to prevent state updates during render
      setTimeout(() => navigate('/login'), 0);
      return null;
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
        return <SignupView navigate={navigate} onSignupSuccess={handleSignupSuccess} />;
      case '/profile':
        return (
          <ProfileView
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onLogout={handleLogout}
          />
        );
      case '/dashboard':
      case '/my-events':
        if (currentUser.role === 'organizer') {
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
            />
          );
        } else {
          return (
            <AttendeeDashboardView
              tickets={tickets}
              events={events}
              onViewTicket={(t) => setViewedTicket(t)}
              setActiveView={handleActiveViewChange}
            />
          );
        }
      case '/create-event':
        return (
          <CreateEventView
            onCancel={() => navigate('/dashboard')}
            onSaveEvent={handleSaveEvent}
            sponsorshipCodes={sponsorshipCodes}
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
              onRegister={handleRegisterForEvent}
            />
          );
        }
        setTimeout(() => navigate('/discover'), 0);
        return null;
      case '/venues-marketplace':
        return <VenueMarketplaceView onBack={() => handleActiveViewChange('dashboard')} />;
      case '/speakers-marketplace':
        return <SpeakerMarketplaceView onBack={() => handleActiveViewChange('dashboard')} />;
      case '/services-marketplace':
        return <ServicesMarketplaceView onBack={() => handleActiveViewChange('dashboard')} />;
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
        setUserRole={setUserRole}
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
