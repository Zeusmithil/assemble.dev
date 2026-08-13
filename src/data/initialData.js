export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Design Systems Architecture Summit',
    description: 'A deep dive into scaling multi-brand component libraries, design token pipelines, and design-to-code automation for modern software teams.',
    category: 'Technology',
    format: 'In-Person',
    startDate: '2026-10-24',
    time: '10:00 AM',
    location: 'Sir Mutha Venkatasubba Rao Concert Hall',
    city: 'Chennai',
    organizer: 'Design Scale India',
    price: 150,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 500,
    registeredCount: 380,
    checkedInCount: 0,
    revenue: 57000,
    status: 'published',
    whatsIncluded: ['Certificate of Mastery', 'Swag Kit & Notebook', 'Gourmet Lunch & Coffee', 'Recorded Sessions Access'],
    venueDetails: {
      name: 'Sir Mutha Venkatasubba Rao Concert Hall',
      address: '7, Lady McNichols Rd, Chetpet, Chennai, Tamil Nadu 600031',
      facilities: ['Acoustic Hall', 'VIP Lounge', 'High-speed Wi-Fi', 'Valet Parking']
    },
    speakers: [
      {
        id: 'spk-1',
        name: 'Ananya Ramachandran',
        designation: 'Principal Design System Lead',
        company: 'Atlassian',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        expertise: ['Design Tokens', 'Figma Pipelines', 'React Architecture'],
        bio: 'Leading design infrastructure for global cloud products.'
      },
      {
        id: 'spk-2',
        name: 'Karthik Sundaram',
        designation: 'Staff UX Architect',
        company: 'Freshworks',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        expertise: ['Accessibility', 'Tailwind CSS', 'Component Governance'],
        bio: 'Pioneered accessible SaaS component frameworks.'
      }
    ],
    schedule: [
      { time: '09:00 AM', title: 'Registration & Coffee Networking', description: 'Badge collection and welcome drinks.' },
      { time: '10:00 AM', title: 'Keynote: Design Token Pipelines in 2026', speaker: 'Ananya Ramachandran' },
      { time: '11:30 AM', title: 'Component Governance Panel', speaker: 'Karthik Sundaram' },
      { time: '01:00 PM', title: 'Networking Lunch', description: 'Buffet in the main atrium.' },
      { time: '02:30 PM', title: 'Figma to Code Live Lab', description: 'Hands-on session with automated code generation.' },
      { time: '04:30 PM', title: 'Closing & Q&A', description: 'Community announcements and raffle.' }
    ],
    visibility: 'Public'
  },
  {
    id: 'evt-2',
    title: 'Modern Minimalist Plating Masterclass',
    description: 'Master the art of architectural culinary presentation with Michelin-level techniques, flavor pairing, and aesthetic photography layout.',
    category: 'Culinary',
    format: 'In-Person',
    startDate: '2026-10-28',
    time: '06:30 PM',
    location: 'The Culinary Studio, Nungambakkam',
    city: 'Chennai',
    organizer: 'Artisan Culinary Guild',
    price: 85,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 60,
    registeredCount: 52,
    checkedInCount: 0,
    revenue: 4420,
    status: 'published',
    whatsIncluded: ['Professional Chef Apron', 'Tasting Menu Included', 'Recipe E-Book', 'Chef Certificate'],
    venueDetails: {
      name: 'The Culinary Studio',
      address: 'Khader Nawaz Khan Rd, Nungambakkam, Chennai',
      facilities: ['Marble Countertops', 'Live Cooking Stations', 'Wine Cellar']
    },
    speakers: [
      {
        id: 'spk-3',
        name: 'Chef Vikram Sethi',
        designation: 'Executive Chef',
        company: 'Aura Dining',
        photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&auto=format&fit=crop',
        expertise: ['Gastronomy', 'Plating Aesthetics', 'Modern Asian'],
        bio: 'Award-winning culinary artist known for structural plating elegance.'
      }
    ],
    schedule: [
      { time: '06:30 PM', title: 'Welcome Drinks & Introduction' },
      { time: '07:00 PM', title: 'Live Demonstration: Negative Space Plating' },
      { time: '08:00 PM', title: 'Hands-On Creation & Tasting Session' }
    ],
    visibility: 'Public'
  },
  {
    id: 'evt-3',
    title: 'Intimate Acoustic Sessions',
    description: 'An exclusive candlelit acoustic music performance featuring indie singer-songwriters in an architecturally acoustic chamber.',
    category: 'Music',
    format: 'In-Person',
    startDate: '2026-11-02',
    time: '08:00 PM',
    location: 'EVP Film City Amphitheatre',
    city: 'Chennai',
    organizer: 'Echo Chamber Collective',
    price: 0,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 200,
    registeredCount: 195,
    checkedInCount: 0,
    revenue: 0,
    status: 'published',
    whatsIncluded: ['Complimentary Craft Mocktails', 'Souvenir Poster', 'Artist Meet & Greet'],
    venueDetails: {
      name: 'EVP Film City Amphitheatre',
      address: 'Poonamallee Bypass Rd, Chennai',
      facilities: ['Acoustic Shell', 'Ambient Lighting', 'Lawn Seating']
    },
    schedule: [
      { time: '07:30 PM', title: 'Doors Open' },
      { time: '08:00 PM', title: 'Opening Set by Maya & The Echoes' },
      { time: '09:15 PM', title: 'Headline Acoustic Performance' }
    ],
    visibility: 'Public'
  },
  {
    id: 'evt-4',
    title: 'The Future of AI Summit 2026',
    description: 'Bringing together 2,500+ tech leaders, researchers, and venture capitalists to explore breakthrough LLMs, multimodal reasoning, and AI agents.',
    category: 'AI & ML',
    format: 'In-Person',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    time: '09:00 AM PST',
    location: 'Moscone Center',
    city: 'San Francisco',
    organizer: 'TechNexus Global',
    price: 299,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 2500,
    registeredCount: 1850,
    checkedInCount: 420,
    revenue: 553150,
    status: 'published',
    whatsIncluded: ['Full 3-Day Summit Pass', 'VIP Lounge Access', 'AI Developer Workshop', 'Keynote Recordings'],
    venueDetails: {
      name: 'Moscone Center',
      address: '747 Howard St, San Francisco, CA 94103',
      facilities: ['Main Expo Hall', 'Keynote Auditorium', 'Press Room', 'Food Courts']
    },
    speakers: [
      {
        id: 'spk-4',
        name: 'Dr. Elena Rostova',
        designation: 'VP of AI Research',
        company: 'Antigravity Labs',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
        expertise: ['Autonomous Agents', 'Multimodal LLMs', 'Robotics'],
        bio: 'Pioneer in zero-shot agentic reasoning frameworks.'
      },
      {
        id: 'spk-5',
        name: 'David Chen',
        designation: 'General Partner',
        company: 'Horizon Ventures',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        expertise: ['Venture Capital', 'AI Startups', 'SaaS Growth'],
        bio: 'Early backer of leading foundation model startups.'
      }
    ],
    schedule: [
      { time: '09:00 AM', title: 'Opening Ceremony & Keynote' },
      { time: '11:00 AM', title: 'Agentic Workflows in Enterprise' },
      { time: '02:00 PM', title: 'Multimodal Generative Models Workshop' }
    ],
    visibility: 'Public'
  },
  {
    id: 'evt-5',
    title: 'Minimalist UI Patterns Workshop',
    description: 'An interactive virtual masterclass on typography hierarchy, micro-interactions, mathematical layout grids, and anti-slop design aesthetics.',
    category: 'Design',
    format: 'Online',
    startDate: '2026-11-02',
    time: '01:00 PM EST',
    location: 'Online via Zoom & Figma',
    city: 'New York',
    organizer: 'Studio Horizon',
    price: 0,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 1000,
    registeredCount: 840,
    checkedInCount: 0,
    revenue: 0,
    status: 'published',
    whatsIncluded: ['Figma UI Kit', 'Typography Cheat Sheet', 'Interactive Figma Community File'],
    schedule: [
      { time: '01:00 PM', title: 'Introduction to Optical Spacing & Math Grids' },
      { time: '02:30 PM', title: 'Live Redesign Challenge & Critique' }
    ],
    visibility: 'Public'
  },
  {
    id: 'evt-6',
    title: 'Indie Sounds Festival',
    description: 'Three days of indie rock, electronic beats, and acoustic showcases in Central Park under the autumn skyline.',
    category: 'Music',
    format: 'In-Person',
    startDate: '2026-12-10',
    endDate: '2026-12-12',
    time: '04:00 PM EST',
    location: 'Central Park Rumsey Playfield',
    city: 'New York',
    organizer: 'Gotham Soundworks',
    price: 120,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 4000,
    registeredCount: 3100,
    checkedInCount: 0,
    revenue: 372000,
    status: 'published',
    whatsIncluded: ['3-Day Festival Wristband', 'Food Truck Coupons', 'Festival Eco Tote'],
    visibility: 'Public'
  },
  {
    id: 'evt-7',
    title: 'Global Tech Summit 2026',
    description: 'The premier gathering of technology leaders, innovators, and enthusiasts focusing on AI, clean energy, and sustainable tech infrastructure.',
    category: 'Conferences',
    format: 'In-Person',
    startDate: '2026-10-15',
    time: '09:00 AM GMT',
    location: 'ExCeL London Convention Centre',
    city: 'London',
    organizer: 'Global Tech Forum',
    price: 400,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 1000,
    registeredCount: 850,
    checkedInCount: 745,
    revenue: 340000,
    status: 'published',
    whatsIncluded: ['VIP Delegate Badge', 'Executive Networking Luncheon', 'Post-Conference Report'],
    visibility: 'Public'
  },
  {
    id: 'evt-8',
    title: 'Creative Leadership Workshop',
    description: 'An intensive one-day workshop designed to foster creative problem-solving, team psychological safety, and innovative leadership strategies.',
    category: 'Workshops',
    format: 'Hybrid',
    startDate: '2026-11-02',
    time: '10:00 AM IST',
    location: 'UB City Executive Suite',
    city: 'Bangalore',
    organizer: 'Mindset Collective',
    price: 199,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 100,
    registeredCount: 0,
    checkedInCount: 0,
    revenue: 0,
    status: 'draft',
    whatsIncluded: ['Workbook & Toolkit', 'Personalized Assessment', '1-on-1 Follow-up Call'],
    visibility: 'Private'
  }
];

