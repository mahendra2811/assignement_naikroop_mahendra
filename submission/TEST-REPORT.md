# Message Makeover — Verification Report

Verified on 7 October 2026. This report separates implementation tests from recorded live model evaluations. No new live-provider evaluation was performed during the documentation handoff.

## Automated verification

| Command/check | Result | What it establishes |
| --- | --- | --- |
| `npm test` | 29 tests passed in two files | Request/result validation and API/provider behavior |
| `npm run lint` | Passed | Configured ESLint checks |
| `npm run typecheck` | Passed | Strict TypeScript compilation checks |
| `npm run build` | Passed | Production build; page prerendered, rewrite endpoint dynamic |
| `npm run test:e2e` | 10 Chromium tests passed | Browser interactions against a dedicated production server |
| Visual and layout review | Desktop/mobile screenshots inspected; 390px and 320px checked for overflow | Observed responsive layout and visible controls |

Build, lint, type checking, unit/API tests, and browser tests were rerun when preparing this submission. The visual review was performed during feature implementation.

### Unit/API coverage

- Draft boundaries, including exactly 2,000 characters; unsupported options and extra fields.
- Preference defaults, valid enums, invalid values, and grammar-only normalization.
- Rewrite/clarification contracts, nonempty fields, and output bounds.
- Separate system/user messages, bearer authentication, JSON mode, configured/default model, and resolved-model header.
- Missing key, provider authorization/payment/rate-limit failures, malformed or incomplete results, network failure, and 30-second timeout.

### Browser coverage

- Rewrite, edit, and copy the edited text; clear obsolete output after input/preferences change.
- Preserve the draft through clarification, errors, and explicit retry.
- Prevent duplicate submission and discard a delayed response after editing the draft.
- Enforce the draft limit and handle clipboard rejection by selecting text for manual copying.
- Keyboard expansion/collapse of the eleven-example picker, radio navigation, desktop/mobile layouts, and safe errors for unexpected transport content.
- Submit length/format choices; pause controls in grammar-only mode; submit normalized preferences and restore remembered choices afterward.

The browser server deliberately has an empty provider key. Most responses are fictional intercepted fixtures; the missing-configuration check uses the real local endpoint. These tests verify application behavior and do not establish live model quality.

## Recorded live-provider evaluation

| Evidence | Calls and observations |
| --- | --- |
| [evaluation-results.json](../evaluation-results.json) | Six initial fictional cases across all tones, one targeted retry, and a separately recorded real browser rewrite/edit/copy journey |
| [preference-evaluation-results.json](../preference-evaluation-results.json) | Five calls across short chat, detailed email, and grammar-only scenarios, including two email correction retries |

The initial cases included a name/deadline, an amount and refusal to extend, a refusal, an existing apology, an uncertain commitment, and conflicting intent. Five initial responses were valid. One incomplete response was safely rejected; its targeted retry succeeded. Successful results were agent-reviewed for the specified details. Conflicting intent produced a clarification question.

A real browser journey also received a live rewrite, edited it, and verified clipboard contents without observed browser runtime errors.

## Failures and resulting changes

| Observation | Change and observed retest |
| --- | --- |
| Incomplete provider response | Requested low reasoning effort and increased the bounded allowance to 4,000 tokens; targeted retry succeeded |
| Explanation claimed a reordering that did not occur | Prompt now asks for a concrete change and disallows unsupported claims |
| Email returned without a subject | Explicitly required a Subject line and a separate body |
| Email used the recipient as a sender signature | Required omission of sign-offs unless already in the draft; final email had no invented signature |
| Browser selector matched the route announcer | Scoped assertions to the input panel; checks passed |
| Earlier copy timer could reset a newer status | Cleared timers when copying again or invalidating a result |

Resolved free-router models varied, including between retries. These results cannot isolate prompt/configuration changes as the sole cause of improvement. Both failed email outputs and the initial incomplete response remain in the evaluation records.

## Limits

Schema validation checks structure and lengths, not semantic correctness. The small live sample does not prove reliable factual preservation, format compliance, or tone quality on unseen messages. Recorded semantic reviews are agent reviews, not independent human assessments.

No external user sessions, screen-reader audit, non-Chromium browser suite, or production deployment was completed. Public hosting would require appropriate usage controls for the unauthenticated provider-backed endpoint.

During the earlier implementation audit, runtime dependencies had zero reported vulnerabilities; the full development audit reported five high findings in the ESLint configuration's transitive braces/glob chain. A forced lint-configuration downgrade was not applied. That is a historical audit result, not a fresh security assessment for this documentation handoff.

## Reproduce the checks

Follow [local setup](../README.md#run-locally), then run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

For a new live evaluation, start the app on port 3000 with a valid local key and run `npm run evaluate`. The script sends six fictional messages and **overwrites** `evaluation-results.json`; preserve the existing submission evidence before rerunning it. It does not reproduce the later preference retries or browser journey. HTTP success alone is insufficient: inspect the output and record semantic review separately.
