# innerOS — Research & UX plan for the front-end prototype

Source: *innerfree Nutrition · innerOS BRD V2.8* (BRD-INNEROS-PROD-2026-V2.8, 21 Nov 2026) and the innerfree Shopify site in design.
Goal of this prototype: a clickable, front-end-only overview of innerOS that shows the client experience and the staff console well enough to win the build. No backend; all data is mock.

---

## 1. What the BRD asks for, in one page

innerOS is innerfree's operating system for personalised nutrition. A client buys on Shopify, innerOS orders the lab work, tracks samples, ingests results from four layers, scores them on one 0–10 scale, routes every release through advisor review, and serves one approved snapshot to the client app.

| Layer | Product | What the client sees |
|---|---|---|
| Blood | innerfree **Vitals** (3 cycles: Baseline M1 · Response M6 · Direction M9) | Marker scores, targets, innerAge |
| Genetics | innerfree **Origin** (once per lifetime, kit) | Trait tendencies, Genetic Potential Index (GPI) |
| Gut | innerfree **Flora** (kit) | Gut IQ zones, pathways, CFI gut share |
| Food | innerfree **Sense** (IgG + IgE panels) | Avoid / Minimise / Prioritise food map |

Two audiences, two surfaces:

* **Client app** (mobile-first, 390 × 844): Home · Biology · Coach (raised centre) · Track · Plan, plus a side menu (§20.5). Nine-step onboarding ending on innerAge (§20.6).
* **Admin console** (desktop): Dashboard with four exact tiles, Review queue, Clients, Client page (Clinical / Operations tabs), Orders & kit dispatch, Alerts, Tables, Audit, Settings (§2).

Rules that shape every screen:

* One scale: **0–10, one decimal**, four bands — **Attention 0–3.9 · Improve 4.0–5.9 · Maintain 6.0–7.9 · Good 8.0–10** (§8.1). Never 0–100, never "points" for scores.
* Segment names and colours appear **only on the Shop screen** (§3.9, §14).
* No lab partner names in client screens ("our partner lab"). No prices in copy except Shop "approx." values.
* FSSAI language only: *supports*, *may help* — never treat, cure, diagnose, prevent. innerAge: never "reverse your age" / "get younger"; an older result uses neutral ink, never alarm red (§20.3).
* No passwords anywhere. Client sign-in: **mobile OTP (primary), Google, Apple** (§20.4). Staff: email + TOTP.
* A layer that is missing is a **locked card** with a personal reason, never an empty chart (§3.3, §3.13). A daily pillar with no data shows the action that fills it, never a zero (§19.1).
* Brand: **Ink & Citron**, Fraunces (headlines, hero numerals), Instrument Sans (UI), Anek Devanagari (Hindi). Citron is the single primary-action colour (§14, §20.7).

