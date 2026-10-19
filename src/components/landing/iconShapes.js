/*
 * Point-cloud builders for the role icons shown by the landing-page 3D scene.
 * Each builder fills `out` (Float32Array N*3) with x, y, z roughly within
 * [-1.7, 1.7], built from simple parts (lines, arcs, rings, rounded rects)
 * so the same N points can morph between icons.
 */

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// ---------------------------------------------------------------------------
// Part samplers: (t in [0,1), j = index within the part, rnd) => [x, y, z]
// ---------------------------------------------------------------------------

const seg = (x0, y0, x1, y1, z = 0) => (t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z];

const arc = (cx, cy, r, a0, a1, z = 0) => (t) => {
  const a = a0 + (a1 - a0) * t;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
};

const ring = (cx, cy, r, z = 0) => arc(cx, cy, r, 0, TAU, z);

// Horizontal circle (in the xz plane), e.g. the rim of a coin or a stand
const ringXZ = (cx, cy, cz, r) => (t) => [cx + Math.cos(t * TAU) * r, cy, cz + Math.sin(t * TAU) * r];

// Points along an open or closed polyline, evenly spaced by length
const polyline = (pts, z = 0) => {
  const lens = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    lens.push(l);
    total += l;
  }
  return (t) => {
    let d = t * total;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) {
        const k = lens[i] ? d / lens[i] : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k, z];
      }
      d -= lens[i];
    }
    return [pts[0][0], pts[0][1], z];
  };
};

const roundRect = (cx, cy, w, h, r, z = 0) => {
  const hw = w / 2 - r;
  const hh = h / 2 - r;
  const straightW = 2 * hw;
  const straightH = 2 * hh;
  const quarter = (Math.PI / 2) * r;
  const total = 2 * straightW + 2 * straightH + 4 * quarter;
  return (t) => {
    let d = t * total;
    const segs = [
      [straightW, (k) => [cx - hw + k * straightW, cy + hh + r]],
      [quarter, (k) => [cx + hw + Math.sin((k * Math.PI) / 2) * r, cy + hh + Math.cos((k * Math.PI) / 2) * r]],
      [straightH, (k) => [cx + hw + r, cy + hh - k * straightH]],
      [quarter, (k) => [cx + hw + Math.cos((k * Math.PI) / 2) * r, cy - hh - Math.sin((k * Math.PI) / 2) * r]],
      [straightW, (k) => [cx + hw - k * straightW, cy - hh - r]],
      [quarter, (k) => [cx - hw - Math.sin((k * Math.PI) / 2) * r, cy - hh - Math.cos((k * Math.PI) / 2) * r]],
      [straightH, (k) => [cx - hw - r, cy - hh + k * straightH]],
      [quarter, (k) => [cx - hw - Math.cos((k * Math.PI) / 2) * r, cy + hh + Math.sin((k * Math.PI) / 2) * r]],
    ];
    for (const [len, fn] of segs) {
      if (d <= len) {
        const [x, y] = fn(len ? d / len : 0);
        return [x, y, z];
      }
      d -= len;
    }
    return [cx - hw, cy + hh + r, z];
  };
};

// Sunflower fill of a disc, evenly spread
const disc = (cx, cy, r, z = 0) => (t, j) => {
  const a = j * GOLDEN;
  const rr = Math.sqrt(t) * r;
  return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z];
};

// Sparse random fill of a rectangle, used for faint card surfaces
const fillRect = (cx, cy, w, h, z = 0) => (t, j, rnd) => [cx + (rnd() - 0.5) * w, cy + (rnd() - 0.5) * h, z];

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

const rotZ = (p, a) => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
};

/**
 * parts: [{ w: weight, fn: sampler, thick?: depth, tf?: (p) => p }]
 * Points are shared between parts by weight; `thick` alternates points
 * between a front and back layer so the icon has real depth.
 */
