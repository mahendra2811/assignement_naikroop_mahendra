# Message Makeover — One-Day Plan

**Decision:** build a small app that helps people express a message clearly, in the right tone, while preserving what they mean.

**Status:** concept selected; implementation has not started.  
**Assignment:** [question.txt](question.txt). The product can solve any problem; our submission must demonstrate AI use throughout development.

## The problem

Someone knows what they want to say but worries their message sounds rude, confusing, or too formal. They need a usable rewrite without repeatedly composing prompts in a chatbot.

**Our promise:** “Say what you mean, the way you want it to sound.”

## One simple flow

**Paste a draft → choose tone and intent → rewrite → review or edit → copy.**

Example:

> Original: “You still haven't sent the file. I need it today.”
>
> Polite and clear: “Could you please send the file today? I still need it.”
>
> What changed: softened the opening and kept the deadline explicit.

This is an illustrative example, not a recorded AI result.

## What we build today

| Feature | Small, concrete scope |
|---|---|
| Draft input | One text box with a 2,000-character limit and three sample messages |
| Tone | Friendly, Professional, or Firm; default to Professional |
| Intent | Optional: Request, Follow up, Decline, or Apologize; default to preserving the original intent |
| Rewrite | Generate one improved message per request |
| Result | Editable output beside the original on desktop, stacked on mobile |
| Explanation | One short sentence describing the wording change |
| Copy | Copy the edited result with visible success feedback |
| Reliable states | Handle empty input, loading, failed requests, and retry without losing the draft |

The distinguishing detail is **preserving meaning**: retain names, amounts, deadlines, uncertainty, and commitments. A polite rewrite should not remove urgency; a firm rewrite should not add threats. If an intent conflicts with the draft, ask the user to clarify rather than inventing facts.

## Keep implementation small

Use one TypeScript web app with a single server endpoint calling an AI provider. Keep the API key on the server, validate input and output, and bound request duration. Choose exact packages and verify their documentation when implementation starts.

Keep drafts in page memory for this version. Explain that rewriting sends the text to the AI provider; avoid storing message contents in application logs.

Today's scope excludes accounts, a database, message history, automatic sending, integrations, and multiple rewrite variants. English is the initial supported language. A working AI API key is needed for live rewriting; missing configuration should produce an honest setup message.

## Today's build order

| Step | Deliverable | Rough time |
|---|---|---|
| 1 | Simple responsive screen with sample inputs | 1 hour |
| 2 | Real AI rewrite endpoint and meaning-preservation instructions | 1–1.5 hours |
| 3 | Editable output, copy, explanation, and error handling | 1 hour |
| 4 | Test examples, fix problems, and check mobile layout | 1 hour |
| 5 | Setup notes, AI development journal, and short demo | 30 minutes |

**Target: 4.5–5 hours**, assuming familiar tools and an available AI key. Hosting is a separate delivery choice; prioritize a complete local demo first.

## What makes it ready

- A real rewrite works from input through editing and copying.
- Test all three tones and check that dates, amounts, names, and meaning survive.
- Include a firm deadline, a polite refusal, an apology, and an ambiguous request in the examples.
- Empty input, provider failure, and repeated clicks behave sensibly.
- Keyboard navigation and the mobile layout work.
- Build and relevant checks pass; document observed results and remaining limitations.

## How we explain it in the assignment

Keep a short `AI-JOURNAL.md`: how AI helped with ideation, planning, design, code, tests, debugging, documentation, and iteration. Record actual suggestions, our decisions, and how we verified them.

Our existing product research is background: [Naikroop](https://naikroop.com/) and [NaikFlow](https://naikflow.com/). This app is an independent concept, not a replica of their product.

**Two-minute demo:** show a blunt draft, rewrite it, explain how the deadline was preserved, edit and copy it, then show one real example of how AI helped us improve the implementation.
