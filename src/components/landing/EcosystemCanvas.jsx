import React, { useEffect, useRef } from 'react';
import { SCENES, ROLE_JOURNEY } from './journey';

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

const gauss = (rnd) => {
  const u = rnd() || 1e-6;
  const v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
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

const constellations = (out, N, rnd) => {
  const clusters = Array.from({ length: 16 }, () => ({
    x: (rnd() - 0.5) * 5.0,
    y: (rnd() - 0.5) * 2.4,
    z: (rnd() - 0.5) * 2.2,
    s: 0.1 + rnd() * 0.14,
  }));
  const clustered = Math.floor(N * 0.78);
  for (let i = 0; i < N; i++) {
    if (i < clustered) {
      const c = clusters[i % clusters.length];
      out[i * 3] = c.x + gauss(rnd) * c.s;
      out[i * 3 + 1] = c.y + gauss(rnd) * c.s;
      out[i * 3 + 2] = c.z + gauss(rnd) * c.s;
    } else {
      out[i * 3] = (rnd() - 0.5) * 5.6;
      out[i * 3 + 1] = (rnd() - 0.5) * 3.0;
      out[i * 3 + 2] = (rnd() - 0.5) * 2.6;
    }
  }
};

const layeredPanels = (out, N, rnd) => {
  // Four stacked "screens" with a timeline grid on each
  const planes = [
    { z: -0.95, w: 2.6, h: 1.6, x: -0.35, y: 0.25 },
    { z: -0.32, w: 2.3, h: 1.4, x: 0.1, y: 0.05 },
    { z: 0.3, w: 2.0, h: 1.2, x: 0.45, y: -0.12 },
    { z: 0.9, w: 1.6, h: 0.95, x: 0.75, y: -0.3 },
  ];
  const per = Math.floor(N / planes.length);
  for (let i = 0; i < N; i++) {
    const p = planes[Math.min(planes.length - 1, Math.floor(i / per))];
    const k = i % per;
    const cols = Math.max(4, Math.round(Math.sqrt(per * (p.w / p.h))));
    const rows = Math.max(3, Math.ceil(per / cols));
    const cx = k % cols;
    const cy = Math.floor(k / cols);
    out[i * 3] = p.x + (cx / (cols - 1) - 0.5) * p.w;
    out[i * 3 + 1] = p.y + (cy / (rows - 1) - 0.5) * p.h;
    out[i * 3 + 2] = p.z + (rnd() - 0.5) * 0.015;
  }
};

const amphitheater = (out, N, rnd) => {
  const stageN = Math.floor(N * 0.16);
  const beamN = Math.floor(N * 0.14);
  const seatsN = N - stageN - beamN;
  const rows = 9;
  const perRow = Math.floor(seatsN / rows);
  let i = 0;
  for (let r = 0; r < rows; r++) {
    const radius = 0.9 + r * 0.2;
    const count = r === rows - 1 ? seatsN - perRow * (rows - 1) : perRow;
    for (let k = 0; k < count; k++, i++) {
      const a = Math.PI * 0.08 + (k / Math.max(1, count - 1)) * Math.PI * 0.84;
      out[i * 3] = Math.cos(a) * radius;
      out[i * 3 + 1] = -0.75 + r * 0.13;
      out[i * 3 + 2] = -Math.sin(a) * radius + 0.4;
    }
  }
  // Stage: a disc in front of the seats
  for (let k = 0; k < stageN; k++, i++) {
    const a = k * GOLDEN;
    const rr = Math.sqrt(k / stageN) * 0.62;
    out[i * 3] = Math.cos(a) * rr;
    out[i * 3 + 1] = -0.95;
    out[i * 3 + 2] = Math.sin(a) * rr * 0.55 + 0.55;
  }
  // Spotlight beam falling onto the stage
  for (let k = 0; k < beamN; k++, i++) {
    const t = k / beamN;
    const a = rnd() * TAU;
    const rr = 0.05 + t * 0.48 * Math.sqrt(rnd());
    out[i * 3] = Math.cos(a) * rr;
    out[i * 3 + 1] = 1.55 - t * 2.45;
    out[i * 3 + 2] = 0.55 + Math.sin(a) * rr * 0.55;
  }
};

const linkedRings = (out, N, rnd) => {
  const ringsCount = 6;
  const hubN = Math.floor(N * 0.14);
  const ringTotal = N - hubN;
  const per = Math.floor(ringTotal / ringsCount);
  let i = 0;
  for (let r = 0; r < ringsCount; r++) {
    const base = (r / ringsCount) * TAU;
    const cx = Math.cos(base) * 1.18;
    const cz = Math.sin(base) * 1.18;
    const count = r === ringsCount - 1 ? ringTotal - per * (ringsCount - 1) : per;
    const tilt = r % 2 === 0 ? 0.0 : Math.PI / 2;
    for (let k = 0; k < count; k++, i++) {
      const a = (k / count) * TAU;
      const lx = Math.cos(a) * 0.68;
      const ly = Math.sin(a) * 0.68;
      // Ring plane faces outward from the circle; alternate rings rotate 90° so neighbours interlock
      const ux = -Math.sin(base);
      const uz = Math.cos(base);
      const px = lx * Math.cos(tilt);
      const py = ly;
      const pz = lx * Math.sin(tilt);
      out[i * 3] = cx + ux * px + Math.cos(base) * pz;
      out[i * 3 + 1] = py;
      out[i * 3 + 2] = cz + uz * px + Math.sin(base) * pz;
    }
  }
  for (let k = 0; k < hubN; k++, i++) {
    const y = 1 - (2 * (k + 0.5)) / hubN;
    const rr = Math.sqrt(1 - y * y);
    const th = k * GOLDEN;
    out[i * 3] = Math.cos(th) * rr * 0.32;
    out[i * 3 + 1] = y * 0.32;
    out[i * 3 + 2] = Math.sin(th) * rr * 0.32;
  }
};

const risingHelix = (out, N, rnd) => {
  const helixN = Math.floor(N * 0.55);
  const colsN = N - helixN;
  let i = 0;
  for (let k = 0; k < helixN; k++, i++) {
    const strand = k % 2;
    const t = Math.floor(k / 2) / (helixN / 2);
    const a = t * TAU * 3.2 + strand * Math.PI;
    const r = 0.55 + t * 0.45;
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = -1.35 + t * 2.7;
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  const columns = 7;
  const perCol = Math.floor(colsN / columns);
  for (let c = 0; c < columns; c++) {
    const a = Math.PI * 0.15 + (c / (columns - 1)) * Math.PI * 0.7;
    const x = Math.cos(a) * 2.0;
    const z = -Math.sin(a) * 1.4 - 0.2;
    const height = 0.6 + (c / (columns - 1)) * 1.9;
    const count = c === columns - 1 ? colsN - perCol * (columns - 1) : perCol;
    for (let k = 0; k < count; k++, i++) {
      out[i * 3] = x + (rnd() - 0.5) * 0.06;
      out[i * 3 + 1] = -1.3 + (k / count) * height;
      out[i * 3 + 2] = z + (rnd() - 0.5) * 0.06;
    }
  }
};

const archedHall = (out, N, rnd) => {
  // A colonnade of arches over a floor grid: the space events happen in
  const floorN = Math.floor(N * 0.34);
  const arches = 6;
  const archTotal = N - floorN;
  const per = Math.floor(archTotal / arches);
  let i = 0;
  const cols = Math.max(6, Math.round(Math.sqrt(floorN * 1.6)));
  const rows = Math.ceil(floorN / cols);
  for (let k = 0; k < floorN; k++, i++) {
    out[i * 3] = ((k % cols) / (cols - 1) - 0.5) * 3.4;
    out[i * 3 + 1] = -1.05;
    out[i * 3 + 2] = (Math.floor(k / cols) / Math.max(1, rows - 1) - 0.5) * 2.8;
  }
  for (let a = 0; a < arches; a++) {
    const z = -1.3 + (a / (arches - 1)) * 2.6;
    const count = a === arches - 1 ? archTotal - per * (arches - 1) : per;
    const legN = Math.floor(count * 0.25);
    for (let k = 0; k < count; k++, i++) {
      if (k < legN * 2) {
        // two columns
        const side = k % 2 ? 1 : -1;
        const t = Math.floor(k / 2) / legN;
        out[i * 3] = side * 1.15;
        out[i * 3 + 1] = -1.05 + t * 1.2;
      } else {
        // the arch itself
        const t = (k - legN * 2) / Math.max(1, count - legN * 2 - 1);
        const ang = Math.PI * t;
        out[i * 3] = -Math.cos(ang) * 1.15;
        out[i * 3 + 1] = 0.15 + Math.sin(ang) * 0.95;
      }
      out[i * 3 + 2] = z + (rnd() - 0.5) * 0.02;
    }
  }
};

const FORMATIONS = [
  sphereWithRing, // hero
  constellations, // attendee
  layeredPanels, // organizer
  archedHall, // venue provider
  amphitheater, // speaker
  linkedRings, // volunteer
  risingHelix, // sponsor
  (out, N, rnd) => sphereWithRing(out, N, rnd, 0.62), // final: everything converges
];

// Scene centre offset (fraction of width) so the field sits behind each section's visual
const OFFSETS_DESKTOP = [0.2, 0.18, -0.2, 0.2, 0, 0.2, -0.2, 0];
const ZOOMS = [1, 0.9, 0.95, 0.95, 0.85, 1.05, 1.0, 1.45];
// Vertical offset (fraction of height): the speaker stage sits low, under the centred copy
const OFFSETS_Y = [0, 0, 0, 0, 0.24, 0, 0, 0];

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

const LINK_DISTANCES = [0.2, 0.2, 0.17, 0.16, 0.2, 0.17, 0.16, 0.2];

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
    const N = isSmall ? 420 : lowPower ? 620 : 900;
    const rnd = seeded(20261016);

    const formations = FORMATIONS.map((fn) => {
      const out = new Float32Array(N * 3);
      fn(out, N, rnd);
      return out;
    });
    const links = formations.map((pos, idx) =>
      buildLinks(pos, N, LINK_DISTANCES[idx], 2, isSmall ? 0.28 : 0.42, rnd)
    );

    // Per-point colour for every scene: role scenes use their colour with a few
    // neutral points; hero and final mix all the role colours.
    const roleColours = ROLE_JOURNEY.map((r) => (light ? r.inkRgb : r.rgb));
    const colours = SCENES.map((scene, idx) => {
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        let c;
        if (idx === 0 || idx === SCENES.length - 1) {
          const rc = roleColours[i % roleColours.length];
          const mix = light ? (idx === 0 ? 0.7 : 0.95) : idx === 0 ? 0.45 : 0.85;
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
      const yaw = time * 0.06 + p * 0.55 + pointer.x * 0.22;
      const pitch = 0.2 + pointer.y * 0.1 + Math.sin(p * 1.3) * 0.06;
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
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [getProgress, reducedMotion, onAccentChange, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
};

export default EcosystemCanvas;
