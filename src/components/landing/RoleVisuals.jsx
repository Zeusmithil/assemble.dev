import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Depth, TiltPanel, Avatar, Icon, EASE } from './primitives';
import { ROLE_JOURNEY, rgbString, inkColor } from './journey';

const roleRgb = (id) => ROLE_JOURNEY.find((r) => r.id === id).rgb;

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Deterministic QR-like pattern from a string, purely decorative
const QrPattern = ({ seed, rgb, size = 64 }) => {
  const cells = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return Array.from({ length: 81 }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      const x = i % 9;
      const y = Math.floor(i / 9);
      const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
      return finder ? !(x % 2 === 1 && y % 2 === 1 && x !== 7 && y !== 7) : (h >> 16) % 2 === 0;
    });
  }, [seed]);
  return (
    <div className="grid grid-cols-9 gap-[2px] p-1.5 rounded-lg keep-light bg-white" style={{ width: size, height: size }} aria-hidden="true">
      {cells.map((on, i) => (
        <span key={i} className="rounded-[1px]" style={{ background: on ? '#0b0d13' : 'transparent' }} />
      ))}
    </div>
  );
};

const Chip = ({ rgb, icon, children, className = '' }) => (
  <div className={`glass rounded-full pl-2 pr-3.5 py-1.5 flex items-center gap-2 text-[12px] text-fg/85 ${className}`}>
    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: rgbString(rgb, 0.18), color: inkColor(rgb) }}>
      <Icon name={icon} className="!text-[15px]" />
    </span>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Attendee: floating event previews, a glass ticket and community activity
