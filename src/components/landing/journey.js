// Content and colour identity for the landing-page role journey.
// `rgb` drives the 3D scene and glows; `signupRole` is the account role the CTA registers.

export const HERO_SCENE = {
  id: 'hero',
  rgb: [196, 204, 232],
  inkRgb: [72, 78, 98],
};

export const ROLE_JOURNEY = [
  {
    id: 'attendee',
    signupRole: 'attendee',
    label: 'Attendee',
    rgb: [140, 202, 244],
    inkRgb: [43, 120, 176],
    kicker: 'Discover',
    title: ['Find the rooms', 'worth being in.'],
    description:
      'Browse events across your city, register in seconds and walk in with a pass already on your phone. Every ticket is a way into a community that keeps going after the lights come up.',
    benefits: [
      { icon: 'travel_explore', title: 'Discover nearby', text: 'Filter by city, format, price and topic.' },
      { icon: 'confirmation_number', title: 'Instant passes', text: 'QR tickets that check you in at the door.' },
      { icon: 'diversity_3', title: 'Join communities', text: 'Stay connected with the people you met.' },
      { icon: 'bookmark', title: 'Save for later', text: 'Keep a shortlist of what you want to attend.' },
    ],
    cta: 'Join as an Attendee',
  },
  {
    id: 'organizer',
    signupRole: 'organizer',
    label: 'Organizer',
    rgb: [185, 168, 242],
    inkRgb: [106, 82, 199],
    kicker: 'Create',
    title: ['Run the whole event', 'from one place.'],
    description:
      'Plan, publish and operate events with venues, speakers, volunteers and sponsors in a single workspace. Track every registration and payment as it happens.',
    benefits: [
      { icon: 'edit_calendar', title: 'Publish in minutes', text: 'Tiers, schedules and capacity in one flow.' },
      { icon: 'apartment', title: 'Book venues & speakers', text: 'Source both directly from the marketplace.' },
      { icon: 'groups', title: 'Coordinate teams', text: 'Review volunteer applications and assign roles.' },
      { icon: 'monitoring', title: 'Live metrics', text: 'Registrations, revenue and check-ins in real time.' },
    ],
    cta: 'Become an Organizer',
  },
  {
    id: 'venue',
    signupRole: 'venue',
    label: 'Venue Provider',
    rgb: [230, 164, 190],
    inkRgb: [176, 74, 118],
    kicker: 'Host',
    title: ['Spaces that bring', 'people together.'],
    description:
      'List your auditoriums, lofts and halls where organizers are already looking. Share capacity, facilities and photos, then accept the bookings that fit your calendar.',
    benefits: [
      { icon: 'apartment', title: 'List your spaces', text: 'Photos, capacity, facilities and pricing.' },
      { icon: 'inbox', title: 'Booking requests', text: 'Accept or decline organizer requests.' },
      { icon: 'calendar_month', title: 'Stay booked', text: 'Confirmed events on a single schedule.' },
      { icon: 'star', title: 'Build trust', text: 'Ratings from the organizers you host.' },
    ],
    cta: 'List Your Venue',
  },
  {
    id: 'speaker',
    signupRole: 'speaker',
    label: 'Speaker',
    rgb: [240, 182, 156],
    inkRgb: [184, 93, 53],
    kicker: 'Share',
    title: ['Your ideas,', 'on the right stage.'],
    description:
      'Build a speaker profile organizers can find, accept invitations that fit your expertise and pitch yourself to events that need your voice.',
    benefits: [
      { icon: 'record_voice_over', title: 'Get discovered', text: 'Appear in the speaker marketplace by topic.' },
      { icon: 'mail', title: 'Manage invitations', text: 'Accept or decline offers in one inbox.' },
      { icon: 'event_available', title: 'Apply to speak', text: 'Pitch sessions directly to organizers.' },
    ],
    cta: 'Join as a Speaker',
  },
  {
    id: 'volunteer',
    signupRole: 'volunteer',
    label: 'Volunteer',
    rgb: [163, 201, 168],
    inkRgb: [69, 127, 80],
    kicker: 'Contribute',
    title: ['The team that makes', 'it all happen.'],
    description:
      'Volunteer for the events you care about. Apply when you register, join the crew, take on a role on the day and get closer to the communities behind every event.',
    benefits: [
      { icon: 'volunteer_activism', title: 'Find opportunities', text: 'Apply to volunteer on any event page.' },
      { icon: 'checklist', title: 'Clear responsibilities', text: 'Know your role before the doors open.' },
      { icon: 'qr_code_scanner', title: 'Run the front line', text: 'Help with check-in, stage and hospitality.' },
    ],
    cta: 'Join as a Volunteer',
  },
  {
    id: 'sponsor',
    signupRole: 'sponsor',
    label: 'Sponsor',
    rgb: [226, 203, 152],
    inkRgb: [142, 109, 34],
    kicker: 'Partner',
    title: ['Back the moments', 'that matter.'],
    description:
      'Find events and communities that match your audience, evaluate their real reach and back the ones you believe in — your support is added to the event instantly.',
    benefits: [
      { icon: 'query_stats', title: 'Evaluate communities', text: 'Attendance, engagement and past partners.' },
      { icon: 'handshake', title: 'Review proposals', text: 'Approve requests from organizers directly.' },
      { icon: 'verified', title: 'Linked instantly', text: 'Approved sponsorships appear on the event.' },
      { icon: 'trending_up', title: 'Measure impact', text: 'See where your budget is making a difference.' },
    ],
    cta: 'Become a Sponsor',
  },
];

export const FINAL_SCENE = {
  id: 'final',
  rgb: [214, 210, 236],
  inkRgb: [84, 76, 120],
};

export const SCENES = [HERO_SCENE, ...ROLE_JOURNEY, FINAL_SCENE];

export const rgbString = (rgb, alpha = 1) => `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]} / ${alpha})`;

// Role colour for text and icons: the pastel in dark mode, a deeper shade in light mode
// (pastels are too faint as text on a light background). Falls back to the pastel.
export const inkColor = (rgb) => {
  const role = ROLE_JOURNEY.find((r) => r.rgb.every((v, i) => v === rgb[i]));
  return role ? `var(--${role.id}-ink)` : rgbString(rgb);
};
