# Message Makeover

Say what you mean, the way you want it to sound.

A small message-rewriting app for people who want their draft to sound friendly, professional, or firm. Paste a draft, choose a tone and optional intent, review the rewrite, make your own edits, and copy it.

Built for the assignment in [question.txt](question.txt), which is the primary guideline. The project demonstrates a focused product decision and AI collaboration across planning, design, implementation, testing, debugging, and documentation. See [AI-JOURNAL.md](AI-JOURNAL.md) for actual decisions and [TEST-REPORT.md](TEST-REPORT.md) for verification results.

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

- Three tones: Friendly, Professional, Firm.
- Five intents: Keep original, Request, Follow up, Decline, Apologize.
- One rewrite and one short explanation, or a question if clarification is needed.
- Editable output; copy feedback and a manual fallback if the clipboard is blocked.
- Input limits, loading state, explicit retry, and protection against outdated responses.
- Keyboard-operable controls and responsive desktop/mobile layouts.

Messages stay in page memory and disappear on refresh. The app has no accounts, database, saved history, or sending integrations. Text is sent to OpenRouter and its selected provider when rewriting. The app does not log message bodies; provider policies are separate.

## Architecture and API

Next.js 16.4 App Router, React 19.3, strict TypeScript, plain CSS, Zod, Vitest, and Playwright. Dependencies are locked in `package-lock.json`.

The browser sends `POST /api/rewrite`:

```json
{ "draft": "Please send the file today.", "tone": "Professional", "intent": "Keep original" }
```

The endpoint returns one of:

```json
{ "status": "ok", "rewrite": "Could you please send the file today?", "explanation": "Made the request more courteous while retaining the deadline." }
```

```json
{ "status": "needs_clarification", "question": "Are you accepting or declining the invitation?" }
```

These are illustrative response examples, not recorded live model outputs.

Errors use `{ "error": { "code": "...", "message": "..." } }`: 400 for invalid input, 503 for configuration, 429 for provider limits, 502 for provider/response failures, and 504 for timeout. Successful responses include an `X-Rewrite-Model` header so evaluations can record the resolved model.

The key remains on the server. The adapter uses a 30-second timeout, separate system and user messages, JSON mode, and output validation. The input limit is 2,000 characters; outputs are limited to 4,000, explanations/questions to 300. The browser cancels stale requests and has a 35-second fallback timeout. There are no automatic retries.

The [runtime prompt](PROMPTS.md) asks the model to retain names, amounts, deadlines, negations, uncertainty, and commitments. Validation checks response structure and length; it cannot prove semantic correctness. Review the result before using it.

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

This sends six fictional test cases across all tones and records the resolved model, outputs, and expected facts in `evaluation-results.json`. Review the results manually for tone and preservation of meaning; HTTP success is not a semantic quality check. Free-model availability and quota may vary. No paid-model fallback is configured.

## Two-minute demo

1. Explain the problem: changing tone should not weaken a deadline or add a promise.
2. Load “A follow-up,” choose Professional, and rewrite it using a configured key.
3. Compare the original and result, checking “Alex” and “3 PM today.”
4. Edit the rewrite and copy it. Show a different tone or a clarification if time permits.
5. Show the actual scope correction and one tested implementation decision in the AI journal.

Live evaluation was pending at handoff because no key was configured. No deployment or user research has been performed. This is a local assignment prototype; public hosting would also need appropriate usage controls for its unauthenticated AI endpoint.
