import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { isMuted, setMuted } from './sound';

export const Icon = ({ name, className = '', style }) => (
  <span className={`material-symbols-outlined ${className}`} style={style} aria-hidden="true">
    {name}
  </span>
);

// Answer tiles: colour plus a shape, so they are distinguishable without colour
export const ANSWER_STYLES = [
  { bg: '#8ccaf4', shape: 'change_history', name: 'Triangle' },
  { bg: '#f0b69c', shape: 'diamond', name: 'Diamond' },
  { bg: '#a3c9a8', shape: 'circle', name: 'Circle' },
  { bg: '#e2cb98', shape: 'square', name: 'Square' },
  { bg: '#b9a8f2', shape: 'hexagon', name: 'Hexagon' },
  { bg: '#e6a4be', shape: 'star', name: 'Star' },
];
export const answerStyle = (i) => ANSWER_STYLES[i % ANSWER_STYLES.length];

export const PlayerAvatar = ({ icon, name, size = 44, highlight = false }) => (
  <span
    className="inline-flex items-center justify-center rounded-2xl shrink-0 text-ink-950"
    style={{
      width: size,
      height: size,
      background: highlight ? 'rgb(var(--accent-rgb))' : 'rgb(var(--fg-rgb) / 0.08)',
      color: highlight ? '#07080c' : 'rgb(var(--fg-rgb) / 0.85)',
    }}
    title={name}
  >
    <Icon name={icon} className="!text-[22px]" style={{ fontSize: size * 0.5 }} />
  </span>
);

export const MuteButton = ({ className = '' }) => {
  const [m, setM] = useState(isMuted());
  return (
    <button
      type="button"
      onClick={() => {
        setMuted(!m);
        setM(!m);
      }}
      className={`glass w-10 h-10 rounded-full flex items-center justify-center text-fg/80 hover:text-fg cursor-pointer ${className}`}
      aria-label={m ? 'Turn sound on' : 'Mute sound'}
      title={m ? 'Sound off' : 'Sound on'}
    >
      <Icon name={m ? 'volume_off' : 'volume_up'} className="!text-[20px]" />
    </button>
  );
};

// Circular countdown driven by a deadline timestamp
export const Countdown = ({ deadline, total, size = 96, onSecond }) => {
  const [now, setNow] = useState(Date.now());
  const lastSecond = useRef(null);
  useEffect(() => {
    let raf;
    const loop = () => {
      const t = Date.now();
      setNow(t);
      const secs = Math.ceil((deadline - t) / 1000);
      if (secs !== lastSecond.current) {
        lastSecond.current = secs;
        if (onSecond && secs >= 0) onSecond(secs);
      }
      if (t < deadline) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [deadline, onSecond]);
  const remaining = Math.max(0, deadline - now);
  const frac = total ? remaining / total : 0;
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const urgent = remaining <= 5000;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="timer" aria-label={`${Math.ceil(remaining / 1000)} seconds left`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--fg-rgb) / 0.1)" strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={urgent ? '#f3a0ad' : 'rgb(var(--accent-rgb))'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <motion.span
        key={Math.ceil(remaining / 1000)}
        initial={{ scale: urgent ? 1.35 : 1.1, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`absolute inset-0 flex items-center justify-center font-geist font-semibold ${urgent ? 'text-[#e2667a]' : 'text-fg'}`}
        style={{ fontSize: size * 0.34 }}
      >
        {Math.ceil(remaining / 1000)}
      </motion.span>
    </div>
  );
};

// Celebration burst on a full-screen canvas
export const Confetti = ({ fire, duration = 3500 }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!fire || reduced) return undefined;
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    const colours = ANSWER_STYLES.map((s) => s.bg);
    const pieces = Array.from({ length: 160 }, (_, i) => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 18 * dpr,
      vy: (-Math.random() * 16 - 6) * dpr,
      size: (5 + Math.random() * 7) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      colour: colours[i % colours.length],
    }));
    const start = performance.now();
    let raf;
    const loop = (t) => {
      ctx.clearRect(0, 0, w, h);
      const life = (t - start) / duration;
      pieces.forEach((p) => {
        p.vy += 0.45 * dpr;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.colour;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      if (life < 1) raf = requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fire, duration, reduced]);
  return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-[90]" aria-hidden="true" />;
};

// Short label for the activity type
export const typeLabel = (type) => (type === 'Poll' ? 'Live poll' : type || 'Live quiz');