const assemble = (out, N, rnd, parts, globalTf) => {
  const totalW = parts.reduce((s, p) => s + p.w, 0);
  let i = 0;
  parts.forEach((part, pi) => {
    const count = pi === parts.length - 1 ? N - i : Math.round((N * part.w) / totalW);
    for (let j = 0; j < count && i < N; j++, i++) {
      const t = (j + 0.5) / count;
      let p = part.fn(t, j, rnd);
      if (part.thick) p = [p[0], p[1], p[2] + (j % 2 ? 0.5 : -0.5) * part.thick];
      p = [p[0] + (rnd() - 0.5) * 0.012, p[1] + (rnd() - 0.5) * 0.012, p[2] + (rnd() - 0.5) * 0.012];
      if (part.tf) p = part.tf(p);
      if (globalTf) p = globalTf(p);
      out[i * 3] = p[0];
      out[i * 3 + 1] = p[1];
      out[i * 3 + 2] = p[2];
    }
  });
};

// ---------------------------------------------------------------------------
// Attendee: conference ID badge on a lanyard
// ---------------------------------------------------------------------------
export const idBadge = (out, N, rnd) => {
  const T = 0.09;
  assemble(
    out,
    N,
    rnd,
    [
      { w: 9, fn: roundRect(0, -0.4, 1.6, 2.1, 0.2), thick: T },
      { w: 2, fn: fillRect(0, -0.4, 1.4, 1.9) },
      { w: 3.2, fn: ring(0, 0.12, 0.42), thick: T },
      { w: 1, fn: ring(0, 0.23, 0.12), thick: T },
      { w: 1.1, fn: arc(0, -0.24, 0.28, 0.4, Math.PI - 0.4), thick: T },
      { w: 1.6, fn: seg(-0.5, -0.6, 0.5, -0.6), thick: T },
      { w: 1.1, fn: seg(-0.34, -0.84, 0.34, -0.84), thick: T },
      { w: 0.8, fn: seg(-0.22, -1.06, 0.22, -1.06), thick: T },
      { w: 1, fn: roundRect(0, 0.44, 0.44, 0.1, 0.05), thick: T },
      { w: 0.6, fn: ring(0, 0.78, 0.09) },
      // Lanyard: a strap rising from the clip and opening out, as if worn
      { w: 1.8, fn: seg(-0.12, 0.84, -0.86, 1.85) },
      { w: 1.8, fn: seg(-0.02, 0.86, -0.7, 1.88) },
      { w: 1.8, fn: seg(0.12, 0.84, 0.86, 1.85) },
      { w: 1.8, fn: seg(0.02, 0.86, 0.7, 1.88) },
    ],
    (p) => rotZ(p, 0.1)
  );
};

// ---------------------------------------------------------------------------
// Organizer: a fanned stack of documents
// ---------------------------------------------------------------------------
const docOutline = (w, h, f) =>
  polyline([
    [-w / 2, h / 2],
    [w / 2 - f, h / 2],
    [w / 2, h / 2 - f],
    [w / 2, -h / 2],
    [-w / 2, -h / 2],
    [-w / 2, h / 2],
  ]);

export const fileStack = (out, N, rnd) => {
  const w = 1.3;
  const h = 1.72;
  const f = 0.34;
  const parts = [];
  const docs = 4;
  for (let k = 0; k < docs; k++) {
    const front = k === docs - 1;
    const dx = -0.42 + k * 0.28;
    const dy = 0.32 - k * 0.2;
    const dz = -0.5 + k * 0.33;
    const rz = -0.14 + k * 0.09;
    const tf = (p) => {
      const r = rotZ(p, rz);
      return [r[0] + dx, r[1] + dy, r[2] + dz];
    };
    parts.push({ w: front ? 6 : 3.4, fn: docOutline(w, h, f), thick: 0.05, tf });
    parts.push({ w: front ? 1.2 : 0.6, fn: polyline([[w / 2 - f, h / 2], [w / 2 - f, h / 2 - f], [w / 2, h / 2 - f]]), tf });
    const lines = front ? [0.42, 0.2, -0.02, -0.24, -0.46] : [0.3, 0.05];
    lines.forEach((ly, li) => {
      const lw = front ? [0.6, 0.85, 0.85, 0.7, 0.5][li] : 0.7;
      parts.push({ w: front ? 1.1 * lw : 0.5, fn: seg(-w / 2 + 0.2, ly, -w / 2 + 0.2 + lw, ly), tf });
    });
  }
  assemble(out, N, rnd, parts);
};

