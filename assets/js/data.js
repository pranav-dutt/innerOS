/* innerOS prototype — mock data + icons. Everything here is illustrative, not clinical data. */
window.IO = window.IO || {};

/* ---------- Icons (stroke, 24px grid) ---------- */
(function () {
  const p = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    biology: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6"/><path d="M17 3c0 6-10 6-10 12"/><path d="M8.5 7h7M8.5 17h7M10 12h4"/>',
    track: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    plan: '<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M9 3v3M15 3v3M8 11h8M8 15h5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6 3 3v3M9 11l3-3 3 3 3 1M12 8l-1.5 5"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>',
    pill: '<rect x="3" y="9" width="18" height="7" rx="3.5" transform="rotate(-30 12 12.5)"/><path d="M10 8.5l4 7"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c2 .7 3 2.3 3.5 5"/>',
    inbox: '<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h5l1 2h4l1-2h5"/>',
    truck: '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    flame: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7 10 6 12.5 6 15a6 6 0 0 0 6 6z"/>',
    scale: '<rect x="3" y="4" width="18" height="16" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0L12 13z"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5 20 4"/>',
    gut: '<path d="M8 4c-3 0-4 3-2 5s6 1 6 4-5 2-6 5 2 3 4 2M14 4c3 0 5 2 4 5"/>',
    blood: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    dna: '<path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12"/><path d="M8.5 7h7M8.5 17h7"/>',
    plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
    watch: '<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6V3h6v3M9 18v3h6v-3"/>',
    logout: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14-5l-2 2M4 13a8 8 0 0 0 14 5l2-2"/><path d="M4 4v4h4M20 20v-4h-4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    google: '<path d="M20.5 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.5z" fill="#4285F4" stroke="none"/><path d="M12 21c2.4 0 4.4-.8 5.9-2.2L15 16.5c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.3A9 9 0 0 0 12 21z" fill="#34A853" stroke="none"/><path d="M7 13.7a5.4 5.4 0 0 1 0-3.4V8H4a9 9 0 0 0 0 8z" fill="#FBBC05" stroke="none"/><path d="M12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 4 8l3 2.3c.7-2.1 2.7-3.7 5-3.7z" fill="#EA4335" stroke="none"/>',
    apple: '<path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8a4.4 4.4 0 0 0-3.7 2.3c-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.7 2.3 2.9 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.2-2.6 0 0-2.4-.9-2.4-3.6zM14.1 5.9a4 4 0 0 0 .9-3c-.9 0-2 .6-2.6 1.4a3.8 3.8 0 0 0-1 2.9c1 .1 2-.5 2.7-1.3z" fill="currentColor" stroke="none"/>'
  };
  IO.icon = function (name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p[name] || '') + '</svg>';
  };
})();

/* ---------- Scoring rules (copied from BRD §8 — shown in the UI, never computed in the real app) ---------- */
IO.band = function (s) {
  if (s == null) return { key: 'neutral', label: 'Not measured' };
  if (s < 4) return { key: 'attention', label: 'Attention' };
  if (s < 6) return { key: 'improve', label: 'Improve' };
  if (s < 8) return { key: 'maintain', label: 'Maintain' };
  return { key: 'good', label: 'Good' };
};
IO.r1 = function (n) { return Math.round(n * 10) / 10; };
IO.scoreMarker = function (v, a) {
  let s;
  if (v >= a.opt_lo && v <= a.opt_hi) s = 9.5;
  else if (v >= a.ref_lo && v < a.opt_lo) s = 6 + 3.5 * (v - a.ref_lo) / (a.opt_lo - a.ref_lo);
  else if (v > a.opt_hi && v <= a.ref_hi) s = 6 + 3.5 * (a.ref_hi - v) / (a.ref_hi - a.opt_hi);
  else if (v >= a.crit_lo && v < a.ref_lo) s = 3 + 3 * (v - a.crit_lo) / (a.ref_lo - a.crit_lo);
  else if (v > a.ref_hi && v <= a.crit_hi) s = 3 + 3 * (a.crit_hi - v) / (a.crit_hi - a.ref_hi);
  else if (v < a.crit_lo) s = Math.max(0, a.crit_lo === 0 ? 0 : 3 * v / a.crit_lo);
  else s = Math.max(0, 3 - 3 * (v - a.crit_hi) / a.crit_hi);
  return IO.r1(s);
};
IO.RESP = { fast: 0.5, moderate: 0.35, slow: 0.15, fixed: 0.05 };
IO.RESP_LABEL = { fast: 'moves in weeks', moderate: 'moves in months', slow: 'moves slowly', fixed: 'largely fixed' };
IO.target = function (cur, cls, adh) { return IO.r1(Math.min(cur + (10 - cur) * IO.RESP[cls] * (adh || 1), 8.5)); };
IO.gapLabel = function (gap) {
  if (gap == null) return 'locked';
  if (gap > 1.5) return 'Outperforming your genes';
  if (gap >= -1.5) return 'On track with your genes';
  if (gap >= -3) return 'Below your genetic potential';
  return 'Well below your genetic potential';
};

