# Message Makeover — Verification Report

Date: 7 October 2026. Primary guideline: [question.txt](question.txt).

## Results

| Check | Observed result |
|---|---|
| TypeScript | `npm run typecheck` passed |
| Lint | `npm run lint` passed |
| Production build | `npm run build` passed; page prerendered, rewrite API dynamic |
| Unit/API tests | `npm test`: 26 tests passed across two files |
| Chromium browser tests | `npm run test:e2e`: 8 tests passed |
| Visual review | Desktop screenshot at 1280px and mobile at 390px inspected; stacked mobile panels and no horizontal overflow; 320px width also checked |
| Runtime dependencies | `npm audit --omit=dev`: zero reported vulnerabilities |
| Live AI evaluation | Pending: no `OPENROUTER_API_KEY` configured; evaluation command made no model calls |

## What automated checks establish

**Unit/API tests:** draft limits including exactly 2,000 characters; invalid options and extra fields; response structure and bounds; success and clarification contracts; configured/default model selection; separate system/user data; bearer auth and JSON mode; missing credentials; provider authorization/payment/rate-limit errors; malformed/truncated output; network failure; 30-second timeout; sanitized errors and resolved-model header.

**Browser tests:** paste-to-result flow with fictional intercepted responses; editing and copying the edited text; clearing output after intent changes; clarification and focus return; retry without losing input; empty input and character limit; blocked duplicate submission and cancellation of stale results; clipboard failure/manual selection; native radio keyboard navigation; desktop/mobile layout. One real local API check confirms the missing-key error.

The browser suite uses a dedicated production server with an empty key, so it never intentionally calls a live model. Fixture strings retaining a deadline do not demonstrate that the real model preserves deadlines.

## Actual debugging and iteration

- Lint rejected an ordinary anchor to `/`; switched to Next.js `Link` and reran lint.
- The first browser attempt used the development server and encountered blocked dev-resource warnings and unresponsive interaction checks. Set explicit local development origin/project root and made the repeatable browser suite target the production build. The production interaction checks passed.
- Two error assertions matched both the application alert and Next.js's route-announcer alert. Scoped the assertions to the input panel; all eight browser tests passed.
- Copy feedback now clears old timers so an earlier success cannot reset the status of a newer copy attempt.
- Added a 320px layout rule and checked narrow-screen overflow. Increased the provider disclosure text size and replaced an absolute factual-preservation claim with “Your meaning comes first.”

## Limits and remaining checks

- Live tone quality, factual preservation, and model-driven clarification are unverified. `npm run evaluate` provides six fictional cases for review after credentials are configured.
- No usability sessions with external users, non-Chromium browser checks, screen-reader testing, or production deployment have been performed.
- Full development dependency audit reports five high findings from the ESLint configuration's transitive `braces`/glob chain. The current `braces` release is affected; no compatible patched release was available in the registry during this build. Runtime audit is clean. A forced downgrade of the Next.js lint configuration was not applied.
- The free router can select different models; the evaluation records the resolved model. Model behavior is not guaranteed by schema validation.
