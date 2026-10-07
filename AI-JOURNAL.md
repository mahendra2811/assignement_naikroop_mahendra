# Message Makeover — AI Development Journal

Primary guideline: [question.txt](question.txt). Record actual collaboration and verification; leave unfinished stages explicitly pending. Do not store secrets or private message content here.

## Completed: ideation and scope correction

- **AI tool:** Codex in this conversation.
- **Initial suggestion:** a larger purchase-approval application linked closely to NaikFlow's use cases.
- **User correction:** solve a small problem, use a simple UI, finish within one day, and allow concepts unrelated to NaikFlow's product.
- **Decision:** explored smaller alternatives; the user selected Message Makeover.
- **Outcome:** reduced scope to one message-rewriting screen. This is a real example of human judgment correcting AI's initial scope.
- **Verification:** reread question.txt; it explicitly permits freedom of application, technology, and approach.

## Completed: planning and prompt preparation

- **AI contribution:** prepared a scoped plan, ordered build steps, implementation prompt, and runtime rewrite prompt.
- **Decision:** focus on meaning preservation, editable output, and an honest explanation of changes. Defer accounts, storage, and integrations.
- **Evidence:** PLAN.md and PROMPTS.md.
- **State at planning time:** no application code, runtime prompt evaluation, live model calls, or user testing had been completed. Provider configuration was unresolved. Later implementation and verification are recorded below.

## Completed: design and implementation

- **AI tool:** Codex in this conversation.
- **User decisions:** approved the implementation plan, selected OpenRouter, and selected its free router.
- **AI contribution:** translated the prompt into one responsive screen with teal controls, editable output, and explicit clarification/error states. Implemented the shared validation, route, provider adapter, and browser interaction logic.
- **Decision:** use native radio inputs and a select for keyboard behavior; plain CSS and local SVGs avoid a component-library dependency. Keep provider logic in one adapter and runtime instructions separate from user data.
- **Verification:** checked current official Next.js/OpenRouter documentation and installed versions; read the relevant bundled Next.js documentation after the development server generated AGENTS.md. Visual desktop/mobile screenshots and keyboard behavior were checked.
- **Limit:** schema checks protect response shape, not semantic truth. The UI explicitly asks users to review details.

## Completed: testing and debugging

- **AI contribution:** suggested boundary cases and implemented meaningful unit/API and browser checks, including stale responses and clipboard rejection.
- **Actual failures:** lint rejected a plain home anchor; two browser selectors matched Next.js's route announcement as well as our error; the initial development-server browser run had blocked dev-resource warnings and interaction failures.
- **Changes:** used Link, scoped error assertions, configured the local dev origin/project root, and made browser checks run against a dedicated production server. That server has a deliberately empty key, preventing unintended provider calls during tests.
- **Verification:** lint, type checking, production build, 26 unit/API tests, and nine Chromium browser tests passed. The automated suite used fictional fixtures; a separate live evaluation was performed later, recorded below.
- **Evidence:** TEST-REPORT.md and runnable test scripts. Actual test status is kept separate from semantic model evaluation.

## Completed: iteration and documentation

- **AI review:** found that a prior copy-success timer could clear feedback from a newer attempt. Clear timers when invalidating results or starting a new copy.
- **Design revision:** increased disclosure text size, added a 320px layout adjustment, and softened an unverified factual-preservation claim. Added an edit notice because the AI explanation describes its original output, not the user's later edits.
- **Documentation:** wrote setup instructions, API behavior, test steps, provider configuration, and a short demo. Verified documented build/test commands and checked missing-key behavior.
- **Outcome:** a complete local implementation with repeatable checks and transparent remaining limits. No external user feedback was fabricated.

## Completed: live AI evaluation and prompt iteration

- **Configuration:** the user supplied the OpenRouter key in the local environment file. The key was neither displayed nor added to version control.
- **Initial observation:** five of six fictional cases produced valid outputs; a firm-tone request returned an incomplete response and was rejected. Its original failure was preserved.
- **AI contribution:** checked the provider’s official reasoning-token documentation. Reasoning can consume the completion allowance, which is a possible explanation for incomplete content, not a confirmed diagnosis here.
- **Changes:** requested low reasoning effort and increased the bounded total allowance to 4,000 tokens. Strengthened the explanation instruction after one response overstated the wording change. Character caps, timeout, and manual retry remain unchanged.
- **Retest:** the firm-tone request passed on a targeted retry with a different resolved free model. Amount, deadline, and refusal to extend were retained. The model difference prevents attributing recovery solely to the configuration change.
- **Real browser verification:** submitted the follow-up sample to the actual provider, edited the returned message, and verified clipboard contents. HTTP 200, no browser runtime errors, copy succeeded.
- **Evidence:** evaluation-results.json records all initial results, the retry, model names, and the browser result. Agent review is labeled as such; external human feedback has not been fabricated.
- **Limitation:** a small passing sample does not guarantee tone or factual correctness on new messages. Free-model selection, availability, and output reliability can vary.

## Entry template

- **Stage/date:**
- **Problem and AI tool:**
- **Prompt summary and suggestion:**
- **Accepted, changed, or rejected:**
- **Verification performed:**
- **Observed result and remaining limitation:**