// ---------------------------------------------------------------------------
// Venue provider: a map pin dropping onto a ground ring
// ---------------------------------------------------------------------------
const PIN_R = 0.84;
const PIN_C = 0.42;
const PIN_TIP = -1.38;
const pinOutline = (() => {
  const d = PIN_C - PIN_TIP;
  const beta = Math.acos(PIN_R / d); // angle at the centre between "down" and the tangent point
  const right = -Math.PI / 2 + beta;
  const left = -Math.PI / 2 - beta + TAU;
  const P = (a) => [Math.cos(a) * PIN_R, PIN_C + Math.sin(a) * PIN_R];
  const arcLen = PIN_R * (left - right);
  const lineLen = Math.hypot(P(right)[0], P(right)[1] - PIN_TIP);
  const total = arcLen + 2 * lineLen;
  return (t, z = 0) => {
    let s = t * total;
    if (s < arcLen) {
      const [x, y] = P(right + (s / arcLen) * (left - right));
      return [x, y, z];
    }
    s -= arcLen;
    const L = P(left);
    const R = P(right);
    if (s < lineLen) {
      const k = s / lineLen;
      return [L[0] + (0 - L[0]) * k, L[1] + (PIN_TIP - L[1]) * k, z];
    }
    const k = (s - lineLen) / lineLen;
    return [0 + (R[0] - 0) * k, PIN_TIP + (R[1] - PIN_TIP) * k, z];
  };
})();

export const locationPin = (out, N, rnd) => {
  const depth = 0.22;
  assemble(out, N, rnd, [
    { w: 7, fn: (t) => pinOutline(t, depth) },
    { w: 7, fn: (t) => pinOutline(t, -depth) },
    { w: 3, fn: (t, j, r) => pinOutline(r(), (r() - 0.5) * 2 * depth) },
    { w: 2.6, fn: ring(0, PIN_C, 0.34, depth) },
    { w: 2, fn: ring(0, PIN_C, 0.34, -depth) },
    { w: 1.2, fn: disc(0, PIN_C, 0.16, depth) },
    { w: 3, fn: ringXZ(0, -1.5, 0, 1.05) },
    { w: 1.8, fn: ringXZ(0, -1.5, 0, 0.6) },
  ]);
};

// ---------------------------------------------------------------------------
// Speaker: a studio microphone in a yoke on a stand
// ---------------------------------------------------------------------------
export const microphone = (out, N, rnd) => {
  const headY = 0.92;
  const headR = 0.5;
  const half = 0.2; // straight section of the capsule
  const capsuleR = (y) => {
    const dy = Math.abs(y - headY);
    if (dy <= half) return headR;
    const k = dy - half;
    return k >= headR ? 0 : Math.sqrt(headR * headR - k * k);
  };
  const parts = [];
  // Grille: latitude rings and meridians on the capsule head
  [-0.62, -0.42, -0.2, 0, 0.2, 0.42, 0.62].forEach((o) => {
    const y = headY + o;
    parts.push({ w: 1.4 * (capsuleR(y) / headR + 0.2), fn: ringXZ(0, y, 0, capsuleR(y)) });
  });
  for (let m = 0; m < 8; m++) {
    const a = (m / 8) * TAU;
    parts.push({
      w: 1.2,
      fn: (t) => {
        const y = headY - (half + headR) + t * 2 * (half + headR);
        const r = capsuleR(y);
        return [Math.cos(a) * r, y, Math.sin(a) * r];
      },
    });
  }
  // Collar and body
  parts.push({ w: 1.2, fn: ringXZ(0, 0.3, 0, 0.42) });
  parts.push({ w: 1.2, fn: ringXZ(0, 0.2, 0, 0.42) });
  [0.0, -0.3, -0.58].forEach((y, i) => parts.push({ w: 1, fn: ringXZ(0, y, 0, 0.38 - i * 0.04) }));
  for (let m = 0; m < 6; m++) {
    const a = (m / 6) * TAU + 0.3;
    parts.push({ w: 0.7, fn: (t) => { const y = 0.2 - t * 0.78; const r = 0.4 - t * 0.1; return [Math.cos(a) * r, y, Math.sin(a) * r]; } });
  }
  // Yoke, stem and base
  parts.push({ w: 2.6, fn: arc(0, 0.62, 0.74, Math.PI + 0.12, TAU - 0.12), thick: 0.06 });
  parts.push({ w: 0.5, fn: ring(-0.74, 0.62, 0.07) });
  parts.push({ w: 0.5, fn: ring(0.74, 0.62, 0.07) });
  parts.push({ w: 1.4, fn: seg(0, -0.12, 0, -1.35), thick: 0.05 });
  parts.push({ w: 2, fn: ringXZ(0, -1.38, 0, 0.62) });
  parts.push({ w: 1.2, fn: ringXZ(0, -1.38, 0, 0.34) });
  assemble(out, N, rnd, parts);
};

