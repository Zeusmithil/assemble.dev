import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { EcosystemCanvas } from './EcosystemCanvas';
import { ROLE_JOURNEY, SCENES, HERO_SCENE, rgbString } from './journey';
import { ROLE_VISUALS } from './RoleVisuals';
import { Reveal, Icon, EASE } from './primitives';

/*
 * Maps window scroll to a continuous scene index (0 = hero … 6 = final).
 * Each section holds its own scene while it is pinned/in view, and the
 * scroll distance between two sections morphs one scene into the next.
 */
const useJourneyProgress = (sectionRefs) => {
  const spans = useRef([]);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  const measure = useCallback(() => {
    const vh = window.innerHeight;
    spans.current = sectionRefs.current.map((el) => {
      if (!el) return { start: 0, end: 0 };
      const top = el.getBoundingClientRect().top + window.scrollY;
      const h = el.offsetHeight;
      return { start: top, end: Math.max(top, top + h - vh) };
    });
  }, [sectionRefs]);

  const compute = useCallback(() => {
    const s = window.scrollY;
    const list = spans.current;
    if (!list.length) return 0;
    if (s <= list[0].end) return 0;
    for (let k = 0; k < list.length - 1; k++) {
      const cur = list[k];
      const next = list[k + 1];
      if (s <= next.start) {
        const gap = next.start - cur.end;
        return gap <= 0 ? k + 1 : k + Math.min(1, Math.max(0, (s - cur.end) / gap));
      }
      if (s <= next.end) return k + 1;
    }
    return list.length - 1;
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      progress.current = compute();
      setActive((prev) => {
        const next = Math.round(progress.current);
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // Images and fonts change section heights after first paint
    const ro = new ResizeObserver(onResize);
    sectionRefs.current.forEach((el) => el && ro.observe(el));
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [compute, measure, sectionRefs]);

  const getProgress = useCallback(() => progress.current, []);
  return { getProgress, active };
};

// ---------------------------------------------------------------------------

const PrimaryButton = ({ children, onClick, rgb, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group inline-flex items-center gap-2.5 rounded-full pl-6 pr-5 py-3.5 font-geist text-[14px] font-semibold text-ink-950 transition-all duration-300 hover:gap-3.5 hover:shadow-[0_10px_40px_-10px_var(--btn-glow)] active:scale-[0.98] cursor-pointer ${className}`}
    style={{ background: rgb ? rgbString(rgb) : '#f3f4f7', '--btn-glow': rgb ? rgbString(rgb, 0.7) : 'rgb(255 255 255 / 0.5)' }}
  >
    {children}
    <Icon name="arrow_forward" className="!text-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />
  </button>
);

const GhostButton = ({ children, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-geist text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-300 cursor-pointer ${className}`}
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
const Hero = React.forwardRef(({ stats, onExplore, onDiscoverRoles, onJumpTo }, ref) => {
  const reduced = useReducedMotion();
  const line = (delay) => ({
    initial: { y: reduced ? 0 : '105%', opacity: reduced ? 0 : 1 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: reduced ? 0.3 : 1.1, ease: EASE, delay: reduced ? 0 : delay },
  });

  // Role "satellites" orbiting the ecosystem sphere on the right
  const orbit = [
    { angle: -155, r: 1 },
    { angle: -95, r: 1.04 },
    { angle: -30, r: 1 },
    { angle: 30, r: 1.04 },
    { angle: 95, r: 1 },
    { angle: 155, r: 1.04 },
  ];

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative min-h-[100svh] flex items-center pt-28 pb-24 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 w-full grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 relative">
          <motion.p
            className="inline-flex items-center gap-2 glass rounded-full pl-2 pr-4 py-1.5 text-[12px] text-white/75"
            initial={{ opacity: 0, y: reduced ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="flex -space-x-1" aria-hidden="true">
              {ROLE_JOURNEY.map((r) => (
                <span key={r.id} className="w-3 h-3 rounded-full ring-2 ring-ink-950" style={{ background: rgbString(r.rgb) }} />
              ))}
            </span>
            One platform for everyone who makes events happen
          </motion.p>

          <h1 id="hero-title" className="mt-7 font-geist font-semibold tracking-[-0.035em] text-white text-[42px] leading-[1.02] sm:text-[60px] xl:text-[68px]">
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" {...line(0.1)}>Where events, people</motion.span>
            </span>
            <span className="block overflow-hidden pb-1">
              <motion.span className="block" {...line(0.2)}>and opportunity</motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.span
                className="block font-display italic font-normal tracking-[-0.01em] text-[1.18em] leading-[0.95] bg-gradient-to-r from-attendee via-organizer to-sponsor bg-clip-text text-transparent pr-3"
                {...line(0.3)}
              >
                connect.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-6 max-w-[540px] text-[16px] sm:text-[18px] leading-relaxed text-white/65"
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.45 }}
          >
            Connect brings attendees, organizers, speakers, volunteers, sponsors and venue partners into one integrated
            ecosystem — from the first ticket to the final applause.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.6 }}
          >
            <PrimaryButton onClick={onExplore}>Explore the Platform</PrimaryButton>
            <GhostButton onClick={onDiscoverRoles}>
              Discover Your Role
              <Icon name="south" className="!text-[18px]" />
            </GhostButton>
          </motion.div>

          <motion.dl
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduced ? 0 : 0.85 }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-geist text-2xl font-semibold text-white">{s.value}</dd>
                <dd className="text-[12px] text-white/50 mt-0.5" aria-hidden="true">{s.label}</dd>
              </div>
            ))}
          </motion.dl>

          {/* Mobile: role entry points */}
          <div className="mt-10 flex flex-wrap gap-2 lg:hidden">
            {ROLE_JOURNEY.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onJumpTo(r.id)}
                className="glass rounded-full px-3.5 py-2 text-[13px] text-white/85 flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: rgbString(r.rgb) }} />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: glass satellites orbit the 3D ecosystem rendered behind */}
        <div className="hidden lg:block lg:col-span-5 relative h-[560px]" aria-label="Roles on Connect">
          {ROLE_JOURNEY.map((r, i) => {
            const rad = (orbit[i].angle * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 46 * orbit[i].r;
            const y = 50 + Math.sin(rad) * 34 * orbit[i].r;
            return (
              <motion.button
                key={r.id}
                type="button"
                onClick={() => onJumpTo(r.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 glass glass-sheen rounded-2xl pl-3 pr-4 py-2.5 flex items-center gap-3 text-left cursor-pointer hover:bg-white/10 transition-colors"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  reduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1, y: [0, i % 2 ? 8 : -8, 0] }
                }
                transition={{
                  opacity: { duration: 0.8, delay: 0.7 + i * 0.1 },
                  scale: { duration: 0.8, delay: 0.7 + i * 0.1, ease: EASE },
                  y: { duration: 6 + i, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: rgbString(r.rgb, 0.16), color: rgbString(r.rgb) }}>
                  <Icon name={r.benefits[0].icon} className="!text-[19px]" />
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-white">{r.label}</span>
                  <span className="block text-[11px] text-white/50">{r.kicker}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={onDiscoverRoles}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/45 hover:text-white/80 transition-colors cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        aria-label="Scroll to the roles"
      >
        Scroll
        <span className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.button>
    </section>
  );
});

// ---------------------------------------------------------------------------
// Role section
// ---------------------------------------------------------------------------
const RoleSection = React.forwardRef(({ role, index, layout, events, communities, venues, venueBookings, isLoggedIn, onCta, onLogin }, ref) => {
  const innerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: innerRef, offset: ['start end', 'end start'] });
  const Visual = ROLE_VISUALS[role.id];
  const rgb = role.rgb;
  const centered = layout === 'center';
  const visualFirst = layout === 'visual-left';

  const setRefs = (el) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const text = (
    <div className={centered ? 'relative max-w-[760px] mx-auto text-center' : 'max-w-[520px]'}>
      <Reveal>
        <p className={`flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] ${centered ? 'justify-center' : ''}`} style={{ color: rgbString(rgb) }}>
          <span className="font-mono">0{index + 1}</span>
          <span className="w-8 h-px" style={{ background: rgbString(rgb, 0.5) }} />
          {role.kicker} · {role.label}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 id={`${role.id}-title`} className="mt-5 font-geist font-semibold tracking-[-0.03em] text-white text-[38px] leading-[1.05] sm:text-[52px]">
          {role.title[0]}
          <br />
          <span className="font-display italic font-normal tracking-[-0.01em]" style={{ color: rgbString(rgb) }}>
            {role.title[1]}
          </span>
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className={`mt-5 text-[16px] leading-relaxed text-white/65 ${centered ? 'max-w-[620px] mx-auto' : ''}`}>{role.description}</p>
      </Reveal>

      <ul className={`mt-8 grid gap-x-6 gap-y-5 text-left ${centered ? 'sm:grid-cols-3 max-w-[760px] mx-auto' : 'sm:grid-cols-2'}`}>
        {role.benefits.map((b, i) => (
          <Reveal as="li" key={b.title} delay={0.16 + i * 0.06} y={14} className="flex gap-3">
            <span className="mt-0.5 w-9 h-9 shrink-0 rounded-xl flex items-center justify-center border" style={{ background: rgbString(rgb, 0.1), borderColor: rgbString(rgb, 0.2), color: rgbString(rgb) }}>
              <Icon name={b.icon} className="!text-[18px]" />
            </span>
            <span>
              <span className="block text-[14px] font-medium text-white">{b.title}</span>
              <span className="block text-[13px] text-white/55 leading-snug mt-0.5">{b.text}</span>
            </span>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.3} className={`mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 ${centered ? 'justify-center' : ''}`}>
        <PrimaryButton rgb={rgb} onClick={() => onCta(role.signupRole)}>
          {role.cta}
        </PrimaryButton>
        {!isLoggedIn && (
          <button type="button" onClick={() => onLogin(role.signupRole)} className="text-[13px] text-white/55 hover:text-white transition-colors cursor-pointer">
            Already on Connect? <span className="underline underline-offset-4 decoration-white/30">Log in</span>
          </button>
        )}
      </Reveal>
    </div>
  );

  const visual = (
    <div className="relative">
      <Visual progress={scrollYProgress} events={events} communities={communities} venues={venues} venueBookings={venueBookings} />
    </div>
  );

  return (
    <section ref={setRefs} id={role.id} aria-labelledby={`${role.id}-title`} className="relative lg:min-h-[150vh]">
      <div className={`lg:sticky lg:top-0 lg:min-h-screen flex items-center ${centered ? 'py-24 lg:py-20' : 'py-24 lg:py-28'}`}>
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 w-full">
          {centered ? (
            <div className="space-y-12">
              {text}
              {visual}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
              <div className={visualFirst ? 'lg:order-2' : ''}>{text}</div>
              <div className={visualFirst ? 'lg:order-1' : ''}>{visual}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

// ---------------------------------------------------------------------------
// Closing
// ---------------------------------------------------------------------------
const Closing = React.forwardRef(({ isLoggedIn, onGetStarted, onExplore, onJumpTo }, ref) => (
  <section ref={ref} id="get-started" aria-labelledby="closing-title" className="relative min-h-[100svh] flex items-center py-28">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse 50% 45% at 50% 50%, rgb(7 8 12 / 0.75), transparent 75%)' }}
      aria-hidden="true"
    />
    <div className="relative max-w-[860px] mx-auto px-5 sm:px-8 text-center">
      <Reveal>
        <div className="flex justify-center gap-2 flex-wrap">
          {ROLE_JOURNEY.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onJumpTo(r.id)}
              className="glass rounded-full px-3.5 py-1.5 text-[12px] text-white/75 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: rgbString(r.rgb) }} />
              {r.label}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 id="closing-title" className="mt-9 font-geist font-semibold tracking-[-0.035em] text-white text-[42px] leading-[1.04] sm:text-[64px]">
          Every role.
          <br />
          One{' '}
          <span className="font-display italic font-normal tracking-[-0.01em] bg-gradient-to-r from-attendee via-speaker to-sponsor bg-clip-text text-transparent pr-2">
            connected
          </span>{' '}
          ecosystem.
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed text-white/65 max-w-[620px] mx-auto">
          Attendees fill the room, organizers build it, venues give it a home, speakers give it meaning, volunteers keep it
          running and sponsors make it possible. On Connect, they all meet.
        </p>
      </Reveal>
      <Reveal delay={0.24} className="mt-10 flex flex-wrap justify-center gap-3">
        <PrimaryButton onClick={onGetStarted}>{isLoggedIn ? 'Go to your dashboard' : 'Get started — it’s free'}</PrimaryButton>
        <GhostButton onClick={onExplore}>Explore the platform</GhostButton>
      </Reveal>
    </div>
  </section>
));

// ---------------------------------------------------------------------------
// Side progress rail (desktop)
// ---------------------------------------------------------------------------
const JourneyRail = ({ active, onJumpTo }) => {
  const items = [{ id: 'top', label: 'Overview', rgb: HERO_SCENE.rgb }, ...ROLE_JOURNEY, { id: 'get-started', label: 'Get started', rgb: SCENES[SCENES.length - 1].rgb }];
  return (
    <nav aria-label="Page sections" className="hidden xl:flex fixed right-7 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5">
      {items.map((item, i) => {
        const isActive = active === i;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onJumpTo(item.id)}
            className="group flex items-center justify-end gap-3 cursor-pointer"
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className={`text-[11px] tracking-wide transition-all duration-300 ${isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 text-white/60'}`}
            >
              {item.label}
            </span>
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: isActive ? 10 : 6,
                height: isActive ? 10 : 6,
                background: isActive ? rgbString(item.rgb) : 'rgb(255 255 255 / 0.3)',
                boxShadow: isActive ? `0 0 14px ${rgbString(item.rgb, 0.8)}` : 'none',
              }}
            />
          </button>
        );
      })}
    </nav>
  );
};

// ---------------------------------------------------------------------------

const LAYOUTS = {
  attendee: 'visual-right',
  organizer: 'visual-left',
  venue: 'visual-right',
  speaker: 'center',
  volunteer: 'visual-right',
  sponsor: 'visual-left',
};

export const LandingView = ({ events, communities, venues, venueBookings, currentUser, onExplore, onRoleCta, onRoleLogin, onGetStarted }) => {
  const reduced = useReducedMotion();
  const sectionRefs = useRef([]);
  const atmosphereRef = useRef(null);
  const { getProgress, active } = useJourneyProgress(sectionRefs);

  const published = events.filter((e) => e.status === 'published');
  const stats = useMemo(
    () => [
      { value: published.length, label: 'Live events' },
      { value: communities.length, label: 'Communities' },
      { value: new Set(published.map((e) => e.city)).size, label: 'Cities' },
      { value: ROLE_JOURNEY.length, label: 'Ways to take part' },
    ],
    [published.length, communities.length] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleAccent = useCallback((rgb) => {
    atmosphereRef.current?.style.setProperty('--accent', `${rgb[0]} ${rgb[1]} ${rgb[2]}`);
  }, []);

  const jumpTo = useCallback(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );

  const setRef = (i) => (el) => {
    sectionRefs.current[i] = el;
  };

  return (
    <div className="relative">
      {/* Persistent environment behind every section */}
      <div
        ref={atmosphereRef}
        className="fixed inset-0 z-0 pointer-events-none grain"
        style={{ '--accent': HERO_SCENE.rgb.join(' ') }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 transition-[background] duration-700"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 70% 35%, rgb(var(--accent) / 0.16), transparent 70%), radial-gradient(ellipse 60% 50% at 15% 85%, rgb(var(--accent) / 0.08), transparent 70%), linear-gradient(180deg, #07080c 0%, #0a0c12 50%, #07080c 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-45 lg:opacity-90">
          <EcosystemCanvas getProgress={getProgress} reducedMotion={!!reduced} onAccentChange={handleAccent} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="relative z-10">
        <Hero
          ref={setRef(0)}
          stats={stats}
          onExplore={onExplore}
          onDiscoverRoles={() => jumpTo('attendee')}
          onJumpTo={jumpTo}
        />
        {ROLE_JOURNEY.map((role, i) => (
          <RoleSection
            key={role.id}
            ref={setRef(i + 1)}
            role={role}
            index={i}
            layout={LAYOUTS[role.id]}
            events={events}
            communities={communities}
            venues={venues}
            venueBookings={venueBookings}
            isLoggedIn={!!currentUser}
            onCta={onRoleCta}
            onLogin={onRoleLogin}
          />
        ))}
        <Closing
          ref={setRef(ROLE_JOURNEY.length + 1)}
          isLoggedIn={!!currentUser}
          onGetStarted={onGetStarted}
          onExplore={onExplore}
          onJumpTo={jumpTo}
        />
      </div>

      <JourneyRail active={active} onJumpTo={jumpTo} />
    </div>
  );
};

export default LandingView;
