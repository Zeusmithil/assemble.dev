# Assemble.dev — End-to-End Backend Architecture & Implementation Plan

> Complete guide to setting up the database, relational schemas, RESTful APIs, real-time WebSockets, and AI services for the **Assemble.dev** event and community platform.

---

## 1. Where to Create & Host the Database

Because Assemble.dev features complex relational connections (Users with multi-role profiles, Events, Ticket issuance, Sponsorship packages & verification codes, Expense ledgers, and Marketplaces), a **PostgreSQL** relational database is strongly recommended.

### Recommended Database Hosting Options

| Provider | Best For | Why Choose It | How to Create |
|---|---|---|---|
| **[Supabase](https://supabase.com/)** *(Recommended)* | Production & MVP | Managed PostgreSQL, generous free tier (500MB), built-in Auth & Realtime engines, SQL GUI editor | 1. Sign up at supabase.com<br>2. "New Project"<br>3. Copy the Connection URI from Project Settings > Database |
| **[Neon.tech](https://neon.tech/)** | Serverless Postgres | Instant branch cloning, zero-scale idle, automatic connection pooling | 1. Sign up at neon.tech<br>2. Create Project<br>3. Copy `DATABASE_URL` |
| **Docker (Local Dev)** | Offline / Local Testing | Fast local development without internet dependency | Run `docker run --name assemble-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16-alpine` |

---

## 2. Tech Stack & Directory Structure

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (`express: ^4.21.2` already installed in root) or Fastify
- **ORM / Migrations:** Prisma ORM (`@prisma/client` + `prisma`)
- **Authentication:** JWT (`jsonwebtoken`) + Password hashing (`bcryptjs`)
- **Real-Time Engine:** Socket.io (`socket.io` for live quizzes, polls, chat in Community Room)
- **AI Integrations:** `@google/genai` (Server-side Gemini 2.0 / 1.5 Flash for activity generation and community due diligence)

### Recommended Project Layout

```
assemble.dev/
├── backend/                       # Dedicated backend directory
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema & relationships
│   │   └── seed.ts                # Seed script with INITIAL_EVENTS, INITIAL_COMMUNITIES
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts              # PrismaClient instance
│   │   │   └── gemini.ts          # Google Gen AI client setup
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── eventController.ts
│   │   │   ├── ticketController.ts
│   │   │   ├── communityController.ts
│   │   │   ├── sponsorshipController.ts
│   │   │   ├── marketplaceController.ts
│   │   │   └── aiController.ts
│   │   ├── middlewares/
│   │   │   ├── auth.ts            # JWT verification
│   │   │   ├── roleCheck.ts       # Role capability validation
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── eventRoutes.ts
│   │   │   ├── ticketRoutes.ts
│   │   │   ├── communityRoutes.ts
│   │   │   ├── sponsorshipRoutes.ts
│   │   │   ├── marketplaceRoutes.ts
│   │   │   └── aiRoutes.ts
│   │   ├── sockets/
│   │   │   └── communityRoom.ts   # WebSocket handlers for live room
│   │   └── server.ts              # Express + HTTP Server + Socket.io entry
│   ├── .env                       # Backend env variables (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY)
│   ├── tsconfig.json
│   └── package.json
└── src/                           # Existing React frontend
```

---

## 3. Database Schema & Tables (Entity Breakdown)

```mermaid
erDiagram
    USERS ||--o{ USER_PROFILES : has
    USERS ||--o{ EVENTS : organizes
    USERS ||--o{ TICKETS : owns
    COMMUNITIES ||--o{ COMMUNITY_MEMBERS : includes
    COMMUNITIES ||--o{ EVENTS : hosts
    COMMUNITIES ||--o{ COMMUNITY_MESSAGES : contains
    EVENTS ||--o{ TICKETS : issues
    EVENTS ||--o{ EVENT_SCHEDULES : has
    EVENTS ||--o{ EVENT_EXPENSES : incurs
    EVENTS ||--o{ SPONSORSHIP_REQUESTS : receives
    EVENTS ||--o{ VENUE_BOOKINGS : reserves
    EVENTS ||--o{ SPEAKER_INVITES : invites
    EVENTS ||--o{ MERCH_ORDERS : orders
```

### 3.1. User & Identity Tables
1. **`users`**
   - `id`: UUID (Primary Key, default `gen_random_uuid()`)
   - `email`: VARCHAR (Unique, Indexed)
   - `password_hash`: VARCHAR
   - `name`: VARCHAR
   - `avatar_url`: VARCHAR (Nullable)
   - `phone`: VARCHAR (Nullable)
   - `active_role`: VARCHAR (`attendee`, `organizer`, `speaker`, `sponsor`, `venue`)
   - `capabilities`: TEXT[] (Array of allowed roles, e.g. `['attendee', 'organizer']`)
   - `created_at`, `updated_at`: TIMESTAMP

2. **`user_profiles`** (Stores specialized profile configurations)
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (Foreign Key -> `users.id`, Unique per role)
   - `role`: VARCHAR (`organizer`, `speaker`, `sponsor`, `venue`)
   - `profile_data`: JSONB
     - *Organizer:* `{ "organizationName": "...", "bio": "...", "website": "..." }`
     - *Speaker:* `{ "headline": "...", "bio": "...", "expertise": ["Design Tokens", "React"], "feeRange": "€1,000–€3,000" }`
     - *Sponsor:* `{ "companyName": "TechNova", "industry": "Cloud", "budgetRange": "€10,000+", "targetCategories": ["Technology"] }`
     - *Venue:* `{ "venueName": "Concert Hall", "address": "...", "city": "Chennai", "capacity": 500 }`

### 3.2. Community & Live Room Tables
3. **`communities`**
   - `id`: UUID (Primary Key)
   - `name`: VARCHAR
   - `slug`: VARCHAR (Unique)
   - `code`: VARCHAR (Unique, e.g., `AI2026X7`, `CODE2026`)
   - `description`: TEXT
   - `category`: VARCHAR
   - `image_url`: VARCHAR
   - `location`: VARCHAR
   - `created_by`: UUID (FK -> `users.id`)
   - `activity_status`: VARCHAR (`Active`, `Highly Active`)
   - `created_at`: TIMESTAMP

4. **`community_members`**
   - `id`: UUID (Primary Key)
   - `community_id`: UUID (FK -> `communities.id`)
   - `user_id`: UUID (FK -> `users.id`)
   - `role`: VARCHAR (`admin`, `moderator`, `member`)
   - `joined_at`: TIMESTAMP

5. **`community_messages`**
   - `id`: UUID (Primary Key)
   - `community_id`: UUID (FK -> `communities.id`, Indexed)
   - `user_id`: UUID (FK -> `users.id`)
   - `text`: TEXT
   - `created_at`: TIMESTAMP

6. **`community_activities`** (Interactive quizzes, rapid-fire, trivia)
   - `id`: UUID (Primary Key)
   - `community_id`: UUID (FK -> `communities.id`)
   - `created_by`: UUID (FK -> `users.id`)
   - `title`: VARCHAR
   - `type`: VARCHAR (`Quiz`, `Trivia`, `RapidFire`, `GuessThePerson`, `Custom`)
   - `config`: JSONB (Questions, options, correct answers, time limit)
   - `status`: VARCHAR (`draft`, `live`, `completed`)
   - `created_at`: TIMESTAMP

### 3.3. Events, Schedule & Expenses
7. **`events`**
   - `id`: UUID (Primary Key)
   - `title`: VARCHAR
   - `description`: TEXT
   - `category`: VARCHAR
   - `format`: VARCHAR (`In-Person`, `Virtual`, `Hybrid`)
   - `start_date`: DATE
   - `start_time`: VARCHAR
   - `location`: VARCHAR
   - `city`: VARCHAR
   - `organizer_id`: UUID (FK -> `users.id`, Indexed)
   - `community_id`: UUID (FK -> `communities.id`, Nullable)
   - `price`: DECIMAL (Default 0)
   - `is_free`: BOOLEAN (Default false)
   - `image_url`: VARCHAR
   - `expected_attendees`: INT
   - `registered_count`: INT (Default 0)
   - `checked_in_count`: INT (Default 0)
   - `budget`: DECIMAL (Default 0)
   - `revenue`: DECIMAL (Default 0)
   - `whats_included`: JSONB (Array of string benefits)
   - `venue_details`: JSONB (`{ name, address, facilities }`)
   - `status`: VARCHAR (`draft`, `published`, `completed`, `cancelled`)
   - `visibility`: VARCHAR (`Public`, `Private`)
   - `created_at`, `updated_at`: TIMESTAMP

8. **`event_schedules`**
   - `id`: UUID (Primary Key)
   - `event_id`: UUID (FK -> `events.id`, Cascade Delete)
   - `time`: VARCHAR
   - `title`: VARCHAR
   - `description`: TEXT (Nullable)
   - `speaker_name`: VARCHAR (Nullable)

9. **`event_expenses`**
   - `id`: UUID (Primary Key)
   - `event_id`: UUID (FK -> `events.id`, Cascade Delete)
   - `title`: VARCHAR
   - `category`: VARCHAR (`Venue`, `Equipment`, `Catering`, `Speakers`, `Swag`, `Marketing`, `Other`)
   - `allocated`: DECIMAL
   - `spent`: DECIMAL
   - `status`: VARCHAR (`Pending`, `Paid`)
   - `date`: DATE

10. **`tickets`**
    - `id`: UUID (Primary Key)
    - `ticket_code`: VARCHAR (Unique - e.g., `TKT-94821` used for QR scanning)
    - `event_id`: UUID (FK -> `events.id`, Indexed)
    - `user_id`: UUID (FK -> `users.id`, Indexed)
    - `tier_name`: VARCHAR (`Standard`, `VIP`, `Early Bird`)
    - `price_paid`: DECIMAL
    - `status`: VARCHAR (`active`, `checked_in`, `cancelled`)
    - `checked_in_at`: TIMESTAMP (Nullable)
    - `created_at`: TIMESTAMP

11. **`saved_events`**
    - `user_id`: UUID (FK -> `users.id`)
    - `event_id`: UUID (FK -> `events.id`)
    - Primary Key: `(user_id, event_id)`

### 3.4. Sponsorship Marketplace
12. **`sponsorship_packages`**
    - `id`: UUID (Primary Key)
    - `event_id`: UUID (FK -> `events.id`)
    - `tier`: VARCHAR (`Title Partner`, `Gold Sponsor`, `Silver Sponsor`, etc.)
    - `amount`: DECIMAL
    - `spots_available`: INT
    - `spots_taken`: INT (Default 0)
    - `perks`: JSONB (Array of string perks)

13. **`sponsorship_requests`**
    - `id`: UUID (Primary Key)
    - `request_id`: VARCHAR (Unique - e.g., `REQ-1092`)
    - `event_id`: UUID (FK -> `events.id`, Indexed)
    - `sponsor_id`: UUID (FK -> `users.id`, Indexed)
    - `requirement`: VARCHAR (`Venue`, `Goodies`, `Speakers`, `Catering`)
    - `amount`: DECIMAL
    - `pitch`: TEXT (Nullable)
    - `status`: VARCHAR (`REQUESTED`, `APPROVED`, `REJECTED`, `FUNDED`)
    - `created_at`: TIMESTAMP

14. **`sponsorship_codes`**
    - `id`: UUID (Primary Key)
    - `code`: VARCHAR (Unique - e.g., `TN2026-75K`)
    - `sponsor_id`: UUID (FK -> `users.id`)
    - `event_id`: UUID (FK -> `events.id`, Nullable)
    - `amount`: DECIMAL
    - `requirement`: VARCHAR
    - `status`: VARCHAR (`Active`, `Redeemed`, `Expired`)
    - `redeemed_at`: TIMESTAMP (Nullable)

### 3.5. Venues, Speakers & Merch Marketplace
15. **`venues`**
    - `id`: UUID (Primary Key)
    - `owner_id`: UUID (FK -> `users.id`)
    - `name`: VARCHAR
    - `address`: TEXT
    - `city`: VARCHAR
    - `capacity`: INT
    - `hourly_rate`: DECIMAL
    - `daily_rate`: DECIMAL
    - `facilities`: TEXT[]
    - `images`: TEXT[]

16. **`venue_bookings`**
    - `id`: UUID (Primary Key)
    - `booking_id`: VARCHAR (Unique - e.g., `VB-4421`)
    - `venue_id`: UUID (FK -> `venues.id`)
    - `event_id`: UUID (FK -> `events.id`)
    - `organizer_id`: UUID (FK -> `users.id`)
    - `booking_date`: DATE
    - `status`: VARCHAR (`Pending`, `Approved`, `Declined`)
    - `amount`: DECIMAL

17. **`speaker_invites`**
    - `id`: UUID (Primary Key)
    - `invite_id`: VARCHAR (Unique - e.g., `SPK-9012`)
    - `speaker_id`: UUID (FK -> `users.id`)
    - `event_id`: UUID (FK -> `events.id`)
    - `organizer_id`: UUID (FK -> `users.id`)
    - `session_title`: VARCHAR
    - `status`: VARCHAR (`Pending`, `Accepted`, `Declined`)
    - `honorarium`: DECIMAL

18. **`merch_orders`**
    - `id`: UUID (Primary Key)
    - `order_id`: VARCHAR (Unique - e.g., `MERCH-81204`)
    - `event_id`: UUID (FK -> `events.id`)
    - `organizer_id`: UUID (FK -> `users.id`)
    - `items`: JSONB (Product details, quantities, custom designs)
    - `total_amount`: DECIMAL
    - `status`: VARCHAR (`submitted`, `confirmed`, `production`, `quality`, `shipped`, `delivered`)
    - `delivery_date`: DATE

---

## 4. Prisma Schema Template (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  passwordHash  String
  name          String
  avatarUrl     String?
  phone         String?
  activeRole    String         @default("attendee")
  capabilities  String[]       @default(["attendee"])
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  profiles      UserProfile[]
  events        Event[]        @relation("OrganizedEvents")
  tickets       Ticket[]
  memberships   CommunityMember[]
  messages      CommunityMessage[]
  requests      SponsorshipRequest[]
  bookings      VenueBooking[]
  savedEvents   SavedEvent[]
}

model UserProfile {
  id          String   @id @default(uuid())
  userId      String
  role        String
  profileData Json
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
}

model Community {
  id             String             @id @default(uuid())
  name           String
  code           String             @unique
  description    String
  category       String
  imageUrl       String?
  location       String?
  activityStatus String             @default("Active")
  createdAt      DateTime           @default(now())

  members        CommunityMember[]
  messages       CommunityMessage[]
  activities     CommunityActivity[]
  events         Event[]
}

model CommunityMember {
  id          String    @id @default(uuid())
  communityId String
  userId      String
  role        String    @default("member")
  joinedAt    DateTime  @default(now())

  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([communityId, userId])
}

model CommunityMessage {
  id          String    @id @default(uuid())
  communityId String
  userId      String
  text        String
  createdAt   DateTime  @default(now())

  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CommunityActivity {
  id          String    @id @default(uuid())
  communityId String
  title       String
  type        String
  config      Json
  status      String    @default("draft")
  createdAt   DateTime  @default(now())

  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
}

model Event {
  id                String               @id @default(uuid())
  title             String
  description       String
  category          String
  format            String               @default("In-Person")
  startDate         DateTime
  startTime         String
  location          String
  city              String
  organizerId       String
  communityId       String?
  price             Decimal              @default(0)
  isFree            Boolean              @default(false)
  imageUrl          String?
  expectedAttendees Int                  @default(100)
  registeredCount   Int                  @default(0)
  checkedInCount    Int                  @default(0)
  budget            Decimal              @default(0)
  revenue           Decimal              @default(0)
  status            String               @default("published")
  visibility        String               @default("Public")
  whatsIncluded     Json?
  venueDetails      Json?
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt

  organizer         User                 @relation("OrganizedEvents", fields: [organizerId], references: [id])
  community         Community?           @relation(fields: [communityId], references: [id])
  schedules         EventSchedule[]
  expenses          EventExpense[]
  tickets           Ticket[]
  packages          SponsorshipPackage[]
  sponsorRequests   SponsorshipRequest[]
  venueBookings     VenueBooking[]
  savedBy           SavedEvent[]
}

model EventSchedule {
  id          String   @id @default(uuid())
  eventId     String
  time        String
  title       String
  description String?
  speakerName String?
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}

model EventExpense {
  id         String   @id @default(uuid())
  eventId    String
  title      String
  category   String
  allocated  Decimal  @default(0)
  spent      Decimal  @default(0)
  status     String   @default("Pending")
  date       DateTime @default(now())
  event      Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}

model Ticket {
  id          String    @id @default(uuid())
  ticketCode  String    @unique
  eventId     String
  userId      String
  tierName    String    @default("General")
  pricePaid   Decimal   @default(0)
  status      String    @default("active")
  checkedInAt DateTime?
  createdAt   DateTime  @default(now())

  event       Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SavedEvent {
  userId    String
  eventId   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  event     Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@id([userId, eventId])
}

model SponsorshipPackage {
  id             String   @id @default(uuid())
  eventId        String
  tier           String
  amount         Decimal
  spotsAvailable Int      @default(1)
  spotsTaken     Int      @default(0)
  perks          Json
  event          Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
}

model SponsorshipRequest {
  id          String   @id @default(uuid())
  requestId   String   @unique
  eventId     String
  sponsorId   String
  requirement String
  amount      Decimal
  pitch       String?
  status      String   @default("REQUESTED")
  createdAt   DateTime @default(now())

  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  sponsor     User     @relation(fields: [sponsorId], references: [id], onDelete: Cascade)
}

model VenueBooking {
  id          String   @id @default(uuid())
  bookingId   String   @unique
  venueId     String
  eventId     String
  organizerId String
  bookingDate DateTime
  status      String   @default("Pending")
  amount      Decimal
  createdAt   DateTime @default(now())

  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  organizer   User     @relation(fields: [organizerId], references: [id], onDelete: Cascade)
}
```

---

## 5. Complete REST API Specifications

Base URL: `http://localhost:5000/api/v1`  
Protected routes require header: `Authorization: Bearer <JWT_TOKEN>`

### 5.1. Authentication & Profiles (`/api/v1/auth`, `/api/v1/users`)
- `POST /auth/signup`
  - Body: `{ email, password, name, role }`
  - Response: `{ user, token }`
- `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ user, token }`
- `GET /auth/me`
  - Response: User session, active role, permissions & capabilities
- `POST /auth/switch-role`
  - Body: `{ role: 'organizer' }`
- `PUT /users/profile`
  - Body: `{ role, profileData }` (Updates speaker/sponsor/venue/organizer profiles)

### 5.2. Events & Management (`/api/v1/events`)
- `GET /events`
  - Query Params: `?city=Chennai&category=Technology&search=Architecture&page=1`
- `POST /events`
  - Body: Complete event creation wizard payload (details, schedule items, initial expenses, sponsorship packages)
- `GET /events/:id`
  - Response: Event details with linked speakers, schedule, venue, and sponsorship status
- `PUT /events/:id`
  - Update event details, status (`published`, `cancelled`)
- `POST /events/:id/save`
  - Bookmark / save event for current attendee
- `GET /events/user/saved`
  - Fetch attendee's bookmarked events
- `GET /events/:id/expenses`
  - List allocated vs spent expenses and remaining budget
- `POST /events/:id/expenses`
  - Body: `{ title, category, allocated, spent, status }`

### 5.3. Tickets & Attendee Check-In (`/api/v1/tickets`)
- `POST /tickets/book`
  - Body: `{ eventId, tierName, price }`
  - Response: `{ ticketCode, qrPayload, status }`
- `GET /tickets/my-tickets`
  - List all tickets purchased/claimed by current user
- `POST /tickets/verify-qr`
  - Body: `{ ticketCode }`
  - Checks in attendee, updates `checkedInCount` on event, prevents double check-ins

### 5.4. Communities & Live Room (`/api/v1/communities`)
- `GET /communities`
  - List all registered communities
- `GET /communities/:id`
  - Community stats, member counts, organizers, past events
- `POST /communities/:id/join`
  - Toggle membership
- `GET /communities/:id/messages`
  - Retrieve recent chat messages
- `GET /communities/:id/analysis`
  - Compute due-diligence credibility metrics for prospective sponsors

### 5.5. Sponsorship Management (`/api/v1/sponsorships`)
- `GET /sponsorships/requests`
  - Filter by organizer's events or sponsor's applications
- `POST /sponsorships/request`
  - Body: `{ eventId, requirement, amount, pitch }`
- `POST /sponsorships/:requestId/respond`
  - Body: `{ status: 'APPROVED' | 'REJECTED' }`
  - Generates sponsorship verification code (`TN2026-75K`) upon approval
- `POST /sponsorships/redeem-code`
  - Body: `{ code, eventId }`
  - Validates and applies sponsored funds to event expenses

### 5.6. Marketplaces (`/api/v1/marketplace`)
- `GET /marketplace/venues`
  - Browse venue listings by city and capacity
- `POST /marketplace/venues/book`
  - Reserve venue for an event
- `GET /marketplace/speakers`
  - Browse available speakers by expertise and fee
- `POST /marketplace/speakers/invite`
  - Send speaking invite with proposed topic and honorarium
- `POST /marketplace/merch/orders`
  - Body: `{ eventId, items: [...], totalAmount }`
- `GET /marketplace/merch/orders`
  - Track order production and shipment status

### 5.7. AI Services via Gemini (`/api/v1/ai`)
- `POST /ai/generate-activity`
  - Body: `{ type: 'Quiz', topic: 'AI & ML', count: 5, difficulty: 'Medium' }`
  - Calls Gemini 2.0 / 1.5 Flash via `@google/genai` to return structured JSON questions with options and explanations
- `POST /ai/community-diligence`
  - Body: `{ communityId }`
  - Generates executive sponsor ROI summary based on past event attendance and repeat attendee rates

---

## 6. Real-Time WebSocket Architecture (Socket.io)

For the **Community Room** (`src/components/views/CommunityRoomView.jsx`), real-time sync is essential for live interaction:

```
Browser Client                                    Backend (Socket.io)
      |                                                    |
      |--- emit('room:join', { communityId, user }) ------>| Join socket room
      |                                                    |
      |--- emit('chat:send', { text }) ------------------->| Save message in DB
      |<-- emit('chat:message', message) ------------------| Broadcast to room members
      |                                                    |
      |--- emit('activity:start', { activityId }) -------->| Organizer launches live quiz
      |<-- emit('activity:question', currentQuestion) -----| Broadcast to participants
      |                                                    |
      |--- emit('activity:answer', { questionId, ans }) -->| Calculate participant score
      |<-- emit('activity:leaderboard', topScores) --------| Live leaderboard update
```

---

## 7. Step-by-Step Implementation Roadmap

### Step 1: Initialize Backend Directory & Dependencies
Run in root terminal:
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv jsonwebtoken bcryptjs @prisma/client socket.io @google/genai
npm install -D prisma typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs ts-node nodemon
npx tsc --init
npx prisma init
```

### Step 2: Configure Environment Variables (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/assemble_dev?schema=public"
JWT_SECRET="assemble_super_secret_jwt_key_2026"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
FRONTEND_URL="http://localhost:3000"
```

### Step 3: Run Database Migrations
Copy the Prisma schema from Section 4 to `backend/prisma/schema.prisma`, then run:
```bash
npx prisma db push
```

### Step 4: Seed Initial Data
Create `backend/prisma/seed.ts` to insert the initial data from `src/data/initialData.js` (`INITIAL_EVENTS`, `INITIAL_COMMUNITIES`, etc.) so the database immediately matches the current UI mock state:
```bash
npx prisma db seed
```

### Step 5: Connect Frontend to Backend
1. Create an API helper in `src/utils/api.js`:
   ```javascript
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

   export const apiRequest = async (endpoint, options = {}) => {
     const token = localStorage.getItem('assemble_token');
     const headers = {
       'Content-Type': 'application/json',
       ...(token ? { Authorization: `Bearer ${token}` } : {}),
       ...options.headers,
     };
     const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
     if (!res.ok) throw new Error((await res.json()).message || 'API Error');
     return res.json();
   };
   ```
2. Replace `localStorage.getItem('assemble_events')` calls in `App.jsx` with calls to `apiRequest('/events')`.