// ---------------------------------------------------------------------------
// Volunteer: a handshake, traced from the Material Symbols "handshake" glyph
// (the icon font the site already loads), with a geometric fallback.
// ---------------------------------------------------------------------------
const GLYPH_FONT = '"Material Symbols Outlined"';

export const glyphReady = (name) => {
  try {
    return document.fonts.check(`200px ${GLYPH_FONT}`, name);
  } catch {
    return false;
  }
};

const sampleGlyph = (name, target) => {
  const size = 220;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  // A light stroke weight keeps the traced strokes about one dot wide, like line art
  ctx.font = `200 200px ${GLYPH_FONT}`;
  // Without the icon font the ligature falls back to plain text, which is much wider
  if (ctx.measureText(name).width > size * 1.2) return null;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(name, size / 2, size / 2);
  const data = ctx.getImageData(0, 0, size, size).data;
  const filled = (x, y) => data[(y * size + x) * 4 + 3] > 140;
  let total = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 140) total++;
  if (total < 200) return null;
  // Lay an even dot grid over the strokes, picking the spacing that yields
  // about `target` dots, so the icon reads as clean dotted line art.
  let pts = [];
  for (let g = 9; g >= 2; g--) {
    pts = [];
    for (let y = Math.floor(g / 2); y < size; y += g) {
      for (let x = (Math.floor(y / g) % 2) * Math.floor(g / 2); x < size; x += g) {
        if (filled(x, y)) pts.push([x, y]);
      }
    }
    if (pts.length >= target) break;
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  pts.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });
  const scale = 3.3 / Math.max(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return pts.map(([x, y]) => [(x - cx) * scale, -(y - cy) * scale]);
};

const handshakeFallback = (out, N, rnd) => {
  // Two forearms meeting in a clasp, with finger lines over the grip
  const arm = (dir) => (t) => [dir * (1.65 - t * 1.15), -0.55 + t * 0.55, 0];
  assemble(out, N, rnd, [
    { w: 2.4, fn: polyline([[-1.65, -0.2], [-0.5, 0.25]]), thick: 0.16 },
    { w: 2.4, fn: polyline([[-1.65, -0.75], [-0.45, -0.4]]), thick: 0.16 },
    { w: 2.4, fn: polyline([[1.65, -0.2], [0.5, 0.25]]), thick: 0.16 },
    { w: 2.4, fn: polyline([[1.65, -0.75], [0.45, -0.4]]), thick: 0.16 },
    { w: 1.2, fn: arm(-1) },
    { w: 1.2, fn: arm(1) },
    { w: 4, fn: roundRect(0, -0.08, 1.2, 0.8, 0.35), thick: 0.16 },
    ...[-0.32, -0.1, 0.12, 0.34].map((x) => ({ w: 0.8, fn: seg(x, 0.3, x + 0.12, -0.36), thick: 0.12 })),
  ]);
};

export const handshake = (out, N, rnd) => {
  const layers = 2;
  const perLayer = Math.ceil(N / layers);
  const glyph = glyphReady('handshake') ? sampleGlyph('handshake', perLayer) : null;
  if (!glyph) {
    handshakeFallback(out, N, rnd);
    return false;
  }
  // Front and back layers of the dot grid give the emblem its thickness
  const stride = glyph.length / perLayer;
  for (let i = 0; i < N; i++) {
    const layer = i % layers;
    const k = Math.floor(i / layers);
    const [x, y] = glyph[Math.min(glyph.length - 1, Math.floor((k + layer * 0.5) * stride))];
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = layer ? 0.09 : -0.09;
  }
  return true;
};

