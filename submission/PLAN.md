# Message Makeover — Product and Delivery Plan

This is the final scope and decision summary. The original assignment is [question.txt](../question.txt); implementation instructions and the runtime prompt are in [PROMPTS.md](PROMPTS.md).

## Why I chose this project

I wanted a small application that I could complete and explain clearly within a one-day scope. The user problem is straightforward: a person knows what they want to say but needs help wording it appropriately. Changing tone should not accidentally change a deadline, weaken a refusal, or add a promise.

The initial AI-assisted exploration included purchase approvals, SOP-to-workflow generation, and onboarding coordination. I rejected that larger scope and clarified that the project could address any useful problem. I selected Message Makeover and directed the work toward one complete interaction:

**Paste → choose preferences → rewrite → review and edit → copy.**

This problem is a product hypothesis. I did not conduct external user interviews or claim market validation.

## Assignment research and connection

The planning research used public first-party website content from [Naikroop](https://naikroop.com/), its [NaikFlow overview](https://naikroop.com/naikflow), and [NaikFlow](https://naikflow.com/). The research summary described no-code application development, visual process design, automation, and AI assistance. It did not include a hands-on platform trial.

My takeaway was to demonstrate the full journey from an idea to usable software, with AI involved throughout that journey. The assignment permits freedom of product and technology, so I chose a focused communication tool rather than recreating NaikFlow.

## Final scope

| Area | Delivered behavior |
| --- | --- |
| Input | Draft up to 2,000 characters; eleven fictional examples in a collapsed picker |
| Tone | Friendly, Professional, Firm; Professional by default |
| Intent | Keep original, Request, Follow up, Decline, Apologize |
| Length | Short, Balanced, Detailed; Balanced by default |
| Format | Chat message or Email; Chat message by default |
| Grammar only | Minimal corrections; other controls pause and their choices are remembered |
| Output | One editable rewrite and a short explanation, or one clarification question |
| Completion | Copy the edited result; manual selection if clipboard permission fails |
| Failure handling | Helpful errors, preserved input, explicit retry, cancellation of stale results |
| Layout | One page, desktop columns, stacked mobile panels, keyboard-operable controls |

I excluded accounts, a database, saved history, automatic sending, and integrations. This kept the work focused on a usable end-to-end experience.

## Delivery sequence

1. Read the assignment, compare ideas, choose the product, and constrain the scope.
2. Prepare AI-assisted planning and implementation prompts with explicit acceptance criteria.
3. Build the responsive screen and the interaction states.
4. Integrate OpenRouter through a server endpoint with input/output validation.
5. Complete editing, clarification, copying, errors, retry, and stale-response handling.
6. Test the implementation, evaluate live fictional messages, and revise observed failures.
7. Add the requested examples and preferences, verify them, and prepare the submission documents.

These are the actual stages of the work, not measured time entries. The original estimate was approximately five focused hours; no exact time log was recorded.

## Technical decisions

| Decision | Reason |
| --- | --- |
| Next.js, React, strict TypeScript | UI and server endpoint in one small application, with checked data contracts |
| Plain CSS and native form controls | Simple styling, responsive layout, and built-in keyboard behavior |
| Zod validation | Reject unsupported inputs and malformed model responses |
| OpenRouter with configurable model | One provider adapter; `openrouter/free` is the default |
| Separate system prompt and user JSON | Keep rewrite instructions separate from the draft being rewritten |
| Page memory only | Avoid persistence and account complexity in this assignment |
| Vitest and Playwright | Check API boundaries and the complete browser interaction separately |

## Completion and limits

The application runs locally, has verified live provider calls, and has passed build, lint, type checking, and 39 automated tests. Details are in [TEST-REPORT.md](TEST-REPORT.md).

Meaning preservation is a prompt objective, not a guarantee. JSON validation cannot prove that the rewrite is semantically correct. Free-router model behavior varies. Deployment, external usability research, and a broader accessibility audit remain outside the completed scope.
