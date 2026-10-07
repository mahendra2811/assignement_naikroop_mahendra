# Message Makeover — AI Collaboration Journal

This journal summarizes actual work recorded during development. It is written from the project owner's perspective for interview review. AI-generated code, testing, and analysis are credited explicitly; planned work is distinguished from completed work.

## My role and AI's role

I owned the product direction, scope, feature choices, and acceptance criteria. I chose Message Makeover, asked for a small one-day implementation, supplied the assignment as the primary guideline, approved the plan, configured the provider key locally, and directed subsequent UI and feature changes.

Codex helped explore alternatives, draft the plan and prompts, implement the application, propose and run checks, investigate failures, and prepare documentation. AI-assisted planning was part of the collaboration; I do not claim that all planning or code was written manually. The project demonstrates how I directed AI work and used evidence to guide iteration.

## 1. Ideation: correct the scope

**AI suggestion:** a larger workflow-oriented application, including a purchase-approval concept related to NaikFlow.

**My decision:** reduce the scope, permit an unrelated product, and choose Message Makeover. I wanted one useful problem solved well with a simple interface.

**Result:** one page with a complete paste-to-copy journey. The assignment was reread to confirm that it allows freedom of concept and technology.

## 2. Planning: turn the idea into constraints

**My direction:** follow question.txt, keep the application achievable in one day, and prepare a proper plan, prompts, and ordered steps before implementation.

**AI contribution:** drafted the plan, implementation instructions, runtime rewrite prompt, and acceptance checks.

**Accepted decisions:** preserve meaning, return one rewrite, explain the wording change, allow editing, and ask for clarification when intent conflicts. Defer accounts, storage, history, and sending integrations.

**Evidence:** [PLAN.md](PLAN.md) records the scope; [rewrite-prompt.ts](../src/lib/rewrite-prompt.ts) contains the runtime instructions. The working prompt document is retained locally in the ignored docs/ folder.

## 3. Design and development: implement the complete interaction

**My direction:** approve the implementation plan and keep the UI simple. Select OpenRouter and configure its key locally.

**AI contribution:** implemented the responsive two-panel screen, shared contracts, server endpoint, provider adapter, and client interaction states. It checked documentation and installed versions during implementation.

**Design choices:** a light background, white panels, teal accent, native radio inputs and selects, visible keyboard focus, and an editable result. The server keeps credentials private. Drafts remain in page memory.

**Result:** working input → rewrite → edit → copy, with clarification, retry, and safe errors. These behaviors are supported by the source code and tests.

## 4. Testing and debugging: check failure paths

**AI contribution:** proposed edge cases and implemented validation/API and browser tests. Checks include draft/output limits, unsupported options, missing configuration, provider failures, timeouts, stale responses, duplicate submissions, and clipboard rejection.

**Observed failures and corrections:**

- Lint rejected a plain home anchor; the implementation switched to Next.js Link.
- Browser error assertions also matched Next.js's route announcer; selectors were scoped to the input panel.
- Initial development-server browser checks encountered resource warnings and interaction failures; repeatable checks were moved to a separate production server with an empty provider key.
- Review found that an old copy-feedback timer could reset a newer status; timers are cleared when copying again or invalidating the result.

**Result:** repeatable automated checks passed. Browser fixtures are not presented as live AI evidence.

## 5. Live evaluation: inspect meaning, not just HTTP success

**My contribution:** configured the OpenRouter credential in the ignored local environment file.

**AI contribution:** ran six fictional cases across all tones, recorded resolved model names, and reviewed preservation of names, amounts, deadlines, refusals, apologies, uncertainty, and conflicting intent.

**Observed issue:** one initial response was incomplete and safely rejected. Another explanation overstated the actual wording change.

**Correction:** increased the bounded token allowance, requested low reasoning effort, and made explanation wording more concrete. A targeted retry succeeded. Because the free router selected a different model, this does not prove which change caused the recovery.

**Additional evidence:** a real browser rewrite, edit, and clipboard journey succeeded. See [evaluation-results.json](../evaluation-results.json). Reviews in that file are labeled agent reviews, not external user feedback.

## 6. Product iteration: respond to my requested changes

I asked for eight additional examples, then asked to hide all eleven examples behind a single clickable “Try an example” line with an arrow. AI implemented this with native details/summary and checked keyboard behavior and narrow layouts.

I then selected message length, message format, and grammar-only mode. AI implemented compact controls, backwards-compatible defaults, and server normalization so grammar-only ignores contradictory rewrite preferences. Other selections return when grammar-only is switched off.

**Live prompt failures:** the first email attempt omitted the required subject. A revised attempt added formatting but incorrectly used the recipient's name as a sender signature.

**Corrections:** explicitly require Subject/body formatting and prohibit a sign-off unless one exists in the draft. The final email check preserved uncertainty and dates without an invented signature. Its resolved model differed, so reliability remains limited evidence.

**Evidence:** all five preference-evaluation calls, including both failures, are retained in [preference-evaluation-results.json](../preference-evaluation-results.json).

## 7. Documentation and handoff

I requested an interviewer-ready account of what the project does, how I directed the work, how AI contributed, and where reviewers can find evidence. AI reorganized the documentation into a public submission set while preserving my ignored working documents.

During this handoff, build, lint, type checking, 29 unit/API tests, and 10 browser tests were rerun successfully. Relative documentation links were checked and the published runtime prompt was compared with the code.

The working prompt document was later moved into the ignored docs/ folder at my request. The application continues to use the runtime prompt in source code.

The final [README](../README.md) provides setup and a reading guide. The [test report](TEST-REPORT.md) separates automated and live results. The [demo guide](DEMO.md) explains a two-minute walkthrough.

## What this demonstrates

My contribution was choosing the problem, controlling scope, setting requirements, and directing refinements. AI contributed across ideation, planning, design, development, testing, debugging, documentation, and iteration. The important evidence is the working application, the decisions that changed its scope, and the real failures that led to revisions.

No external user research, independent human quality assessment, exact time log, or deployment is claimed.

## Iteration: improve length and format dropdowns

The user requested a better design and interaction for the message-length and message-format dropdowns. Codex implemented a reusable combobox/listbox component with icons, option descriptions, selected checkmarks, and keyboard navigation. The existing state invalidation and grammar-only behavior remain connected to the same API contract. Browser checks verified keyboard selection, Escape and outside dismissal, Tab, one open menu, preference submission, and mobile bounds. Visual review at 320px showed cramped option text, so the popups were widened and the format popup aligned to the right. Build, lint, type checking, 29 unit/API tests, and 11 browser tests passed. This was a UI iteration; no new provider evaluation or screen-reader audit was performed.