/* ---------- Demo client ---------- */
IO.client = {
  first: 'Ananya', name: 'Ananya Rao', ref: 'IFN-0142', age: 42, sex: 'Female', city: 'Bengaluru',
  diet: 'Vegetarian', phone: '+91 98450 •• 312', email: 'ananya.r@•••••.in',
  innerAge: 38.4, collected: '14 Oct 2026',
  drivers: [
    { name: 'RDW-CV', delta: +1.2, note: 'Red cell size spread · linked to iron and B12', link: 'ferritin' },
    { name: 'Fasting glucose', delta: +0.9, note: 'Near the top of optimal', link: 'glucose' },
    { name: 'hs-CRP', delta: +0.6, note: 'Low-grade inflammation', link: 'hscrp' },
    { name: 'Albumin', delta: -2.3, note: 'Strong protein status', link: 'albumin' },
    { name: 'Lymphocyte %', delta: -1.4, note: 'Healthy immune balance', link: 'lymph' }
  ],
  layers: {
    vitals: { state: 'present', name: 'Vitals', what: 'Blood', date: '14 Oct 2026', icon: 'blood' },
    origin: { state: 'present', name: 'Origin', what: 'Genetics', date: '2 Nov 2026', icon: 'dna' },
    sense: { state: 'present', name: 'Sense', what: 'Food test', date: '14 Oct 2026', icon: 'plate' },
    flora: { state: 'progress', name: 'Flora', what: 'Gut', date: 'Sample received', icon: 'gut' }
  },
  floraStages: ['Kit requested', 'Kit dispatched', 'Sample collected', 'Sample received', 'Result received', 'In review', 'Live'],
  floraAt: 3,
  vitalsPlan: [
    { n: 'Baseline', d: '14 Oct 2026', s: 'done' },
    { n: 'Response', d: '14 Mar 2027', s: 'next' },
    { n: 'Direction', d: '14 Jun 2027', s: '' }
  ],
  adherence: 0.86
};

/* 17 body systems — names illustrative (final list: lut_system_segment). gut CFI = blood only until Flora arrives. */
IO.systems = [
  ['sugar', 'Blood sugar & insulin', 5.2, 4.1], ['lipids', 'Lipids & cholesterol', 4.6, 4.8], ['inflam', 'Inflammation', 6.8, 4.4],
  ['nutrients', 'Nutrient status', 7.0, 4.9], ['thyroid', 'Thyroid', 7.2, 5.6], ['gut', 'Gut & digestion', 6.1, 5.8],
  ['iron', 'Blood & iron', 7.4, 6.1], ['heart', 'Heart & circulation', 6.5, 6.6], ['liver', 'Liver', 7.1, 6.9],
  ['hormones', 'Hormonal balance', 6.4, 6.7], ['bones', 'Bones & joints', 5.9, 7.0], ['stress', 'Stress & sleep', 5.5, 6.2],
  ['immune', 'Immunity', 7.6, 7.3], ['brain', 'Brain & mood', 6.9, 7.4], ['muscle', 'Muscle & recovery', 7.8, 7.9],
  ['kidney', 'Kidney', 8.1, 8.4], ['skin', 'Skin & hair', 7.0, 8.2]
].map(function (r) {
  const gpi = r[2], cfi = r[3];
  return { id: r[0], name: r[1], gpi: gpi, cfi: cfi, si: IO.r1(gpi * 0.35 + cfi * 0.65), gap: IO.r1(cfi - gpi) };
}).sort(function (a, b) { return a.si - b.si; });
IO.overall = IO.r1(IO.systems.reduce(function (t, s) { return t + s.si; }, 0) / IO.systems.length);

