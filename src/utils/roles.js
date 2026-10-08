export const ROLE_LABELS = {
  attendee: 'Attendee',
  organizer: 'Organizer',
  speaker: 'Speaker',
  sponsor: 'Sponsor',
  venue: 'Venue Provider',
};

export const PROFESSIONAL_ROLES = ['organizer', 'speaker', 'sponsor', 'venue'];

export const getUserCapabilities = (user) => {
  if (!user) return ['attendee'];
  const caps = Array.isArray(user.capabilities) ? [...user.capabilities] : [];
  if (user.role && !caps.includes(user.role)) caps.push(user.role);
  if (!caps.includes('attendee')) caps.push('attendee');
  return caps;
};

export const userHasRoleSetup = (user, role) => {
  if (!user) return false;
  if (role === 'attendee') return true;
  const caps = getUserCapabilities(user);
  if (!caps.includes(role)) return false;
  if (role === 'sponsor') return Boolean(user.sponsorProfile?.companyName || user.sponsorProfile?.budgetRange);
  if (role === 'speaker') return Boolean(user.speakerProfile?.title || user.speakerProfile?.bio);
  if (role === 'venue') return Boolean(user.venueProfile?.venueName || user.venueProfile?.name || user.venueProfile?.address);
  if (role === 'organizer') return Boolean(user.organizationName || user.organizerProfile?.organizationName || user.organizerProfile);
  return caps.includes(role);
};

export const persistUserRecord = (updatedUser) => {
  localStorage.setItem('assemble_session', JSON.stringify(updatedUser));
  const localUsers = JSON.parse(localStorage.getItem('assemble_users') || '[]');
  const email = updatedUser.email?.toLowerCase();
  const idx = localUsers.findIndex((u) => u.email?.toLowerCase() === email);
  if (idx >= 0) {
    localUsers[idx] = { ...localUsers[idx], ...updatedUser };
  } else {
    localUsers.push(updatedUser);
  }
  localStorage.setItem('assemble_users', JSON.stringify(localUsers));
};

export const budgetAmountFromRange = (range, customAmount) => {
  const custom = Number(customAmount);
  if (range === 'Custom amount' && Number.isFinite(custom) && custom > 0) return custom;
  if (range === 'Under €500') return 400;
  if (range === '€500–€1,000') return 750;
  if (range === '€1,000–€5,000') return 3000;
  if (range === '€5,000–€10,000') return 7500;
  if (range === '€10,000+') return 25000;
  return 5000;
};
