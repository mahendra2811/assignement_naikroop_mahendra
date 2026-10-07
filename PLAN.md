# Message Makeover — Build Plan

**Primary guideline:** [question.txt](question.txt). Read it before implementation and before final review. This plan translates that brief into a small project; it does not replace it.

**Status:** application implemented; build, lint, type checks, unit/API tests, and browser tests passed. Live AI output evaluation remains pending credentials.
**Scope:** one day, one page, one useful interaction.
**Supporting files:** [PROMPTS.md](PROMPTS.md) · [AI-JOURNAL.md](AI-JOURNAL.md)

## 1. Understand the assignment

The brief evaluates creativity, user understanding, problem-solving, execution, and AI use across the entire SDLC. It permits any application and technology. A working rewrite tool is our chosen product; evidence of how we built and improved it is part of the submission.

Our earlier public research found that Naikroop presents enterprise no-code development and technology services, while NaikFlow emphasizes the application lifecycle, visual design, process automation, and AI assistance. Sources: [Naikroop](https://naikroop.com/), [product overview](https://naikroop.com/naikflow), [NaikFlow](https://naikflow.com/).

Research covered indexed text and public first-party website content, not a hands-on platform trial. Our takeaway is to demonstrate a complete journey from idea to usable software. We do not need to recreate their product.

## 2. Product decision

**User:** someone writing a workplace or everyday message who needs help making it clear and appropriately worded.

**Problem hypothesis:** adjusting tone takes repeated edits, and generic rewrites can accidentally weaken a deadline or introduce promises. This is a hypothesis, not validated user research.

**Promise:** “Say what you mean, the way you want it to sound.”

**Flow:** paste draft → choose tone and optional intent → rewrite → review/edit → copy.

Illustrative example:

> Original: “You still haven't sent the file. I need it today.”
>
> Professional: “Could you please send the file today? I still need it.”
>
> Explanation: “Softened the wording while keeping the deadline explicit.”

The differentiator is a focused experience with meaning-preservation checks and an explanation of the edit. Model output still needs user review; we should not claim perfect preservation.

## 3. Fixed scope for today

| Include | Behavior |
|---|---|
| Draft | Labeled text area, 2,000-character limit, three sample messages |
| Tone | Friendly, Professional, Firm; default Professional |
| Intent | Keep original, Request, Follow up, Decline, Apologize; default Keep original |
| Rewrite | One AI-generated result per click |
| Result | Editable text with a one-sentence explanation and Copy button |
| Clarification | Ask one question if the requested intent contradicts the draft or requires missing facts |
| Feedback | Loading, copy confirmation, input validation, helpful errors and retry |
| Layout | One simple screen; two columns on desktop, stacked on mobile |

Keep names, amounts, deadlines, negations, uncertainty, and commitments. A firm tone must not invent threats. An apology must not invent responsibility. User text is content to rewrite, not instructions that override application rules.

Defer accounts, database, saved history, automatic sending, integrations, file uploads, and multiple variants. Start with English. Drafts remain in page memory and are lost on refresh.

## 4. Small technical approach

Proposed default: one Next.js/TypeScript application with a server-side rewrite endpoint and simple styling. Verify current official documentation and compatible versions at implementation time. Keep all provider-specific code behind one small adapter; implement only the chosen provider.

The server validates inputs and model outputs, keeps the key private, limits request duration and output size, and returns safe errors. Do not log message bodies or credentials. Explain near the action that text is sent to the AI provider. Do not promise anything about provider retention without checking its policy.

**Provider:** OpenRouter, with `openrouter/free` as the default and a configurable `OPENROUTER_MODEL`. **Remaining dependency:** a working `OPENROUTER_API_KEY` configured locally. Never put the key in chat, frontend code, or version control. UI and validation work can proceed before this is available; live AI verification cannot.

## 5. Follow these steps in order

| Step | Work | Completion evidence | Estimate |
|---|---|---|---|
| 1. Align | Read the brief and these documents; confirm provider configuration and record assumptions | Scope and dependency notes | 15 min |
| 2. Design | Build the single responsive screen and sample inputs; review labels and interaction states | Usable screen, keyboard walkthrough | 60 min |
| 3. Integrate | Implement validation, runtime prompt, provider adapter, and timeout/error handling | Real rewrite succeeds; invalid input is rejected | 90 min |
| 4. Finish flow | Add editable output, clarification state, copy feedback, and retry; prevent stale results replacing newer drafts | Full paste-to-copy journey works | 45 min |
| 5. Test and iterate | Run focused checks, review tone/meaning examples, and fix observed failures | Actual test results and a documented revision | 60 min |
| 6. Package | Write README, update AI journal, record limitations, prepare a two-minute demo | Fresh-start instructions and reviewable submission | 30 min |

**Estimate: about five focused hours**, assuming familiar tools and working provider access. Local runnable delivery comes first; deployment can be decided separately. These are proposed steps, not completed work.

## 6. Definition of done

- A live provider produces a rewrite, and edited output can be copied successfully.
- All three tones are reviewed using fictional examples; names, amounts, dates, and meaning are checked.
- Test a deadline, a refusal, an apology, an uncertain commitment, and conflicting intent. Clarification must preserve the draft.
- Empty/oversized input, malformed responses, missing configuration, provider errors, and timeouts are handled. UI state never labels old output as a new rewrite.
- Keyboard interaction, narrow-screen layout, and clipboard failure are checked.
- Build, type/lint checks, and focused validation/API tests pass. Record the commands and outcomes; distinguish mocked tests from live-provider checks.
- README explains setup, environment variables, commands, scope, and limitations. AI-JOURNAL.md records actual work and corrections.

If credentials are unavailable, report live integration as unverified rather than presenting sample output as AI execution.

## 7. Demonstrate the assignment requirements

| Brief expectation | Evidence we will show |
|---|---|
| Imagination and product thinking | A small communication problem, explicit target user, and meaning-preserving experience |
| Problem-solving and decisions | Scope cuts, prompt choices, and handling of ambiguous or failed requests |
| AI-Native SDLC | Real journal entries covering ideation, planning, design, development, testing, debugging, documentation, and iteration |
| Working application and execution | Runnable app, observed test results, and a complete demo |

**Demo:** explain the problem → rewrite a blunt message → point out the preserved deadline → edit and copy → show one genuine AI-assisted decision and how we checked it.