/* Vitals markers with six anchors (lut_marker_anchors — values illustrative) */
IO.markers = [
  { id: 'vitd', name: 'Vitamin D (25-OH)', unit: 'ng/mL', v: 22, a: { crit_lo: 20, ref_lo: 30, opt_lo: 60, opt_hi: 80, ref_hi: 100, crit_hi: 150 }, cls: 'moderate', sys: ['nutrients', 'bones', 'immune'], hist: [22] },
  { id: 'ferritin', name: 'Ferritin', unit: 'ng/mL', v: 13, a: { crit_lo: 10, ref_lo: 15, opt_lo: 50, opt_hi: 150, ref_hi: 200, crit_hi: 400 }, cls: 'moderate', sys: ['iron', 'nutrients'], hist: [13] },
  { id: 'apob', name: 'ApoB', unit: 'mg/dL', v: 112, a: { crit_lo: 0, ref_lo: 0, opt_lo: 0, opt_hi: 80, ref_hi: 100, crit_hi: 130 }, cls: 'moderate', sys: ['lipids', 'heart'], hist: [112], india: true },
  { id: 'hba1c', name: 'HbA1c', unit: '%', v: 5.9, a: { crit_lo: 0, ref_lo: 0, opt_lo: 0, opt_hi: 5.4, ref_hi: 5.7, crit_hi: 6.5 }, cls: 'moderate', sys: ['sugar'], hist: [5.9] },
  { id: 'hdl', name: 'HDL cholesterol', unit: 'mg/dL', v: 46, a: { crit_lo: 30, ref_lo: 50, opt_lo: 60, opt_hi: 90, ref_hi: 120, crit_hi: 150 }, cls: 'slow', sys: ['lipids', 'heart'], hist: [46] },
  { id: 'hscrp', name: 'hs-CRP', unit: 'mg/L', v: 3.4, a: { crit_lo: 0, ref_lo: 0, opt_lo: 0, opt_hi: 1, ref_hi: 3, crit_hi: 10 }, cls: 'fast', sys: ['inflam', 'heart'], hist: [3.4] },
  { id: 'trig', name: 'Triglycerides', unit: 'mg/dL', v: 168, a: { crit_lo: 0, ref_lo: 0, opt_lo: 0, opt_hi: 100, ref_hi: 150, crit_hi: 500 }, cls: 'fast', sys: ['lipids', 'sugar'], hist: [168] },
  { id: 'glucose', name: 'Fasting glucose', unit: 'mg/dL', v: 98, a: { crit_lo: 54, ref_lo: 70, opt_lo: 75, opt_hi: 90, ref_hi: 99, crit_hi: 126 }, cls: 'fast', sys: ['sugar'], hist: [98] },
  { id: 'b12', name: 'Vitamin B12', unit: 'pg/mL', v: 240, a: { crit_lo: 150, ref_lo: 200, opt_lo: 500, opt_hi: 900, ref_hi: 1100, crit_hi: 2000 }, cls: 'moderate', sys: ['nutrients', 'brain'], hist: [240] },
  { id: 'tsh', name: 'TSH', unit: 'µIU/mL', v: 3.9, a: { crit_lo: 0.1, ref_lo: 0.4, opt_lo: 1, opt_hi: 2, ref_hi: 4.5, crit_hi: 10 }, cls: 'slow', sys: ['thyroid'], hist: [3.9] },
  { id: 'rdw', name: 'RDW-CV', unit: '%', v: 14.1, a: { crit_lo: 10, ref_lo: 11, opt_lo: 11.5, opt_hi: 13, ref_hi: 14.5, crit_hi: 17 }, cls: 'moderate', sys: ['iron'], hist: [14.1] },
  { id: 'homocys', name: 'Homocysteine', unit: 'µmol/L', v: 13.2, a: { crit_lo: 0, ref_lo: 0, opt_lo: 0, opt_hi: 8, ref_hi: 15, crit_hi: 30 }, cls: 'moderate', sys: ['heart', 'brain'], hist: [13.2] },
  { id: 'albumin', name: 'Albumin', unit: 'g/dL', v: 4.6, a: { crit_lo: 3, ref_lo: 3.5, opt_lo: 4.3, opt_hi: 5, ref_hi: 5.2, crit_hi: 5.8 }, cls: 'slow', sys: ['liver', 'muscle'], hist: [4.6] },
  { id: 'lymph', name: 'Lymphocyte %', unit: '%', v: 34, a: { crit_lo: 10, ref_lo: 20, opt_lo: 25, opt_hi: 40, ref_hi: 45, crit_hi: 60 }, cls: 'fast', sys: ['immune'], hist: [34] }
].map(function (m) {
  m.score = IO.scoreMarker(m.v, m.a);
  m.tgt = IO.target(m.score, m.cls, 1);
  return m;
}).sort(function (a, b) { return a.score - b.score; });

