// Canonical sponsorship request statuses. Older saved data may still use
// legacy labels, so always compare through getSponsorshipStage().
export const SPONSORSHIP_STATUS = {
  REQUESTED: 'Requested',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const APPROVED_LABELS = ['approved', 'sponsorship code generated', 'active', 'verified'];
const REJECTED_LABELS = ['rejected', 'declined'];

// Returns 'approved' | 'rejected' | 'pending'
export const getSponsorshipStage = (status) => {
  const s = String(status || '').trim().toLowerCase();
  if (APPROVED_LABELS.includes(s)) return 'approved';
  if (REJECTED_LABELS.includes(s)) return 'rejected';
  return 'pending';
};

export const isSponsorshipApproved = (req) => getSponsorshipStage(req?.status) === 'approved';
export const isSponsorshipRejected = (req) => getSponsorshipStage(req?.status) === 'rejected';
export const isSponsorshipPending = (req) => getSponsorshipStage(req?.status) === 'pending';

// What an event can seek sponsorship for. `id` matches the requirement values
// used by sponsorship requests and offers.
export const SPONSORSHIP_NEEDS = [
  { id: 'Venue', label: 'Venue & stage', icon: 'apartment' },
  { id: 'Speakers', label: 'Speakers & travel', icon: 'record_voice_over' },
  { id: 'Goodies', label: 'Swag & goodies', icon: 'redeem' },
  { id: 'Catering', label: 'Food & drinks', icon: 'restaurant' },
  { id: 'AV', label: 'A/V & streaming', icon: 'videocam' },
  { id: 'General', label: 'General support', icon: 'volunteer_activism' },
];

// Older events describe needs in free text; match those by keyword.
const NEED_KEYWORDS = {
  Venue: /venue|hall|stage|backdrop|rigging/i,
  Speakers: /speaker|keynote|travel|honorarium/i,
  Goodies: /swag|goodies|merch|kit|notebook|box|lanyard/i,
  Catering: /catering|lunch|food|coffee|dinner|drinks|buffet/i,
  AV: /a\/v|audio|video|stream|led|screen|sound|lighting/i,
};

// Does this funding need (event.sponsorshipOpportunities item) cover the requirement?
export const sponsorshipNeedMatches = (need, requirement) => {
  if (!need) return false;
  if (need.category) return need.category === requirement || requirement === 'General' || need.category === 'General';
  if (requirement === 'General') return true;
  const pattern = NEED_KEYWORDS[requirement];
  return pattern ? pattern.test(`${need.requirement || ''} ${need.description || ''}`) : false;
};