export const INITIAL_VENUES = [
  {
    id: 'ven-1',
    name: 'The Glasshouse Loft',
    location: 'Downtown Arts District',
    city: 'New York',
    capacity: 120,
    pricePerHour: 150,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    vibe: 'Industrial',
    amenities: ['Exposed Brick', 'High Factory Windows', 'A/V & Wi-Fi', 'Catering Prep Kitchen'],
    rating: 4.9,
    availability: 'Available Next Week'
  },
  {
    id: 'ven-2',
    name: 'Blanc Gallery',
    location: 'West End',
    city: 'London',
    capacity: 80,
    pricePerHour: 200,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    vibe: 'Minimalist',
    amenities: ['Hardwood Floors', 'Track Spotlight Systems', 'Acoustic Wall Panels'],
    rating: 4.85,
    availability: 'Available Daily'
  },
  {
    id: 'ven-3',
    name: 'The Conservatory',
    location: 'City Center Park',
    city: 'San Francisco',
    capacity: 250,
    pricePerHour: 350,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    vibe: 'Outdoor / Indoor',
    amenities: ['Glass Ceiling Atrium', 'Lush Botanical Gardens', 'Stage Lighting', 'Valet Area'],
    rating: 4.95,
    availability: 'Weekend Availability'
  },
  {
    id: 'ven-4',
    name: 'Apex Horizon Hall',
    location: 'Tech Hub Park',
    city: 'Chennai',
    capacity: 600,
    pricePerHour: 280,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
    vibe: 'Modern Conference',
    amenities: ['4K LED Backdrop Wall', 'Simultaneous Translation Booths', 'High-density Wi-Fi 7'],
    rating: 4.9,
    availability: 'Immediate Booking'
  }
];