IO.traits = [
  { name: 'Caffeine metabolism', genes: 'CYP1A2', level: 'High', text: 'You tend to clear caffeine slowly. Keep coffee and tea before 1 pm.', food: true, sys: 'stress' },
  { name: 'Salt sensitivity', genes: 'AGT · ACE', level: 'High', text: 'Blood pressure tends to respond more to sodium.', food: true, sys: 'heart' },
  { name: 'Vitamin D metabolism', genes: 'GC · CYP2R1', level: 'Moderate', text: 'A moderate tendency toward lower vitamin D levels.', food: true, sys: 'nutrients' },
  { name: 'Carbohydrate response', genes: 'TCF7L2', level: 'Moderate', text: 'Blood sugar may rise more after refined carbohydrates.', food: true, sys: 'sugar' },
  { name: 'Omega-3 conversion', genes: 'FADS1', level: 'Moderate', text: 'Plant omega-3 converts less efficiently.', food: false, sys: 'inflam' },
  { name: 'Lactose tolerance', genes: 'MCM6', level: 'Low', text: 'Low tendency toward lactose intolerance.', food: false, sys: 'gut' }
];
IO.gated = ['Cardiovascular risk profile (APOE)'];

IO.food = {
  avoid: [
    { n: 'Wheat (atta, maida, suji)', r: 'Sense · intolerance high — avoid for 12 weeks, then reintroduce on 6 Jan 2027' },
    { n: 'Peanut', r: 'Sense · allergy positive — avoid permanently' }
  ],
  minimise: [
    { n: 'Cow’s milk', r: 'Sense · intolerance moderate — once a week, small portion' },
    { n: 'Brinjal', r: 'Sense · intolerance moderate' },
    { n: 'Pickles and papad', r: 'Origin · salt sensitivity high' },
    { n: 'Coffee after 1 pm', r: 'Origin · slow caffeine metabolism' }
  ],
  prioritise: [
    { n: 'Ragi, jowar and bajra rotis', r: 'Swap for wheat · fibre for blood sugar' },
    { n: 'Rajma, chana, moong dal', r: 'Vitals · ferritin low — pair with amla or lemon' },
    { n: 'Walnuts and flax', r: 'Vitals · hs-CRP above optimal' },
    { n: 'Mushrooms left in sunlight', r: 'Vitals · vitamin D low' },
    { n: 'Curd and buttermilk', r: 'Tolerated dairy · supports gut (Flora pending)' },
    { n: 'Methi and palak', r: 'Vitals · ferritin low' }
  ]
};

