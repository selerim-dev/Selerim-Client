# Selerim agency website

Next.js 15 App Router marketing website for https://www.selerim.com. The deployment root is `agency-website/` inside `selerim-dev/Selerim-Client`.

## Develop and verify

Use Node 22.18+ (or Node 24 LTS) for the TypeScript test runner.

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
npm start
```

Content lives in `src/lib/marketing.ts`; shared page sections are in `src/components/marketing/`. The design uses Inter Tight, Instrument Serif, and the existing Selerim light/dark palette. Motion is progressive enhancement: server-rendered text is visible without JavaScript and reduced-motion users get static content.

## Lead capture

The browser validates `src/lib/intake-schema.ts` before submitting directly to Web3Forms over HTTPS, as required by its free integration. It never sends intake data to an AI model. The existing `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` must be configured in the Vercel project. This provider access key is intended for browser use; do not commit its value. The provider performs server-side spam checks. A honeypot, required-field validation, bounded inputs, and duplicate-submit prevention are included. Missing configuration and provider failures show an actionable error rather than false success. The UI retains entered values and provides a direct email fallback.

Tests mock the external delivery service. They never send inquiry emails. The form success message sets a 24-hour personal-response expectation and describes scope agreement, invoice, and kickoff. No payment is collected on the website.

## Publishing content

- All prices and offer durations are defined centrally; keep USD, scope, dependencies, and third-party costs explicit.
- Concept builds must stay labeled as concepts. Proposed metrics are not measured outcomes. No client names or testimonials should be published without verified facts and permission.
- Video areas are placeholders until an actual concept walkthrough is available. Use an accessible, click-to-load player when adding video.
- Retired `/success` redirects to `/case-studies`. Parked portal pages are noindex and excluded from the sitemap. `/api/strategy` is retired with HTTP 410.
- The production site is connected to the repository's `main` branch in Vercel. Verify the preview/build before publishing, then check the custom domain and intake validation behavior.

## Release verification

The September 2026 overhaul was checked at 320, 390, 768, and 1440px widths.
The nine public pages passed automated WCAG A/AA checks. Keyboard menu focus,
Escape/focus restoration, dark mode, reduced motion, and intake validation,
provider failure, and confirmation states were exercised in Chromium.
Form delivery tests intercept the provider request; they do not verify receipt
in the business inbox. Concept videos and measured results remain explicitly
unpublished placeholders until genuine evidence is available.
