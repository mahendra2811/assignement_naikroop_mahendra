import { z } from "zod";

export const DRAFT_LIMIT = 2_000;
export const OUTPUT_LIMIT = 4_000;
export const TONES = ["Friendly", "Professional", "Firm"] as const;
export const INTENTS = [
  "Keep original",
  "Request",
  "Follow up",
  "Decline",
  "Apologize",
] as const;

export const MESSAGE_LENGTHS = ["Short", "Balanced", "Detailed"] as const;
export const MESSAGE_FORMATS = ["Chat message", "Email"] as const;

export const rewriteInputSchema = z
  .strictObject({
    draft: z.string().max(DRAFT_LIMIT).trim().min(1),
    tone: z.enum(TONES),
    intent: z.enum(INTENTS),
    length: z.enum(MESSAGE_LENGTHS).default("Balanced"),
    format: z.enum(MESSAGE_FORMATS).default("Chat message"),
    grammarOnly: z.boolean().default(false),
  })
  .transform((input) =>
    input.grammarOnly
      ? {
          ...input,
          tone: "Professional" as const,
          intent: "Keep original" as const,
          length: "Balanced" as const,
          format: "Chat message" as const,
        }
      : input,
  );

export const rewriteResultSchema = z.discriminatedUnion("status", [
  z.strictObject({
    status: z.literal("ok"),
    rewrite: z.string().trim().min(1).max(OUTPUT_LIMIT),
    explanation: z.string().trim().min(1).max(300),
  }),
  z.strictObject({
    status: z.literal("needs_clarification"),
    question: z.string().trim().min(1).max(300),
  }),
]);

export type Tone = (typeof TONES)[number];
export type Intent = (typeof INTENTS)[number];
export type RewriteInput = z.infer<typeof rewriteInputSchema>;
export type RewriteResult = z.infer<typeof rewriteResultSchema>;

export type MessageLength = (typeof MESSAGE_LENGTHS)[number];
export type MessageFormat = (typeof MESSAGE_FORMATS)[number];