IO.signature = {
  basic: { n: 'Basic', p: 290, cov: 54, needs: 6, total: 14 },
  standard: { n: 'Standard', p: 440, cov: 79, needs: 11, total: 14 },
  premium: { n: 'Premium', p: 690, cov: 100, needs: 14, total: 14 },
  bands: {
    basic: [
      ['DEFEND', '--seg-defend', [['Vitamin D3 + K2', 'Vitamin D low'], ['Zinc bisglycinate', 'Immunity']]],
      ['ENERGY', '--seg-energy', [['Iron bisglycinate + vitamin C', 'Ferritin low'], ['Methylcobalamin', 'B12 low']]],
      ['BALANCE', '--seg-balance', [['Chromium picolinate', 'HbA1c above optimal'], ['Psyllium husk', 'Blood sugar']]]
    ],
    standard: [
      ['DEFEND', '--seg-defend', [['Vitamin D3 + K2', 'Vitamin D low'], ['Zinc bisglycinate', 'Immunity']]],
      ['ENERGY', '--seg-energy', [['Iron bisglycinate + vitamin C', 'Ferritin low'], ['Methylcobalamin', 'B12 low']]],
      ['BALANCE', '--seg-balance', [['Chromium picolinate', 'HbA1c above optimal'], ['Psyllium husk', 'Blood sugar'], ['Plant sterols', 'ApoB above optimal']]],
      ['ENHANCE', '--seg-enhance', [['Algal omega-3 (EPA + DHA)', 'hs-CRP · omega-3 conversion']]],
      ['CLARITY', '--seg-clarity', [['Methylfolate + B6', 'Homocysteine'], ['Magnesium glycinate', 'Stress & sleep']]]
    ],
    premium: [
      ['DEFEND', '--seg-defend', [['Vitamin D3 + K2 (liposomal)', 'Vitamin D low'], ['Zinc bisglycinate', 'Immunity']]],
      ['ENERGY', '--seg-energy', [['Iron bisglycinate + vitamin C', 'Ferritin low'], ['Methylcobalamin', 'B12 low']]],
      ['BALANCE', '--seg-balance', [['Chromium picolinate', 'HbA1c above optimal'], ['Psyllium husk', 'Blood sugar'], ['Plant sterols', 'ApoB above optimal']]],
      ['ENHANCE', '--seg-enhance', [['Algal omega-3 (EPA + DHA)', 'hs-CRP · omega-3 conversion']]],
      ['CLARITY', '--seg-clarity', [['Methylfolate + B6', 'Homocysteine'], ['Magnesium glycinate', 'Stress & sleep']]],
      ['REJUVENATE', '--seg-rejuvenate', [['Curcumin phytosome', 'Inflammation'], ['Collagen peptides powder', 'Skin, bones & joints']]]
    ]
  },
  deferred: {
    basic: ['Plant sterols — ApoB', 'Algal omega-3 — hs-CRP', 'Methylfolate + B6 — homocysteine', '+5 more unlocked in Standard'],
    standard: ['Curcumin phytosome — inflammation', 'Collagen peptides — bones & joints', 'Liposomal vitamin D form'],
    premium: []
  }
};

IO.actions = [
  { id: 'a1', t: '20 minutes of morning daylight', s: 'innerAge driver · vitamin D low', pts: 10, done: true },
  { id: 'a2', t: 'Walk 10 minutes after lunch', s: 'Fasting glucose near top of optimal', pts: 10, done: true },
  { id: 'a3', t: 'Swap wheat roti for ragi or jowar', s: 'Food test · wheat on avoid list', pts: 15, done: false },
  { id: 'a4', t: 'Last coffee or chai before 1 pm', s: 'Genetics · slow caffeine metabolism', pts: 5, done: false },
  { id: 'a5', t: 'Handful of walnuts with breakfast', s: 'hs-CRP above optimal', pts: 5, done: false }
];

