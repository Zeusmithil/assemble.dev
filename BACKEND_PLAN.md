# Assemble.dev — Python (FastAPI) + Supabase Backend Architecture & Plan

> Complete guide to setting up **Supabase** (PostgreSQL, Auth, Storage) with a **Python (FastAPI)** backend for the **Assemble.dev** platform.

---

## 1. Supabase Setup (Your Next Steps)

Since you are using **Supabase**, here is the exact immediate checklist:

### Step 1.1: Create your Supabase Project
1. Log in at **[supabase.com](https://supabase.com/)** and click **"New Project"**.
2. Name your project (e.g. `assemble-backend`), set a strong database password, and choose a region close to your target users (e.g., `South Asia (Mumbai)` or `Southeast Asia (Singapore)`).
3. Once the database is provisioned, go to **Project Settings > API** and copy:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **Project API Key (`anon` / `public`)**
   - **Project API Key (`service_role` / `secret`)** (Keep this secure; used only in the Python backend)
4. Go to **Project Settings > Database** and copy the **Connection string** (URI).

### Step 1.2: Run the SQL Schema in Supabase SQL Editor
Go to the **SQL Editor** tab in your Supabase dashboard and execute the SQL schema provided in **Section 3** below. This instantly creates all tables, indexes, and relations.

---

## 2. Python Backend Tech Stack & Directory Structure

- **Language:** Python 3.10+
- **Framework:** **FastAPI** (`fastapi[standard]`, `uvicorn`) — high performance, native async, automatic interactive Swagger docs at `http://localhost:8000/docs`.
- **Database & Auth:** **Supabase Python SDK** (`supabase>=2.0.0`) + **PostgreSQL** (`asyncpg` / `psycopg2`).
- **Data Validation & Serializers:** **Pydantic v2** (`pydantic`, `pydantic-settings`).
- **Real-Time Communication:** FastAPI WebSockets (`websockets`) for the live Community Room (chat, quizzes, leaderboard).
- **AI Integrations:** Google Gemini SDK (`google-genai`) for quiz generation and sponsor due diligence.

### Project Layout (`backend/`)

```
assemble.dev/
├── backend/                       # Python Backend directory
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI entrypoint & router registry
│   │   ├── config.py              # Environment configuration (Pydantic Settings)
│   │   ├── dependencies.py        # Supabase client & Auth dependencies
│   │   ├── models/                # Pydantic schemas (Request / Response validation)
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── event.py
│   │   │   ├── ticket.py
│   │   │   ├── community.py
│   │   │   ├── sponsorship.py
│   │   │   └── marketplace.py
│   │   ├── routers/               # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # User authentication & role switching
│   │   │   ├── events.py          # Events CRUD, budgeting, analytics
│   │   │   ├── tickets.py         # Ticket booking & QR door check-in
│   │   │   ├── communities.py     # Communities, discussions, due diligence
│   │   │   ├── sponsorships.py    # Sponsorship requests, funding, verification codes
│   │   │   ├── marketplace.py     # Venues, speakers, goodies merchandise orders
│   │   │   └── ai.py              # Gemini AI quiz generation & analytics
│   │   ├── websockets/
│   │   │   ├── __init__.py
│   │   │   └── community_room.py  # WebSocket manager for live room sync
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── supabase_client.py # Supabase client singleton
│   │       └── gemini_service.py  # Gemini AI calls
│   ├── scripts/
│   │   └── seed_data.py           # Seed script matching INITIAL_EVENTS & INITIAL_COMMUNITIES
│   ├── .env                       # Environment variables
│   ├── requirements.txt           # Python dependencies
│   └── README.md
└── src/                           # Existing React frontend
```

---

## 3. Supabase PostgreSQL Schema (Run in Supabase SQL Editor)

Copy and run this in your **Supabase Dashboard > SQL Editor**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
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

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    profile_data JSONB DEFAULT '{}'::JSONB,
    UNIQUE(user_id, role)
);

-- 2. COMMUNITIES & LIVE ROOM
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

-- 3. EVENTS, TICKETS & EXPENSES
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

-- 4. SPONSORSHIPS & MARKETPLACE
CREATE TABLE IF NOT EXISTS sponsorship_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(50) UNIQUE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    requirement VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'REQUESTED', -- 'REQUESTED', 'APPROVED', 'REJECTED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- 5. VENUES & SPEAKERS (MARKETPLACE & DIRECTORY)
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

CREATE TABLE IF NOT EXISTS event_speakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Speaker', -- 'Keynote Speaker', 'Panelist', 'Workshop Lead', 'Host'
    topic VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, speaker_id)
);
```

---

## 4. Python Backend Implementation Files

### 4.1. `backend/requirements.txt`
```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
supabase==2.11.0
pydantic==2.10.4
pydantic-settings==2.7.0
python-dotenv==1.0.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
websockets==14.1
google-genai==0.1.1
httpx==0.28.1
```

### 4.2. `backend/.env`
```env
PORT=8000
ENVIRONMENT=development
FRONTEND_URL=http://localhost:3000