**Added by innerfree (client note):** signing in on the innerfree Shopify store also signs the member into innerOS. The prototype shows this as a store-account "Open innerOS" hand-off (the BRD's optional `POST /auth/shopify`, §3.1) alongside OTP / Google / Apple.

---

## 2. Research findings applied

| Pattern | Evidence | How innerOS uses it |
|---|---|---|
| One headline score built from named contributors, with progressive disclosure | Oura Readiness = 7 contributors in 3 pillars; Whoop Recovery leads the home screen and drives the day's guidance ([Oura](https://ouraring.com/blog/readiness-score/), [UX Collective on Whoop](https://uxdesign.cc/whoop-or-how-to-gamify-training-3-6-billion-product-playbook-2a1380971b88)) | innerScore ring with five pillar segments; tap for each pillar. innerAge hero always paired with its top drivers. |
| Composite scores lose trust when they can't be explained | 2025 review of composite health scores; user-override cases ([De Gruyter](https://www.degruyterbrill.com/document/doi/10.1515/teb-2025-0001/html?lang=de), [arXiv](https://arxiv.org/pdf/2503.19132)) | Every number shows "why" one tap away; "Calibrating" state instead of a fake score; dated insights. |
| Marker cards with an optimal band inside the reference band | InsideTracker's bloodwork redesign ([InsideTracker blog](https://blog.insidetracker.com/introducing-insidetrackers-new-bloodwork-page)) | Marker band component: reference zone, optimal zone, value dot, plus current → target and responsiveness label. |
| Results grouped by organ system | Function Health dashboard ([write-up](https://medicalnewstoday.us/?p=4355)) | 17 body systems sorted weakest first, GPI vs CFI bars. |
| Biological age = headline number + drivers + "estimate" caveat | PhenoAge apps (Lifetimer, Gradual, My Bio Age) ([App Store](https://apps.apple.com/app/id6772128982)) | innerAge reveal and detail: plain sentence first, calendar age beside it, "about +1.2 yrs from RDW" drivers, recheck date. |
| Ask for permissions in context, after explaining the benefit; graceful decline | Apple HIG onboarding, Android Health Connect, NN/g (+12% grant rate with a reason) ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/onboarding), [Health Connect](https://developer.android.com/health-and-fitness/health-connect/ui/onboard-users), [NN/g](https://www.nngroup.com/articles/permission-requests/)) | Step 7 priming screens, one permission per screen, "Not now" always visible; two separate consents each with Decline (DPDP). |
| Standardised, plain consent screens | 2024 study on health-app consent design ([Springer](https://link.springer.com/article/10.1007/s44206-024-00135-w)) | Consent cards list *what is sent, to whom, retention, training* in fixed rows. |
| Review queues: abnormal first, context beside the result, final audited actions | Ontada sign queue, Junction results dashboard, UiPath clinical review ([Ontada](https://guide.ontada.com/?p=574), [Junction](https://support.junction.com/articles/7187626147-results-dashboard), [UiPath](https://docs.uipath.com/de/industry-department-solutions/automation-cloud/latest/healthcare-user-guide/clinical-review-reference)) | Review queue sorted worst severity → oldest; side-by-side review page; Approve requires ticking each CRITICAL alert; Reject needs a reason code + ≥ 20-char note. |

---

## 3. Information architecture (prototype scope)

Only the pages needed to tell the story are built. Everything else in the nav is visible but marked "Full build".

```
Prototype hub
├─ innerfree store account (Shopify)  → "Open innerOS" → hand-off → Home
├─ Client app (phone frame on desktop, full screen on phone)
│  ├─ Onboarding (9 steps)
│  │  1 Splash · 2 Intro ×3 · 3 Sign in (OTP / Google / Apple / innerfree store)
│  │  + OTP verify · 4 Coach welcome + language · 5 Profile basics
│  │  6 Two consents · 7 Permission priming · 8 innerfree Roadmap · 9 innerAge reveal
│  ├─ Home        innerAge hero → Ask coach → Roadmap → innerScore → daily actions
│  │              (points, streak) → doses due → tracking ribbon → next recheck
│  ├─ Biology     Overall index · layer strip · 17 systems · System detail · Marker detail
│  ├─ Coach       Chat, suggested questions from drivers, advisor hand-off
│  ├─ Track       innerScore pillars · meals · water · body signals · Log meal (Sense badges)
│  ├─ Plan        Daily actions · Food map · Signature Basic/Standard/Premium (segments here only) · Recheck ribbon
│  └─ Me          Layers & reports · consents · Connected AI apps (MCP, V2.8)
└─ Admin console (desktop)
   ├─ Staff sign-in (email + authenticator code)
   ├─ Dashboard   4 tiles · orders by status · pending review · recent activity
   ├─ Review queue → Review detail (side by side, approve / reject)
   ├─ Clients     list with layer tiles, plan, next due, release status
   ├─ Client page Clinical tab · Operations tab (two-hop Origin tracker)
   └─ Orders      orders + kit-dispatch queue
```

Demo persona: **Ananya Rao**, 42, Bengaluru, vegetarian. Vitals Baseline + Origin + Sense released; Flora kit in progress (sample received). innerAge 38.4.

---

## 4. Design system

| Token | Value | Use |
|---|---|---|
| Ink | `#1F2121` | Hero sections, text, splash |
| Paper | `#F6F6F1` | App background ("paper-white") |
| Citron | `#D2E055` | The single primary action colour and accent |
| Status | Attention `#C4432F` · Improve `#C98A0B` · Maintain `#3F7CB0` · Good `#3A9460` | Pills, bands, tally — never equal to a segment colour |
| Segments (Shop only) | DEFEND `#4A1D96` · BALANCE `#7E011F` · ENHANCE `#C2410C` · CLARITY `#814000` · ENERGY `#02654E` · REJUVENATE `#1E3A5F` | §14 v2 palette |
| Type | Fraunces 300 for hero numerals, 500 headings · Instrument Sans 400–600 UI · Anek Devanagari for Hindi | §14 |

Seven shared components from §3.4 are built once and reused: hero score card, status pill, 4-band tally, marker band, system row, locked card, cycle ribbon. Light and dark themes are both supported.

---

## 5. Visual direction — from the Pinterest references

The client shared a board of health-dashboard references. What we took from it, and what we avoided:

**Adopted**
* **Ink + citron + white bento.** The strongest references mix one black card, one lime card and white cards on a soft grey canvas, which is innerfree's own Ink & Citron palette. Cards are separated by fill, not borders.
* **Photography inside cards.** A landscape or food photo as a hero card with a white pill button and a round citron arrow, instead of illustrations or 3D organs.
* **Pastel tint per metric.** Sleep (lilac), Nutrition (peach), Activity (mint), Recovery (sky) and Protocol (lime) each keep one tint. Tints are identity only and never carry status, so they can't clash with the four status colours.
* **Big light numerals, small labels.** Fraunces Light for hero numbers (innerAge, innerScore, tiles), with Instrument Sans for labels.
* **Floating black sidebar rail and black pill tabs** in the admin console; the active item turns citron.

**Avoided (reads as generic or AI-made)**
* 3D anatomy renders and glowing organs, which also risk over-claiming clinically.
* Purple-blue gradients, glassmorphism and neon dark dashboards.
* Accent rails on rounded cards, the same border and shadow on every box, emoji markers and everything centred.
* Chart-heavy screens without a sentence that says what the number means. Every number in innerOS comes with its plain-language reading.

## 6. What is intentionally out of scope

Backend, real auth, lab integrations, PDF filling, lookup-table editor, audit log, settings, MCP server. The screens that depend on them show realistic mock states so the flow reads end to end.
