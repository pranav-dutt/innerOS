# innerOS — front-end prototype

A clickable, front-end-only overview of **innerOS**, innerfree Nutrition's health operating system, built from *BRD V2.8*. It has no backend; all data is mock and the photos are stock (Pexels) placeholders for the commissioned shoot.

## What's in it

| Surface | Pages |
|---|---|
| **innerfree store hand-off** | Shopify account page → "Open innerOS" → signed straight in (no second login) |
| **Member app** (phone frame on desktop, full screen on phones) | 9-step onboarding: splash, intro, sign-in (mobile OTP · innerfree store account · Google · Apple), OTP, coach welcome + language, profile, two consents, permission priming, roadmap, innerAge reveal |
| | Home · innerAge detail · Biology (17 systems) · System detail · Marker detail · Genetics · Coach · Track · Log meal · Plan (food map, routine, rechecks) · Shop (Signature tiers, the only screen with segments) · Me · Connected AI apps |
| **Admin console** | Staff sign-in (email + authenticator) · Dashboard · Review queue · Review release (approve gate, reject with reason) · Clients · Client page (Clinical / Operations) · Orders & kit dispatch |

The research, information architecture and design decisions are in [`docs/RESEARCH_AND_UX_PLAN.md`](docs/RESEARCH_AND_UX_PLAN.md).

## Run it

It's plain HTML, CSS and JavaScript, so there is no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. Any static host (Netlify, Vercel, GitHub Pages, S3) works as is.

## Structure

```
index.html              entry point
assets/css/styles.css   design tokens (Ink & Citron, Fraunces / Instrument Sans) + components
assets/js/data.js       mock member, markers, systems, food map, admin data; BRD scoring rules
assets/js/main.js       hash router, phone stage, hub, store hand-off
assets/js/client.js     member app screens
assets/js/admin.js      admin console screens
assets/img/             stock photography (placeholders)
docs/                   research and UX plan
```

Scores shown in the app follow the BRD's own rules (six-anchor marker scoring, target formula, System Index and Gap), so the numbers are internally consistent. For example, Vitamin D 22 ng/mL scores 3.6 and ApoB 112 mg/dL scores 4.8, matching the BRD acceptance tests.