export const INITIAL_SPEAKERS = [
  {
    id: 'spk-101',
    name: 'Dr. Elena Rostova',
    designation: 'VP of AI Research',
    company: 'Antigravity AI',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    expertise: ['Autonomous Agents', 'Reasoning LLMs', 'Robotics'],
    bio: 'Pioneered self-correcting neural architectures with over 15k academic citations.',
    fee: '$3,500 / keynote',
    availability: 'Available Q4 2026'
  },
  {
    id: 'spk-102',
    name: 'Marcus Vance',
    designation: 'Global Head of Design',
    company: 'Aura Systems',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    expertise: ['Design Systems', 'Micro-Interactions', 'Spatial UI'],
    bio: 'Author of "The Minimalist Grid" and creator of popular enterprise UI frameworks.',
    fee: '$2,500 / keynote',
    availability: 'Available Globally'
  },
  {
    id: 'spk-103',
    name: 'Sarah Jenkins',
    designation: 'Chief Technology Officer',
    company: 'CloudScale Inc.',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop',
    expertise: ['Serverless Architecture', 'Kubernetes', 'DevOps Strategy'],
    bio: 'Architected distributed systems handling 10B daily API requests.',
    fee: '$3,000 / keynote',
    availability: 'Virtual & On-Site'
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    name: 'Artisan Bites Co.',
    category: 'Catering & Bar',
    description: 'Farm-to-table gourmet canapés, craft mocktail stations, and dietary-inclusive buffet spreads.',
    priceRange: '$$$',
    rating: 4.9,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    estPrice: 650
  },
  {
    id: 'srv-2',
    name: 'The Daily Grind Events',
    category: 'Catering & Bar',
    description: 'Mobile artisan espresso bar with trained baristas, signature oat milk lattes, and fresh pastries.',
    priceRange: '$$',
    rating: 4.88,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
    tag: 'Coffee Bar',
    estPrice: 450
  },
  {
    id: 'srv-3',
    name: 'LensCraft Cinematic Studio',
    category: 'Photography',
    description: '4K multi-cam video recording, live streaming setup, high-res event photography, and same-day highlight reels.',
    priceRange: '$$$',
    rating: 4.95,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    estPrice: 800
  },
  {
    id: 'srv-4',
    name: 'Acoustic Aura Sound & AV',
    category: 'AV & Sound',
    description: 'Concert-grade wireless mics, stage spotlight rigs, 4K projector screens, and real-time audio engineering.',
    priceRange: '$$$',
    rating: 4.92,
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    estPrice: 1200
  }
];

