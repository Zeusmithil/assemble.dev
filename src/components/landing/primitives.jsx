import React, { useRef } from 'react';
import { motion, useReducedMotion, useTransform, useMotionValue, useSpring } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1];

// Fades and lifts content in once it enters the viewport
export const Reveal = ({ children, delay = 0, y = 24, className = '', as = 'div' }) => {
  const reduced = useReducedMotion();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: reduced ? 0.2 : 0.9, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
};

// Scroll parallax layer: higher depth moves further as the section scrolls past
export const Depth = ({ progress, depth = 1, className = '', style, children }) => {
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 1], reduced ? [0, 0] : [depth * 70, -depth * 70]);
  return (
    <motion.div className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
};

// Glass panel that tilts gently toward the pointer
export const TiltPanel = ({ children, className = '', max = 6, style }) => {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={className}
      style={{ ...style, rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
    >
      {children}
    </motion.div>
  );
};

// Small initials avatar used across the role visuals
export const Avatar = ({ name, rgb, size = 28, ring = true }) => {
  const initials = (name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-geist font-semibold text-ink-950 shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`,
        boxShadow: ring ? '0 0 0 2px #0b0d13' : 'none',
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
};

export const Icon = ({ name, className = '', style }) => (
  <span className={`material-symbols-outlined ${className}`} style={style} aria-hidden="true">
    {name}
  </span>
);