IO.pillars = [
  { k: 'Sleep', v: 7.8, tint: 'tint-lilac', col: '#8a7bc4', icon: 'moon', sub: '7 h 22 m · bedtime spread 24 min' },
  { k: 'Nutrition', v: 6.4, tint: 'tint-peach', col: '#d98b5f', icon: 'plate', sub: '52 g protein of 70 g · 2 meals logged' },
  { k: 'Activity', v: 8.1, tint: 'tint-mint', col: '#4e9c6b', icon: 'walk', sub: '7,840 steps · goal 7,200' },
  { k: 'Recovery', v: null, tint: 'tint-sky', col: '#5b8fbf', icon: 'heart', sub: 'Calibrating · 4 of 7 days' },
  { k: 'Protocol', v: 9.0, tint: 'tint-lime', col: '#9aa82a', icon: 'pill', sub: 'AM pouch taken · PM due 9 pm' }
];
IO.innerScore = (function () {
  const w = { Sleep: .2, Nutrition: .25, Activity: .2, Recovery: .2, Protocol: .15 };
  let t = 0, ws = 0;
  IO.pillars.forEach(function (p) { if (p.v != null) { t += w[p.k] * p.v; ws += w[p.k]; } });
  return IO.r1(t / ws);
})();

IO.meals = [
  { slot: 'Breakfast', t: 'Ragi dosa, coconut chutney', k: '8:10 am', tier: 'prioritise', img: 'assets/img/bowl.jpg' },
  { slot: 'Lunch', t: 'Jowar roti, palak dal, curd', k: '1:20 pm', tier: 'prioritise', img: 'assets/img/thali.jpg' },
  { slot: 'Snack', t: 'Masala chai with milk', k: '4:45 pm', tier: 'minimise', img: null },
  { slot: 'Dinner', t: 'Not logged yet', k: '', tier: null, img: null }
];

IO.foodDb = [
  { n: 'Wheat roti (phulka)', hi: 'गेहूं की रोटी', tier: 'avoid', r: 'Food test · wheat intolerance high', unit: 'piece', kcal: 85 },
  { n: 'Ragi roti', hi: 'रागी रोटी', tier: 'prioritise', r: 'Wheat swap · fibre for blood sugar', unit: 'piece', kcal: 95 },
  { n: 'Jowar bhakri', hi: 'ज्वार भाकरी', tier: 'prioritise', r: 'Wheat swap', unit: 'piece', kcal: 110 },
  { n: 'Moong dal', hi: 'मूंग दाल', tier: 'prioritise', r: 'Iron and protein · ferritin low', unit: 'katori', kcal: 120 },
  { n: 'Paneer bhurji', hi: 'पनीर भुर्जी', tier: 'minimise', r: 'Cow’s milk · intolerance moderate', unit: 'katori', kcal: 210 },
  { n: 'Peanut chikki', hi: 'मूंगफली चिक्की', tier: 'avoid', r: 'Peanut allergy — never suggested', unit: 'piece', kcal: 140 },
  { n: 'Curd rice', hi: 'दही चावल', tier: 'neutral', r: 'No rule applies', unit: 'katori', kcal: 180 },
  { n: 'Masala chai', hi: 'मसाला चाय', tier: 'minimise', r: 'Milk moderate · caffeine before 1 pm', unit: 'cup', kcal: 90 }
];

IO.coachQA = [
  { q: 'Why is my innerAge 38.4?', a: '<p>Your blood markers suggest a body age of <b>38.4</b>, against a calendar age of 42. It is an estimate from nine routine Vitals markers.</p><ul><li><b>Helping most:</b> albumin (about −2.3 years) and lymphocyte % (about −1.4).</li><li><b>Adding most:</b> RDW-CV (about +1.2), fasting glucose (+0.9) and hs-CRP (+0.6).</li></ul><p>Your Signature plan already includes iron with vitamin C, which may help RDW. We’ll measure again at Vitals Response on 14 Mar 2027.</p>', src: 'From your approved results · released 4 Nov 2026' },
  { q: 'What can I eat instead of wheat roti?', a: '<p>Your food test put wheat on your <b>avoid</b> list for 12 weeks. Good swaps that fit your results:</p><ul><li>Ragi roti or ragi dosa</li><li>Jowar or bajra bhakri</li><li>Rice with moong dal</li></ul><p>On 6 Jan 2027 you can start reintroducing wheat one food at a time. I’ll remind you and track how you feel.</p>', src: 'From your food map · Sense, released 22 Oct 2026' },
  { q: 'How do I raise my vitamin D?', a: '<p>Your vitamin D is <b>22 ng/mL</b> (score 3.6, Attention). This cycle’s target is <b>5.8</b> and it moves in months.</p><ul><li>20 minutes of morning daylight on arms and face</li><li>Mushrooms left in the sun, fortified foods</li><li>Vitamin D3 + K2 is in your Signature plan</li></ul><p>Your genetics also show a moderate tendency toward lower vitamin D, so steady habits matter.</p>', src: 'From your approved results · Vitals and Origin' },
  { q: 'I get chest pain when I walk', red: true, a: '<p><b>Please stop and get help now.</b> Chest pain during activity needs a doctor today.</p><p>Call <b>112</b> for an emergency. For emotional support, Tele-MANAS is on <b>14416</b>.</p><p>I’ve let the innerfree expert team know, and an advisor will contact you.</p>', src: 'Safety reply · advisor notified' }
];

