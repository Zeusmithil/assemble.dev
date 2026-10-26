-- ==========================================================
-- ASSEMBLE.DEV — MIGRATION: VENUES & SPEAKERS TABLES
-- File: supabase/migrations/20261026000000_venues_and_speakers.sql
-- ==========================================================

-- Enable Extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. VENUES & VENUE BOOKINGS
-- ==========================================================

-- Venues Directory Table
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

-- ==========================================================
-- 2. SPEAKERS & INVITATIONS
-- ==========================================================

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
