import { writeFile } from "node:fs/promises";

if (!process.env.OPENROUTER_API_KEY?.trim()) {
  console.error(
    "Live evaluation pending: configure OPENROUTER_API_KEY in .env.local and start the app. No model calls were made.",
  );
  process.exit(1);
}
const cases = [
  {
    name: "deadline and name",
    draft: "Alex, send the file by 3 PM today. I need it for the review.",
    tone: "Professional",
    intent: "Request",
    facts: ["Alex", "3 PM", "today"],
  },
  {
    name: "amount and firm deadline",
    draft:
      "Please pay the remaining ₹2,400 by Friday. I cannot extend the deadline.",
    tone: "Firm",
    intent: "Follow up",
    facts: ["₹2,400", "Friday", "cannot extend"],
  },
  {
    name: "refusal",
    draft: "Thanks for inviting me. I cannot take on this project this week.",
    tone: "Friendly",
    intent: "Decline",
    facts: ["cannot", "this week"],
  },
  {
    name: "existing apology",
    draft:
      "I am sorry I missed our call. I forgot to check my calendar. Could we reschedule?",
    tone: "Professional",
    intent: "Apologize",
    facts: ["missed", "calendar", "reschedule"],
  },
  {
    name: "uncertain commitment",
    draft: "I might finish by Monday, but I cannot promise that yet.",
    tone: "Friendly",
    intent: "Keep original",
    facts: ["might", "Monday", "cannot promise"],
  },
  {
    name: "conflicting intent",
    draft: "I accept your invitation and will attend on Friday.",
    tone: "Firm",
    intent: "Decline",
    facts: [],
    expected: "needs_clarification",
  },
];
const observations = [];
for (const item of cases) {
  const { name, facts, expected = "ok", ...input } = item;
  const response = await fetch("http://127.0.0.1:3000/api/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(35_000),
  });
  const body = await response.json();
  observations.push({
    name,
    input,
    expected,
    factsToReview: facts,
    httpStatus: response.status,
    resolvedModel: response.headers.get("x-rewrite-model"),
    output: body,
    semanticReview: "pending human review",
  });
  console.log(
    `${name}: HTTP ${response.status}, model ${response.headers.get("x-rewrite-model") || "not available"}`,
  );
}
await writeFile(
  "evaluation-results.json",
  JSON.stringify(
    {
      evaluatedAt: new Date().toISOString(),
      kind: "live-provider; fictional messages only",
      observations,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Saved evaluation-results.json. Review factual preservation and tone; HTTP success alone does not establish semantic quality.",
);
if (
  observations.some(
    (item) => item.httpStatus !== 200 || item.output.status !== item.expected,
  )
)
  process.exitCode = 1;
