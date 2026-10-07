import { describe, expect, it } from "vitest";
import { rewriteInputSchema, rewriteResultSchema } from "../src/lib/contracts";

const input = {
  draft: "Send Alex ₹2,400 by Friday. I cannot commit to Monday.",
  tone: "Professional",
  intent: "Keep original",
};
describe("request validation", () => {
  it("preserves facts and uncertainty while trimming outside whitespace", () => {
    expect(
      rewriteInputSchema.parse({ ...input, draft: `  ${input.draft}  ` }).draft,
    ).toBe(input.draft);
  });
  it.each(["", "   ", "a".repeat(2_001)])(
    "rejects empty or oversized drafts",
    (draft) => {
      expect(rewriteInputSchema.safeParse({ ...input, draft }).success).toBe(
        false,
      );
    },
  );
  it("accepts exactly 2,000 characters", () => {
    expect(
      rewriteInputSchema.safeParse({ ...input, draft: "a".repeat(2_000) })
        .success,
    ).toBe(true);
  });
  it("rejects unrecognized options and extra fields", () => {
    for (const patch of [
      { tone: "Aggressive" },
      { intent: "Invent excuses" },
      { apiKey: "secret" },
    ]) {
      expect(rewriteInputSchema.safeParse({ ...input, ...patch }).success).toBe(
        false,
      );
    }
  });
});
describe("model output validation", () => {
  const good = {
    status: "ok",
    rewrite: "Please send the file today.",
    explanation: "Kept the deadline and softened the request.",
  };
  it("accepts a rewrite or a clarification question", () => {
    expect(rewriteResultSchema.parse(good)).toEqual(good);
    expect(
      rewriteResultSchema.parse({
        status: "needs_clarification",
        question: "Are you accepting or declining?",
      }).status,
    ).toBe("needs_clarification");
  });
  it("rejects unsupported, empty, overly long, or inconsistent responses", () => {
    for (const value of [
      { ...good, rewrite: " " },
      { ...good, rewrite: "x".repeat(4_001) },
      { ...good, explanation: "x".repeat(301) },
      { ...good, status: "done" },
      { ...good, question: "Unexpected extra field" },
      { status: "needs_clarification", question: "" },
      { status: "needs_clarification", question: "x".repeat(301) },
    ])
      expect(rewriteResultSchema.safeParse(value).success).toBe(false);
  });
});

describe("rewrite preferences", () => {
  it("defaults older requests to balanced chat rewrites", () => {
    expect(rewriteInputSchema.parse(input)).toEqual({
      ...input,
      length: "Balanced",
      format: "Chat message",
      grammarOnly: false,
    });
  });
  it("validates the new options", () => {
    expect(
      rewriteInputSchema.parse({ ...input, length: "Short", format: "Email" })
        .length,
    ).toBe("Short");
    for (const patch of [
      { length: "Huge" },
      { format: "SMS" },
      { grammarOnly: "true" },
    ]) {
      expect(rewriteInputSchema.safeParse({ ...input, ...patch }).success).toBe(
        false,
      );
    }
  });
  it("normalizes conflicting preferences for grammar-only requests on the server", () => {
    expect(
      rewriteInputSchema.parse({
        ...input,
        grammarOnly: true,
        tone: "Firm",
        intent: "Decline",
        length: "Detailed",
        format: "Email",
      }),
    ).toEqual({
      ...input,
      grammarOnly: true,
      length: "Balanced",
      format: "Chat message",
    });
  });
});
