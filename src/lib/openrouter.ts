import {
  rewriteResultSchema,
  type RewriteInput,
  type RewriteResult,
} from "./contracts";
import { REWRITE_PROMPT } from "./rewrite-prompt";

export class RewriteError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "RewriteError";
  }
}

export async function generateRewrite(
  input: RewriteInput,
): Promise<{ result: RewriteResult; model: string }> {
  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (!key) {
    throw new RewriteError(
      "configuration",
      503,
      "Rewriting isn’t set up yet. Add the OpenRouter API key on the server, then try again.",
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL?.trim() || "openrouter/free",
          messages: [
            { role: "system", content: REWRITE_PROMPT },
            { role: "user", content: JSON.stringify(input) },
          ],
          response_format: { type: "json_object" },
          provider: { require_parameters: true },
          stream: false,
          max_tokens: 2_000,
        }),
        signal: controller.signal,
        cache: "no-store",
      },
    );
    if (!response.ok) {
      if (response.status === 429)
        throw new RewriteError(
          "rate_limit",
          429,
          "The AI service is busy or its request limit has been reached. Wait a moment, then try again.",
        );
      if (
        response.status === 401 ||
        response.status === 403 ||
        response.status === 402
      ) {
        throw new RewriteError(
          "configuration",
          503,
          "The AI service couldn’t authorize this request. Check the server’s API key and available quota.",
        );
      }
      throw new RewriteError(
        "provider",
        502,
        "The AI service couldn’t complete the rewrite. Your draft is safe here; please try again.",
      );
    }
    const payload = await response.json();
    const content: unknown = payload?.choices?.[0]?.message?.content;
    if (
      typeof content !== "string" ||
      content.length > 30_000 ||
      payload?.choices?.[0]?.finish_reason === "length"
    ) {
      throw new RewriteError(
        "invalid_response",
        502,
        "The AI returned an incomplete response. Please try again.",
      );
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new RewriteError(
        "invalid_response",
        502,
        "The AI returned an unreadable response. Please try again.",
      );
    }
    const validated = rewriteResultSchema.safeParse(parsed);
    if (!validated.success)
      throw new RewriteError(
        "invalid_response",
        502,
        "The AI returned an unexpected response. Please try again.",
      );
    return {
      result: validated.data,
      model: typeof payload.model === "string" ? payload.model : "unknown",
    };
  } catch (error) {
    if (error instanceof RewriteError) throw error;
    if (controller.signal.aborted)
      throw new RewriteError(
        "timeout",
        504,
        "That took longer than expected. Please try again; your draft hasn’t changed.",
      );
    throw new RewriteError(
      "provider",
      502,
      "We couldn’t reach the AI service. Please try again in a moment.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
