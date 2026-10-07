import { rewriteInputSchema } from "@/lib/contracts";
import { generateRewrite, RewriteError } from "@/lib/openrouter";

export const runtime = "nodejs";

function json(
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16_000)
      return json(
        {
          error: {
            code: "validation",
            message: "Please keep your message within 2,000 characters.",
          },
        },
        400,
      );
    input = JSON.parse(raw);
  } catch {
    return json(
      {
        error: {
          code: "validation",
          message: "Please send a valid message, tone, and intent.",
        },
      },
      400,
    );
  }
  const validated = rewriteInputSchema.safeParse(input);
  if (!validated.success) {
    return json(
      {
        error: {
          code: "validation",
          message:
            "Enter a message between 1 and 2,000 characters and choose a supported tone and intent.",
        },
      },
      400,
    );
  }
  try {
    const { result, model } = await generateRewrite(validated.data);
    return json(result, 200, { "X-Rewrite-Model": model });
  } catch (error) {
    if (error instanceof RewriteError)
      return json(
        { error: { code: error.code, message: error.message } },
        error.status,
      );
    return json(
      {
        error: {
          code: "internal",
          message: "Something went wrong. Please try again.",
        },
      },
      500,
    );
  }
}
