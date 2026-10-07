# Message Makeover — Two-Minute Interview Demo

Before the interview, follow the [setup instructions](../README.md#run-locally), verify the provider key and quota, and open the app. Live response time and quality vary by model; do not present an intercepted test fixture as a real AI result.

| Time | Show | Explain |
| --- | --- | --- |
| 0:00–0:20 | The single-page screen | “I chose a small communication problem: improving wording without accidentally changing the message. I directed a one-day scope and used AI throughout the development process.” |
| 0:20–0:55 | Open Try an example → A follow-up → Professional → rewrite | “Tone changes should preserve Alex and the 3 PM deadline. The result includes an explanation so I can inspect the edit.” |
| 0:55–1:15 | Edit the result and copy it | “The user stays in control of the final message. The app helps with wording and does not send it.” |
| 1:15–1:35 | Show length, format, and grammar-only | “Grammar-only pauses other preferences and restores them afterward. The server also enforces that mode.” |
| 1:35–2:00 | Open AI journal and test report | “AI helped plan, build, and test. I set the scope and requested refinements. We recorded actual failures, including an invented email signature, then revised the prompt and retested.” |

For copy-ready drafts, settings, and example outputs in several formats, use [INTERVIEW-EXAMPLES.md](INTERVIEW-EXAMPLES.md).

## Useful follow-up answers

**Why this project?** A small problem makes a complete working interaction feasible and easy to assess. I prioritized completion and meaning preservation over a broad feature list.

**How is this more than a single prompt?** The application adds validated preferences, clarification, editable output, copy handling, safe provider errors, and cancellation of outdated responses. The prompt is one part of that system.

**What did you personally direct?** Product selection, the smaller scope, primary assignment guideline, provider configuration, expanded examples, collapsed picker, and the three additional controls. AI-assisted planning and implementation are credited in the journal.

**What did testing establish?** 29 unit/API tests and 11 browser tests checked implementation behavior. Separate live fictional cases checked model behavior. Neither proves correctness on every future message.

**What would you improve next?** Start with external usability feedback and a larger fixed-model evaluation set. Add public-hosting usage controls if deployment is requested.