# Supabase Credentials (from Project Settings > API)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# JWT & AI
JWT_SECRET=super_secret_jwt_key_assemble_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4.3. `backend/app/config.py`
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:3000"
    
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    
    JWT_SECRET: str
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
```

### 4.4. `backend/app/services/supabase_client.py`
```python
from supabase import create_client, Client
from app.config import settings

# Admin client with Service Role for privileged operations (backend API)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# Public client
supabase_public: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
```

### 4.5. `backend/app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, events, tickets, communities, sponsorships, marketplace, ai
from app.websockets import community_room

app = FastAPI(
    title="Assemble.dev API",
    description="Python FastAPI backend powered by Supabase PostgreSQL for events & communities",
    version="1.0.0"
)

# CORS setup for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(events.router, prefix="/api/v1/events", tags=["Events"])
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["Tickets & Check-In"])
app.include_router(communities.router, prefix="/api/v1/communities", tags=["Communities"])
app.include_router(sponsorships.router, prefix="/api/v1/sponsorships", tags=["Sponsorships"])
app.include_router(marketplace.router, prefix="/api/v1/marketplace", tags=["Marketplace"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["Gemini AI"])

# WebSocket for Community Live Room
app.include_router(community_room.router, tags=["Live WebSockets"])

@app.get("/health")
def health_check():
    return {"status": "ok", "framework": "FastAPI", "database": "Supabase"}
```

### 4.6. Example Router: `backend/app/routers/events.py`
```python
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
from app.services.supabase_client import supabase_admin
from pydantic import BaseModel

router = APIRouter()

class EventCreate(BaseModel):
    title: str
    description: str
    category: str
    format: str = "In-Person"
    startDate: str
    time: Optional[str] = "10:00 AM"
    location: str
    city: str
    price: float = 0.0
    isFree: bool = True
    expectedAttendees: int = 100
    ticketTiers: Optional[list] = []
    swagOrder: Optional[list] = None
    imageUrl: Optional[str] = ""

@router.get("/")
def get_events(city: Optional[str] = None, category: Optional[str] = None):
    query = supabase_admin.table("events").select("*")
    if city and city != "All Cities":
        query = query.eq("city", city)
    if category and category != "All":
        query = query.eq("category", category)
    
    res = query.order("created_at", desc=True).execute()
    return res.data

@router.post("/")
def create_event(payload: EventCreate):
    data = payload.model_dump()
    # Map camelCase to database columns if needed
    db_payload = {
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "format": data["format"],
        "start_date": data["startDate"],
        "start_time": data.get("time"),
        "location": data["location"],
        "city": data["city"],
        "price": data["price"],
        "is_free": data["isFree"],
        "expected_attendees": data["expectedAttendees"],
        "ticket_tiers": data.get("ticketTiers") or [],
        "swag_order": data.get("swagOrder"),
        "image_url": data.get("imageUrl"),
        "status": "published"
    }
    res = supabase_admin.table("events").insert(db_payload).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create event")
    return res.data[0]
```

### 4.7. Example Router: Door Check-In in `backend/app/routers/tickets.py`
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.supabase_client import supabase_admin

router = APIRouter()

class CheckInRequest(BaseModel):
    ticket_id: str

@router.post("/check-in")
def check_in_ticket(req: CheckInRequest):
    ticket_id = req.ticket_id.strip()
    
    # 1. Fetch ticket
    res = supabase_admin.table("tickets").select("*").ilike("ticket_id", ticket_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket = res.data[0]
    if ticket["status"] == "checked-in":
        return {
            "success": False,
            "message": f"Already checked in! {ticket['user_name']} was admitted earlier.",
            "ticket": ticket
        }
    
    # 2. Mark checked in
    supabase_admin.table("tickets").update({"status": "checked-in"}).eq("id", ticket["id"]).execute()
    
    # 3. Increment event checked-in count
    supabase_admin.rpc("increment_event_checkins", {"evt_id": ticket["event_id"]}).execute()
    
    return {
        "success": True,
        "message": f"✓ Admitted! {ticket['user_name']} checked in successfully.",
        "ticket": ticket
    }
```

---

## 5. Connecting the React Frontend to Python + Supabase

In the React frontend, add a simple API helper:

### `src/utils/api.js`
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error((await res.json()).detail || 'API Error');
    return res.json();
  },
  post: async (endpoint, data) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'API Error');
    return res.json();
  },
};
```

---

## 6. Execution Roadmap

| Step | Action | Command / Tool |
|---|---|---|
| **1. Create Project** | Create Supabase project & get API keys | [supabase.com](https://supabase.com) dashboard |
| **2. Run Schemas** | Execute Section 3 SQL in Supabase SQL editor | Supabase SQL Editor |
| **3. Setup Backend** | Create Python virtual environment & install requirements | `python -m venv venv`<br>`source venv/bin/activate` (or `venv\Scripts\activate`)<br>`pip install -r requirements.txt` |
| **4. Configure .env** | Paste Supabase URL and Service Role Key into `backend/.env` | Text Editor |
| **5. Run FastAPI** | Start backend server with auto-reload | `uvicorn app.main:app --reload --port 8000` |
| **6. Interactive Docs** | Verify routes and test APIs visually | Open `http://localhost:8000/docs` in browser |