IO.aiApps = [
  { n: 'Claude', since: 'Connected 12 Nov 2026', groups: { food: true, labs: true, notes: true, routine: true, logs: true, genetics: false } }
];
IO.aiLog = [
  ['Today 9:42', 'Claude read your food list'],
  ['Today 9:42', 'Claude checked “paneer tikka” → minimise (milk)'],
  ['Yesterday 21:10', 'Claude logged dinner: jowar roti, rajma · via Claude'],
  ['Yesterday 08:03', 'Claude read your supplement routine']
];

/* ---------- Admin data ---------- */
IO.admin = {
  staff: { name: 'Dr. Meera Nair', role: 'advisor', initials: 'MN' },
  tiles: {
    pending: 7, pendingCrit: 3,
    critical: 4, criticalBy: '2 pathogen · 2 marker beyond critical',
    orders: 38, ordersBy: [['Origin', 9], ['Flora', 7], ['Vitals', 17], ['Sense', 5]],
    parseFail: 1, parseWarn: 3
  },
  byStatus: [['ordered', 12], ['collected', 9], ['processing', 11], ['result_received', 6], ['parsed', 41], ['failed', 1], ['cancelled', 2]],
  queue: [
    { ref: 'IFN-0187', name: 'Rohan Mehta', reason: 'critical', sev: 'critical', worst: 'PATHOGEN', layers: 'VOF', wait: '2 d 4 h', trig: 'new_result · Flora' },
    { ref: 'IFN-0163', name: 'Farah Siddiqui', reason: 'critical', sev: 'critical', worst: 'MARKER_CRITICAL', layers: 'V', wait: '1 d 2 h', trig: 'new_result · Vitals C1' },
    { ref: 'IFN-0201', name: 'Arjun Nair', reason: 'critical', sev: 'critical', worst: 'MARKER_CRITICAL', layers: 'VS', wait: '9 h', trig: 'new_result · Vitals C1' },
    { ref: 'IFN-0174', name: 'Kavya Iyer', reason: 'confirmatory', sev: 'high', worst: 'CONFIRMATORY', layers: 'VO', wait: '1 d 6 h', trig: 'new_result · Vitals C2' },
    { ref: 'IFN-0209', name: 'Sanjay Kulkarni', reason: 'first_release', sev: 'moderate', worst: 'ORAL_GUT', layers: 'F', wait: '20 h', trig: 'new_result · Flora' },
    { ref: 'IFN-0158', name: 'Priya Desai', reason: 'auto_approve_off', sev: 'high', worst: 'MARKER_ATTENTION', layers: 'VOS', wait: '6 h', trig: 'goals' },
    { ref: 'IFN-0215', name: 'Neha Bhatt', reason: 'first_release', sev: 'safety', worst: 'DRUG_ALLERGY', layers: 'S', wait: '3 h', trig: 'new_result · Sense' }
  ],
  activity: [
    ['10:42', 'Dr. Meera Nair approved release R3 for IFN-0142'],
    ['10:15', 'Ops recorded kit dispatch for IFN-0219 · Origin · Blue Dart'],
    ['09:58', 'Raw result received for IFN-0187 · Flora (AIRGenomix push)'],
    ['09:31', 'Editor activated lut_marker_anchors v7 · 212 clients queued for recompute'],
    ['09:02', 'Lab order created for IFN-0221 · Vitals cycle 1'],
    ['08:47', 'Rajesh (ops) advanced IFN-0198 to raw_data_sent']
  ],
  clients: [
    { ref: 'IFN-0142', name: 'Ananya Rao', layers: 'VOSf', plan: 'Vitals Annual — Response', due: '14 Mar 2027', rel: 'approved', last: '2 h ago' },
    { ref: 'IFN-0187', name: 'Rohan Mehta', layers: 'VOF', plan: 'Vitals Annual — Baseline', due: '20 Apr 2027', rel: 'pending_review', last: '1 h ago' },
    { ref: 'IFN-0163', name: 'Farah Siddiqui', layers: 'V', plan: 'Vitals Baseline (one-off)', due: '—', rel: 'pending_review', last: '5 h ago' },
    { ref: 'IFN-0174', name: 'Kavya Iyer', layers: 'VO', plan: 'Vitals Annual — Direction', due: '02 Feb 2027', rel: 'pending_review', last: 'Yesterday' },
    { ref: 'IFN-0158', name: 'Priya Desai', layers: 'VOS', plan: 'Vitals Annual — Response', due: '11 Jan 2027', rel: 'pending_review', last: 'Yesterday' },
    { ref: 'IFN-0201', name: 'Arjun Nair', layers: 'VS', plan: 'Vitals Annual — Baseline', due: '30 Apr 2027', rel: 'pending_review', last: '9 h ago' },
    { ref: 'IFN-0130', name: 'Vikram Singh', layers: 'VOFS', plan: 'Full Body Intelligence', due: '08 Feb 2027', rel: 'approved', last: '3 d ago' },
    { ref: 'IFN-0219', name: 'Ishita Ghosh', layers: 'o', plan: 'Origin', due: '—', rel: 'none', last: 'Today' },
    { ref: 'IFN-0112', name: 'Aditya Rao', layers: 'VF', plan: 'Vitals Annual — paused', due: 'Paused', rel: 'approved', last: '2 w ago' }
  ],
  orders: [
    { ref: 'IFN-0219', product: 'Origin', lab: 'MedGenome → AIRGenomix', cyc: '—', status: 'kit_requested', src: 'shopify', at: '25 Nov 2026', ext: '—' },
    { ref: 'IFN-0224', product: 'Flora', lab: 'AIRGenomix', cyc: '—', status: 'kit_requested', src: 'shopify', at: '25 Nov 2026', ext: '—' },
    { ref: 'IFN-0142', product: 'Flora', lab: 'AIRGenomix', cyc: '—', status: 'sample_received', src: 'shopify', at: '04 Nov 2026', ext: 'AGX-55120' },
    { ref: 'IFN-0198', product: 'Origin', lab: 'MedGenome → AIRGenomix', cyc: '—', status: 'raw_data_sent', src: 'shopify', at: '28 Oct 2026', ext: 'MG-88213' },
    { ref: 'IFN-0221', product: 'Vitals', lab: 'Thyrocare DSA', cyc: '1', status: 'ordered', src: 'shopify', at: '25 Nov 2026', ext: 'TC-4471902' },
    { ref: 'IFN-0158', product: 'Vitals', lab: 'Thyrocare DSA', cyc: '2', status: 'collected', src: 'schedule', at: '20 Nov 2026', ext: 'TC-4469113' },
    { ref: 'IFN-0201', product: 'Sense', lab: 'Thyrocare DSA', cyc: '—', status: 'processing', src: 'shopify', at: '19 Nov 2026', ext: 'TC-4468720' },
    { ref: 'IFN-0187', product: 'Flora', lab: 'AIRGenomix', cyc: '—', status: 'result_received', src: 'shopify', at: '30 Oct 2026', ext: 'AGX-55002' }
  ]
};
