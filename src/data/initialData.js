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
    organizerEmail: 'organizer@eventhorizon.dev',
    price: 150,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 500,
    registeredCount: 380,
    checkedInCount: 0,
    revenue: 57000,
    budget: 60000,
    expenses: [
      { id: 'exp-1', title: 'Venue Hall Rental & Stage Setup', category: 'Venue', allocated: 20000, spent: 19500, status: 'Paid', date: '2026-09-01' },
      { id: 'exp-2', title: 'A/V Sound, LED Screens & Lighting', category: 'Equipment', allocated: 12000, spent: 12000, status: 'Paid', date: '2026-09-10' },
      { id: 'exp-3', title: 'Gourmet Catering & Coffee Station', category: 'Catering', allocated: 15000, spent: 14200, status: 'Paid', date: '2026-09-20' },
      { id: 'exp-4', title: 'Keynote Speaker Travel & Honorarium', category: 'Speakers', allocated: 8000, spent: 7500, status: 'Paid', date: '2026-09-25' },
      { id: 'exp-5', title: 'Custom Swag Bags & Lanyards', category: 'Swag', allocated: 5000, spent: 3800, status: 'Pending', date: '2026-10-01' }
    ],
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
    visibility: 'Public',
    volunteersNeeded: 12,
    associatedCommunities: ['Code Community'],
    sponsorshipOpportunities: [
      { id: 'so-101', requirement: 'Main Hall & LED Backdrop Rigging', amount: 25000, fundedAmount: 25000, status: 'Funded', sponsor: 'TechNova Solutions', description: 'Auditorium main stage LED backdrop co-branding.' },
      { id: 'so-102', requirement: 'Artisan Catering & Networking Lunch', amount: 15000, fundedAmount: 0, status: 'Open', description: 'Executive buffet luncheon and gourmet coffee station branding.' },
      { id: 'so-103', requirement: 'Attendee Design Swag Boxes', amount: 8000, fundedAmount: 0, status: 'Open', description: 'Figma-themed design notebooks and physical token cards for 500 participants.' }
    ],
    sponsorshipPackages: [
      { id: 'pkg-101', tier: 'Title Partner', amount: 25000, spotsAvailable: 1, spotsTaken: 1, perks: ['Opening Keynote Co-Host', 'Auditorium Naming Rights', '6 VIP Passes', 'Premium Exhibition Stand'] },
      { id: 'pkg-102', tier: 'Gold Sponsor', amount: 12000, spotsAvailable: 2, spotsTaken: 0, perks: ['Breakout Track Branding', '3 VIP Passes', 'Booth in Atrium', 'Logo on All Recorded Sessions'] },
      { id: 'pkg-103', tier: 'Silver Sponsor', amount: 5000, spotsAvailable: 4, spotsTaken: 1, perks: ['Logo on Conference Website', '1 VIP Pass', 'Attendee Swag Insertion'] }
    ]
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
    organizerEmail: 'organizer@eventhorizon.dev',
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
    visibility: 'Public',
    associatedCommunities: ['Artisan Culinary Guild'],
    sponsorshipOpportunities: [
      { id: 'so-201', requirement: 'Artisan Kitchen & Wine Cellar Space', amount: 5000, fundedAmount: 0, status: 'Open', description: 'High-end culinary studio equipment and wine cellar sponsorship.' },
      { id: 'so-202', requirement: 'Organic Ingredients & Apron Branding', amount: 3500, fundedAmount: 0, status: 'Open', description: 'Organic farm produce sponsorship and customized chef aprons.' }
    ],
    sponsorshipPackages: [
      { id: 'pkg-201', tier: 'Gourmet Patron', amount: 5000, spotsAvailable: 1, spotsTaken: 0, perks: ['Private VIP Tasting Table for 4', 'Chef Apron Co-Branding', 'Opening Welcome Speech'] },
      { id: 'pkg-202', tier: 'Culinary Supporter', amount: 2000, spotsAvailable: 2, spotsTaken: 0, perks: ['Logo on Recipe E-Book & Menu', '2 Masterclass Passes'] }
    ]
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
    organizerEmail: 'organizer@eventhorizon.dev',
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
    visibility: 'Public',
    associatedCommunities: ['Echo Chamber Collective'],
    sponsorshipOpportunities: [
      { id: 'so-301', requirement: 'Concert-Grade Acoustic Audio Rig', amount: 4000, fundedAmount: 0, status: 'Open', description: 'Concert-grade acoustic amplification and ambient lighting.' },
      { id: 'so-302', requirement: 'Botanical Mocktail Bar Station', amount: 2500, fundedAmount: 0, status: 'Open', description: 'Custom botanical mocktail bar named after sponsor.' }
    ],
    sponsorshipPackages: [
      { id: 'pkg-301', tier: 'Stage Host', amount: 4000, spotsAvailable: 1, spotsTaken: 0, perks: ['Amphitheatre Front Row VIP Box (6 seats)', 'On-Stage Artist Introduction', 'Poster Co-Branding'] },
      { id: 'pkg-302', tier: 'Lounge Sponsor', amount: 1800, spotsAvailable: 2, spotsTaken: 0, perks: ['Mocktail Bar Branding', '2 VIP Tickets', 'Social Media Features'] }
    ]
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
    organizerEmail: 'organizer@eventhorizon.dev',
    price: 299,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 2500,
    registeredCount: 1850,
    checkedInCount: 420,
    revenue: 553150,
    budget: 450000,
    expenses: [
      { id: 'exp-401', title: 'Moscone Center Main Hall & Keynote Stage', category: 'Venue', allocated: 200000, spent: 195000, status: 'Paid', date: '2026-08-01' },
      { id: 'exp-402', title: 'Enterprise Keynote Speaker Honorariums & VIP Logistics', category: 'Speakers', allocated: 100000, spent: 98000, status: 'Paid', date: '2026-08-15' },
      { id: 'exp-403', title: 'Full 3-Day Executive Catering & VIP Dining', category: 'Catering', allocated: 80000, spent: 78500, status: 'Paid', date: '2026-09-01' },
      { id: 'exp-404', title: 'Digital Billboard & Tech Conference PR Campaign', category: 'Marketing', allocated: 40000, spent: 42000, status: 'Paid', date: '2026-09-10' },
      { id: 'exp-405', title: 'AI Developer Custom Backpack Swag & Badges', category: 'Swag', allocated: 30000, spent: 26400, status: 'Pending', date: '2026-09-20' }
    ],
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
    visibility: 'Public',
    volunteersNeeded: 25,
    associatedCommunities: ['AI Community'],
    sponsorshipOpportunities: [
      { id: 'so-401', requirement: 'Main Keynote Stage & Venue Hall', amount: 50000, fundedAmount: 50000, status: 'Funded', sponsor: 'TechNova Solutions', description: 'Prominent branding across 1,500-seat amphitheater and digital stage arches.' },
      { id: 'so-402', requirement: 'Enterprise AI Workshop Lab', amount: 25000, fundedAmount: 0, status: 'Open', description: 'Co-branded 200-seat developer hands-on lab with cloud compute credits.' },
      { id: 'so-403', requirement: 'VIP Speakers Lounge & Dinner', amount: 20000, fundedAmount: 0, status: 'Open', description: 'Private networking lounge branding and executive dinner sponsorship.' },
      { id: 'so-404', requirement: 'Attendee Swag & Welcome Kits', amount: 15000, fundedAmount: 0, status: 'Open', description: 'Custom tech backpack, badges, and eco-friendly merchandise for 2,500 attendees.' }
    ],
    sponsorshipPackages: [
      { id: 'pkg-401', tier: 'Title Partner', amount: 50000, spotsAvailable: 1, spotsTaken: 1, perks: ['Main Keynote Opening 5-Min Address', 'Exclusive Badge Lanyard Logo', '10 All-Access VIP Passes', 'Dedicated 6x4m Expo Booth Space', 'Prime Logo on Main Screen & Web'] },
      { id: 'pkg-402', tier: 'Gold Sponsor', amount: 25000, spotsAvailable: 3, spotsTaken: 1, perks: ['Track Stage Naming Rights', '5 All-Access VIP Passes', 'Dedicated 3x3m Expo Booth Space', 'Logo on Website & Event Program', '1 Dedicated Email Blast to Attendees'] },
      { id: 'pkg-403', tier: 'Silver Sponsor', amount: 12000, spotsAvailable: 5, spotsTaken: 2, perks: ['2 All-Access VIP Passes', 'Logo on Banners & Website', 'Flyer/Goodie in Attendee Kit', 'Access to Attendee Networking Lounge'] }
    ]
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
    organizerEmail: 'organizer@eventhorizon.dev',
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
    organizerEmail: 'organizer@eventhorizon.dev',
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
    organizerEmail: 'organizer@eventhorizon.dev',
    price: 400,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    expectedAttendees: 1000,
    registeredCount: 850,
    checkedInCount: 745,
    revenue: 340000,
    status: 'published',
    whatsIncluded: ['VIP Delegate Badge', 'Executive Networking Luncheon', 'Post-Conference Report'],
    visibility: 'Public',
    associatedCommunities: ['Startup Community'],
    sponsorshipOpportunities: [
      { id: 'so-701', requirement: 'ExCeL Main Keynote Arena', amount: 50000, fundedAmount: 0, status: 'Open', description: 'Prime expo hall and arena branding in London docklands.' },
      { id: 'so-702', requirement: 'Global Cleantech Stage & Audio Rig', amount: 30000, fundedAmount: 0, status: 'Open', description: 'Dedicated cleantech innovation stage naming rights.' }
    ],
    sponsorshipPackages: [
      { id: 'pkg-701', tier: 'Summit Co-Host', amount: 60000, spotsAvailable: 1, spotsTaken: 0, perks: ['Global Summit Co-Host Status', 'Keynote Slot', '12 All-Access VIP Badges', 'ExCeL Entrance Arch Naming'] },
      { id: 'pkg-702', tier: 'Innovation Partner', amount: 25000, spotsAvailable: 4, spotsTaken: 1, perks: ['Expo Booth 4x4m', '4 VIP Badges', 'Logo on Live Webcast (10k+ viewers)'] }
    ]
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
    organizerEmail: 'organizer@eventhorizon.dev',
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
    gender: 'Male',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco',
    state: 'California',
    country: 'USA',
    occupation: 'Working Professional',
    occupationDetails: 'UX Architect at Horizon Studio.',
    linkedin: 'https://linkedin.com/in/johndoe',
    registrationType: 'Volunteer + Community',
    volunteerStatus: 'Selected',
    communityInterest: true,
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
    gender: 'Male',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco',
    state: 'California',
    country: 'USA',
    occupation: 'Working Professional',
    occupationDetails: 'UX Architect at Horizon Studio.',
    linkedin: 'https://linkedin.com/in/johndoe',
    registrationType: 'Attendee',
    volunteerStatus: 'None',
    communityInterest: false,
    date: 'Oct 24, 2026',
    time: '10:00 AM IST',
    venue: 'Sir Mutha Concert Hall, Chennai',
    price: 150,
    registrationDate: '2026-08-11',
    status: 'confirmed',
    qrCodeData: 'EH-44102-JOHN-DOE-EVT1'
  },
  {
    ticketId: 'EH-31049',
    eventId: 'evt-4',
    eventTitle: 'The Future of AI Summit 2026',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    gender: 'Female',
    phone: '+91 98401 23456',
    location: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    occupation: 'Student',
    occupationDetails: 'Pre-final year Computer Science student at IIT Madras.',
    linkedin: 'https://linkedin.com/in/janesmith',
    registrationType: 'Volunteer',
    volunteerStatus: 'Applied',
    communityInterest: false,
    date: 'Oct 15 - 17, 2026',
    time: '09:00 AM PST',
    venue: 'Moscone Center, San Francisco',
    price: 0,
    registrationDate: '2026-08-12',
    status: 'confirmed',
    qrCodeData: 'EH-31049-JANE-SMITH-EVT4'
  },
  {
    ticketId: 'EH-55201',
    eventId: 'evt-4',
    eventTitle: 'The Future of AI Summit 2026',
    userName: 'Bob Miller',
    userEmail: 'bob.miller@example.com',
    gender: 'Male',
    phone: '+1 (555) 321-7654',
    location: 'San Francisco',
    state: 'California',
    country: 'USA',
    occupation: 'Working Professional',
    occupationDetails: 'Software Engineer specializing in Generative AI.',
    linkedin: 'https://linkedin.com/in/bobmiller',
    registrationType: 'Community',
    volunteerStatus: 'None',
    communityInterest: true,
    date: 'Oct 15 - 17, 2026',
    time: '09:00 AM PST',
    venue: 'Moscone Center, San Francisco',
    price: 299,
    registrationDate: '2026-08-13',
    status: 'confirmed',
    qrCodeData: 'EH-55201-BOB-MILLER-EVT4'
  }
];

