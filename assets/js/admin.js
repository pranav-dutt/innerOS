/* innerOS prototype — Admin console (BRD §2) */
(function () {
  const I = IO.icon, S = IO.state, A = IO.admin;

  const LT = function (code) {
    // code letters: V O F S present (uppercase) / in progress (lowercase)
    return '<span class="lt" aria-label="Layers">' + [['V', 'Vitals'], ['O', 'Origin'], ['F', 'Flora'], ['S', 'Sense']].map(function (l) {
      const on = code.indexOf(l[0]) > -1, prog = code.indexOf(l[0].toLowerCase()) > -1;
      return '<i class="' + (on ? 'on' : prog ? 'prog' : '') + '" title="' + l[1] + (on ? ' released' : prog ? ' in progress' : ' not ordered') + '">' + l[0] + '</i>';
    }).join('') + '</span>';
  };
  const relPill = function (r) {
    return { approved: '<span class="pill good">Approved</span>', pending_review: '<span class="pill improve">Pending review</span>', none: '<span class="pill neutral">No release yet</span>' }[r];
  };
  const sev = function (s) { return '<span class="sev ' + s + '">' + s.toUpperCase() + '</span>'; };
  const statusPill = function (s) {
    const m = { kit_requested: 'neutral', ordered: 'neutral', collected: 'maintain', sample_received: 'maintain', processing: 'maintain', raw_data_sent: 'maintain', result_received: 'improve', kit_dispatched: 'good' };
    return '<span class="pill ' + (m[s] || 'neutral') + '">' + s.replace(/_/g, ' ') + '</span>';
  };

  function shell(on, body) {
    const nav = function (href, icon, label, key, cnt, soon) {
      return '<a href="#' + href + '" class="' + (on === key ? 'on' : '') + (soon ? ' soon' : '') + '"' + (on === key ? ' aria-current="page"' : '') + '>' + I(icon) + label + (cnt ? '<span class="cnt">' + cnt + '</span>' : '') + '</a>';
    };
    return '<div class="admin"><nav class="side" aria-label="Admin">' +
      '<a href="#hub" class="brandmark" style="padding:4px 8px 18px;color:var(--hero-fg)"><span class="circle"></span>innerOS <small>Admin</small></a>' +
      nav('admin-dashboard', 'grid', 'Dashboard', 'dash') +
      '<span class="grp">Clinical</span>' +
      nav('admin-review', 'inbox', 'Review queue', 'review', A.tiles.pending) +
      nav('admin-dashboard', 'alert', 'Alerts', 'alerts', 'Full build', true) +
      nav('admin-clients', 'users', 'Clients', 'clients') +
      '<span class="grp">Operations</span>' +
      nav('admin-orders', 'truck', 'Orders & kits', 'orders', 2) +
      '<span class="grp">Configuration</span>' +
      nav('admin-dashboard', 'table', 'Lookup tables', 'tables', 'Full build', true) +
      nav('admin-dashboard', 'clock', 'Audit log', 'audit', 'Full build', true) +
      nav('admin-dashboard', 'cog', 'Staff & access', 'set', 'Full build', true) +
      '<div class="me"><span class="av">' + A.staff.initials + '</span><div><b>' + A.staff.name + '</b><div style="color:var(--hero-muted);font-size:12px">' + A.staff.role + ' · MFA on</div></div></div>' +
      '</nav><main class="main">' + body + '</main>' + modal() + '</div>';
  }

  /* ---------- Staff sign-in ---------- */
  IO.def('admin-login', {
    kind: 'page', title: 'Staff sign-in',
    render: function () {
      return '<div class="login-wrap"><section class="login-art"><img src="assets/img/kerala-tea-hills.jpg" alt="">' +
        '<a href="#hub" class="brandmark" style="color:var(--hero-fg);text-decoration:none"><span class="circle"></span>innerOS <small>Admin console</small></a>' +
        '<div><h1>Every result reviewed before a member sees it.</h1><p style="color:#d6d8cf;margin-top:12px;max-width:40ch">For innerfree advisors, reviewers, ops and editors. Staff sign in separately from members, with an authenticator code.</p></div></section>' +
        '<form class="login-form" data-submit="staffLogin"><span class="eyebrow">innerfree staff</span><h2>Sign in</h2>' +
        '<div class="field"><label for="se">Work email</label><input id="se" class="input" type="email" value="meera.nair@innerfree.health" autocomplete="username"></div>' +
        '<div class="field"><label for="sc">Authenticator code</label><input id="sc" class="input" inputmode="numeric" value="731 204" autocomplete="one-time-code"></div>' +
        '<button class="btn primary block" type="submit">Sign in</button>' +
        '<p class="muted" style="font-size:12px">Every staff read of a member’s health data is written to the audit log.</p></form></div>';
    }
  });
  IO.acts.staffLogin = function () { IO.go('admin-dashboard'); };

  /* ---------- Dashboard (§2 Flow 1) ---------- */
  IO.def('admin-dashboard', {
    kind: 'page', title: 'Admin dashboard',
    render: function () {
      const t = A.tiles, max = Math.max.apply(null, A.byStatus.map(function (s) { return s[1]; }));
      return shell('dash',
        '<div class="ahead"><div><h1>Good morning, Meera</h1><div class="sub">Every number reads innerOS’s own tables · refreshes every 30 s · last 10:44</div></div>' +
        '<div class="search">' + I('search') + '<input placeholder="Search IFN ref, name, email or Shopify ID" aria-label="Search clients"></div></div>' +
        '<div class="tiles">' +
          '<a class="tile" href="#admin-review" style="background:var(--hero-bg);color:var(--hero-fg)"><span class="k" style="color:var(--citron)">Pending review</span><span class="v num">' + t.pending + '</span><span class="s" style="color:var(--hero-muted)">' + t.pendingCrit + ' with a CRITICAL alert</span></a>' +
          '<a class="tile crit" href="#admin-review"><span class="k">Critical alerts</span><span class="v num">' + t.critical + '</span><span class="s">' + t.criticalBy + '</span></a>' +
          '<a class="tile tint-lime" href="#admin-orders"><span class="k">Orders in progress</span><span class="v num">' + t.orders + '</span><span class="s">' + t.ordersBy.map(function (o) { return o[0] + ' ' + o[1]; }).join(' · ') + '</span></a>' +
          '<div class="tile"><span class="k">Parse failures · warnings</span><div class="split"><div><span class="v num">' + t.parseFail + '</span><span>failed</span></div><div><span class="v num">' + t.parseWarn + '</span><span>warnings</span></div></div><span class="s">Unmapped label “VIT D TOTAL” · <button class="link" data-act="adminNoop">Map it</button></span></div>' +
        '</div>' +
        '<div class="agrid">' +
          '<section class="panel"><div class="panel-h"><h2>Pending review</h2><a class="link" href="#admin-review" style="font-size:13px">Open queue</a></div>' + queueTable(A.queue.slice(0, 5)) + '</section>' +
          '<section class="panel"><div class="panel-h"><h2>Orders by status</h2><span class="meta">last 30 days</span></div><div class="chart">' +
            A.byStatus.map(function (s) { return '<div class="chart-row"><span>' + s[0].replace(/_/g, ' ') + '</span><span class="track"><i style="width:' + (s[1] / max * 100) + '%"></i></span><span class="n num">' + s[1] + '</span></div>'; }).join('') +
          '</div></section>' +
          '<section class="panel" style="grid-column:1/-1"><div class="panel-h"><h2>Recent activity</h2><span class="meta">from the audit log</span></div><div class="feed">' +
            A.activity.map(function (a) { return '<div><time>' + a[0] + '</time><span>' + a[1] + '</span></div>'; }).join('') + '</div></section>' +
        '</div>');
    }
  });
  IO.acts.adminNoop = function () { IO.toast('Opens the marker alias mapper in the full build', true); };

  function queueTable(rows) {
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Client</th><th>Worst alert</th><th>Reason</th><th>Layers</th><th>Waiting</th></tr></thead><tbody>' +
      rows.map(function (q) {
        return '<tr class="click" data-act="openReview" data-ref="' + q.ref + '"><td><b>' + q.name + '</b><div class="mono muted">' + q.ref + '</div></td><td>' + sev(q.sev) + ' <span class="mono" style="font-size:11.5px">' + q.worst + '</span></td><td>' + q.reason.replace(/_/g, ' ') + '</td><td>' + LT(q.layers) + '</td><td class="num">' + q.wait + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  IO.acts.openReview = function (el) { IO.go('review-' + el.dataset.ref); };

  /* ---------- Review queue ---------- */
  IO.def('admin-review', {
    kind: 'page', title: 'Review queue',
    render: function () {
      return shell('review',
        '<div class="ahead"><div><h1>Review queue</h1><div class="sub">Pending releases · worst severity first, then oldest · one pending release per client</div></div>' +
        '<div class="pillnav"><button class="on">All · 7</button><button>Critical · 3</button><button>First release · 2</button></div></div>' +
        '<section class="panel">' + queueTable(A.queue) + '</section>' +
        '<p class="muted" style="font-size:13px;margin-top:12px">Launch setting: auto-approve off (D7). Releases reach this queue by four rules: critical alert, confirmatory alert, first release, or auto-approve off.</p>');
    }
  });

  /* ---------- Review detail ---------- */
  const DRAFTS = [
    { k: 'gut', label: 'What your gut score means', tpl: 'Your gut results show an organism our advisors want to discuss with you. Your advisor will call you before your plan changes.', ai: 'Your gut test found a bacterium that can upset digestion when it overgrows. This is common and manageable. Before anything in your plan changes, an innerfree advisor will call you to talk it through.' },
    { k: 'sugar', label: 'Blood sugar & insulin — explanation', tpl: 'Your HbA1c is above the optimal range. Small daily changes may help.', ai: 'Your HbA1c of 6.1% sits above optimal. A 10-minute walk after meals and swapping refined grains for millets may help bring it down by your next recheck.' }
  ];
  IO.defPrefix('review-', {
    kind: 'page', title: 'Review release',
    render: function (ref) {
      const q = A.queue.find(function (x) { return x.ref === ref; }) || A.queue[0];
      const alerts = q.sev === 'critical' && q.worst === 'PATHOGEN'
        ? [['critical', 'PATHOGEN', 'Clostridioides difficile detected (pathogen panel row 7)', 'Holds release · blocks Signature dispatch'], ['high', 'MARKER_ATTENTION', 'HbA1c 6.1% → score 3.4', 'Priority Action Plan'], ['moderate', 'ORAL_GUT', '2 oral-origin species in gut', 'Dental advisory']]
        : [['critical', q.worst, q.worst === 'MARKER_CRITICAL' ? 'Potassium 6.4 mmol/L beyond critical anchor (crit_hi 6.0)' : 'See layer findings', 'Forces review · immediate advisor notice'], ['high', 'MARKER_ATTENTION', 'Vitamin D 14 ng/mL → score 2.1', 'Priority Action Plan']];
      const crits = alerts.filter(function (a) { return a[0] === 'critical'; });
      const ticks = S.ticks[q.ref] || {};
      const allTicked = crits.every(function (_, i) { return ticks[i]; });
      const draftsDone = DRAFTS.every(function (d) { return S.drafts[q.ref + d.k]; });
      const decided = S.decided && S.decided.ref === q.ref ? S.decided : null;
      return shell('review',
        '<div class="ahead"><div><a class="back-btn" href="#admin-review">' + I('back') + ' Review queue</a><h1>' + q.name + ' <span class="mono muted" style="font-size:16px;font-family:ui-monospace,monospace">' + q.ref + '</span></h1>' +
        '<div class="sub">Release R2 · trigger ' + q.trig + ' · engine 2.4.0 · tables v7 · computed 23 Nov 2026 09:58</div></div>' +
        '<div class="row">' + LT(q.layers) + relPill('pending_review') + '</div></div>' +
        (decided ? '<div class="banner" style="margin-bottom:14px;background:' + (decided.ok ? 'var(--st-good-bg)' : 'var(--st-attention-bg)') + '"><b style="color:' + (decided.ok ? 'var(--st-good)' : 'var(--st-attention)') + '">' + (decided.ok ? 'Approved.' : 'Rejected.') + '</b> ' + (decided.ok ? 'Previous release superseded, alerts acknowledged, REPORT_READY queued. Audited.' : 'Reason: ' + decided.reason + '. Alerts stay open; the client keeps the previous approved release.') + '</div>' : '') +
        '<div class="review-grid">' +
          '<section class="stack">' +
            '<div class="panel"><div class="panel-h"><h2>Alerts</h2><span class="meta">' + alerts.length + ' open</span></div>' + alerts.map(function (a) { return '<div class="alert-row">' + sev(a[0]) + '<div><b class="mono" style="font-size:12px">' + a[1] + '</b><div>' + a[2] + '</div><div class="muted" style="font-size:12px">' + a[3] + '</div></div></div>'; }).join('') + '</div>' +
            '<div class="panel"><div class="panel-h"><h2>System scores</h2><span class="meta">weakest 5</span></div>' + IO.systems.slice(0, 5).map(function (s) { return '<div class="row between" style="padding:7px 0;border-top:1px solid var(--line);font-size:13px"><span>' + s.name + '</span><span class="row" style="gap:8px"><span class="muted num" style="font-size:12px">GPI ' + s.gpi.toFixed(1) + ' · CFI ' + s.cfi.toFixed(1) + '</span>' + IO.ui.pill(s.si) + '</span></div>'; }).join('') + '</div>' +
            '<div class="panel"><div class="panel-h"><h2>Flagged markers</h2></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Marker</th><th>Value</th><th>Score</th><th>Target</th></tr></thead><tbody>' +
              [['HbA1c', '6.1 %', 3.4, 5.7], ['Vitamin D', '19 ng/mL', 2.9, 5.2], ['Ferritin', '22 ng/mL', 6.6, 8.1]].map(function (m) { return '<tr><td>' + m[0] + '</td><td class="num">' + m[1] + '</td><td>' + IO.ui.pill(m[2]) + '</td><td class="num">' + m[3].toFixed(1) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
          '</section>' +
          '<section class="stack">' +
            '<div class="panel"><div class="panel-h"><h2>AI drafts</h2><span class="meta">accept, edit or revert to template</span></div><div class="stack">' +
              DRAFTS.map(function (d) {
                const st = S.drafts[q.ref + d.k];
                return '<div class="draft' + (st ? ' resolved' : '') + '"><span class="tag">' + d.label + (st ? ' · ' + st : '') + '</span><div><span class="tag" style="font-size:10px">Template</span><p>' + d.tpl + '</p></div><div class="ai"><span class="tag" style="font-size:10px">AI draft · guard passed</span><p>' + d.ai + '</p></div>' +
                  '<div class="acts"><button class="btn sm primary" data-act="draft" data-k="' + q.ref + d.k + '" data-v="accepted">Accept draft</button><button class="btn sm" data-act="draft" data-k="' + q.ref + d.k + '" data-v="edited">Edit</button><button class="btn sm ghost" data-act="draft" data-k="' + q.ref + d.k + '" data-v="template">Use template</button></div></div>';
              }).join('') + '</div></div>' +
            '<div class="panel"><div class="panel-h"><h2>Need list → Signature Standard</h2><span class="meta">coverage 81%</span></div>' +
              [['Blood sugar support', 'system + marker', 0.9], ['Vitamin D', 'marker', 0.9], ['Gut repair', 'gut_alert', 1.0], ['Energy (goal)', 'goal', 0.6]].map(function (n) { return '<div class="row between" style="padding:7px 0;border-top:1px solid var(--line);font-size:13px"><span>' + n[0] + ' <span class="muted">· ' + n[1] + '</span></span><b class="num">' + n[2].toFixed(1) + '</b></div>'; }).join('') +
              '<p class="muted" style="font-size:12px;margin-top:8px">Signature dispatch blocked while PATHOGEN is open.</p></div>' +
          '</section>' +
          '<aside class="panel decide"><h2 style="font-size:16px">Decision</h2><div class="muted" style="font-size:13px">review_reason: <b class="mono" style="color:var(--fg)">' + q.reason + '</b></div>' +
            '<div><div class="eyebrow" style="margin-bottom:4px">Confirm each critical alert</div>' + crits.map(function (a, i) { return '<label class="tick"><input type="checkbox" data-act="tick" data-ref="' + q.ref + '" data-i="' + i + '" ' + (ticks[i] ? 'checked' : '') + '><span><b class="mono" style="font-size:12px">' + a[1] + '</b><br>' + a[2] + '</span></label>'; }).join('') + '</div>' +
            '<div class="muted" style="font-size:12px">' + (draftsDone ? '✓ All AI drafts resolved' : 'Resolve every AI draft before approving') + '</div>' +
            '<button class="btn primary block" data-act="approve" data-ref="' + q.ref + '" ' + (allTicked && draftsDone && !decided ? '' : 'disabled') + '>Approve release</button>' +
            '<button class="btn block danger" data-act="rejectOpen" data-ref="' + q.ref + '" ' + (decided ? 'disabled' : '') + '>Reject…</button>' +
            '<button class="btn block ghost" data-act="viewAs">' + I('eye') + ' View as client</button>' +
            '<p class="muted" style="font-size:12px">Approve runs in one transaction: supersede the previous release, approve this one, acknowledge its alerts, audit and queue REPORT_READY.</p></aside>' +
        '</div>');
    }
  });
  IO.acts.tick = function (el) {
    const r = el.dataset.ref, i = el.dataset.i; S.ticks[r] = S.ticks[r] || {}; S.ticks[r][i] = !S.ticks[r][i]; IO.render();
  };
  IO.acts.draft = function (el) { S.drafts[el.dataset.k] = el.dataset.v; IO.render(); };
  IO.acts.approve = function (el) { S.decided = { ref: el.dataset.ref, ok: true }; IO.render(); IO.toast('Release approved · client notified', true); };
  IO.acts.rejectOpen = function (el) { S.modal = { type: 'reject', ref: el.dataset.ref, reason: 'needs_retest', note: '' }; IO.render(); };
  IO.acts.viewAs = function () { IO.toast('15-minute read-only view · every write returns 403 · audited', true); setTimeout(function () { IO.go('home'); }, 900); };

  /* ---------- Modals ---------- */
  function modal() {
    const m = S.modal; if (!m) return '';
    if (m.type === 'reject') {
      return '<div class="modal-back"><form class="modal" data-submit="rejectDo" role="dialog" aria-label="Reject release"><h2>Reject release</h2>' +
        '<div class="field"><label for="rr">Reason</label><select id="rr" class="input">' + ['data_error', 'table_error', 'needs_retest', 'clinical_hold', 'other'].map(function (r) { return '<option' + (r === m.reason ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="rn">Note (at least 20 characters)</label><textarea id="rn" class="input" data-input="rejNote" placeholder="What needs to happen before this can be released?">' + m.note + '</textarea><span class="muted num" style="font-size:12px">' + m.note.length + ' / 20</span></div>' +
        '<p class="muted" style="font-size:13px">Alerts stay open. The client keeps their previous approved release.</p>' +
        '<div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="closeModal">Cancel</button><button class="btn ink" type="submit" ' + (m.note.length >= 20 ? '' : 'disabled') + '>Reject release</button></div></form></div>';
    }
    if (m.type === 'dispatch') {
      return '<div class="modal-back"><form class="modal" data-submit="dispatchDo" role="dialog" aria-label="Record kit dispatch"><h2>Record kit dispatch</h2><p class="muted" style="font-size:14px">' + m.ref + ' · ' + m.product + ' kit · sample code ' + m.code + '</p>' +
        '<div class="field"><label for="cr">Courier</label><select id="cr" class="input"><option>Blue Dart</option><option>Delhivery</option><option>DTDC</option></select></div>' +
        '<div class="field"><label for="tn">Tracking number</label><input id="tn" class="input" value="BD7712093341"></div>' +
        '<p class="muted" style="font-size:13px">The client gets KIT_DISPATCHED by email and in the app. Stage moves to kit_dispatched and is audited.</p>' +
        '<div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-act="closeModal">Cancel</button><button class="btn primary" type="submit">Mark dispatched</button></div></form></div>';
    }
    return '';
  }
  document.addEventListener('input', function (e) {
    if (e.target.dataset.input === 'rejNote' && S.modal) {
      S.modal.note = e.target.value; S.modal.reason = document.getElementById('rr').value;
      const pos = e.target.selectionStart; IO.render();
      const t = document.getElementById('rn'); if (t) { t.focus(); t.setSelectionRange(pos, pos); }
    }
  });
  IO.acts.closeModal = function () { S.modal = null; IO.render(); };
  IO.acts.rejectDo = function () {
    const reason = document.getElementById('rr').value;
    S.decided = { ref: S.modal.ref, ok: false, reason: reason }; S.modal = null; IO.render(); IO.toast('Release rejected · audited', true);
  };
  IO.acts.dispatchOpen = function (el) { S.modal = { type: 'dispatch', ref: el.dataset.ref, product: el.dataset.p, code: el.dataset.code }; IO.render(); };
  IO.acts.dispatchDo = function () { S.dispatched[S.modal.ref] = true; S.modal = null; IO.render(); IO.toast('Kit dispatched · client notified', true); };

  /* ---------- Clients ---------- */
  IO.def('admin-clients', {
    kind: 'page', title: 'Clients',
    render: function () {
      return shell('clients',
        '<div class="ahead"><div><h1>Clients</h1><div class="sub">' + A.clients.length + ' shown · created from Shopify orders · no passwords stored</div></div>' +
        '<div class="search">' + I('search') + '<input placeholder="IFN ref, name, email or Shopify ID" aria-label="Search clients"></div></div>' +
        '<div class="row" style="flex-wrap:wrap;margin-bottom:12px"><div class="pillnav"><button class="on">All layers</button><button>Vitals</button><button>Origin</button><button>Flora</button><button>Sense</button></div><div class="pillnav"><button class="on">Any release</button><button>Pending review</button><button>Approved</button></div></div>' +
        '<section class="panel"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Client</th><th>Layers</th><th>Active plan</th><th>Next due</th><th>Latest release</th><th>Last activity</th></tr></thead><tbody>' +
        A.clients.map(function (c) { return '<tr class="click" data-act="openClient" data-ref="' + c.ref + '"><td><b>' + c.name + '</b><div class="mono muted">' + c.ref + '</div></td><td>' + LT(c.layers) + '</td><td>' + c.plan + '</td><td class="num">' + c.due + '</td><td>' + relPill(c.rel) + '</td><td class="muted">' + c.last + '</td></tr>'; }).join('') +
        '</tbody></table></div></section>');
    }
  });
  IO.acts.openClient = function (el) { IO.go('client-' + el.dataset.ref); };

  /* ---------- Client page (§2 Flow 3) ---------- */
  IO.defPrefix('client-', {
    kind: 'page', title: 'Client',
    render: function (ref) {
      const c = A.clients.find(function (x) { return x.ref === ref; }) || A.clients[0];
      const isA = c.ref === 'IFN-0142';
      const tab = S.adminTab;
      const clinical =
        '<div class="agrid"><section class="stack">' +
          '<div class="panel"><div class="panel-h"><h2>Latest approved snapshot</h2><span class="meta">R3 · approved 4 Nov 2026 by Dr. Meera Nair</span></div>' +
            '<div class="kv"><div><span>Overall index</span><b class="num">' + IO.overall.toFixed(1) + '</b> · ' + IO.band(IO.overall).label + '</div><div><span>innerAge</span><b class="num">' + IO.client.innerAge + '</b> vs ' + IO.client.age + '</div><div><span>Systems in Attention / Improve</span><b class="num">' + IO.systems.filter(function (s) { return s.si < 6; }).length + ' of 17</b></div><div><span>innerScore (7-day)</span><b class="num">7.4</b></div></div>' +
            '<div style="margin-top:14px">' + IO.systems.slice(0, 4).map(function (s) { return '<div class="row between" style="padding:7px 0;border-top:1px solid var(--line);font-size:13px"><span>' + s.name + '</span>' + IO.ui.pill(s.si) + '</div>'; }).join('') + '</div></div>' +
          '<div class="panel"><div class="panel-h"><h2>Releases</h2></div><div class="feed">' +
            [['4 Nov', 'R3 approved · Origin added · reason first_release (genetics)'], ['22 Oct', 'R2 superseded · Sense added'], ['18 Oct', 'R1 superseded · Vitals Baseline · CONFIRMATORY on vitamin D']].map(function (r) { return '<div><time>' + r[0] + '</time><span>' + r[1] + '</span></div>'; }).join('') + '</div></div>' +
        '</section><section class="stack">' +
          '<div class="panel"><div class="panel-h"><h2>Open alerts</h2></div>' +
            '<div class="alert-row">' + sev('high') + '<div><b class="mono" style="font-size:12px">MARKER_ATTENTION</b><div>Vitamin D 22 ng/mL → 3.6</div></div></div>' +
            '<div class="alert-row">' + sev('safety') + '<div><b class="mono" style="font-size:12px">DRUG_ALLERGY</b><div>Sense IgE positive · sulfonamides → formulation contraindication</div></div></div></div>' +
          '<div class="panel"><div class="panel-h"><h2>Adherence</h2><span class="meta">current Vitals window</span></div><div class="row" style="align-items:flex-end;gap:16px"><span class="display num" style="font-size:44px;font-weight:300;line-height:1">86%</span><span class="muted" style="font-size:13px">Next-cycle adherence factor <b style="color:var(--fg)">1.1</b> (≥ 0.8)</span></div></div>' +
          '<div class="panel"><div class="panel-h"><h2>Daily layer</h2><span class="meta">30 days</span></div><div class="row" style="gap:4px;align-items:flex-end;height:54px">' + Array.from({ length: 30 }, function (_, i) { const h = 30 + Math.round(18 * Math.sin(i / 3) + (i % 5) * 4); return '<i style="flex:1;height:' + h + 'px;border-radius:3px;background:' + (i > 25 ? 'var(--citron)' : 'var(--line-strong)') + '"></i>'; }).join('') + '</div><p class="muted" style="font-size:12px;margin-top:8px">Sources: Health Connect, manual logs, Claude (MCP). No daily flags.</p></div>' +
        '</section></div>';
      const ops =
        '<div class="agrid"><section class="stack">' +
          '<div class="panel"><div class="panel-h"><h2>Orders</h2><button class="btn sm" data-act="sync">' + I('refresh') + ' Sync now</button></div>' +
            '<div style="padding:4px 0 14px"><div class="row between"><b>Flora · AIRGenomix</b><span class="mono muted">AGX-55120 · sent as ANGx146-F1</span></div>' +
            '<div class="stage-track">' + ['kit_requested', 'kit_dispatched', 'sample_collected', 'sample_received', 'result_received'].map(function (s, i) { return '<div class="' + (i < 3 ? 'done' : i === 3 ? 'cur' : '') + '">' + s.replace(/_/g, ' ') + '<small>' + ['4 Nov', '5 Nov', '14 Nov', '18 Nov', '—'][i] + '</small></div>'; }).join('') + '</div></div>' +
            '<div style="padding:14px 0;border-top:1px solid var(--line)"><div class="row between"><b>Origin · MedGenome → AIRGenomix</b><span class="pill good">parsed</span></div>' +
            '<div class="stage-track">' + ['kit_requested', 'kit_dispatched', 'sample_collected', 'sample_received', 'raw_data_sent', 'interpreting', 'result_received'].map(function (s) { return '<div class="done">' + s.replace(/_/g, ' ') + '</div>'; }).join('') + '</div>' +
            '<p class="muted" style="font-size:12px;margin-top:8px">innerOS never receives raw genotype data; MedGenome sends it directly to AIRGenomix (D43, D49).</p></div>' +
            '<div style="padding:14px 0 0;border-top:1px solid var(--line)"><div class="row between"><b>Vitals cycle 1 · Thyrocare DSA</b><span class="pill good">parsed</span></div><p class="muted" style="font-size:12px;margin-top:4px">TC-4401872 · collected 14 Oct 2026 · 124 markers · raw XML stored</p></div></div>' +
        '</section><section class="stack">' +
          '<div class="panel"><div class="panel-h"><h2>Plan & schedule</h2><span class="meta">Vitals Annual · anchored to collection</span></div>' +
            IO.client.vitalsPlan.map(function (p, i) { return '<div class="row between" style="padding:8px 0;border-top:1px solid var(--line);font-size:13px"><span>Cycle ' + (i + 1) + ' · ' + p.n + '</span><span class="num">' + p.d + '</span>' + (p.s === 'done' ? '<span class="pill good">done</span>' : p.s === 'next' ? '<span class="pill citron">next</span>' : '<span class="pill neutral">planned</span>') + '</div>'; }).join('') +
            '<p class="muted" style="font-size:12px;margin-top:8px">Reminder 30 days before · order created on the due date · ops can pause, skip, shift or order now.</p></div>' +
          '<div class="panel"><div class="panel-h"><h2>Shopify</h2><span class="meta">read-only mirror</span></div>' +
            [['#IF-10482', 'Vitals Annual Plan', '₹—'], ['#IF-10598', 'innerfree Origin', '₹—'], ['#IF-10677', 'innerfree Flora', '₹—'], ['#IF-10702', 'Signature Standard · subscription', 'active']].map(function (o) { return '<div class="row between" style="padding:7px 0;border-top:1px solid var(--line);font-size:13px"><span class="mono">' + o[0] + '</span><span class="grow">' + o[1] + '</span><span class="muted">' + o[2] + '</span></div>'; }).join('') + '</div>' +
          '<div class="panel"><div class="panel-h"><h2>Communications</h2></div><div class="feed">' + [['18 Nov', 'SAMPLE_RECEIVED · in-app'], ['5 Nov', 'KIT_DISPATCHED · email + in-app'], ['4 Nov', 'REPORT_READY · email + in-app']].map(function (r) { return '<div><time>' + r[0] + '</time><span>' + r[1] + '</span></div>'; }).join('') + '</div></div>' +
        '</section></div>';
      return shell('clients',
        '<div class="ahead"><div><a class="back-btn" href="#admin-clients">' + I('back') + ' Clients</a><h1>' + c.name + '</h1><div class="sub"><span class="mono">' + c.ref + '</span> · ' + (isA ? 'Female · 42 · Bengaluru · vegetarian' : c.plan) + ' · Shopify customer 7712049</div></div>' +
        '<div class="row" style="flex-wrap:wrap">' + LT(c.layers) + '<button class="btn sm" data-act="recompute">' + I('refresh') + ' Recompute</button><button class="btn sm" data-act="viewAs">' + I('eye') + ' View as client</button><button class="btn sm ink" data-act="newOrder">' + I('plus') + ' New order</button></div></div>' +
        '<div class="atabs" role="tablist"><button role="tab" data-act="atab" data-v="clinical" aria-selected="' + (tab === 'clinical') + '">Clinical</button><button role="tab" data-act="atab" data-v="ops" aria-selected="' + (tab === 'ops') + '">Operations</button></div>' +
        (tab === 'clinical' ? clinical : ops));
    }
  });
  IO.acts.atab = function (el) { S.adminTab = el.dataset.v; IO.render(); };
  IO.acts.recompute = function () { IO.toast('Recompute queued (202). The new release goes through review.', true); };
  IO.acts.newOrder = function () { IO.toast('409 — a Vitals order is already in flight for this client', true); };
  IO.acts.sync = function () { IO.toast('Sync job queued. Opening a client never calls a lab.', true); };

  /* ---------- Orders & kit dispatch ---------- */
  IO.def('admin-orders', {
    kind: 'page', title: 'Orders & kits',
    render: function () {
      const kits = A.orders.filter(function (o) { return o.status === 'kit_requested'; });
      return shell('orders',
        '<div class="ahead"><div><h1>Orders & kits</h1><div class="sub">Two API sources (Thyrocare DSA · AIRGenomix), manual upload as fallback</div></div><div class="search">' + I('search') + '<input placeholder="Search orders" aria-label="Search orders"></div></div>' +
        '<section class="panel" style="margin-bottom:14px;background:var(--tint-lime)"><div class="panel-h"><h2>Kit-dispatch queue</h2><span class="meta">Origin and Flora kits sent by the innerfree team</span></div>' +
          '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Client</th><th>Kit</th><th>Sample code</th><th>Ordered</th><th></th></tr></thead><tbody>' +
          kits.map(function (k, i) { const code = 'ANGx' + (150 + i) + '-' + k.product[0] + '1'; return '<tr><td><b class="mono">' + k.ref + '</b></td><td>' + k.product + '</td><td class="mono">' + code + '</td><td class="num">' + k.at + '</td><td style="text-align:right">' + (S.dispatched[k.ref] ? statusPill('kit_dispatched') : '<button class="btn sm ink" data-act="dispatchOpen" data-ref="' + k.ref + '" data-p="' + k.product + '" data-code="' + code + '">Record dispatch</button>') + '</td></tr>'; }).join('') +
          '</tbody></table></div></section>' +
        '<section class="panel"><div class="panel-h"><h2>All lab orders</h2><span class="meta">one in-flight order per client per layer</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Client</th><th>Product</th><th>Lab</th><th>Cycle</th><th>Status / stage</th><th>Source</th><th>Ordered</th><th>External ID</th></tr></thead><tbody>' +
          A.orders.map(function (o) { return '<tr><td class="mono">' + o.ref + '</td><td>' + o.product + '</td><td>' + o.lab + '</td><td class="num">' + o.cyc + '</td><td>' + (S.dispatched[o.ref] ? statusPill('kit_dispatched') : statusPill(o.status)) + '</td><td>' + o.src + '</td><td class="num">' + o.at + '</td><td class="mono">' + o.ext + '</td></tr>'; }).join('') +
        '</tbody></table></div></section>');
    }
  });
})();
