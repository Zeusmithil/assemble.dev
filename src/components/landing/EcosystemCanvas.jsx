import React, { useEffect, useRef } from 'react';
import { SCENES, ROLE_JOURNEY } from './journey';
import { idBadge, fileStack, locationPin, microphone, handshake, banknote, iconRing, glyphReady } from './iconShapes';

/*
 * One persistent 3D point field behind the whole landing page.
 * Each scene (hero, six roles, final) is a "formation" of the same N points;
 * scroll progress morphs between adjacent formations so the page reads as one
 * continuous environment rather than separate sections.
 */

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const seeded = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// ---------------------------------------------------------------------------
// Formations: each fills `out` (Float32Array N*3) with x, y, z in roughly [-2.6, 2.6]
// ---------------------------------------------------------------------------

const sphereWithRing = (out, N, rnd, sphereShare = 0.56) => {
  const sphereN = Math.floor(N * sphereShare);
  for (let i = 0; i < sphereN; i++) {
    const y = 1 - (2 * (i + 0.5)) / sphereN;
    const r = Math.sqrt(1 - y * y);
    const th = i * GOLDEN;
    const R = 1.02;
    out[i * 3] = Math.cos(th) * r * R;
    out[i * 3 + 1] = y * R;
    out[i * 3 + 2] = Math.sin(th) * r * R;
  }
  const ringN = N - sphereN;
  const tilt = 0.38;
  for (let k = 0; k < ringN; k++) {
    const i = sphereN + k;
    const a = (k / ringN) * TAU * 3 + rnd() * 0.02;
    const r = 1.5 + (k % 3) * 0.2 + rnd() * 0.12;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = (rnd() - 0.5) * 0.04;
    out[i * 3] = x;
    out[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
    out[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
  }
};

// Hero keeps the ecosystem sphere; each role becomes its icon (see iconShapes.js);
// the final scene gathers all six icons on a ring.
const FORMATIONS = [
  sphereWithRing, // hero
  idBadge, // attendee
  fileStack, // organizer
  locationPin, // venue provider
  microphone, // speaker
  handshake, // volunteer
  banknote, // sponsor
  iconRing, // final
];
const HANDSHAKE_INDEX = 5;
const FINAL_INDEX = FORMATIONS.length - 1;

// Scene centre offset (fraction of width): placed behind each section's text (opposite side of the visual card)
// for attendee, organizer, venue provider, volunteer, and sponsor so 3D models & transitions are clearly visible
const OFFSETS_DESKTOP = [0.2, -0.2, 0.2, -0.2, 0, -0.2, 0.2, 0];
const ZOOMS = [1, 0.95, 0.95, 0.95, 0.92, 1.0, 0.95, 1.2];
// Vertical offset (fraction of height): the speaker's mic sits low, under the centred copy
const OFFSETS_Y = [0, 0, 0, 0, 0.2, 0, 0, 0];

// Pairs of nearby points per formation, used to draw faint connecting lines
const buildLinks = (pos, N, maxDist, maxPerPoint, share, rnd) => {
  const links = [];
  const counts = new Uint8Array(N);
  const d2 = maxDist * maxDist;
  for (let i = 0; i < N; i++) {
    if (rnd() > share) continue;
    for (let j = i + 1; j < N && counts[i] < maxPerPoint; j++) {
      if (counts[j] >= maxPerPoint) continue;
      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < d2) {
        links.push(i, j);
        counts[i]++;
        counts[j]++;
      }
    }
  }
  return Uint16Array.from(links);
};

// Link radius and share per formation: icons link densely so they read as line art
const LINK_DISTANCES = [0.2, 0.12, 0.12, 0.12, 0.13, 0.1, 0.12, 0.1];
const LINK_SHARES = [0.42, 0.85, 0.85, 0.85, 0.8, 0.6, 0.85, 0.7];

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const EcosystemCanvas = ({ getProgress, reducedMotion = false, onAccentChange, theme = 'dark' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const isSmall = window.innerWidth < 768;
    // Daylight: deeper colours drawn normally; night: pastel light added together so it glows
    const light = theme === 'light';
    const neutral = light ? [96, 102, 120] : [236, 238, 246];
    const base = light ? [247, 246, 243] : [235, 238, 248];
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const N = isSmall ? 560 : lowPower ? 800 : 1100;
    const rnd = seeded(20261016);

    const formations = FORMATIONS.map((fn) => {
      const out = new Float32Array(N * 3);
      fn(out, N, rnd);
      return out;
    });
    const linkFor = (idx) => buildLinks(formations[idx], N, LINK_DISTANCES[idx], 2, LINK_SHARES[idx] * (isSmall ? 0.7 : 1), rnd);
    const links = formations.map((_, idx) => linkFor(idx));

    // The handshake is traced from the icon font; if the font was not ready yet,
    // rebuild it (and the final ring that includes it) once it loads.
    let disposed = false;
    if (!glyphReady('handshake') && document.fonts?.load) {
      document.fonts.load('200px "Material Symbols Outlined"', 'handshake').then(() => {
        if (disposed || !glyphReady('handshake')) return;
        [HANDSHAKE_INDEX, FINAL_INDEX].forEach((idx) => {
          FORMATIONS[idx](formations[idx], N, seeded(idx + 7));
          links[idx] = linkFor(idx);
        });
      }).catch(() => {});
    }

    // Per-point colour for every scene: role scenes use their colour with a few
    // neutral points; hero and final mix all the role colours.
    const roleColours = ROLE_JOURNEY.map((r) => (light ? r.inkRgb : r.rgb));
    const colours = SCENES.map((scene, idx) => {
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        let c;
        if (idx === 0 || idx === SCENES.length - 1) {
          const rc = roleColours[i % roleColours.length];
          const mix = idx === 0 ? (light ? 0.7 : 0.45) : 1; // final ring: each icon in its full role colour
          const tint = light ? neutral : base;
          c = [rc[0] * mix + tint[0] * (1 - mix), rc[1] * mix + tint[1] * (1 - mix), rc[2] * mix + tint[2] * (1 - mix)];
        } else {
          c = i % 7 === 0 ? neutral : light ? scene.inkRgb : scene.rgb;
        }
        out[i * 3] = c[0];
        out[i * 3 + 1] = c[1];
        out[i * 3 + 2] = c[2];
      }
      return out;
    });

    const delays = new Float32Array(N);
    const sizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      delays[i] = rnd() * 0.32;
      sizes[i] = 0.6 + rnd() * 0.9;
    }

    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const proj = new Float32Array(N * 3); // screen x, y, depth scale

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pointer parallax (eased)
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

    let raf = 0;
    let lastProgress = -1;
    let lastAccentKey = '';
    let smoothProgress = getProgress();
    const start = performance.now();

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;

      const target = getProgress();
      // Ease toward the scroll position so fast scrolling still morphs smoothly
      smoothProgress += (target - smoothProgress) * (reducedMotion ? 1 : 0.085);
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      if (reducedMotion && Math.abs(smoothProgress - lastProgress) < 0.0005) return;
      lastProgress = smoothProgress;

      const maxIdx = FORMATIONS.length - 1;
      const p = Math.min(Math.max(smoothProgress, 0), maxIdx);
      const a = Math.min(Math.floor(p), maxIdx - 1);
      const t = p - a;
      const A = formations[a];
      const B = formations[a + 1];
      const CA = colours[a];
      const CB = colours[a + 1];

      for (let i = 0; i < N; i++) {
        const ti = easeInOut(clamp01((t - delays[i]) / 0.68));
        const i3 = i * 3;
        pos[i3] = A[i3] + (B[i3] - A[i3]) * ti;
        pos[i3 + 1] = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * ti;
        pos[i3 + 2] = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * ti;
        col[i3] = CA[i3] + (CB[i3] - CA[i3]) * ti;
        col[i3 + 1] = CA[i3 + 1] + (CB[i3 + 1] - CA[i3 + 1]) * ti;
        col[i3 + 2] = CA[i3 + 2] + (CB[i3 + 2] - CA[i3 + 2]) * ti;
      }

      // Camera: slow drift, scroll-linked orbit, pointer parallax, and a dolly
      // that pushes in mid-transition to suggest moving between environments.
      const time = reducedMotion ? 0 : (now - start) / 1000;
      const te = easeInOut(t);
      // Icons stay facing the viewer with a gentle sway; the bigger turn happens
      // mid-transition (alternating direction) and settles back to face-on.
      const turn = Math.sin(Math.PI * t) * 0.9 * (a % 2 ? -1 : 1);
      const yaw = Math.sin(time * 0.32) * 0.24 + pointer.x * 0.2 + turn;
      const pitch = 0.1 + pointer.y * 0.08 + Math.sin(time * 0.23) * 0.04;
      const dolly = 1 + Math.sin(Math.PI * t) * 0.22;
      const zoom = (ZOOMS[a] + (ZOOMS[a + 1] - ZOOMS[a]) * te) * dolly;
      const offset = isSmall || width < 900 ? 0 : OFFSETS_DESKTOP[a] + (OFFSETS_DESKTOP[a + 1] - OFFSETS_DESKTOP[a]) * te;

      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const camDist = 5.4;
      const focal = Math.min(width, height * 1.25) * 0.62 * zoom * dpr;
      const ox = (width / 2 + offset * width) * dpr;
      const offY = OFFSETS_Y[a] + (OFFSETS_Y[a + 1] - OFFSETS_Y[a]) * te;
      const oy = (height / 2 + offY * height) * dpr;

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const x = pos[i3];
        const y = pos[i3 + 1];
        const z = pos[i3 + 2];
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const s = focal / (camDist - z2);
        proj[i3] = ox + x1 * s;
        proj[i3 + 1] = oy - y2 * s;
        proj[i3 + 2] = s / (focal / camDist); // ~1 at origin depth
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = light ? 'source-over' : 'lighter';

      // Connecting lines: outgoing formation fades out, incoming fades in
      ctx.lineWidth = 0.6 * dpr;
      const drawLinks = (pairs, alpha) => {
        if (alpha < 0.02) return;
        for (let k = 0; k < pairs.length; k += 2) {
          const i = pairs[k];
          const j = pairs[k + 1];
          const depth = (proj[i * 3 + 2] + proj[j * 3 + 2]) * 0.5;
          const la = alpha * (light ? 0.16 : 0.22) * Math.min(1, Math.max(0.15, depth - 0.55));
          ctx.strokeStyle = `rgba(${col[i * 3] | 0},${col[i * 3 + 1] | 0},${col[i * 3 + 2] | 0},${la})`;
          ctx.beginPath();
          ctx.moveTo(proj[i * 3], proj[i * 3 + 1]);
          ctx.lineTo(proj[j * 3], proj[j * 3 + 1]);
          ctx.stroke();
        }
      };
      drawLinks(links[a], 1 - te);
      drawLinks(links[a + 1], te);

      // Points
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const depth = proj[i3 + 2];
        const r = sizes[i] * (0.55 + depth * 0.9) * dpr;
        const alpha = light
          ? Math.min(0.75, Math.max(0.1, (depth - 0.62) * 1.3))
          : Math.min(0.95, Math.max(0.12, (depth - 0.62) * 1.6));
        ctx.fillStyle = `rgba(${col[i3] | 0},${col[i3 + 1] | 0},${col[i3 + 2] | 0},${alpha})`;
        ctx.beginPath();
        ctx.arc(proj[i3], proj[i3 + 1], r, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // Report the blended accent colour so the page atmosphere can follow it
      if (onAccentChange) {
        const sa = SCENES[a].rgb;
        const sb = SCENES[a + 1].rgb;
        const accent = [0, 1, 2].map((c) => Math.round(sa[c] + (sb[c] - sa[c]) * te));
        const key = accent.join(',');
        if (key !== lastAccentKey) {
          lastAccentKey = key;
          onAccentChange(accent);
        }
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [getProgress, reducedMotion, onAccentChange, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

export default EcosystemCanvas;
