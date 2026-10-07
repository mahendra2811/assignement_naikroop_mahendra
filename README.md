# Message Makeover

**A small AI-assisted application for improving message wording while keeping the intended meaning.**

Paste a draft, choose tone and intent, set length and format, generate one rewrite, review the explanation, edit the result, and copy it. Grammar-only mode provides minimal corrections instead of a full makeover.

## Project ownership and AI collaboration

I chose Message Makeover, constrained it to a simple one-day project, and directed the requirements and later refinements. My goal was one complete, useful interaction that I could explain and demonstrate clearly.

I used Codex as a development partner across idea exploration, planning, prompt preparation, design, implementation, testing, debugging, and documentation. AI helped draft the plan and generated implementation and tests; I provided product direction, scope corrections, feature selections, and local provider configuration. The [AI journal](submission/AI-JOURNAL.md) records this division of work and the actual revisions.

## Reading guide for the interviewer

Start with this README for the product, setup, and architecture. Then read the plan and journal for the decision-making process; use the prompt and test report to inspect implementation and evidence.

| File | What it contains | When to read it |
| --- | --- | --- |
| [question.txt](question.txt) | Original assignment and evaluation criteria | To understand the primary guideline |
| [PLAN.md](submission/PLAN.md) | Product choice, research summary, scope, decisions, and delivery sequence | To understand why this application was built this way |
| [AI-JOURNAL.md](submission/AI-JOURNAL.md) | My direction, AI contributions, real failures, corrections, and iterations | To assess AI use throughout the SDLC |
| [PROMPTS.md](submission/PROMPTS.md) | Consolidated build instructions, exact runtime prompt, and response handling | To review prompt design and how it connects to the code |
| [TEST-REPORT.md](submission/TEST-REPORT.md) | Automated checks, live evaluation, actual outcomes, and limitations | To judge what has been verified |
| [DEMO.md](submission/DEMO.md) | Two-minute walkthrough and interview discussion points | To review the working application efficiently |
| [evaluation-results.json](evaluation-results.json) | Original live cases, resolved models, initial failure, retry, and real browser journey | To inspect raw provider evidence |
| [preference-evaluation-results.json](preference-evaluation-results.json) | Live length/format/grammar cases, including email failures and prompt revisions | To inspect the later feature evaluations |

The interviewer-facing documents are in `submission/`. Local working documents in `docs/` are intentionally ignored and are not required to review or run the project.

## How this addresses the assignment

The primary guideline is [question.txt](question.txt), which allows any product and technology while emphasizing creativity, execution, and an AI-Native SDLC.

| Expectation | Evidence in this project |
| --- | --- |
| Creativity and user needs | A focused message-writing problem, with tone control and meaning-preservation goals |
| Product thinking | A single-page scope, editable output, clarification, and deliberate exclusions |
| Problem-solving | Validation, safe failures, duplicate/stale-response handling, and real prompt corrections |
| AI across the lifecycle | Stage-by-stage journal covering ideation through iteration |
| Working execution | Locally runnable application, live provider evidence, and 39 passing automated tests |
| Strategy and decisions | Rejection of excessive initial scope and incremental feature additions |

## Run locally

Use Node.js 24 LTS and npm.

```bash
npm ci
cp .env.example .env.local
```

Edit `.env.local` on your machine:

```dotenv
OPENROUTER_API_KEY=your-key-here
OPENROUTER_MODEL=openrouter/free
```

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). Restart the server after changing environment configuration. Without a key, the screen works and the rewrite action shows a setup error; it never returns fabricated AI results.

For a production build:

```bash
npm run build
npm start
```

## What it does

- A collapsed “Try an example” picker with eleven clickable examples: follow-up, refusal, apology, payment reminder, leave request, meeting invite, rescheduling, feedback, thanks, deadline update, and customer reply. Each fills the draft and selects its matching intent.
- Three tones: Friendly, Professional, Firm.
- Five intents: Keep original, Request, Follow up, Decline, Apologize.
- Message length: Short, Balanced (default), Detailed.
- Message format: Chat message (default), Email with a subject and body.
- Grammar-only mode: correct mistakes with minimal wording changes. Other controls are disabled while this is on; their previous selections return when switched off.
- One rewrite and one short explanation, or a question if clarification is needed.
- Editable output; copy feedback and a manual fallback if the clipboard is blocked.
- Input limits, loading state, explicit retry, and protection against outdated responses.
- Keyboard-operable controls and responsive desktop/mobile layouts.

Messages stay in page memory and disappear on refresh. The app has no accounts, database, saved history, or sending integrations. Text is sent to OpenRouter and its selected provider when rewriting. The app does not log message bodies; provider policies are separate.

## Architecture and API

