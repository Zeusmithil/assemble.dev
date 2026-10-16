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
