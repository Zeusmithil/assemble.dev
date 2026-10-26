-- ==========================================================
-- ASSEMBLE.DEV — COMPLETE SUPABASE POSTGRESQL SCHEMA
-- File: supabase/migrations/20261025000000_initial_schema.sql
-- ==========================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. USERS & PROFILES
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    city VARCHAR(100),
    active_role VARCHAR(50) DEFAULT 'attendee',
    capabilities TEXT[] DEFAULT ARRAY['attendee']::TEXT[],
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    profile_data JSONB DEFAULT '{}'::JSONB,
    UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- ==========================================================
-- 2. COMMUNITIES & DISCUSSIONS
-- ==========================================================
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url TEXT,
    location VARCHAR(100),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_communities_code ON communities(code);

CREATE TABLE IF NOT EXISTS community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(community_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_messages_cid ON community_messages(community_id);

-- ==========================================================
-- 3. EVENTS, SCHEDULES & EXPENSES
-- ==========================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    format VARCHAR(50) DEFAULT 'In-Person',
    start_date DATE NOT NULL,
    start_time VARCHAR(50),
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    community_id UUID REFERENCES communities(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    image_url TEXT,
    expected_attendees INT DEFAULT 100,
    registered_count INT DEFAULT 0,
    checked_in_count INT DEFAULT 0,
    budget NUMERIC(12, 2) DEFAULT 0.00,
    revenue NUMERIC(12, 2) DEFAULT 0.00,
    ticket_tiers JSONB DEFAULT '[]'::JSONB,
    sponsorship_opportunities JSONB DEFAULT '[]'::JSONB,
    swag_order JSONB,
    venue_details JSONB,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);

CREATE TABLE IF NOT EXISTS event_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    allocated NUMERIC(10, 2) DEFAULT 0.00,
    spent NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Paid',
    date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_event_expenses_event_id ON event_expenses(event_id);

CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(100),
    registration_type VARCHAR(50) DEFAULT 'Attendee',
    ticket_tier_name VARCHAR(100),
    price NUMERIC(10, 2) DEFAULT 0.00,
    volunteer_status VARCHAR(50) DEFAULT 'None',
    community_status VARCHAR(50) DEFAULT 'None',
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'checked-in', 'cancelled'
    checked_in_at TIMESTAMP WITH TIME ZONE,
    registration_date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_tickets_ticket_id ON tickets(ticket_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);

-- Helper function to atomically increment event check-in counts
CREATE OR REPLACE FUNCTION increment_event_checkins(evt_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE events
    SET checked_in_count = COALESCE(checked_in_count, 0) + 1
    WHERE id = evt_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 4. SPONSORSHIPS & MARKETPLACE
-- ==========================================================
CREATE TABLE IF NOT EXISTS sponsorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    requirement VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    pitch TEXT,
    status VARCHAR(50) DEFAULT 'REQUESTED', -- 'REQUESTED', 'APPROVED', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sponsorship_requests_event_id ON sponsorship_requests(event_id);

CREATE TABLE IF NOT EXISTS merchandise_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    event_title VARCHAR(255),
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted',
    date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_merchandise_orders_event_id ON merchandise_orders(event_id);

-- ==========================================================
-- 5. VENUES & SPEAKERS (MARKETPLACE & DIRECTORY)
-- ==========================================================

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
    provider_name VARCHAR(255),
    provider_email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 100,
    vibe VARCHAR(100) DEFAULT 'Modern Conference',
    price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    rating NUMERIC(3, 2) DEFAULT 4.90,
    reviews_count INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    availability_note VARCHAR(255) DEFAULT 'Available for Bookings',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_vibe ON venues(vibe);
CREATE INDEX IF NOT EXISTS idx_venues_provider_id ON venues(provider_id);

-- Venue Bookings Table
CREATE TABLE IF NOT EXISTS venue_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    venue_name VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    booking_date DATE NOT NULL,
    duration_hours INT DEFAULT 6,
    expected_attendees INT DEFAULT 100,
    estimated_total NUMERIC(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'declined', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_venue_bookings_venue_id ON venue_bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_organizer_id ON venue_bookings(organizer_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_event_id ON venue_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_status ON venue_bookings(status);

-- Speakers Directory Table
CREATE TABLE IF NOT EXISTS speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    designation VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    photo_url TEXT,
    bio TEXT,
    expertise TEXT[] DEFAULT ARRAY[]::TEXT[],
    location VARCHAR(100),
    fee VARCHAR(100) DEFAULT 'Contact for Fee',
    fee_amount NUMERIC(10, 2) DEFAULT 0.00,
    fee_type VARCHAR(50) DEFAULT 'fee', -- 'fee', 'free'
    currency VARCHAR(10) DEFAULT '$',
    years_experience INT DEFAULT 5,
    video_url TEXT,
    availability VARCHAR(255) DEFAULT 'Available for Bookings',
    rating NUMERIC(3, 2) DEFAULT 4.90,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_speakers_user_id ON speakers(user_id);
CREATE INDEX IF NOT EXISTS idx_speakers_location ON speakers(location);
CREATE INDEX IF NOT EXISTS idx_speakers_name ON speakers(name);

-- Speaker Invitations & Speaking Applications Table
CREATE TABLE IF NOT EXISTS speaker_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invite_id VARCHAR(50) UNIQUE NOT NULL,
    speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
    speaker_name VARCHAR(255) NOT NULL,
    speaker_email VARCHAR(255),
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    event_title VARCHAR(255) NOT NULL,
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organizer_name VARCHAR(255),
    message TEXT,
    pitch TEXT,
    session_type VARCHAR(100) DEFAULT 'Keynote', -- 'Keynote', 'Workshop', 'Panel', 'Lightning Talk'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_speaker_invitations_speaker_id ON speaker_invitations(speaker_id);
CREATE INDEX IF NOT EXISTS idx_speaker_invitations_event_id ON speaker_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_speaker_invitations_organizer_id ON speaker_invitations(organizer_id);
CREATE INDEX IF NOT EXISTS idx_speaker_invitations_status ON speaker_invitations(status);

-- Event Confirmed Speakers (Join table for Schedule & Lineup)
CREATE TABLE IF NOT EXISTS event_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Speaker', -- 'Keynote Speaker', 'Panelist', 'Workshop Lead', 'Host'
    topic VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, speaker_id)
);

CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker_id ON event_speakers(speaker_id);