Next.js 16.4 App Router, React 19.3, strict TypeScript, plain CSS, Zod, Vitest, and Playwright. Dependencies are locked in `package-lock.json`.

The browser sends `POST /api/rewrite`:

```json
{ "draft": "Please send the file today.", "tone": "Professional", "intent": "Keep original", "length": "Balanced", "format": "Chat message", "grammarOnly": false }
```

The three new preferences are optional in API requests and default to Balanced, Chat message, and false. When grammarOnly is true, the server normalizes the other preferences and the prompt preserves the original style and layout. Detailed mode may keep a short draft short when there is no extra information to expand.

The endpoint returns one of:

```json
{ "status": "ok", "rewrite": "Could you please send the file today?", "explanation": "Made the request more courteous while retaining the deadline." }
```

```json
{ "status": "needs_clarification", "question": "Are you accepting or declining the invitation?" }
```

These are illustrative response examples, not recorded live model outputs.

Errors use `{ "error": { "code": "...", "message": "..." } }`: 400 for invalid input, 503 for configuration, 429 for provider limits, 502 for provider/response failures, and 504 for timeout. Successful responses include an `X-Rewrite-Model` header so evaluations can record the resolved model.

The key remains on the server. The adapter uses a 30-second timeout, separate system and user messages, JSON mode, low reasoning effort with a bounded 4,000-token total allowance, and output validation. The input limit is 2,000 characters; outputs are limited to 4,000, explanations/questions to 300. The browser cancels stale requests and has a 35-second fallback timeout. There are no automatic retries.

The [runtime prompt](submission/PROMPTS.md) asks the model to retain names, amounts, deadlines, negations, uncertainty, and commitments. Validation checks response structure and length; it cannot prove semantic correctness. Review the result before using it.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests start a separate production server on port 3001, with the provider key deliberately blank. Rewrite responses are intercepted with fictional fixtures in UI tests. The missing-key endpoint check uses the real local API. These tests do not spend provider credits and do not establish live model quality.

For real provider evaluation, start the app on port 3000 with a valid key, then run:

```bash
npm run evaluate
```

This overwrites `evaluation-results.json`; preserve the submitted evidence before running it again. It sends six fictional test cases across all tones and records the resolved model, outputs, and expected facts in `evaluation-results.json`. Review the results manually for tone and preservation of meaning; HTTP success is not a semantic quality check. Free-model availability and quota may vary. No paid-model fallback is configured.

## Two-minute demo

1. Explain the problem: changing tone should not weaken a deadline or add a promise.
2. Expand “Try an example,” load “A follow-up,” choose Professional, and rewrite it using a configured key.
3. Compare the original and result, checking “Alex” and “3 PM today.”
4. Edit the rewrite and copy it. Show a different tone or a clarification if time permits.
5. Show the actual scope correction and one tested implementation decision in the AI journal.

Live evaluation was completed after the user configured the key. Six fictional cases were exercised, with one initially incomplete response safely rejected and a successful targeted retry. A real browser rewrite/edit/copy journey also passed. See [evaluation-results.json](evaluation-results.json) for the original outcomes and agent review, and the [test report](submission/TEST-REPORT.md) for the later feature checks. No deployment or user research has been performed. This is a local assignment prototype; public hosting would also need appropriate usage controls for its unauthenticated AI endpoint.

## Source-code guide

| File | Responsibility |
| --- | --- |
| [message-makeover.tsx](src/components/message-makeover.tsx) | Form state, examples, preferences, cancellation, editable result, and copying |
| [globals.css](src/app/globals.css) | Visual styling, responsive layout, and focus states |
| [route.ts](src/app/api/rewrite/route.ts) | POST endpoint, validation, safe error responses, and resolved-model header |
| [contracts.ts](src/lib/contracts.ts) | Request/result schemas, limits, defaults, and grammar-only normalization |
| [openrouter.ts](src/lib/openrouter.ts) | Server-side provider call, authentication, timeout, and output checks |
| [rewrite-prompt.ts](src/lib/rewrite-prompt.ts) | Runtime system prompt used by the provider adapter |
| [contracts.test.ts](tests/contracts.test.ts) and [api.test.ts](tests/api.test.ts) | Unit and API-boundary verification |
| [makeover.spec.ts](tests/browser/makeover.spec.ts) | Browser interaction, keyboard, mobile, error, and clipboard checks |

## Current delivery status

The local application is complete for the agreed scope. Build, lint, type checking, 29 unit/API tests, and 10 browser tests passed. Live provider calls were also evaluated separately with fictional messages. Prompt compliance and meaning preservation still require user review; the free router can select different models.

The setup, decisions, prompts, AI collaboration, verification, and demo are included in this repository. Production deployment and external user testing have not been performed.