// ---------------------------------------------------------------------------
// Sponsor: a banknote with a stack of coins
// ---------------------------------------------------------------------------
export const banknote = (out, N, rnd) => {
  const W = 2.5;
  const H = 1.25;
  const wave = (p) => [p[0], p[1], p[2] + 0.14 * Math.sin(p[0] * 1.4)];
  const note = (p) => {
    const q = rotZ(wave(p), -0.1);
    return [q[0] - 0.3, q[1] + 0.38, q[2]];
  };
  const backNote = (p) => {
    const q = rotZ(wave(p), 0.02);
    return [q[0] - 0.05, q[1] + 0.6, q[2] - 0.4];
  };
  const coinX = 1.05;
  const coinY = -0.95;
  const coinZ = 0.5;
  const coinR = 0.42;
  const coins = 6;
  const parts = [
    { w: 7, fn: roundRect(0, 0, W, H, 0.06), thick: 0.04, tf: note },
    { w: 4.2, fn: roundRect(0, 0, W - 0.28, H - 0.28, 0.04), tf: note },
    { w: 2.4, fn: ring(0, 0, 0.34), tf: note },
    { w: 1.5, fn: ring(0, 0, 0.2), tf: note },
    ...[[-0.92, 0.36], [0.92, 0.36], [-0.92, -0.36], [0.92, -0.36]].map(([x, y]) => ({ w: 0.5, fn: ring(x, y, 0.1), tf: note })),
    { w: 0.8, fn: seg(-0.85, -0.05, -0.5, -0.05), tf: note },
    { w: 0.8, fn: seg(0.5, -0.05, 0.85, -0.05), tf: note },
    { w: 3, fn: roundRect(0, 0, W, H, 0.06), tf: backNote },
  ];
  for (let k = 0; k < coins; k++) {
    parts.push({ w: 1.6, fn: ringXZ(coinX, coinY + k * 0.09, coinZ, coinR) });
  }
  parts.push({ w: 1.2, fn: ringXZ(coinX, coinY + (coins - 1) * 0.09, coinZ, coinR * 0.7) });
  parts.push({ w: 1.2, fn: (t, j) => { const a = j * GOLDEN; const rr = Math.sqrt(t) * coinR * 0.55; return [coinX + Math.cos(a) * rr, coinY + (coins - 1) * 0.09, coinZ + Math.sin(a) * rr]; } });
  for (let m = 0; m < 10; m++) {
    const a = (m / 10) * TAU;
    parts.push({ w: 0.3, fn: (t) => [coinX + Math.cos(a) * coinR, coinY + t * (coins - 1) * 0.09, coinZ + Math.sin(a) * coinR] });
  }
  assemble(out, N, rnd, parts);
};

// ---------------------------------------------------------------------------
// Final: all six role icons gathered on a ring, joined by arcs
// ---------------------------------------------------------------------------
export const ROLE_ICON_BUILDERS = [idBadge, fileStack, locationPin, microphone, handshake, banknote];

export const iconRing = (out, N, rnd) => {
  const roles = ROLE_ICON_BUILDERS.length;
  const perRole = Math.ceil(N / roles);
  const iconShare = Math.floor(perRole * 0.88);
  const icons = ROLE_ICON_BUILDERS.map((build) => {
    const pts = new Float32Array(iconShare * 3);
    build(pts, iconShare, rnd);
    return pts;
  });
  // An ellipse wide enough to frame the closing headline
  const RX = 2.75;
  const RY = 1.55;
  const S = 0.4;
  const angle = (r) => Math.PI / 2 - (r / roles) * TAU;
  for (let i = 0; i < N; i++) {
    // Point i belongs to role i % 6, matching how the final scene is coloured
    const r = i % roles;
    const k = Math.floor(i / roles);
    const a = angle(r);
    let x;
    let y;
    let z;
    if (k < iconShare) {
      x = Math.cos(a) * RX + icons[r][k * 3] * S;
      y = Math.sin(a) * RY + icons[r][k * 3 + 1] * S;
      z = icons[r][k * 3 + 2] * S;
    } else {
      const t = (k - iconShare + 0.5) / Math.max(1, perRole - iconShare);
      const b = a - 0.32 - t * (TAU / roles - 0.64);
      x = Math.cos(b) * RX;
      y = Math.sin(b) * RY;
      z = 0;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
};
