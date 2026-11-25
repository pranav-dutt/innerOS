/* innerOS prototype — router, shell, hub, store hand-off */
(function () {
  const I = IO.icon;
  IO.routes = {};
  IO.prefix = [];
  IO.acts = {};
  IO.state = {
    actions: Object.fromEntries(IO.actions.map(function (a) { return [a.id, a.done]; })),
    water: 5, lang: 'en', consents: { health: null, ai: null }, introIdx: 0, otpSent: false,
    perm: null, permDone: {}, chat: [], typing: false, tier: 'standard', foodTab: 'avoid',
    sheet: null, mealPick: null, mealQty: 1, mealQuery: '', goals: ['Energy', 'Blood sugar', 'Gut comfort'],
    aiGroups: Object.assign({}, IO.aiApps[0].groups), aiConnected: true,
    adminTab: 'clinical', drafts: {}, ticks: {}, modal: null, decided: null, dispatched: {}
  };
  IO.def = function (name, cfg) { IO.routes[name] = cfg; };
  IO.defPrefix = function (prefix, cfg) { IO.prefix.push([prefix, cfg]); };
  IO.go = function (name) { if (location.hash.slice(1) === name) IO.render(); else location.hash = name; };

  function resolve(name) {
    if (IO.routes[name]) return { cfg: IO.routes[name], arg: null };
    for (const [p, cfg] of IO.prefix) if (name.indexOf(p) === 0) return { cfg: cfg, arg: name.slice(p.length) };
    return { cfg: IO.routes.hub, arg: null };
  }

  /* ---------- Theme ---------- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  const savedTheme = store('io-theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  IO.acts.theme = function () {
    const cur = document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next); store('io-theme', next);
  };
  function themeBtn() {
    return '<div class="theme-toggle"><button class="btn sm" data-act="theme" aria-label="Switch light or dark theme">' + I('sun') + 'Theme</button></div>';
  }

  /* ---------- Toast ---------- */
  IO.toast = function (msg, admin) {
    const host = document.querySelector(admin ? 'body' : '.phone-screen') || document.body;
    const t = document.createElement('div');
    t.className = 'toast' + (admin ? ' admin' : ''); t.setAttribute('role', 'status');
    t.innerHTML = '<i></i><span>' + msg + '</span>';
    host.appendChild(t); setTimeout(function () { t.remove(); }, 2600);
  };

  /* ---------- Render ---------- */
  let lastRoute = null;
  IO.render = function () {
    const name = location.hash.slice(1) || 'hub';
    const r = resolve(name);
    const root = document.getElementById('root');
    const sc = root.querySelector('[data-keep-scroll]');
    const keep = (lastRoute === name && sc) ? sc.scrollTop : 0;
    let html;
    if (r.cfg.kind === 'app') html = stage(name, r.cfg, r.cfg.render(r.arg));
    else html = r.cfg.render(r.arg);
    root.innerHTML = html + (r.cfg.kind === 'app' ? '' : themeBtn());
    document.title = (r.cfg.title ? r.cfg.title + ' · ' : '') + 'innerOS prototype';
    const sc2 = root.querySelector('[data-keep-scroll]');
    if (sc2) sc2.scrollTop = keep;
    if (lastRoute !== name) { window.scrollTo(0, 0); }
    lastRoute = name;
    if (r.cfg.after) r.cfg.after(r.arg);
  };

  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const fn = IO.acts[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('submit', function (e) {
    const f = e.target.closest('form[data-submit]');
    if (!f) return;
    e.preventDefault();
    const fn = IO.acts[f.dataset.submit]; if (fn) fn(f, e);
  });
  window.addEventListener('hashchange', IO.render);

  /* ---------- Phone stage ---------- */
  const OB = ['ob-splash', 'ob-intro', 'ob-signin', 'ob-otp', 'ob-welcome', 'ob-profile', 'ob-consent', 'ob-permissions', 'ob-roadmap', 'ob-reveal'];
  const APP = [['home', 'Home'], ['biology', 'Biology'], ['marker-vitd', 'Marker'], ['coach', 'Coach'], ['track', 'Track'], ['log-meal', 'Log meal'], ['plan', 'Plan'], ['shop', 'Shop'], ['me', 'Me'], ['ai-apps', 'AI apps']];
  function stage(name, cfg, screen) {
    const OBL = ['1', '2', '3', '3b', '4', '5', '6', '7', '8', '9'];
    const jumpOb = OB.map(function (r, i) { return '<a href="#' + r + '"' + (r === name ? ' class="on"' : '') + ' title="' + r.replace('ob-', '') + '">' + OBL[i] + '</a>'; }).join('');
    const jumpApp = APP.map(function (a) { return '<a href="#' + a[0] + '"' + (a[0] === name ? ' class="on"' : '') + '>' + a[1] + '</a>'; }).join('');
    const notes = (cfg.notes || []).map(function (n) { return '<li>' + n + '</li>'; }).join('');
    return '<div class="stage">' +
      '<aside class="stage-side">' +
        '<a class="back" href="#hub">← Prototype hub</a>' +
        '<span class="ref">' + (cfg.ref || 'Client app') + '</span>' +
        '<h2>' + (cfg.title || '') + '</h2>' +
        (cfg.lede ? '<p>' + cfg.lede + '</p>' : '') +
        (notes ? '<ul class="stage-notes">' + notes + '</ul>' : '') +
        '<button class="btn sm" data-act="theme">' + I('sun') + 'Light / dark</button>' +
      '</aside>' +
      '<div class="phone"><div class="notch"></div><div class="phone-screen' + (cfg.inkTop ? ' on-ink' : '') + '">' +
        '<div class="statusbar' + (cfg.inkTop ? ' ink' : '') + '"><span>9:41</span><span class="sb-ic">5G <i></i></span></div>' +
        screen +
      '</div></div>' +
      '<aside class="stage-side right">' +
        '<span class="eyebrow">Onboarding · 9 steps</span><div class="jump">' + jumpOb + '</div>' +
        '<span class="eyebrow" style="margin-top:8px">App screens</span><div class="jump">' + jumpApp + '</div>' +
        '<span class="eyebrow" style="margin-top:8px">Other surfaces</span><div class="jump"><a href="#store">innerfree store</a><a href="#admin-login">Admin console</a></div>' +
      '</aside>' +
    '</div>';
  }
  IO.tabbar = function (on) {
    const t = [['home', 'Home', 'home'], ['biology', 'Biology', 'biology'], ['coach', 'Coach', null], ['track', 'Track', 'track'], ['plan', 'Plan', 'plan']];
    return '<nav class="tabbar" aria-label="Main">' + t.map(function (x) {
      if (!x[2]) return '<a href="#coach" class="coach' + (on === 'coach' ? ' on' : '') + '" aria-label="Coach"><span class="orb"><span></span></span>Coach</a>';
      return '<a href="#' + x[0] + '"' + (on === x[0] ? ' class="on" aria-current="page"' : '') + '>' + I(x[2]) + x[1] + '</a>';
    }).join('') + '</nav>';
  };

  /* ---------- Hub ---------- */
  IO.def('hub', {
    kind: 'page', title: 'Hub',
    render: function () {
      return '<main class="hub">' +
        '<section class="hub-hero">' +
          '<img class="bg" src="assets/img/tea-hills-walker.jpg" alt="">' +
          '<div class="brandmark"><span class="circle"></span>innerOS <small>by innerfree</small></div>' +
          '<div><h1>Your health,<br><em>interpreted.</em></h1>' +
          '<p class="lede">A clickable front-end overview of innerOS: the member app built around innerAge and a daily score, and the console the innerfree team uses to review every result before a member sees it.</p></div>' +
          '<div class="hub-facts">' +
            '<div><b>4</b><span>lab layers read together</span></div>' +
            '<div><b>0–10</b><span>one scale, four bands</span></div>' +
            '<div><b>9</b><span>step onboarding to innerAge</span></div>' +
            '<div><b>1</b><span>approved snapshot per member</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="hub-doors">' +
          '<span class="eyebrow">Open the prototype</span>' +
          door('store', 'lead', 'plug', 'From the innerfree store', 'Signed in on innerfree.health? The same account opens innerOS — no new login.') +
          door('ob-splash', '', 'phone', 'Member app — first run', 'Nine-step onboarding: sign-in, consents, permissions, roadmap and the first innerAge reveal.') +
          door('home', '', 'home', 'Member app — daily use', 'Home, Biology, Coach, Track and Plan for a member with Vitals, Origin and Sense released.') +
          door('admin-login', '', 'grid', 'Admin console', 'Dashboard, review queue with approve / reject, clients, orders and kit dispatch.') +
          '<div class="hub-foot"><span>Front-end prototype · mock data · stock photography</span><a href="docs/RESEARCH_AND_UX_PLAN.md" target="_blank" rel="noopener">Research &amp; UX plan</a></div>' +
        '</section>' +
      '</main>';
    }
  });
  function door(href, cls, icon, h, p) {
    return '<a class="door ' + cls + '" href="#' + href + '"><span class="ico">' + I(icon) + '</span><span><h2>' + h + '</h2><p>' + p + '</p></span><span class="arrow">' + I('arrow') + '</span></a>';
  }

  /* ---------- Store (Shopify account page mock) ---------- */
  IO.def('store', {
    kind: 'page', title: 'innerfree store',
    render: function () {
      const c = IO.client;
      const orders = [
        ['#IF-10482', 'Vitals Annual Plan', '12 Oct 2026', 'Paid'],
        ['#IF-10511', 'innerfree Sense — Intolerance + Allergy (veg)', '12 Oct 2026', 'Paid'],
        ['#IF-10598', 'innerfree Origin', '18 Oct 2026', 'Paid'],
        ['#IF-10677', 'innerfree Flora', '1 Nov 2026', 'Paid'],
        ['#IF-10702', 'innerfree Signature — Standard (monthly)', '6 Nov 2026', 'Subscription active']
      ].map(function (o) { return '<div class="order-row"><div><b>' + o[1] + '</b><div class="muted" style="font-size:13px">' + o[0] + ' · ' + o[2] + '</div></div><span class="pill ' + (o[3] === 'Paid' ? 'neutral' : 'good') + '">' + o[3] + '</span></div>'; }).join('');
      return '<div class="store">' +
        '<div class="store-bar">Founding cohort now open · Test earlier. Understand deeper. Act sooner.</div>' +
        '<header class="store-nav"><a class="logo" href="#hub" style="text-decoration:none">innerfree</a><nav><span>Tests</span><span>Formulas</span><span>Essentials</span><span>innerOS</span><span>Journal</span></nav><span class="row" style="font-size:14px;font-weight:600">' + I('user') + ' ' + c.first + '</span></header>' +
        '<div class="store-wrap">' +
          '<span class="eyebrow">My account</span>' +
          '<h1 class="display" style="font-weight:400;font-size:38px;margin-top:6px">Namaste, ' + c.first + '.</h1>' +
          '<div class="store-grid">' +
            '<section class="os-card"><span class="glow"></span>' +
              '<span class="eyebrow" style="color:var(--citron);position:relative">innerOS · your health system</span>' +
              '<h2>Your results are ready in innerOS.</h2>' +
              '<p>You’re signed in on innerfree.health, so innerOS opens with the same account. No new password, no second sign-up.</p>' +
              '<div class="row" style="position:relative;flex-wrap:wrap"><a class="btn primary" href="#handoff">Open innerOS ' + I('arrow') + '</a><span class="muted" style="font-size:13px">On your phone it opens the app</span></div>' +
            '</section>' +
            '<section class="card"><h3>Orders</h3><div style="margin-top:8px">' + orders + '</div>' +
              '<p class="store-note">Orders and payments stay in the store. innerOS reads them to set up your tests and plan.</p></section>' +
          '</div>' +
        '</div></div>';
    }
  });

  /* ---------- Hand-off screen (inside phone) ---------- */
  IO.def('handoff', {
    kind: 'app', title: 'Store sign-in hand-off', ref: 'Client note · BRD §3.1 POST /auth/shopify', inkTop: true,
    lede: 'A member who is signed in on the innerfree Shopify store lands in innerOS already signed in.',
    notes: ['The store session is exchanged for an innerOS session; the client is matched by the Shopify customer ID.', 'No password is created or shown at any point (§3.1).', 'First-time members continue to the coach welcome and consents; returning members land on Home.'],
    render: function () {
      return '<div class="splash" style="gap:18px">' +
        '<div class="open-circle"></div>' +
        '<div class="wm">innerOS</div>' +
        '<div class="stack" style="align-items:center;gap:6px;text-align:center;padding:0 30px">' +
          '<span class="by">Signing you in with your innerfree.health account</span>' +
          '<span style="font-size:15px;font-weight:600">' + IO.client.name + ' · ' + IO.client.phone + '</span>' +
        '</div>' +
        '<span class="typing" aria-label="Loading"><i></i><i></i><i></i></span>' +
      '</div>';
    },
    after: function () { setTimeout(function () { if (location.hash === '#handoff') IO.go('ob-welcome'); }, 2200); }
  });

  document.addEventListener('DOMContentLoaded', IO.render);
})();
