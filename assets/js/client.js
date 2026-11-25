/* innerOS prototype — member app (onboarding + tabs) */
(function () {
  const I = IO.icon, S = IO.state, C = IO.client;

  /* ---------- Shared components (BRD §3.4: the seven shared components) ---------- */
  const pill = function (s, label) {
    const b = IO.band(s);
    return `<span class="pill ${b.key}">${s == null ? '' : `<span class="num">${s.toFixed(1)}</span>`} ${label || b.label}</span>`;
  };
  const tally = function (scores) {
    const n = { attention: 0, improve: 0, maintain: 0, good: 0 };
    scores.forEach(function (s) { n[IO.band(s).key]++; });
    return `<div class="tally">${['attention', 'improve', 'maintain', 'good'].map(function (k) {
      return `<div class="${k}"><b class="num">${n[k]}</b><span>${k[0].toUpperCase() + k.slice(1)}</span></div>`;
    }).join('')}</div>`;
  };
  const pct = function (v) { return Math.max(0, Math.min(100, v * 10)); };
  const sysRow = function (s) {
    return `<a class="sysrow" href="#system-${s.id}">
      <span class="name">${s.name}</span>${pill(s.si)}
      <div class="bars">
        <span>Genes</span><span class="track gpi"><i style="width:${pct(s.gpi)}%"></i></span><span class="val num">${s.gpi.toFixed(1)}</span>
        <span>Now</span><span class="track"><i style="width:${pct(s.cfi)}%;background:var(--st-${IO.band(s.cfi).key})"></i></span><span class="val num">${s.cfi.toFixed(1)}</span>
      </div>
      <span class="gap-label">${IO.gapLabel(s.gap)} · gap ${s.gap > 0 ? '+' : ''}${s.gap.toFixed(1)}</span>
    </a>`;
  };
  const markerBand = function (m) {
    const a = m.a, lo = a.crit_lo === 0 ? 0 : a.crit_lo * 0.8, hi = a.crit_hi * 1.05;
    const x = function (v) { return Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100)); };
    return `<div class="mband" aria-label="${m.name} ${m.v} ${m.unit}; optimal ${a.opt_lo}–${a.opt_hi}">
      <span class="rail"></span>
      <span class="ref" style="left:${x(a.ref_lo)}%;width:${x(a.ref_hi) - x(a.ref_lo)}%"></span>
      <span class="opt" style="left:${x(a.opt_lo)}%;width:${Math.max(1.5, x(a.opt_hi) - x(a.opt_lo))}%"></span>
      <span class="val" style="left:${x(m.v)}%"></span>
    </div>
    <div class="mband-legend"><span>Reference ${a.ref_lo}–${a.ref_hi}</span><span>Optimal ${a.opt_lo === 0 ? '<' + a.opt_hi : a.opt_lo + '–' + a.opt_hi}</span></div>`;
  };
  const ribbon = function (stages, at) {
    return `<div class="ribbon">${stages.map(function (s, i) {
      return `<div class="${i < at ? 'done' : i === at ? 'cur' : ''}">${s}</div>`;
    }).join('')}</div>`;
  };
  const lockedCard = function (title, body, cta, href) {
    return `<div class="locked-card"><span class="lk">${I('lock')} Not measured yet</span><h3>${title}</h3><p class="muted" style="font-size:14px">${body}</p>${cta ? `<a class="btn sm" href="#${href}" style="align-self:flex-start">${cta}</a>` : ''}</div>`;
  };
  const back = function (href, label) { return `<a class="back-btn" href="#${href}">${I('back')} ${label}</a>`; };
  IO.ui = { pill: pill, tally: tally, sysRow: sysRow, markerBand: markerBand, ribbon: ribbon };

  function ring(size) {
    const r = 54, C2 = 2 * Math.PI * r, gap = 7, w = { Sleep: .2, Nutrition: .25, Activity: .2, Recovery: .2, Protocol: .15 };
    const usable = C2 - gap * 5;
    let off = 0, out = '';
    IO.pillars.forEach(function (p) {
      const len = usable * w[p.k];
      out += `<circle cx="64" cy="64" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="12" stroke-dasharray="${len} ${C2 - len}" stroke-dashoffset="${-off}" stroke-linecap="round"/>`;
      if (p.v != null) out += `<circle cx="64" cy="64" r="${r}" fill="none" stroke="${p.col}" stroke-width="12" stroke-dasharray="${len * p.v / 10} ${C2 - len * p.v / 10}" stroke-dashoffset="${-off}" stroke-linecap="round"/>`;
      off += len + gap;
    });
    return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 128 128" role="img" aria-label="innerScore ${IO.innerScore} out of 10">${out}</svg><div class="c"><div><b class="num">${IO.innerScore.toFixed(1)}</b><span>innerScore</span></div></div></div>`;
  }

  /* =====================================================================
     ONBOARDING (BRD §20.6)
     ===================================================================== */
  const obTop = function (step, prev) {
    return `<div class="ob-top">${prev ? back(prev, 'Back') : '<span></span>'}<span class="step">Step ${step} of 9</span></div>
      <div class="progress">${Array.from({ length: 9 }, function (_, i) { return `<i class="${i < step ? 'on' : ''}"></i>`; }).join('')}</div>`;
  };

  IO.def('ob-splash', {
    kind: 'app', title: '1 · Splash', ref: 'BRD §20.6 step 1', inkTop: true,
    lede: 'The Open Circle on Ink. It becomes the coach’s animated face later.',
    notes: ['Shown while the app checks for a session.', 'Tap to continue.'],
    render: function () {
      return `<a class="splash" href="#ob-intro" style="position:relative"><div class="open-circle"></div><div class="wm">innerOS</div><div class="by">your health operating system, by innerfree</div><span class="tap">Tap to begin</span></a>`;
    }
  });

  const slides = [
    ['kitchen-paratha', 'Food that fits <em>your</em> biology.', 'Your blood, genes, gut and food test decide what goes on your plate — not a generic diet chart.'],
    ['family-home', 'One picture of your <em>whole</em> health.', 'Four lab layers read together, reviewed by the innerfree expert team before you see them.'],
    ['meditation', 'Small daily actions, <em>measured</em>.', 'A daily score from sleep, food, activity, recovery and your plan — proven at every recheck.']
  ];
  IO.def('ob-intro', {
    kind: 'app', title: '2 · Introduction', ref: 'BRD §20.6 step 2', inkTop: true,
    lede: 'Three slides, one photograph each (commissioned editorial photography of Indian people, kitchens and landscapes — D40).',
    notes: ['Stock photography stands in until the D40 shoot.', 'Skip is always available.'],
    render: function () {
      const s = slides[S.introIdx];
      return `<div class="intro"><div class="intro-img"><img src="assets/img/${s[0]}.jpg" alt=""></div>
        <div class="intro-copy"><div class="dots">${slides.map(function (_, i) { return `<i class="${i === S.introIdx ? 'on' : ''}"></i>`; }).join('')}</div>
        <h1>${s[1]}</h1><p>${s[2]}</p></div>
        <div class="ob-foot"><button class="btn primary block" data-act="introNext">${S.introIdx < 2 ? 'Next' : 'Get started'}</button>
        <a class="btn ghost block" href="#ob-signin" style="color:var(--hero-muted)">Skip</a></div></div>`;
    }
  });
  IO.acts.introNext = function () { if (S.introIdx < 2) { S.introIdx++; IO.render(); } else { S.introIdx = 0; IO.go('ob-signin'); } };

  IO.def('ob-signin', {
    kind: 'app', title: '3 · Sign in', ref: 'BRD §20.4 · client note',
    lede: 'Mobile number + OTP is the primary sign-in. Google and Apple are alternatives. Members signed in on the innerfree store continue with that account.',
    notes: ['No passwords anywhere — none created, stored, emailed or shown.', 'The verified phone is matched to the client created from the Shopify order; no match creates an app-only client linked later.', 'OTP requests are rate-limited (§20.9).'],
    render: function () {
      return `<div class="ob">${obTop(3, 'ob-intro')}<div class="ob-body">
        <h1>Sign in to innerOS</h1>
        <p class="lead">Use the mobile number you gave when you ordered.</p>
        <form class="stack" data-submit="sendOtp">
          <div class="field"><label for="mob">Mobile number</label>
            <div class="row"><span class="input" style="width:76px;display:grid;place-items:center;flex:none">+91</span><input id="mob" class="input" inputmode="numeric" value="98450 12312" autocomplete="tel"></div></div>
          <button class="btn primary block" type="submit">Send code</button>
        </form>
        <div class="divider">or continue with</div>
        <a class="store-sso" href="#handoff"><span class="lg">i</span><span><b>innerfree.health account</b><span>You’re signed in on the store as Ananya</span></span>${I('chev')}</a>
        <div class="sso"><button class="btn block" data-act="sso">${I('google')} Google</button><button class="btn block" data-act="sso">${I('apple')} Apple</button></div>
        <p class="muted" style="font-size:12px;text-align:center">innerOS never asks you to create a password.</p>
      </div></div>`;
    }
  });
  IO.acts.sendOtp = function () { IO.go('ob-otp'); };
  IO.acts.sso = function () { IO.go('ob-welcome'); };

  IO.def('ob-otp', {
    kind: 'app', title: '3 · Verify code', ref: 'BRD §3.2 /auth/otp/verify',
    lede: 'Six-digit code by SMS. SMS needs a DLT-registered sender ID and templates (D3).',
    notes: ['Session: innerOS JWT (1 hour) + 30-day HTTP-only refresh cookie.'],
    render: function () {
      const code = '482916';
      return `<div class="ob">${obTop(3, 'ob-signin')}<div class="ob-body">
        <h1>Enter the code</h1><p class="lead">Sent to +91 98450 •• 312. <button class="link" data-act="none">Change</button></p>
        <div class="otp">${code.split('').map(function (d, i) { return `<input aria-label="Digit ${i + 1}" inputmode="numeric" maxlength="1" value="${d}">`; }).join('')}</div>
        <p class="muted" style="font-size:13px">Resend code in 0:24</p>
      </div><div class="ob-foot"><a class="btn primary block" href="#ob-welcome">Verify</a></div></div>`;
    }
  });
  IO.acts.none = function () {};

  IO.def('ob-welcome', {
    kind: 'app', title: '4 · Coach welcome', ref: 'BRD §20.6 step 4',
    lede: 'The coach greets the member by name and asks for their language: English, हिंदी or Hinglish.',
    notes: ['Coach languages beyond English are decision D17; the choice is captured now.'],
    render: function () {
      const L = [['en', 'English'], ['hi', '<span class="hi">हिंदी</span>'], ['hing', 'Hinglish']];
      return `<div class="ob">${obTop(4, 'ob-signin')}<div class="ob-body">
        <div class="coach-orb" style="width:72px;height:72px"><span style="width:32px;height:32px;border-width:4px"></span></div>
        <h1>Namaste, ${C.first}.<br>I’m your innerOS coach.</h1>
        <p class="lead">I explain your results in plain words, answer from your own approved data, and hand you to an innerfree advisor when a person should answer.</p>
        <div class="field"><label>Which language should I use?</label><div class="chips">${L.map(function (l) { return `<button class="chip" data-act="lang" data-v="${l[0]}" aria-pressed="${S.lang === l[0]}">${l[1]}</button>`; }).join('')}</div></div>
        ${S.lang === 'hi' ? '<div class="card flat hi" style="font-size:16px">नमस्ते अनन्या, मैं आपका innerOS कोच हूँ।</div>' : S.lang === 'hing' ? '<div class="card flat" style="font-size:15px">Namaste Ananya, main aapka innerOS coach hoon. Chalo shuru karte hain!</div>' : ''}
      </div><div class="ob-foot"><a class="btn primary block" href="#ob-profile">Continue</a></div></div>`;
    }
  });
  IO.acts.lang = function (el) { S.lang = el.dataset.v; IO.render(); };

  const GOALS = ['Energy', 'Blood sugar', 'Gut comfort', 'Heart health', 'Weight', 'Sleep', 'Hormonal balance', 'Skin & hair', 'Stress', 'Healthy ageing'];
  IO.def('ob-profile', {
    kind: 'app', title: '5 · Profile basics', ref: 'BRD §20.6 step 5 · §3.8',
    lede: 'Date of birth, sex, height, weight, diet type and goals. Prefilled from the innerfree Assessment where it captured them.',
    notes: ['Date of birth sets the age used for innerAge.', 'Goals come from a fixed library (~25) — no free text. They shape the plan and never change a score.'],
    render: function () {
      return `<div class="ob">${obTop(5, 'ob-welcome')}<div class="ob-body">
        <h1>A few basics</h1><p class="lead">We filled in what you told us at checkout. Check and edit anything.</p>
        <div class="bento">
          <div class="field span2"><label for="dob">Date of birth</label><input id="dob" class="input" value="12 Mar 1984"></div>
          <div class="field"><label for="ht">Height</label><input id="ht" class="input" value="162 cm"></div>
          <div class="field"><label for="wt">Weight</label><input id="wt" class="input" value="64 kg"></div>
        </div>
        <div class="field"><label>Sex</label><div class="chips"><button class="chip" aria-pressed="true">Female</button><button class="chip" aria-pressed="false">Male</button></div></div>
        <div class="field"><label>Diet type</label><div class="chips">${['Vegetarian', 'Eggetarian', 'Non-vegetarian', 'Vegan', 'Jain'].map(function (d) { return `<button class="chip" aria-pressed="${d === 'Vegetarian'}">${d}</button>`; }).join('')}</div></div>
        <div class="field"><label>Your goals <span class="faint">(pick up to 3)</span></label><div class="chips">${GOALS.map(function (g) { return `<button class="chip" data-act="goal" data-v="${g}" aria-pressed="${S.goals.indexOf(g) > -1}">${g}</button>`; }).join('')}</div></div>
      </div><div class="ob-foot"><a class="btn primary block" href="#ob-consent">Continue</a></div></div>`;
    }
  });
  IO.acts.goal = function (el) {
    const g = el.dataset.v, i = S.goals.indexOf(g);
    if (i > -1) S.goals.splice(i, 1); else if (S.goals.length < 3) S.goals.push(g); else IO.toast('Pick up to 3 goals. Remove one first.');
    IO.render();
  };

  const consentCard = function (key, icon, title, body, rows) {
    const v = S.consents[key];
    return `<section class="consent"><div class="consent-h"><span class="ic">${I(icon)}</span><div><h3 style="font-size:15px">${title}</h3><p class="muted" style="font-size:13px;margin-top:2px">${body}</p></div></div>
      <dl>${rows.map(function (r) { return `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`; }).join('')}</dl>
      <div class="consent-act"><button class="btn sm" data-act="consent" data-k="${key}" data-v="no" aria-pressed="${v === false}">Decline</button><button class="btn sm" data-act="consent" data-k="${key}" data-v="yes" aria-pressed="${v === true}">I agree</button></div></section>`;
  };
  IO.def('ob-consent', {
    kind: 'app', title: '6 · Two consents', ref: 'BRD §20.6 step 6 · §10 DPDP · D18',
    lede: 'Two separate consents, each with Decline: health-data processing, and AI-coach processing naming the provider, what is sent, retention and training terms.',
    notes: ['Recorded with consent_version and consent_at.', 'Declining the AI consent keeps the app working; the coach stays off.', 'Provider and retention text are placeholders until D16 / D18 are signed.'],
    render: function () {
      const ready = S.consents.health === true && S.consents.ai !== null;
      return `<div class="ob">${obTop(6, 'ob-profile')}<div class="ob-body">
        <h1>Your data, your choice</h1><p class="lead">Two separate choices. You can change either later in Me → Data & privacy.</p>
        ${consentCard('health', 'shield', 'Health-data processing', 'Needed to interpret your lab results and build your plan.', [['What', 'Lab results, profile, daily logs'], ['Who sees it', 'innerOS and the innerfree expert team'], ['Kept', 'For as long as you’re a member'], ['Sold', 'Never']])}
        ${consentCard('ai', 'sparkle', 'AI coach processing', 'Lets the coach answer questions from your approved results.', [['Provider', 'Approved model provider (D16)'], ['What is sent', 'Only the part of your snapshot a question needs'], ['Retention', '30 days, then deleted (D18)'], ['Training', 'Not used to train models']])}
        ${S.consents.health === false ? '<div class="banner"><b>Needed</b> innerOS can’t show results without health-data processing. You can still browse the app.</div>' : ''}
      </div><div class="ob-foot"><a class="btn primary block" href="#ob-permissions" ${ready ? '' : 'aria-disabled="true" style="opacity:.45;pointer-events:none"'}>Continue</a></div></div>`;
    }
  });
  IO.acts.consent = function (el) { S.consents[el.dataset.k] = el.dataset.v === 'yes'; IO.render(); };

  IO.def('ob-permissions', {
    kind: 'app', title: '7 · Permission priming', ref: 'BRD §20.6 step 7 · §19.7',
    lede: 'A reason screen before each system prompt, so the system dialog only appears once the member has said yes.',
    notes: ['Research: a stated reason raises grant rates (NN/g); Health Connect asks for a fallback screen after two declines.', 'Each source can later be disconnected with “also delete this source’s data”.'],
    render: function () {
      const row = function (k, icon, t, s) {
        const st = S.permDone[k];
        return `<div class="card" style="display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px">
          <span class="ic tint-lime" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center">${I(icon)}</span>
          <div class="stack" style="gap:8px"><div><b>${t}</b><p class="muted" style="font-size:13px">${s}</p></div>
          ${st ? `<span class="pill ${st === 'yes' ? 'good' : 'neutral'}">${st === 'yes' ? 'Allowed' : 'Not now'}</span>` : `<div class="row"><button class="btn sm primary" data-act="perm" data-k="${k}">Allow</button><button class="btn sm ghost" data-act="permSkip" data-k="${k}">Not now</button></div>`}</div></div>`;
      };
      return `<div class="ob" style="position:relative">${obTop(7, 'ob-consent')}<div class="ob-body">
        <h1>Two things that make innerOS work better</h1>
        <p class="lead">We’ll only ask your phone after you say yes here.</p>
        ${row('notif', 'bell', 'Reminders', 'Your supplement pouch at 8 am and 9 pm, and a nudge when results are ready. Never ads.')}
        ${row('health', 'heart', 'Health Connect', 'Steps, sleep and heart rate feed your daily innerScore. We read; we never write.')}
      </div><div class="ob-foot"><a class="btn primary block" href="#ob-roadmap">Continue</a></div>
      ${S.perm ? `<div class="os-dialog"><div><p><b>${S.perm === 'notif' ? 'Allow innerOS to send you notifications?' : 'Allow innerOS to read steps, sleep and heart rate from Health Connect?'}</b>${S.perm === 'notif' ? 'Notifications may include alerts and sounds.' : 'You can change this in Health Connect settings.'}</p><div class="opts"><button data-act="osNo">Don’t allow</button><button data-act="osYes">Allow</button></div></div></div>` : ''}</div>`;
    }
  });
  IO.acts.perm = function (el) { S.perm = el.dataset.k; IO.render(); };
  IO.acts.permSkip = function (el) { S.permDone[el.dataset.k] = 'no'; IO.render(); };
  IO.acts.osYes = function () { S.permDone[S.perm] = 'yes'; S.perm = null; IO.render(); };
  IO.acts.osNo = function () { S.permDone[S.perm] = 'no'; S.perm = null; IO.render(); };

  const roadmapHtml = function (compact) {
    const steps = [
      ['done', 'Vitals · blood', 'Baseline taken 14 Oct 2026'],
      ['done', 'Food test · Sense', 'Results in your food map'],
      ['done', 'Genetics · Origin', 'Read alongside your blood'],
      ['now', 'Gut · Flora', 'Sample received · results in about 3 weeks'],
      ['', 'Wearables', 'Connect a watch or ring to sharpen Recovery']
    ];
    return `<div class="roadmap">${steps.map(function (s, i) {
      return `<div class="rm-step ${s[0]}"><span class="rm-dot">${s[0] === 'done' ? I('check') : i + 1}</span><div><div class="t">${s[1]}</div><div class="s">${s[2]}</div></div>${s[0] === '' && !compact ? '<a class="btn sm" href="#me">Connect</a>' : '<span></span>'}</div>`;
    }).join('')}</div>`;
  };
  IO.def('ob-roadmap', {
    kind: 'app', title: '8 · innerfree Roadmap', ref: 'BRD §20.6 step 8 · §20.7 · D37',
    lede: 'Vitals → Food test → Genetics → Gut → Wearables. Purchased steps ticked; the next step shown with a personal reason, never as an ad.',
    notes: ['One ordered list drives both this screen and the locked cards (D37).'],
    render: function () {
      return `<div class="ob">${obTop(8, 'ob-permissions')}<div class="ob-body">
        <h1>Your innerfree roadmap</h1><p class="lead">Each layer makes the others clearer. Here’s where you are.</p>
        <div class="card">${roadmapHtml(false)}</div>
      </div><div class="ob-foot"><a class="btn primary block" href="#ob-reveal">See my innerAge</a></div></div>`;
    }
  });

  IO.def('ob-reveal', {
    kind: 'app', title: '9 · First innerAge reveal', ref: 'BRD §20.1–20.3', inkTop: true,
    lede: 'For members with an approved Vitals release. Plain words first, calendar age beside it, never shown without its drivers and recheck date.',
    notes: ['innerAge = Phenotypic Age (Levine 2018) from nine routine Vitals markers; always labelled an estimate.', 'An older result uses neutral ink, never alarm red. “Reverse your age” is a banned phrase.', 'Members without Vitals land on Home with “Discover your innerAge”.'],
    render: function () {
      return `<div class="reveal"><div class="scroll">
        <span class="eyebrow" style="color:var(--citron)">Your first innerAge</span>
        <p style="font-size:18px">Your blood markers suggest a body age of</p>
        <div class="reveal-num num">${C.innerAge}</div>
        <p class="muted">Calendar age <b style="color:var(--hero-fg)">${C.age}</b> · from your Vitals Baseline, ${C.collected}</p>
        <div class="drivers">${C.drivers.slice(0, 3).map(function (d) { return `<div class="driver"><span>${d.name}</span><span class="num">about +${d.delta.toFixed(1)} yrs</span><span class="bar"><i style="width:${d.delta * 60}%"></i></span></div>`; }).join('')}
        <p class="muted" style="font-size:12px">These three add the most. Your daily actions start with them.</p></div>
        <div class="note">An estimate, not a diagnosis. It isn’t calibrated for Indian populations yet. We’ll measure again at Vitals Response on 14 Mar 2027.</div>
      </div><div class="ob-foot"><a class="btn primary block" href="#home">Go to Home</a></div></div>`;
    }
  });

  /* =====================================================================
     HOME (BRD §20.5)
     ===================================================================== */
  IO.def('home', {
    kind: 'app', title: 'Home', ref: 'BRD §20.5', inkTop: true,
    lede: 'innerAge hero → Ask your coach → Roadmap → today’s innerScore → daily actions with points and streak → doses due → next recheck.',
    notes: ['Daily actions are doable today, never a purchase. A missed day shows an empty circle, never a red cross.', 'innerScore shown ÷10 on the four bands (D25 option A) — option B is a one-line change.', 'Paid kits are never advertised on Home.'],
    render: function () {
      const done = IO.actions.filter(function (a) { return S.actions[a.id]; });
      const pts = done.reduce(function (t, a) { return t + a.pts; }, 0);
      const streak = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(function (d, i) { return `<span class="${i < 6 && i !== 2 ? 'done' : ''}">${d}</span>`; }).join('');
      return `<div class="scr"><div class="scroll" data-keep-scroll>
        <div class="ink-hero">
          <div class="row between" style="margin-bottom:14px"><div class="row"><img class="avatar" src="assets/img/ananya-avatar.jpg" alt=""><div><div style="font-size:13px;color:var(--hero-muted)">Good morning</div><b>${C.first}</b></div></div>
          <div class="row"><a class="icon-btn" href="#me" style="background:transparent;border-color:var(--hero-line);color:var(--hero-fg)" aria-label="Notifications">${I('bell')}<span class="dot"></span></a></div></div>
          <a href="#innerage" style="text-decoration:none;color:inherit;display:block">
          <span class="eyebrow" style="color:var(--citron)">innerAge</span>
          <div class="age-hero"><div class="age-num num">${C.innerAge}<small>yrs</small></div><div class="age-cal">Calendar age<b class="num">${C.age}</b></div></div>
          <p style="font-size:14px;margin-top:6px;color:#d6d8cf">Your blood markers suggest a body age about 3.6 years younger. Biggest lever: <b style="color:var(--citron)">RDW-CV</b>.</p></a>
          <a class="ask-bar" href="#coach"><span class="orb-s"></span><span>Ask why your innerAge is ${C.innerAge}…</span><b>Ask</b></a>
        </div>

        <div class="sec"><div class="sec-h"><h2>Today</h2><span class="muted" style="font-size:13px">Wed 25 Nov</span></div>
          <div class="bento">
            <a class="card span2 card-link" href="#track"><div class="score-card">${ring(124)}<div class="pillars">${IO.pillars.map(function (p) { return `<div class="pillar"><i style="background:${p.col}"></i><span>${p.k}</span><span class="v ${p.v == null ? 'calib' : ''}">${p.v == null ? 'Calibrating' : p.v.toFixed(1)}</span></div>`; }).join('')}</div></div></a>
            <div class="metric tint-lime"><span class="lbl">Doses ${I('pill')}</span><span class="val">1<small>of 2</small></span><span class="sub">PM pouch due 9 pm</span><div class="mini"><i style="width:50%"></i></div></div>
            <div class="metric tint-sky"><span class="lbl">Water ${I('drop')}</span><span class="val num">${(S.water * 0.25).toFixed(2).replace(/0$/, '')}<small>L of 2.5</small></span><span class="sub">${S.water} glasses</span><div class="mini"><i style="width:${S.water / 10 * 100}%"></i></div></div>
          </div></div>

        <div class="sec"><div class="sec-h"><h2>Daily actions</h2><span class="pts">${pts} pts today</span></div>
          <div class="card"><div class="row between" style="margin-bottom:6px"><span class="muted" style="font-size:13px">5-day streak</span><div class="streak">${streak}</div></div>
          ${IO.actions.map(function (a) { return `<div class="action"><button class="check" data-act="toggleAction" data-id="${a.id}" aria-pressed="${!!S.actions[a.id]}" aria-label="Mark done: ${a.t}">${I('check')}</button><div><div class="t">${a.t}</div><div class="s">${a.s}</div></div><span class="pts">+${a.pts}</span></div>`; }).join('')}</div></div>

        <div class="sec"><div class="sec-h"><h2>Your roadmap</h2><a class="link" href="#biology">Results</a></div>
          <div class="card"><div class="row between"><b>Flora · gut</b><span class="pill citron">In progress</span></div>
          ${ribbon(C.floraStages, C.floraAt)}<p class="muted" style="font-size:12px;margin-top:10px">Your sample reached our partner lab on 18 Nov. Results usually take about 3 weeks.</p></div></div>

        <div class="sec"><a class="photo-hero" href="#plan"><img src="assets/img/thali.jpg" alt=""><span class="eyebrow" style="color:#e9ebe2">Food map</span><div class="stack" style="gap:10px"><h3>Ragi, jowar and dal are your best friends this month.</h3><span class="pillbtn">See my food map <i>${I('arrow')}</i></span></div></a></div>

        <div class="sec" style="margin-bottom:24px"><div class="card citron-card"><div class="row between"><div><span class="eyebrow" style="color:#4b5310">Next recheck</span><h3 class="display" style="font-weight:400;font-size:22px;margin-top:4px">Vitals Response</h3><p class="muted" style="font-size:13px">14 Mar 2027 · 75 markers + your add-ons · innerAge measured again</p></div><a class="arrow-c" href="#plan" aria-label="Open plan">${I('arrow')}</a></div></div></div>
      </div>${IO.tabbar('home')}</div>`;
    }
  });
  IO.acts.toggleAction = function (el) {
    const id = el.dataset.id; S.actions[id] = !S.actions[id]; IO.render();
    if (S.actions[id]) IO.toast('Nice. +' + IO.actions.find(function (a) { return a.id === id; }).pts + ' points');
  };

  /* =====================================================================
     innerAge detail
     ===================================================================== */
  IO.def('innerage', {
    kind: 'app', title: 'innerAge detail', ref: 'BRD §20.3', inkTop: true,
    lede: 'Drivers: innerAge recomputed with one marker at a time at its R&D reference value, reported as “about +1.2 years from RDW”.',
    notes: ['The top three drivers link to daily actions and to Signature ingredients already addressing them.', 'The mortality score is never shown or returned by the API.'],
    render: function () {
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="ink-hero">
        ${back('home', 'Home').replace('class="back-btn"', 'class="back-btn" style="color:var(--hero-fg)"')}
        <div class="age-hero" style="margin-top:6px"><div class="age-num num">${C.innerAge}<small>yrs</small></div><div class="age-cal">Calendar age<b class="num">${C.age}</b></div></div>
        <p class="muted" style="font-size:13px;margin-top:8px">Estimate from Vitals Baseline · ${C.collected}</p></div>
        <div class="sec"><div class="sec-h"><h2>What moves it</h2></div><div class="card">
          ${C.drivers.map(function (d) { return `<a class="list-row" href="#marker-${d.link}"><span class="ic ${d.delta > 0 ? 'tint-peach' : 'tint-mint'}">${I(d.delta > 0 ? 'plus' : 'check')}</span><div><div class="t">${d.name}</div><div class="s">${d.note}</div></div><span class="num" style="font-weight:700">${d.delta > 0 ? '+' : '−'}${Math.abs(d.delta).toFixed(1)} yrs</span></a>`; }).join('')}
        </div></div>
        <div class="sec"><div class="sec-h"><h2>Over time</h2></div><div class="card"><div class="ribbon">${C.vitalsPlan.map(function (c, i) { return `<div class="${i === 0 ? 'cur' : ''}">${c.n}<br>${i === 0 ? '<b>' + C.innerAge + '</b>' : c.d}</div>`; }).join('')}</div><p class="muted" style="font-size:12px;margin-top:10px">The line fills in at each recheck. A change smaller than the threshold reads “about the same”.</p></div></div>
        <div class="sec" style="margin-bottom:24px"><div class="card flat" style="font-size:13px">innerAge is a wellness estimate, not a diagnosis. It uses nine routine blood markers and your age on the collection date.</div></div>
      </div>${IO.tabbar('home')}</div>`;
    }
  });

  /* =====================================================================
     BIOLOGY (BRD §3.3–3.5)
     ===================================================================== */
  IO.def('biology', {
    kind: 'app', title: 'Biology', ref: 'BRD §3.3 · §3.4 · §8.5',
    lede: 'Overall index, the layer strip, highlights and 17 body systems sorted weakest first. No segment names here.',
    notes: ['System Index = GPI × 0.35 + CFI × 0.65; Gap = CFI − GPI with four labels.', 'Layer tiles: present (opens the dataset), in progress (tracking ribbon) or not measured (locked card). Never an empty chart.', 'Gut systems use blood only until Flora is released (CFI = blood × 0.7 + gut × 0.3 when both exist).'],
    render: function () {
      const L = C.layers;
      const tile = function (k) {
        const l = L[k];
        return `<a class="layer ${l.state}" href="${l.state === 'present' ? (k === 'sense' ? '#plan' : k === 'origin' ? '#genetics' : '#biology') : '#biology'}"><span class="ic">${I(l.icon)}</span><span class="n">${l.name}</span><span class="d">${l.what}<br>${l.date}</span></a>`;
      };
      const pri = IO.systems.slice(0, 5);
      return `<div class="scr"><div class="scroll" data-keep-scroll>
        <div class="topbar"><h1>Biology</h1><a class="icon-btn" href="#coach" aria-label="Ask coach">${I('search')}</a></div>
        <div class="pad"><div class="card ink-card"><div class="hero-score"><div><span class="eyebrow" style="color:var(--citron)">Overall index</span><div class="big num">${IO.overall.toFixed(1)}<small> /10</small></div></div>${pill(IO.overall)}</div>
          <p class="muted" style="font-size:13px;margin:10px 0 12px">Interpreted by innerOS from Vitals, Origin and Sense · approved 4 Nov 2026</p>${tally(IO.systems.map(function (s) { return s.si; }))}</div></div>
        <div class="sec"><div class="layers">${['vitals', 'origin', 'sense', 'flora'].map(tile).join('')}</div></div>
        <div class="sec"><div class="bento">
          <a class="card card-link tint-lilac" href="#innerage"><span class="eyebrow">innerAge</span><div class="display num" style="font-size:34px;font-weight:300;margin-top:6px">${C.innerAge}</div><span class="muted" style="font-size:12px">vs calendar ${C.age}</span></a>
          <a class="card card-link tint-peach" href="#marker-${IO.markers[0].id}"><span class="eyebrow">Needs attention</span><div style="font-weight:700;margin-top:8px">${IO.markers[0].name}</div><span class="muted" style="font-size:12px">${IO.markers[0].v} ${IO.markers[0].unit} · ${IO.markers[0].score.toFixed(1)}</span></a>
        </div></div>
        <div class="sec"><div class="sec-h"><h2>Top priorities</h2><span class="muted" style="font-size:12px">Highest leverage: ${pri[2].name}</span></div><div class="card">${pri.map(sysRow).join('')}</div></div>
        <div class="sec"><div class="sec-h"><h2>All 17 systems</h2><span class="muted" style="font-size:12px">weakest first</span></div><div class="card">${IO.systems.slice(5).map(sysRow).join('')}</div></div>
        <div class="sec"><div class="sec-h"><h2>Blood markers</h2><a class="link" href="#marker-vitd">Open</a></div><div class="card">${IO.markers.slice(0, 6).map(function (m) { return `<a class="list-row" href="#marker-${m.id}"><span class="ic">${I('blood')}</span><div><div class="t">${m.name}</div><div class="s num">${m.v} ${m.unit} · target ${m.tgt.toFixed(1)} · ${IO.RESP_LABEL[m.cls]}</div></div>${pill(m.score)}</a>`; }).join('')}</div></div>
        <div class="sec" style="margin-bottom:24px"><div class="sec-h"><h2>Gut</h2></div><div class="card"><div class="row between"><b>innerfree Flora</b><span class="pill citron">In progress</span></div>${ribbon(C.floraStages, C.floraAt)}<p class="muted" style="font-size:12px;margin-top:10px">When it arrives, gut findings join 6 of your systems and your food map.</p></div></div>
      </div>${IO.tabbar('biology')}</div>`;
    }
  });

  IO.def('genetics', {
    kind: 'app', title: 'Genetics (Origin)', ref: 'BRD §3.4 · §8.4 · D22',
    lede: 'Traits grouped by system with AIRGenomix tendency wording (Low / Moderate / High tendency). No variant or SNP list, no raw score with a Good/Attention badge.',
    notes: ['Clinically gated traits show “Book a consultation”, never the result.', 'School Genomics is a separate report.'],
    render: function () {
      const lvl = { High: 'tint-peach', Moderate: 'tint-lime', Low: 'tint-mint' };
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="pad">${back('biology', 'Biology')}</div>
        <div class="greet"><h1>Your genetics</h1><p>innerfree Origin · read alongside your blood · 2 Nov 2026</p></div>
        <div class="pad stack">${IO.traits.map(function (t) { return `<div class="card"><div class="row between"><b>${t.name}</b><span class="pill neutral ${lvl[t.level]}" style="color:var(--fg)">${t.level} tendency</span></div><p style="font-size:14px;margin-top:6px">${t.text}</p><p class="muted" style="font-size:12px;margin-top:6px">${t.genes}${t.food ? ' · shapes your food map' : ''}</p></div>`; }).join('')}
        <div class="locked-card"><span class="lk">${I('lock')} Consultation</span><h3>${IO.gated[0]}</h3><p class="muted" style="font-size:14px">Some results are best explained in person. Book a free call with an innerfree advisor.</p><button class="btn sm" data-act="book" style="align-self:flex-start">Book a consultation</button></div>
        <div style="height:24px"></div></div>
      </div>${IO.tabbar('biology')}</div>`;
    }
  });
  IO.acts.book = function () { IO.toast('Request sent. An advisor will call you within 2 working days.'); };

  IO.defPrefix('system-', {
    kind: 'app', title: 'System detail', ref: 'BRD §3.5',
    lede: 'Name, score pill, GPI vs CFI bars, Gap text, what it means, traits, markers, gut findings and a locked section per absent layer.',
    notes: ['Explanation text is template or advisor-approved AI draft — AI text never reaches a member without a human approving it (§15.1).'],
    render: function (id) {
      const s = IO.systems.find(function (x) { return x.id === id; }) || IO.systems[0];
      const ms = IO.markers.filter(function (m) { return m.sys.indexOf(s.id) > -1; });
      const ts = IO.traits.filter(function (t) { return t.sys === s.id; });
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="pad">${back('biology', 'Biology')}</div>
        <div class="greet"><h1>${s.name}</h1><p>System Index ${s.si.toFixed(1)} · ${IO.band(s.si).label}</p></div>
        <div class="pad stack">
          <div class="card"><div class="bars" style="font-size:12px;grid-template-columns:96px minmax(0,1fr) 30px">
            <span>Genetic potential</span><span class="track gpi"><i style="width:${pct(s.gpi)}%"></i></span><span class="val num">${s.gpi.toFixed(1)}</span>
            <span>Current function</span><span class="track"><i style="width:${pct(s.cfi)}%;background:var(--st-${IO.band(s.cfi).key})"></i></span><span class="val num">${s.cfi.toFixed(1)}</span></div>
            <p style="margin-top:12px;font-size:14px"><b>${IO.gapLabel(s.gap)}.</b> ${s.gap < -1.5 ? 'Your genes give you more room here than your blood shows today — a good sign that habits can move it.' : 'Your current function is close to what your genes suggest.'}</p></div>
          <div class="card flat" style="font-size:14px"><span class="eyebrow">Across your layers</span><p style="margin-top:6px">${s.id === 'inflam' ? 'Your hs-CRP is above optimal while your genes show a moderate tendency for omega-3 conversion. Walnuts and flax are on your food map, and algal omega-3 is in your Signature Standard plan.' : 'Your blood and genetics point the same way here. Your plan keeps the habits that support it.'}</p><span class="muted" style="font-size:11px;display:block;margin-top:6px">Reviewed by an innerfree advisor</span></div>
          ${ms.length ? `<div class="card"><h3 style="margin-bottom:4px">Markers</h3>${ms.map(function (m) { return `<a class="list-row" href="#marker-${m.id}"><span class="ic">${I('blood')}</span><div><div class="t">${m.name}</div><div class="s num">${m.v} ${m.unit}</div></div>${pill(m.score)}</a>`; }).join('')}</div>` : ''}
          ${ts.length ? `<div class="card"><h3 style="margin-bottom:4px">Traits</h3>${ts.map(function (t) { return `<div class="list-row"><span class="ic">${I('dna')}</span><div><div class="t">${t.name}</div><div class="s">${t.text}</div></div><span class="pill neutral">${t.level}</span></div>`; }).join('')}</div>` : ''}
          ${lockedCard('Gut findings for this system', 'Your Flora sample is at our partner lab. Gut zones and pathways will join this system when results are released.', null)}
          <div style="height:24px"></div>
        </div></div>${IO.tabbar('biology')}</div>`;
    }
  });

  IO.defPrefix('marker-', {
    kind: 'app', title: 'Marker detail', ref: 'BRD §3.5 · §8.2 · §8.6',
    lede: 'Value, unit, band (reference zone, optimal zone, value dot), score and status, current vs target, responsiveness label, explanation, history from cycle 2.',
    notes: ['Score from the six-anchor function: Vitamin D 22 → 3.6, ApoB 112 → 4.8 (BRD acceptance tests).', 'Target = min(current + (10 − current) × responsiveness × adherence, 8.5). Shown as “Target 5.8 this cycle · moves in months” — never “points”.'],
    render: function (id) {
      const m = IO.markers.find(function (x) { return x.id === id; }) || IO.markers[0];
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="pad">${back('biology', 'Biology')}</div>
        <div class="greet"><h1>${m.name}</h1><p>Vitals Baseline · ${C.collected}</p></div>
        <div class="pad stack">
          <div class="card"><div class="row between" style="align-items:flex-end"><div><span class="display num" style="font-size:52px;font-weight:300;line-height:1">${m.v}</span> <span class="muted">${m.unit}</span></div>${pill(m.score)}</div>
            ${markerBand(m)}</div>
          <div class="bento">
            <div class="metric tint-lime"><span class="lbl">Now</span><span class="val num">${m.score.toFixed(1)}</span><span class="sub">${IO.band(m.score).label}</span></div>
            <div class="metric tint-sky"><span class="lbl">Target this cycle</span><span class="val num">${m.tgt.toFixed(1)}</span><span class="sub">${IO.RESP_LABEL[m.cls]}</span></div>
          </div>
          <div class="card"><h3>What it means</h3><p style="font-size:14px;margin-top:6px">${explain(m)}</p>${m.india ? '<p class="muted" style="font-size:12px;margin-top:8px">India flag: South Asian reference values apply to this marker.</p>' : ''}</div>
          <div class="card flat"><div class="row between"><b>History</b><span class="muted" style="font-size:12px">from cycle 2</span></div><p class="muted" style="font-size:13px;margin-top:6px">Your trend appears after Vitals Response on 14 Mar 2027.</p></div>
          <a class="card card-link" href="#coach"><div class="row between"><span>Ask the coach about ${m.name}</span>${I('chev')}</div></a>
          <div style="height:24px"></div>
        </div></div>${IO.tabbar('biology')}</div>`;
    }
  });
  function explain(m) {
    const t = {
      vitd: 'Vitamin D supports bones, muscles and immunity. Yours is below the reference range. Daylight, food sources and the vitamin D3 + K2 in your plan may help.',
      ferritin: 'Ferritin shows your iron stores. Yours are low, which can show up as tiredness. Iron-rich dals with vitamin C may help.',
      apob: 'ApoB counts the particles that carry cholesterol. Lower is better. Yours is above the reference value.',
      hba1c: 'HbA1c reflects average blood sugar over about three months. Yours is just above optimal.',
      hscrp: 'hs-CRP is a marker of low-grade inflammation. Lower is better.'
    };
    return t[m.id] || 'This marker is part of your Vitals panel. Your score compares it with the optimal and reference ranges your advisor team uses.';
  }

  /* =====================================================================
     COACH (BRD §15.2)
     ===================================================================== */
  IO.def('coach', {
    kind: 'app', title: 'Coach', ref: 'BRD §15.2–15.3 · M7',
    lede: 'Chat with suggested questions from innerAge drivers and open results; history; hand-off to the advisor.',
    notes: ['Explains; never decides. Every number must match the approved snapshot (the guard, §15.3).', 'Red-flag words skip the model: a fixed safety reply and an advisor task.', 'Try the four suggestions, including the red-flag one.'],
    render: function () {
      const msgs = S.chat.map(function (m) {
        return m.me ? `<div class="msg me">${m.t}</div>` : `<div class="msg ai">${m.t}<span class="src">${m.src || ''}</span></div>`;
      }).join('');
      return `<div class="scr">
        <div class="coach-head"><div class="coach-orb"><span></span></div><div class="grow"><b>innerOS coach</b><div class="muted" style="font-size:12px">Answers from your approved results · an advisor is a tap away</div></div><button class="btn sm" data-act="escalate">Advisor</button></div>
        <div class="scroll" data-keep-scroll id="chatScroll"><div class="chat">
          <div class="msg ai">Hi ${C.first}. I can explain your innerAge, your food map, your supplements and your next recheck. What would you like to know?<span class="src">Interpreted by innerOS</span></div>
          ${msgs}${S.typing ? '<div class="msg ai"><span class="typing"><i></i><i></i><i></i></span></div>' : ''}
        </div></div>
        <div class="suggest">${IO.coachQA.map(function (q, i) { return `<button data-act="ask" data-i="${i}">${q.q}</button>`; }).join('')}</div>
        <form class="composer" data-submit="askFree"><input id="coachIn" placeholder="Ask about your results…" autocomplete="off"><button type="submit" aria-label="Send">${I('send')}</button></form>
        ${IO.tabbar('coach')}</div>`;
    },
    after: function () { const el = document.getElementById('chatScroll'); if (el) el.scrollTop = el.scrollHeight; }
  });
  function reply(q, a, src) {
    S.chat.push({ me: true, t: q }); S.typing = true; IO.render();
    setTimeout(function () { S.typing = false; S.chat.push({ t: a, src: src }); if (location.hash === '#coach') IO.render(); }, 900);
  }
  IO.acts.ask = function (el) { const q = IO.coachQA[+el.dataset.i]; reply(q.q, q.a, q.src); };
  IO.acts.askFree = function (f) {
    const v = f.querySelector('input').value.trim(); if (!v) return;
    reply(v, '<p>I can only answer from your approved results, and I don’t have enough to answer that well. Would you like me to pass it to an innerfree advisor?</p>', 'Guard: no matching data · escalation offered');
  };
  IO.acts.escalate = function () { IO.toast('Sent to an innerfree advisor. You’ll get a reply in the app.'); };

  /* =====================================================================
     TRACK (BRD §19.5)
     ===================================================================== */
  IO.def('track', {
    kind: 'app', title: 'Track', ref: 'BRD §19.3 · §19.5',
    lede: 'Meals, hydration, activity, sleep, recovery, body signals and devices, with a quick-log sheet two taps from anything.',
    notes: ['A pillar with no data shows the action that fills it, never a zero, and stays out of the composite.', 'Recovery reads “Calibrating” until 7 days of data exist.', 'Budget watches without HRV still work: resting HR + sleep + a self-rating.'],
    render: function () {
      return `<div class="scr" style="position:relative"><div class="scroll" data-keep-scroll>
        <div class="topbar"><h1>Track</h1><div class="pillnav"><button>Yesterday</button><button class="on">Today</button></div></div>
        <div class="pad"><div class="card"><div class="score-card">${ring(124)}<div><span class="eyebrow">Synced 4 min ago</span><p style="font-size:14px;margin-top:4px"><b>Better sleep than your 28-day usual.</b> Protein is the gap today — add a katori of dal at dinner.</p><button class="link" data-act="resync" style="font-size:13px;margin-top:6px">Resync</button></div></div></div></div>
        <div class="sec"><div class="bento">${IO.pillars.map(function (p) { return `<div class="metric ${p.tint}"><span class="lbl">${p.k} ${I(p.icon)}</span><span class="val num">${p.v == null ? '<small style="margin:0;font-size:14px;color:var(--fg)">Calibrating</small>' : p.v.toFixed(1)}</span><span class="sub">${p.sub}</span></div>`; }).join('')}
          <a class="metric card-link" style="background:var(--hero-bg);color:var(--hero-fg)" href="#me"><span class="lbl">Devices ${I('watch')}</span><span class="val" style="font-size:18px">Health Connect</span><span class="sub" style="color:var(--hero-muted)">Steps · sleep · heart rate</span></a></div></div>
        <div class="sec"><div class="sec-h"><h2>Meals</h2><a class="link" href="#log-meal">Log meal</a></div><div class="card">
          ${IO.meals.map(function (m) { return `<div class="meal">${m.img ? `<img src="${m.img}" alt="">` : `<span class="ph">${I('plate')}</span>`}<div><div style="font-weight:600;font-size:14px">${m.slot}</div><div class="muted" style="font-size:12px">${m.t}${m.k ? ' · ' + m.k : ''}</div></div>${m.tier ? `<span class="tier ${m.tier}">${m.tier[0].toUpperCase() + m.tier.slice(1)}</span>` : '<a class="btn sm" href="#log-meal">Add</a>'}</div>`; }).join('')}</div></div>
        <div class="sec"><div class="sec-h"><h2>Water</h2><span class="muted num" style="font-size:13px">${S.water * 250} ml of 2,500</span></div><div class="water">${Array.from({ length: 8 }, function (_, i) { return `<button data-act="water" data-i="${i}" aria-pressed="${i < S.water}" aria-label="Glass ${i + 1}"></button>`; }).join('')}</div></div>
        <div class="sec" style="margin-bottom:90px"><div class="sec-h"><h2>Body signals</h2><span class="muted" style="font-size:12px">vs your 28-day band</span></div><div class="card">
          <div class="signal"><span>Resting heart rate</span><b class="num">64 bpm</b><div class="base"><span style="left:30%;width:36%"></span><i style="left:44%"></i></div></div>
          <div class="signal"><span>Sleep</span><b class="num">7 h 22 m</b><div class="base"><span style="left:38%;width:30%"></span><i style="left:60%"></i></div></div>
          <div class="signal"><span>Weight</span><b class="num">64.2 kg</b><div class="base"><span style="left:40%;width:20%"></span><i style="left:48%"></i></div></div>
        </div></div>
      </div>
      <button class="fab" data-act="sheet" aria-label="Quick log">${I('plus')}</button>
      ${S.sheet === 'quick' ? quickSheet() : ''}
      ${IO.tabbar('track')}</div>`;
    }
  });
  function quickSheet() {
    const q = [['plate', 'Meal', 'log-meal'], ['drop', 'Water', ''], ['scale', 'Weight', ''], ['moon', 'Sleep', ''], ['pill', 'Dose taken', ''], ['gut', 'Gut check-in', ''], ['heart', 'Mood', ''], ['walk', 'Activity', '']];
    return `<div class="sheet-back" data-act="closeSheet"><div class="sheet" role="dialog" aria-label="Quick log"><span class="grab"></span><b>Quick log</b><div class="qgrid">${q.map(function (x) { return `<button data-act="quick" data-to="${x[2]}" data-n="${x[1]}">${I(x[0])}${x[1]}</button>`; }).join('')}</div></div></div>`;
  }
  IO.acts.sheet = function () { S.sheet = 'quick'; IO.render(); };
  IO.acts.closeSheet = function (el, e) { if (e.target === el) { S.sheet = null; IO.render(); } };
  IO.acts.quick = function (el) {
    S.sheet = null;
    if (el.dataset.to) IO.go(el.dataset.to);
    else { if (el.dataset.n === 'Water') S.water = Math.min(10, S.water + 1); IO.render(); IO.toast(el.dataset.n + ' logged'); }
  };
  IO.acts.water = function (el) { const i = +el.dataset.i; S.water = (S.water === i + 1) ? i : i + 1; IO.render(); };
  IO.acts.resync = function () { IO.toast('Synced with Health Connect'); };

  IO.def('log-meal', {
    kind: 'app', title: 'Log meal', ref: 'BRD §19.4 · §19.5 · D28',
    lede: 'Search English / Hindi names → katori or piece portion → the food-test tier badge shows before saving.',
    notes: ['Food data: IFCT 2017 + an Indian portion and dish library (D28). Photo logging later (D29).', 'Avoid foods are marked as they are logged; plans leave them out.'],
    render: function () {
      const q = S.mealQuery.toLowerCase();
      const list = IO.foodDb.filter(function (f) { return !q || f.n.toLowerCase().indexOf(q) > -1 || f.hi.indexOf(S.mealQuery) > -1; });
      const pick = S.mealPick != null ? IO.foodDb[S.mealPick] : null;
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="pad">${back('track', 'Track')}</div>
        <div class="greet"><h1>Log lunch</h1><p>Search in English or <span class="hi">हिंदी</span></p></div>
        <div class="pad stack">
          <div class="search" style="min-width:0;height:48px;border-radius:14px">${I('search')}<input id="mealq" placeholder="Roti, dal, chai…" value="${S.mealQuery}" data-input="mealq" aria-label="Search food"></div>
          ${pick ? `<div class="card stack"><div class="row between"><b>${pick.n}</b><span class="tier ${pick.tier}">${pick.tier === 'neutral' ? 'No rule' : pick.tier[0].toUpperCase() + pick.tier.slice(1)}</span></div>
            <p class="muted" style="font-size:13px">${pick.r}</p>
            ${pick.tier === 'avoid' ? '<div class="banner"><b>On your avoid list.</b> You can still log it — your advisor sees honest logs, not perfect ones.</div>' : ''}
            <div class="portion"><button data-act="qty" data-d="-1" aria-label="Less">−</button><div>${S.mealQty} ${pick.unit}${S.mealQty > 1 ? 's' : ''}<div class="muted num" style="font-size:12px;font-weight:400">${pick.kcal * S.mealQty} kcal</div></div><button data-act="qty" data-d="1" aria-label="More">+</button></div>
            <div class="row"><button class="btn block" data-act="unpick">Change</button><button class="btn primary block" data-act="saveMeal">Save</button></div></div>` :
          `<div class="card">${list.map(function (f) { return `<button class="list-row" data-act="pick" data-i="${IO.foodDb.indexOf(f)}"><span class="ic">${I('plate')}</span><div><div class="t">${f.n}</div><div class="s hi">${f.hi}</div></div><span class="tier ${f.tier}">${f.tier === 'neutral' ? '—' : f.tier[0].toUpperCase() + f.tier.slice(1)}</span></button>`; }).join('') || '<p class="muted">No match. Try “dal” or “roti”.</p>'}</div>`}
          <div style="height:24px"></div></div></div>${IO.tabbar('track')}</div>`;
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.dataset.input === 'mealq') {
      S.mealQuery = e.target.value; const pos = e.target.selectionStart; IO.render();
      const el = document.getElementById('mealq'); if (el) { el.focus(); el.setSelectionRange(pos, pos); }
    }
  });
  IO.acts.pick = function (el) { S.mealPick = +el.dataset.i; S.mealQty = 1; IO.render(); };
  IO.acts.unpick = function () { S.mealPick = null; IO.render(); };
  IO.acts.qty = function (el) { S.mealQty = Math.max(1, S.mealQty + (+el.dataset.d)); IO.render(); };
  IO.acts.saveMeal = function () {
    const f = IO.foodDb[S.mealPick]; S.mealPick = null; S.mealQuery = '';
    IO.go('track'); setTimeout(function () { IO.toast(f.n + ' logged for lunch'); }, 50);
  };

  /* =====================================================================
     PLAN (BRD §20.5 · §3.6 · §3.7)
     ===================================================================== */
  IO.def('plan', {
    kind: 'app', title: 'Plan', ref: 'BRD §3.6 · §3.7 · §20.5',
    lede: 'Food map (Avoid · Minimise · Prioritise, each with its reason and source), supplement routine, rechecks with add-ons, and goals.',
    notes: ['Food Engine rank order: allergy → intolerance → blood → gut → genetics → prebiotic. Diet pattern filters, never overrides.', 'Next panel: “included — 75 markers” + add-ons; excluded markers greyed with a reason. Price null → “price on request”.'],
    render: function () {
      const tabs = [['avoid', 'Avoid'], ['minimise', 'Minimise'], ['prioritise', 'Prioritise']];
      const items = IO.food[S.foodTab];
      return `<div class="scr"><div class="scroll" data-keep-scroll>
        <div class="topbar"><h1>Plan</h1><a class="icon-btn" href="#me" aria-label="Me">${I('user')}</a></div>
        <div class="pad"><a class="photo-hero" href="#shop" style="min-height:150px"><img src="assets/img/kitchen-paratha.jpg" alt=""><span class="eyebrow" style="color:#e9ebe2">Signature Standard · active</span><div class="stack" style="gap:10px"><h3>Your formula covers 79% of your needs.</h3><span class="pillbtn">Compare plans <i>${I('arrow')}</i></span></div></a></div>
        <div class="sec"><div class="sec-h"><h2>Supplement routine</h2><span class="muted" style="font-size:12px">Adherence 86%</span></div><div class="bento">
          <div class="metric tint-lime"><span class="lbl">AM pouch ${I('sun')}</span><span class="val" style="font-size:20px">Taken</span><span class="sub">8:05 am</span></div>
          <div class="metric tint-lilac"><span class="lbl">PM pouch ${I('moon')}</span><span class="val" style="font-size:20px">Due 9 pm</span><span class="sub">Reminder on</span></div></div></div>
        <div class="sec"><div class="sec-h"><h2>Food map</h2><span class="muted" style="font-size:12px">Vegetarian filter on</span></div>
          <div class="seg-tabs" role="tablist">${tabs.map(function (t) { return `<button role="tab" data-act="foodTab" data-v="${t[0]}" aria-selected="${S.foodTab === t[0]}">${t[1]} · ${IO.food[t[0]].length}</button>`; }).join('')}</div>
          <div class="card" style="margin-top:10px">${items.map(function (f) { return `<div class="food-item"><span class="n">${f.n}</span><span class="tier ${S.foodTab}">${S.foodTab[0].toUpperCase() + S.foodTab.slice(1)}</span><span class="r">${f.r}</span></div>`; }).join('')}</div>
          ${S.foodTab === 'avoid' ? `<div class="card flat" style="margin-top:10px;font-size:13px"><b>Reintroduction</b> · wheat from 6 Jan 2027, one food at a time over 3 days, with a gut check-in after each.</div>` : ''}</div>
        <div class="sec"><div class="sec-h"><h2>Rechecks</h2></div><div class="card"><div class="ribbon">${C.vitalsPlan.map(function (c) { return `<div class="${c.s === 'done' ? 'done' : c.s === 'next' ? 'cur' : ''}">${c.n}<br>${c.d}</div>`; }).join('')}</div>
          <div style="margin-top:14px;font-size:14px"><div class="row between"><b>Vitals Response · 14 Mar 2027</b><button class="link" data-act="resched" style="font-size:13px">Reschedule</button></div>
          <p class="muted" style="font-size:13px;margin-top:4px">Included — 75 markers. Recommended add-ons for you:</p>
          <div class="stack" style="gap:6px;margin-top:8px">${[['Vitamin D (25-OH)', true, 'price on request'], ['Ferritin + iron studies', true, 'price on request'], ['Lp(a)', false, 'genetically fixed — tested once']].map(function (a) { return `<label class="row" style="font-size:13px;${a[1] ? '' : 'color:var(--faint)'}"><input type="checkbox" ${a[1] ? 'checked' : 'disabled'} style="width:18px;height:18px;accent-color:var(--ink)"> <span class="grow">${a[0]}</span><span class="muted" style="font-size:12px">${a[2]}</span></label>`; }).join('')}</div></div></div></div>
        <div class="sec" style="margin-bottom:24px"><div class="sec-h"><h2>Goals</h2><span class="muted" style="font-size:12px">shape your plan, never a score</span></div><div class="chips">${S.goals.map(function (g) { return `<span class="chip" aria-pressed="true">${g}</span>`; }).join('')}<a class="chip" href="#ob-profile">Edit</a></div></div>
      </div>${IO.tabbar('plan')}</div>`;
    }
  });
  IO.acts.foodTab = function (el) { S.foodTab = el.dataset.v; IO.render(); };
  IO.acts.resched = function () { IO.toast('You can move it up to 21 days either side.'); };

  /* =====================================================================
     SHOP — the only screen with segments (BRD §3.9)
     ===================================================================== */
  IO.def('shop', {
    kind: 'app', title: 'Shop · Signature', ref: 'BRD §3.9 · §8.11',
    lede: 'Signature Basic, Standard and Premium side by side: approximate cost, coverage %, needs covered, products grouped under segment bands, and what the next tier unlocks.',
    notes: ['The only screen where segment names and colours appear (lint rule in CI).', 'Costs are “approx.” from a lookup row or Shopify (D55); checkout always charges the Shopify price.', 'All three tiers are computed for every member; budget never reorders clinical priority.'],
    render: function () {
      const sg = IO.signature, t = sg[S.tier];
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="pad">${back('plan', 'Plan')}</div>
        <div class="greet"><h1>innerfree Signature</h1><p>One formula, made from your results. Pick how much it covers.</p></div>
        <div class="pad stack">
          <div class="tier-cards">${['basic', 'standard', 'premium'].map(function (k) { const x = sg[k]; return `<button class="tier-card" data-act="tier" data-v="${k}" aria-pressed="${S.tier === k}"><span class="n">${x.n}</span><span class="cov num">${x.cov}%</span><div class="cov-bar"><i style="width:${x.cov}%"></i></div><span class="p num">approx. ₹${x.p}/day</span><span class="p">${x.needs} of ${x.total} needs</span></button>`; }).join('')}</div>
          ${sg.bands[S.tier].map(function (b) { return `<div class="seg-band" style="--sc:var(${b[1]})"><span class="sname">${b[0]}</span><ul>${b[2].map(function (p) { return `<li><span>${p[0]}</span><span class="muted">${p[1]}</span></li>`; }).join('')}</ul></div>`; }).join('')}
          ${sg.deferred[S.tier].length ? `<div class="deferred"><b style="color:var(--fg)">Not in this tier</b> — ${S.tier === 'basic' ? 'unlocked in Standard' : 'unlocked in Premium'}<br>${sg.deferred[S.tier].join(' · ')}</div>` : `<div class="deferred">Every need in your plan is covered, with premium forms (phytosome, liposomal) and powders.</div>`}
          <a class="card card-link flat" href="#shop"><div class="row between"><div><b>See pre-formulated alternatives</b><div class="muted" style="font-size:12px">innerfree Essentials · 3 products cover 61%</div></div>${I('chev')}</div></a>
          <button class="btn primary block" data-act="checkout">Continue on innerfree.health · ${t.n}</button>
          <p class="muted" style="font-size:12px;text-align:center">Approximate. Your personalised formulation sets the final amount at checkout.</p>
          <div style="height:24px"></div>
        </div></div>${IO.tabbar('plan')}</div>`;
    }
  });
  IO.acts.tier = function (el) { S.tier = el.dataset.v; IO.render(); };
  IO.acts.checkout = function () { IO.toast('Opening checkout on innerfree.health with Signature ' + IO.signature[S.tier].n); };

  /* =====================================================================
     ME + CONNECTED AI APPS (BRD §3.10 · §15.5)
     ===================================================================== */
  IO.def('me', {
    kind: 'app', title: 'Me', ref: 'BRD §3.10 · §20.5 side menu',
    lede: 'Layers owned and test dates, plan, reports, consents and privacy, devices, notifications and Connected AI apps.',
    notes: ['Reports: four stand-alone PDFs, one test each, filled from innerfree’s templates (§3.14). The integrated interpretation lives only in the app.'],
    render: function () {
      const row = function (icon, t, s, right, href, act) {
        const tag = href ? `a href="#${href}"` : `button ${act ? `data-act="${act}"` : ''}`;
        return `<${tag} class="list-row"><span class="ic">${I(icon)}</span><div><div class="t">${t}</div><div class="s">${s}</div></div>${right || I('chev')}</${href ? 'a' : 'button'}>`;
      };
      return `<div class="scr"><div class="scroll" data-keep-scroll>
        <div class="topbar"><h1>Me</h1><a class="icon-btn" href="#home" aria-label="Close">${I('x')}</a></div>
        <div class="pad"><div class="card row" style="gap:14px"><img class="avatar" style="width:56px;height:56px" src="assets/img/ananya-avatar.jpg" alt=""><div class="grow"><b style="font-size:17px">${C.name}</b><div class="muted" style="font-size:13px">${C.ref} · ${C.city} · member since Oct 2026</div></div></div></div>
        <div class="sec"><div class="sec-h"><h2>Reports</h2><span class="muted" style="font-size:12px">one test per PDF</span></div><div class="card">
          ${row('blood', 'innerfree Vitals', 'Baseline · 14 Oct 2026', I('download'), null, 'pdf')}${row('dna', 'innerfree Origin', '2 Nov 2026', I('download'), null, 'pdf')}${row('plate', 'innerfree Sense', '14 Oct 2026', I('download'), null, 'pdf')}${row('gut', 'innerfree Flora', 'Available after release', '<span class="pill neutral">Pending</span>', null, null)}</div></div>
        <div class="sec"><div class="sec-h"><h2>Settings</h2></div><div class="card">
          ${row('sparkle', 'Connected AI apps', 'Claude · connected', '<span class="pill good">1</span>', 'ai-apps')}
          ${row('watch', 'Devices', 'Health Connect · steps, sleep, heart rate', null, null, 'none')}
          ${row('shield', 'Data & privacy', 'Consents v1.2 · health data, AI coach', null, 'ob-consent')}
          ${row('bell', 'Notifications', 'Doses, results, rechecks', null, null, 'none')}
          ${row('user', 'Language', 'English', null, 'ob-welcome')}
          ${row('heart', 'Book a consultation', 'Talk to an innerfree advisor', null, null, 'book')}
          ${row('logout', 'Sign out', 'This device only', '', 'hub')}</div></div>
        <div style="height:24px"></div>
      </div>${IO.tabbar('')}</div>`;
    }
  });
  IO.acts.pdf = function () { IO.toast('Downloading your report (filled from innerfree’s template)'); };

  IO.def('ai-apps', {
    kind: 'app', title: 'Connected AI apps', ref: 'BRD §15.5 · V2.8 · D59–D66',
    lede: 'Members connect innerOS to Claude or ChatGPT. innerOS decides; the member’s AI explains. This page lists apps, data groups, the call log and Disconnect.',
    notes: ['Genetics is off by default (D62); gated traits stay out either way.', 'Disconnect revokes access at once. Every read and write is logged with its source (“via Claude”).', 'Included in membership at no extra cost (D60).'],
    render: function () {
      const G = [['food', 'Food list and plan'], ['labs', 'Labs and scores'], ['notes', 'Expert notes'], ['routine', 'Supplement routine'], ['logs', 'Daily logs'], ['genetics', 'Genetic trait summaries']];
      return `<div class="scr"><div class="scroll" data-keep-scroll><div class="pad">${back('me', 'Me')}</div>
        <div class="greet"><h1>Connected AI apps</h1><p>Ask your own AI about your body. innerOS gives it your verdicts; it can’t change them.</p></div>
        <div class="pad stack">
          ${S.aiConnected ? `<div class="card ink-card"><div class="row between"><div class="row"><span class="lg" style="width:40px;height:40px;border-radius:12px;background:#d97757;display:grid;place-items:center;color:#fff;font-weight:700">C</span><div><b>Claude</b><div class="muted" style="font-size:12px">${IO.aiApps[0].since}</div></div></div><button class="btn sm" data-act="disconnect" style="background:transparent;color:var(--hero-fg);border-color:var(--hero-line)">Disconnect</button></div></div>
          <div class="card"><h3>What Claude can see</h3><p class="muted" style="font-size:12px;margin:2px 0 6px">Summaries only — never files, raw genetic data or anything not yet released.</p>
            ${G.map(function (g) { return `<div class="list-row" style="grid-template-columns:minmax(0,1fr) auto"><div><div class="t">${g[1]}</div>${g[0] === 'genetics' ? '<div class="s">Off by default</div>' : ''}</div><button class="switch" role="switch" aria-checked="${!!S.aiGroups[g[0]]}" aria-label="${g[1]}" data-act="aiToggle" data-k="${g[0]}"></button></div>`; }).join('')}</div>
          <div class="card"><h3 style="margin-bottom:6px">Activity</h3>${IO.aiLog.map(function (l) { return `<div class="log-line"><span class="muted">${l[0]}</span><span>${l[1]}</span></div>`; }).join('')}</div>`
          : `<div class="card flat">No AI apps connected. Your data is no longer shared.</div>`}
          <div class="card row between"><div><b>Connect ChatGPT</b><div class="muted" style="font-size:12px">Ask-only at launch · logging needs Developer Mode (P11)</div></div><button class="btn sm" data-act="none">Connect</button></div>
          <p class="muted" style="font-size:12px">Whatever your AI reads is processed by that company under your own account (DPDP Act 2023). innerfree never sells health data.</p>
          <div style="height:24px"></div>
        </div></div>${IO.tabbar('')}</div>`;
    }
  });
  IO.acts.aiToggle = function (el) { const k = el.dataset.k; S.aiGroups[k] = !S.aiGroups[k]; IO.render(); };
  IO.acts.disconnect = function () { S.aiConnected = false; IO.render(); IO.toast('Claude disconnected. Access revoked.'); };
})();