// ---------------------------------------------------------------------------
export const AttendeeVisual = ({ progress, events }) => {
  const rgb = roleRgb('attendee');
  const list = events.filter((e) => e.status === 'published').slice(0, 3);
  const [main, second, third] = list;
  if (!main) return null;

  const EventCard = ({ evt, className, style }) => (
    <div className={`glass-strong rounded-3xl overflow-hidden w-[300px] ${className}`} style={style}>
      <div className="h-36 relative">
        <img src={evt.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        <span className="absolute top-3 left-3 glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-fg/90">
          {evt.category}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <p className="font-geist text-[15px] font-semibold text-fg leading-snug line-clamp-2">{evt.title}</p>
        <p className="text-[12px] text-fg/55">
          {formatDate(evt.startDate)} · {evt.city}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative h-[460px] sm:h-[520px] w-full max-w-[560px] mx-auto" style={{ perspective: 1400 }}>
      {third && (
        <Depth progress={progress} depth={0.4} className="absolute right-0 top-2 hidden sm:block">
          <EventCard evt={third} className="opacity-60 scale-[0.82] origin-top-right" style={{ transform: 'perspective(1200px) rotateY(-16deg)' }} />
        </Depth>
      )}
      {second && (
        <Depth progress={progress} depth={0.7} className="absolute right-10 top-16 hidden sm:block">
          <EventCard evt={second} className="opacity-80 scale-[0.9] origin-top-right" style={{ transform: 'perspective(1200px) rotateY(-12deg)' }} />
        </Depth>
      )}
      <Depth progress={progress} depth={1} className="absolute left-0 sm:left-6 top-10 sm:top-24 z-10">
        <TiltPanel className="glass-strong glass-sheen rounded-3xl overflow-hidden w-[300px] sm:w-[320px]">
          <div className="h-40 relative">
            <img src={main.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: inkColor(rgb) }}>
                {main.category} · {main.city}
              </p>
              <p className="font-geist text-lg font-semibold text-fg leading-snug mt-1">{main.title}</p>
              <p className="text-[12px] text-fg/55 mt-1">
                {formatDate(main.startDate)} · {main.time}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {['Priya N', 'Arjun K', 'Meera S', 'Rahul V'].map((n, i) => (
                  <span key={n} style={{ marginLeft: i ? -8 : 0 }}>
                    <Avatar name={n} rgb={i % 2 ? [236, 238, 246] : rgb} size={26} />
                  </span>
                ))}
                <span className="ml-2.5 text-[12px] text-fg/65">{main.registeredCount} going</span>
              </div>
              <span className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-ink-950" style={{ background: rgbString(rgb) }}>
                Register
              </span>
            </div>
          </div>
        </TiltPanel>
      </Depth>
      <Depth progress={progress} depth={1.6} className="absolute right-0 sm:right-4 bottom-0 sm:bottom-6 z-20">
        <div className="glass-strong rounded-2xl p-4 flex items-center gap-4 w-[250px]">
          <QrPattern seed={main.id} rgb={rgb} />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fg/50">Your pass</p>
            <p className="font-mono text-[13px] text-fg mt-0.5">CN-24816</p>
            <p className="text-[12px] mt-1.5 flex items-center gap-1" style={{ color: inkColor(rgb) }}>
              <Icon name="check_circle" className="!text-[15px]" /> Confirmed
            </p>
          </div>
        </div>
      </Depth>
      <Depth progress={progress} depth={2} className="absolute left-2 sm:left-0 bottom-24 sm:bottom-auto sm:top-4 z-20 hidden sm:block">
        <Chip rgb={rgb} icon="diversity_3">Joined AI Community</Chip>
      </Depth>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Organizer: layered event console with timeline, metrics and supplier panels
// ---------------------------------------------------------------------------
export const OrganizerVisual = ({ progress, events }) => {
  const rgb = roleRgb('organizer');
  const reduced = useReducedMotion();
  const evt = events.find((e) => e.schedule?.length) || events[0];
  if (!evt) return null;
  const capacity = evt.expectedAttendees || 500;
  const pct = Math.min(100, Math.round(((evt.registeredCount || 0) / capacity) * 100));
  const schedule = (evt.schedule || []).slice(0, 5);
  const speaker = evt.speakers?.[0];

  return (
    <div className="relative h-[500px] sm:h-[540px] w-full max-w-[600px] mx-auto" style={{ perspective: 1600 }}>
      <Depth progress={progress} depth={0.8} className="absolute inset-x-0 top-6 sm:top-10 z-10">
        <TiltPanel max={4} className="glass-strong glass-sheen rounded-[28px] p-5 sm:p-6 mx-auto w-full max-w-[520px]">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-fg/45">Event console</p>
              <p className="font-geist text-base sm:text-lg font-semibold text-fg mt-1 truncate">{evt.title}</p>
            </div>
            <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium border" style={{ color: inkColor(rgb), borderColor: rgbString(rgb, 0.35), background: rgbString(rgb, 0.1) }}>
              Published
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {[
              { label: 'Registered', value: evt.registeredCount },
              { label: 'Capacity', value: capacity },
              { label: 'Volunteers', value: evt.volunteersNeeded || 0 },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-fg/[0.04] border border-fg/[0.06] px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-fg/45">{m.label}</p>
                <p className="font-geist text-lg font-semibold text-fg mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-fg/50 mb-1.5">
              <span>Registrations</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-fg/[0.07] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${rgbString(rgb, 0.6)}, ${rgbString(rgb)})` }}
                initial={{ width: reduced ? `${pct}%` : 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-fg/45">Run of show</p>
            {schedule.map((s, i) => (
              <div key={s.time + s.title} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-[11px] font-mono text-fg/45">{s.time}</span>
                <div className="flex-1 h-7 relative">
                  <motion.div
                    className="absolute top-0 h-7 rounded-lg px-2.5 flex items-center text-[11px] text-fg/85 truncate"
                    style={{
                      left: `${(i * 9) % 30}%`,
                      background: i % 2 ? 'rgb(var(--fg-rgb) / 0.06)' : rgbString(rgb, 0.16),
                      border: `1px solid ${i % 2 ? 'rgb(var(--fg-rgb) / 0.07)' : rgbString(rgb, 0.25)}`,
                    }}
                    initial={{ width: reduced ? '62%' : '0%', opacity: reduced ? 1 : 0 }}
                    whileInView={{ width: `${48 + ((i * 13) % 26)}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.08 }}
                  >
                    {s.title}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </TiltPanel>
      </Depth>

      <Depth progress={progress} depth={1.6} className="absolute -left-2 sm:-left-8 top-0 z-20 hidden sm:block">
        <div className="glass rounded-2xl px-4 py-3 w-[220px]">
          <p className="text-[10px] uppercase tracking-[0.14em] text-fg/45 flex items-center gap-1.5">
            <Icon name="apartment" className="!text-[14px]" style={{ color: inkColor(rgb) }} /> Venue confirmed
          </p>
          <p className="text-[13px] text-fg mt-1 leading-snug line-clamp-2">{evt.venueDetails?.name || evt.location}</p>
        </div>
      </Depth>

      {speaker && (
        <Depth progress={progress} depth={2} className="absolute -right-2 sm:-right-8 bottom-2 sm:bottom-4 z-20">
          <div className="glass-strong rounded-2xl p-3 pr-4 flex items-center gap-3 w-[250px]">
            <img src={speaker.photo} alt="" className="w-11 h-11 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.14em] text-fg/45">Speaker accepted</p>
              <p className="text-[13px] text-fg font-medium truncate">{speaker.name}</p>
              <p className="text-[11px] text-fg/50 truncate">{speaker.designation}</p>
            </div>
          </div>
        </Depth>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Venue provider: a listed space, an incoming booking and the availability calendar
// ---------------------------------------------------------------------------
export const VenueVisual = ({ progress, venues = [], venueBookings = [] }) => {
  const rgb = roleRgb('venue');
  const reduced = useReducedMotion();
  const venue = venues.find((v) => v.image) || venues[0];
  const booking = venueBookings.find((b) => b.status === 'pending') || venueBookings[0];
  if (!venue) return null;
  // A month view with a few booked days; purely illustrative
  const booked = new Set([3, 4, 11, 17, 18, 24]);
  const requested = 20;

  return (
    <div className="relative h-[560px] sm:h-[540px] w-full max-w-[580px] mx-auto" style={{ perspective: 1500 }}>
      <Depth progress={progress} depth={0.8} className="absolute left-0 right-0 sm:right-14 top-0 z-10">
        <TiltPanel max={5} className="glass-strong glass-sheen rounded-[28px] overflow-hidden">
          <div className="h-44 sm:h-52 relative">
            <img src={venue.image} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
            <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] text-fg/90 flex items-center gap-1.5">
              <Icon name="verified" className="!text-[14px]" style={{ color: inkColor(rgb) }} /> Verified space
            </span>
          </div>
          <div className="p-5 sm:p-6 -mt-10 relative">
            <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: inkColor(rgb) }}>
              {venue.vibe} · {venue.city}
            </p>
            <p className="font-geist text-xl font-semibold text-fg mt-1">{venue.name}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-[12px] text-fg/60">
              <span className="flex items-center gap-1.5"><Icon name="groups" className="!text-[15px]" /> Up to {venue.capacity}</span>
              <span className="flex items-center gap-1.5"><Icon name="star" className="!text-[15px]" style={{ color: inkColor(rgb) }} /> {venue.rating}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {(venue.amenities || []).slice(0, 3).map((a) => (
                <span key={a} className="rounded-full px-2.5 py-1 text-[11px] text-fg/75 bg-fg/[0.05] border border-fg/[0.07]">{a}</span>
              ))}
            </div>
          </div>
        </TiltPanel>
      </Depth>

      {booking && (
        <Depth progress={progress} depth={1.7} className="absolute right-0 bottom-0 sm:bottom-6 z-20">
          <motion.div
            className="glass-strong rounded-2xl p-4 w-[270px]"
            initial={{ opacity: 0, y: reduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-fg/45 flex items-center gap-1.5">
              <Icon name="inbox" className="!text-[14px]" style={{ color: inkColor(rgb) }} /> New booking request
            </p>
            <p className="text-[14px] text-fg font-medium mt-1.5 leading-snug">{booking.eventName}</p>
            <p className="text-[12px] text-fg/50 mt-0.5">
              {booking.organizerName} · {booking.expectedAttendees} guests
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3.5">
              <span className="rounded-full py-2 text-center text-[12px] font-semibold text-ink-950" style={{ background: rgbString(rgb) }}>Accept</span>
              <span className="rounded-full py-2 text-center text-[12px] text-fg/75 border border-fg/15">Decline</span>
            </div>
          </motion.div>
        </Depth>
      )}

      <Depth progress={progress} depth={1.3} className="absolute left-0 bottom-6 sm:bottom-10 z-20 hidden sm:block">
        <div className="glass rounded-2xl p-4 w-[220px]" aria-hidden="true">
          <p className="text-[10px] uppercase tracking-[0.14em] text-fg/45">Availability</p>
          <div className="grid grid-cols-7 gap-1 mt-3">
            {Array.from({ length: 28 }, (_, d) => d + 1).map((d) => (
              <span
                key={d}
                className="h-5 rounded-[5px] text-[9px] flex items-center justify-center"
                style={
                  d === requested
                    ? { background: rgbString(rgb), color: '#0b0d13' }
                    : booked.has(d)
                    ? { background: rgbString(rgb, 0.22), color: inkColor(rgb) }
                    : { background: 'rgb(var(--fg-rgb) / 0.04)', color: 'rgb(var(--fg-rgb) / 0.4)' }
                }
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </Depth>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Speaker: a stage with the live session in front and an arc of sessions
// ---------------------------------------------------------------------------
export const SpeakerVisual = ({ progress, events }) => {
  const rgb = roleRgb('speaker');
  const reduced = useReducedMotion();
  const evt = events.find((e) => e.speakers?.length && e.schedule?.length) || events[0];
  if (!evt) return null;
  const speaker = evt.speakers?.[0];
  const sessions = (evt.schedule || []).filter((s) => s.speaker || s.title).slice(1, 5);
  const arc = [-28, -12, 12, 28];

  return (
    <div className="relative w-full max-w-[980px] mx-auto h-[400px] md:h-[360px]" style={{ perspective: 1500 }}>
      {/* Stage glow */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[80%] h-40 rounded-[50%] blur-3xl"
        style={{ background: rgbString(rgb, 0.18) }}
        aria-hidden="true"
      />

      {/* Session arc */}
      <div className="absolute inset-x-0 top-0 hidden md:flex justify-center gap-4" style={{ transformStyle: 'preserve-3d' }}>
        {sessions.map((s, i) => (
          <Depth key={s.title} progress={progress} depth={0.5 + Math.abs(arc[i]) / 40}>
            <motion.div
              className="glass rounded-2xl p-4 w-[190px]"
              style={{ rotateY: arc[i], z: -Math.abs(arc[i]) * 3, transformPerspective: 1200 }}
              initial={{ opacity: 0, y: reduced ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.08 }}
            >
              <p className="font-mono text-[11px]" style={{ color: inkColor(rgb) }}>{s.time}</p>
              <p className="text-[13px] text-fg mt-1.5 leading-snug line-clamp-2">{s.title}</p>
              {s.speaker && <p className="text-[11px] text-fg/45 mt-1.5 truncate">{s.speaker}</p>}
            </motion.div>
          </Depth>
        ))}
      </div>

      {/* Live session */}
      {speaker && (
        <Depth progress={progress} depth={1.2} className="absolute left-1/2 -translate-x-1/2 top-16 md:top-[132px] z-10">
          <TiltPanel className="glass-strong glass-sheen rounded-[28px] p-5 w-[320px] sm:w-[380px]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={speaker.photo} alt="" className="w-16 h-16 rounded-2xl object-cover" loading="lazy" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg" style={{ background: rgbString(rgb) }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] flex items-center gap-1.5" style={{ color: inkColor(rgb) }}>
                  <span className="relative flex w-1.5 h-1.5">
                    {!reduced && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: rgbString(rgb) }} />}
                    <span className="relative w-1.5 h-1.5 rounded-full" style={{ background: rgbString(rgb) }} />
                  </span>
                  Now speaking
                </p>
                <p className="font-geist text-base font-semibold text-fg mt-1 truncate">{speaker.name}</p>
                <p className="text-[12px] text-fg/50 truncate">
                  {speaker.designation} · {speaker.company}
                </p>
              </div>
            </div>
            <div className="hairline my-4" />
            <div className="flex flex-wrap gap-1.5">
              {(speaker.expertise || []).slice(0, 3).map((x) => (
                <span key={x} className="rounded-full px-2.5 py-1 text-[11px] text-fg/75 bg-fg/[0.05] border border-fg/[0.07]">
                  {x}
                </span>
              ))}
            </div>
          </TiltPanel>
        </Depth>
      )}

      <Depth progress={progress} depth={2} className="absolute left-0 sm:left-[6%] bottom-0 md:bottom-10 z-20">
        <Chip rgb={rgb} icon="mail">3 new invitations</Chip>
      </Depth>
      <Depth progress={progress} depth={1.7} className="absolute right-0 sm:right-[6%] bottom-12 md:bottom-24 z-20">
        <Chip rgb={rgb} icon="groups">{evt.registeredCount} in the audience</Chip>
      </Depth>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Volunteer: crew board with assignments, team links and a check-in scanner
// ---------------------------------------------------------------------------
export const VolunteerVisual = ({ progress }) => {
  const rgb = roleRgb('volunteer');
  const reduced = useReducedMotion();
  const tasks = [
    { role: 'Check-in desk', time: '08:30', crew: ['Divya R', 'Sam P'] },
    { role: 'Stage management', time: '09:45', crew: ['Kiran M'] },
    { role: 'Speaker hospitality', time: '10:00', crew: ['Nisha T', 'Leo F'] },
    { role: 'Networking lounge', time: '12:30', crew: ['Ravi S'] },
  ];

  return (
    <div className="relative h-[480px] sm:h-[520px] w-full max-w-[560px] mx-auto" style={{ perspective: 1400 }}>
      <Depth progress={progress} depth={0.9} className="absolute left-0 right-0 sm:right-16 top-4 z-10">
        <TiltPanel max={5} className="glass-strong glass-sheen rounded-[28px] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-fg/45">Crew board</p>
              <p className="font-geist text-base font-semibold text-fg mt-1">Event day · Team A</p>
            </div>
            <span className="text-[12px] text-fg/60 flex items-center gap-1.5">
              <Icon name="groups" className="!text-[16px]" style={{ color: inkColor(rgb) }} /> 6 volunteers
            </span>
          </div>
          <div className="mt-5 space-y-2.5">
            {tasks.map((t, i) => (
              <motion.div
                key={t.role}
                className="flex items-center gap-3 rounded-2xl bg-fg/[0.04] border border-fg/[0.06] px-3.5 py-3"
                initial={{ opacity: 0, x: reduced ? 0 : -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.1 }}
              >
                <motion.span
                  className="w-5 h-5 rounded-md flex items-center justify-center border shrink-0"
                  initial={{ background: 'rgba(0, 0, 0, 0)', borderColor: 'rgba(128, 132, 145, 0.45)' }}
                  whileInView={i < 2 ? { background: rgbString(rgb), borderColor: rgbString(rgb) } : {}}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.25, duration: 0.4 }}
                >
                  {i < 2 && <Icon name="check" className="!text-[14px] text-ink-950" />}
                </motion.span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-fg truncate">{t.role}</p>
                  <p className="text-[11px] text-fg/45 font-mono">{t.time}</p>
                </div>
                <div className="flex">
                  {t.crew.map((n, k) => (
                    <span key={n} style={{ marginLeft: k ? -7 : 0 }}>
                      <Avatar name={n} rgb={k % 2 ? [236, 238, 246] : rgb} size={24} />
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </TiltPanel>
      </Depth>

      <Depth progress={progress} depth={1.8} className="absolute right-0 bottom-0 z-20">
        <div className="glass-strong rounded-2xl p-4 w-[210px]">
          <div className="relative h-24 rounded-xl border border-fg/10 bg-fg/[0.06] overflow-hidden flex items-center justify-center">
            <Icon name="qr_code_2" className="!text-[56px] text-fg/70" />
            {!reduced && (
              <motion.span
                className="absolute inset-x-3 h-[2px] rounded-full"
                style={{ background: rgbString(rgb), boxShadow: `0 0 12px ${rgbString(rgb)}` }}
                animate={{ top: ['18%', '82%', '18%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
          <p className="text-[12px] mt-3 flex items-center gap-1.5" style={{ color: inkColor(rgb) }}>
            <Icon name="check_circle" className="!text-[15px]" /> Checked in
          </p>
          <p className="text-[11px] text-fg/50 font-mono mt-0.5">CN-48213 · Door 2</p>
        </div>
      </Depth>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Sponsor: a partnership opportunity backed by real community analytics
// ---------------------------------------------------------------------------
export const SponsorVisual = ({ progress, events, communities }) => {
  const rgb = roleRgb('sponsor');
  const reduced = useReducedMotion();
  const evt = events.find((e) => e.sponsorshipPackages?.length) || events[0];
  const community = communities.find((c) => c.memberCount) || communities[0];
  if (!evt) return null;
  const pkg = evt.sponsorshipPackages?.find((p) => p.spotsAvailable > p.spotsTaken) || evt.sponsorshipPackages?.[0];
  const bars = [38, 52, 47, 64, 71, 83, 96];
  const repeat = parseInt(community?.repeatAttendeeRate, 10) || 0;

  return (
    <div className="relative h-[640px] sm:h-[540px] w-full max-w-[580px] mx-auto" style={{ perspective: 1500 }}>
      <Depth progress={progress} depth={0.8} className="absolute left-0 sm:left-4 top-4 z-10">
        <TiltPanel
          max={5}
          className="glass-strong glass-sheen rounded-[28px] p-6 w-[300px] sm:w-[330px]"
          style={{ boxShadow: `inset 0 1px 0 ${rgbString(rgb, 0.35)}, 0 30px 80px -30px rgb(0 0 0 / 0.8), 0 0 0 1px ${rgbString(rgb, 0.22)}` }}
        >
          <p className="text-[11px] uppercase tracking-[0.16em]" style={{ color: inkColor(rgb) }}>
            Partnership opportunity
          </p>
          <p className="font-geist text-lg font-semibold text-fg mt-1.5 leading-snug">{evt.title}</p>
          {pkg && (
            <>
              <div className="flex items-center justify-between mt-4">
                <span className="font-display italic text-2xl" style={{ color: inkColor(rgb) }}>{pkg.tier}</span>
                <span className="text-[12px] text-fg/55">
                  {Math.max(0, pkg.spotsAvailable - pkg.spotsTaken)} of {pkg.spotsAvailable} open
                </span>
              </div>
              <div className="hairline my-4" />
              <ul className="space-y-2">
                {pkg.perks.slice(0, 3).map((perk) => (
                  <li key={perk} className="flex items-center gap-2 text-[13px] text-fg/75">
                    <Icon name="check" className="!text-[15px]" style={{ color: inkColor(rgb) }} />
                    {perk}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-5 rounded-full py-2.5 text-center text-[13px] font-semibold text-ink-950" style={{ background: rgbString(rgb) }}>
            Review proposal
          </div>
        </TiltPanel>
      </Depth>

      {community && (
        <Depth progress={progress} depth={1.6} className="absolute right-0 bottom-0 sm:bottom-6 z-20">
          <div className="glass-strong rounded-[24px] p-5 w-[260px] sm:w-[280px]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.14em] text-fg/45">Community reach</p>
              <span className="text-[11px]" style={{ color: inkColor(rgb) }}>{community.memberGrowthRate}</span>
            </div>
            <p className="text-[13px] text-fg mt-1 truncate">{community.name}</p>
            <div className="flex items-end gap-1.5 h-20 mt-4" aria-hidden="true">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{ background: i === bars.length - 1 ? rgbString(rgb) : rgbString(rgb, 0.28) }}
                  initial={{ height: reduced ? `${h}%` : '6%' }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.2 + i * 0.06 }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p className="font-geist text-lg font-semibold text-fg">{community.memberCount?.toLocaleString()}</p>
                <p className="text-[11px] text-fg/45">Members</p>
              </div>
              <div>
                <p className="font-geist text-lg font-semibold text-fg">{repeat}%</p>
                <p className="text-[11px] text-fg/45">Repeat attendees</p>
              </div>
            </div>
          </div>
        </Depth>
      )}

      <Depth progress={progress} depth={2.2} className="absolute right-4 sm:right-10 top-6 z-20 hidden sm:block">
        <Chip rgb={rgb} icon="verified">Code TN2026-75K issued</Chip>
      </Depth>
    </div>
  );
};

export const ROLE_VISUALS = {
  attendee: AttendeeVisual,
  organizer: OrganizerVisual,
  venue: VenueVisual,
  speaker: SpeakerVisual,
  volunteer: VolunteerVisual,
  sponsor: SponsorVisual,
};