export const INITIAL_GOODIES = [
  {
    id: 'gd-1',
    name: 'Custom Organic Cotton Tee',
    category: 'Apparel',
    unitPrice: 12,
    description: '100% combed organic cotton with soft screen printing.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'gd-2',
    name: 'Minimalist Matte Thermal Bottle',
    category: 'Drinkware',
    unitPrice: 18,
    description: 'Double-wall vacuum insulated 500ml stainless steel bottle.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'gd-3',
    name: 'Linen Bound Conference Journal',
    category: 'Stationery',
    unitPrice: 8,
    description: '192 grid pages on 100gsm acid-free FSC certified paper.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop'
  }
];

export const INITIAL_TICKETS = [
  {
    ticketId: 'EH-89241',
    eventId: 'evt-4',
    eventTitle: 'The Future of AI Summit 2026',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    date: 'Oct 15 - 17, 2026',
    time: '09:00 AM PST',
    venue: 'Moscone Center, San Francisco',
    price: 299,
    registrationDate: '2026-08-10',
    status: 'confirmed',
    qrCodeData: 'EH-89241-JOHN-DOE-EVT4'
  },
  {
    ticketId: 'EH-44102',
    eventId: 'evt-1',
    eventTitle: 'Design Systems Architecture Summit',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    date: 'Oct 24, 2026',
    time: '10:00 AM IST',
    venue: 'Sir Mutha Concert Hall, Chennai',
    price: 150,
    registrationDate: '2026-08-11',
    status: 'confirmed',
    qrCodeData: 'EH-44102-JOHN-DOE-EVT1'
  }
];