export const INITIAL_COMMUNITIES = [
  {
    id: 'com-3',
    name: 'AI Community',
    organizerName: 'TechNexus Global',
    code: 'AI2026X7',
    description: 'The premier international network of machine learning engineers, foundational model researchers, and enterprise AI practitioners.',
    category: 'Artificial Intelligence & Deep Tech',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',
    createdDate: '2023-02-14',
    location: 'San Francisco, CA & Global Chapters',
    memberCount: 3420,
    activeMemberCount: 2680,
    organizerCount: 8,
    activityStatus: 'Highly Active',
    eventFrequency: 'Monthly (12+ events/year)',
    recurringEventsCount: 4,
    memberGrowthRate: '+38% YoY',
    repeatAttendeeRate: '76%',
    engagementRating: '4.95 / 5.0',
    members: [],
    pastEvents: [
      {
        id: 'past-ai-1',
        title: 'Neural Compute Winter Forum 2026',
        date: '2026-02-15',
        year: 2026,
        category: 'AI & ML',
        location: 'San Jose Convention Center',
        attendees: 2100,
        rating: 4.95,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 32000,
        sponsorNames: ['TechNova Solutions', 'GigaTech Energy']
      },
      {
        id: 'past-ai-2',
        title: 'Generative AI & Agentic Architectures 2025',
        date: '2025-11-12',
        year: 2025,
        category: 'AI & ML',
        location: 'Moscone Center, SF',
        attendees: 1800,
        rating: 4.9,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 28000,
        sponsorNames: ['TechNova Solutions', 'Antigravity AI']
      },
      {
        id: 'past-ai-3',
        title: 'Open Source LLM Developers Summit 2025',
        date: '2025-06-20',
        year: 2025,
        category: 'AI & ML',
        location: 'Fort Mason, SF',
        attendees: 1250,
        rating: 4.85,
        isRecurring: false,
        sponsored: true,
        sponsorshipAmount: 18000,
        sponsorNames: ['BrandX Media', 'Horizon Ventures']
      },
      {
        id: 'past-ai-4',
        title: 'Autonomous Robotics & Multimodal AI 2024',
        date: '2024-10-10',
        year: 2024,
        category: 'Robotics & AI',
        location: 'SF Palace of Fine Arts',
        attendees: 980,
        rating: 4.8,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 14000,
        sponsorNames: ['TechNova Solutions']
      }
    ],
    sponsorshipHistory: [
      { id: 'sph-1', eventTitle: 'Neural Compute Winter Forum 2026', date: '2026-02-10', sponsorName: 'TechNova Solutions', amount: 20000, requirement: 'Main Stage & Venue', tier: 'Title Partner' },
      { id: 'sph-2', eventTitle: 'Neural Compute Winter Forum 2026', date: '2026-02-12', sponsorName: 'GigaTech Energy', amount: 12000, requirement: 'Keynote & AV', tier: 'Gold Sponsor' },
      { id: 'sph-3', eventTitle: 'Generative AI & Agentic Architectures 2025', date: '2025-11-05', sponsorName: 'TechNova Solutions', amount: 18000, requirement: 'Main Stage & Venue', tier: 'Title Partner' },
      { id: 'sph-4', eventTitle: 'Generative AI & Agentic Architectures 2025', date: '2025-11-08', sponsorName: 'Antigravity AI', amount: 10000, requirement: 'Attendee Swag Kits', tier: 'Silver Sponsor' },
      { id: 'sph-5', eventTitle: 'Open Source LLM Developers Summit 2025', date: '2025-06-15', sponsorName: 'BrandX Media', amount: 18000, requirement: 'VIP Lounge & Goodies', tier: 'Gold Sponsor' },
      { id: 'sph-6', eventTitle: 'Autonomous Robotics & Multimodal AI 2024', date: '2024-10-02', sponsorName: 'TechNova Solutions', amount: 14000, requirement: 'Main Stage & Venue', tier: 'Gold Sponsor' }
    ]
  },
  {
    id: 'com-1',
    name: 'Code Community',
    organizerName: 'Design Scale India',
    code: 'CODE2026',
    description: 'A nationwide collective of UI architects, design system engineers, and frontend leaders crafting accessible software.',
    category: 'Design Systems & Engineering',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
    createdDate: '2023-05-18',
    location: 'Chennai & Bangalore, India',
    memberCount: 2150,
    activeMemberCount: 1720,
    organizerCount: 6,
    activityStatus: 'Highly Active',
    eventFrequency: 'Bi-monthly (6 events/year)',
    recurringEventsCount: 3,
    memberGrowthRate: '+29% YoY',
    repeatAttendeeRate: '71%',
    engagementRating: '4.88 / 5.0',
    members: [],
    pastEvents: [
      {
        id: 'past-code-1',
        title: 'Design Tokens & Headless Systems 2026',
        date: '2026-03-10',
        year: 2026,
        category: 'Technology',
        location: 'UB City Amphitheatre, Bangalore',
        attendees: 420,
        rating: 4.88,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 16000,
        sponsorNames: ['TechNova Solutions', 'BrandX Media']
      },
      {
        id: 'past-code-2',
        title: 'Component Governance at Scale 2025',
        date: '2025-10-14',
        year: 2025,
        category: 'Technology',
        location: 'Sir Mutha Concert Hall, Chennai',
        attendees: 380,
        rating: 4.85,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 14000,
        sponsorNames: ['BrandX Media']
      },
      {
        id: 'past-code-3',
        title: 'Frontend Foundations Conclave 2025',
        date: '2025-04-22',
        year: 2025,
        category: 'Technology',
        location: 'ITC Grand Chola Auditorium, Chennai',
        attendees: 510,
        rating: 4.92,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 22000,
        sponsorNames: ['TechNova Solutions', 'GigaTech Energy']
      }
    ],
    sponsorshipHistory: [
      { id: 'sph-c1', eventTitle: 'Design Tokens & Headless Systems 2026', date: '2026-03-01', sponsorName: 'TechNova Solutions', amount: 10000, requirement: 'Venue & Audio', tier: 'Gold Sponsor' },
      { id: 'sph-c2', eventTitle: 'Design Tokens & Headless Systems 2026', date: '2026-03-05', sponsorName: 'BrandX Media', amount: 6000, requirement: 'Design Kits', tier: 'Silver Sponsor' },
      { id: 'sph-c3', eventTitle: 'Component Governance at Scale 2025', date: '2025-10-01', sponsorName: 'BrandX Media', amount: 14000, requirement: 'Main Hall', tier: 'Gold Sponsor' },
      { id: 'sph-c4', eventTitle: 'Frontend Foundations Conclave 2025', date: '2025-04-10', sponsorName: 'TechNova Solutions', amount: 15000, requirement: 'Main Stage', tier: 'Title Partner' },
      { id: 'sph-c5', eventTitle: 'Frontend Foundations Conclave 2025', date: '2025-04-12', sponsorName: 'GigaTech Energy', amount: 7000, requirement: 'Networking Lounge', tier: 'Silver Sponsor' }
    ]
  },
  {
    id: 'com-2',
    name: 'Startup Community',
    organizerName: 'Global Tech Forum',
    code: 'START2026',
    description: 'Global network uniting early-stage founders, angel syndicates, and frontier tech operators across Europe and the US.',
    category: 'Venture & Entrepreneurship',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800',
    createdDate: '2022-09-10',
    location: 'London, UK & San Francisco, CA',
    memberCount: 4120,
    activeMemberCount: 3100,
    organizerCount: 10,
    activityStatus: 'Highly Active',
    eventFrequency: 'Monthly (12 events/year)',
    recurringEventsCount: 5,
    memberGrowthRate: '+42% YoY',
    repeatAttendeeRate: '80%',
    engagementRating: '4.91 / 5.0',
    members: [],
    pastEvents: [
      {
        id: 'past-st-1',
        title: 'Global Founders Summit London 2025',
        date: '2025-09-18',
        year: 2025,
        category: 'Conferences',
        location: 'ExCeL London',
        attendees: 920,
        rating: 4.9,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 45000,
        sponsorNames: ['TechNova Solutions', 'Horizon Ventures']
      },
      {
        id: 'past-st-2',
        title: 'European Seed Stage Expo 2025',
        date: '2025-03-24',
        year: 2025,
        category: 'Conferences',
        location: 'Queen Elizabeth II Centre, London',
        attendees: 840,
        rating: 4.82,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 35000,
        sponsorNames: ['GigaTech Energy']
      }
    ],
    sponsorshipHistory: [
      { id: 'sph-s1', eventTitle: 'Global Founders Summit London 2025', date: '2025-09-01', sponsorName: 'TechNova Solutions', amount: 30000, requirement: 'Main Arena', tier: 'Title Partner' },
      { id: 'sph-s2', eventTitle: 'Global Founders Summit London 2025', date: '2025-09-05', sponsorName: 'Horizon Ventures', amount: 15000, requirement: 'VIP Lounge', tier: 'Gold Sponsor' },
      { id: 'sph-s3', eventTitle: 'European Seed Stage Expo 2025', date: '2025-03-15', sponsorName: 'GigaTech Energy', amount: 35000, requirement: 'Exhibition Hall', tier: 'Title Partner' }
    ]
  },
  {
    id: 'com-4',
    name: 'Artisan Culinary Guild',
    organizerName: 'Artisan Culinary Guild',
    code: 'CHEF2026',
    description: 'Gastronomic association dedicated to architectural plating, Michelin-grade masterclasses, and sustainable local produce.',
    category: 'Culinary Arts & Gastronomy',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
    createdDate: '2024-01-20',
    location: 'Chennai, India',
    memberCount: 620,
    activeMemberCount: 480,
    organizerCount: 3,
    activityStatus: 'Active',
    eventFrequency: 'Monthly Masterclasses',
    recurringEventsCount: 2,
    memberGrowthRate: '+22% YoY',
    repeatAttendeeRate: '68%',
    engagementRating: '4.92 / 5.0',
    members: [],
    pastEvents: [
      {
        id: 'past-cul-1',
        title: 'Molecular Gastronomy Primer 2025',
        date: '2025-11-20',
        year: 2025,
        category: 'Culinary',
        location: 'The Culinary Studio, Chennai',
        attendees: 55,
        rating: 4.95,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 4500,
        sponsorNames: ['Artisan Bites Co.']
      }
    ],
    sponsorshipHistory: [
      { id: 'sph-cul1', eventTitle: 'Molecular Gastronomy Primer 2025', date: '2025-11-10', sponsorName: 'Artisan Bites Co.', amount: 4500, requirement: 'Organic Ingredients & Kitchen', tier: 'Gold Sponsor' }
    ]
  },
  {
    id: 'com-5',
    name: 'Echo Chamber Collective',
    organizerName: 'Echo Chamber Collective',
    code: 'ECHO2026',
    description: 'Independent audio collective hosting intimate acoustic sessions and independent musician showcases.',
    category: 'Indie Music & Performing Arts',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800',
    createdDate: '2023-11-05',
    location: 'Chennai & Bangalore, India',
    memberCount: 1150,
    activeMemberCount: 890,
    organizerCount: 4,
    activityStatus: 'Active',
    eventFrequency: 'Bi-monthly Concerts',
    recurringEventsCount: 3,
    memberGrowthRate: '+31% YoY',
    repeatAttendeeRate: '78%',
    engagementRating: '4.89 / 5.0',
    members: [],
    pastEvents: [
      {
        id: 'past-ech-1',
        title: 'Candlelit Indie Showcase Spring 2026',
        date: '2026-03-22',
        year: 2026,
        category: 'Music',
        location: 'Alliance Française Auditorium',
        attendees: 180,
        rating: 4.92,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 3500,
        sponsorNames: ['Acoustic Aura Sound']
      },
      {
        id: 'past-ech-2',
        title: 'Autumn Rooftop Unplugged 2025',
        date: '2025-10-18',
        year: 2025,
        category: 'Music',
        location: 'EVP Film City Amphitheatre',
        attendees: 165,
        rating: 4.88,
        isRecurring: true,
        sponsored: true,
        sponsorshipAmount: 3000,
        sponsorNames: ['BrandX Media']
      }
    ],
    sponsorshipHistory: [
      { id: 'sph-ech1', eventTitle: 'Candlelit Indie Showcase Spring 2026', date: '2026-03-15', sponsorName: 'Acoustic Aura Sound', amount: 3500, requirement: 'Sound System & Lighting', tier: 'Audio Partner' },
      { id: 'sph-ech2', eventTitle: 'Autumn Rooftop Unplugged 2025', date: '2025-10-10', sponsorName: 'BrandX Media', amount: 3000, requirement: 'Stage & Merch', tier: 'Community Sponsor' }
    ]
  }
];
