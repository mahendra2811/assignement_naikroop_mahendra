import { expect, test, type Page } from "@playwright/test";

const output =
  "Alex, could you please send the file by 3 PM today? I need it to finish the review.";
const success = {
  status: "ok",
  rewrite: output,
  explanation: "Softened the wording while preserving the deadline.",
};
async function mockSuccess(page: Page) {
  await page.route("**/api/rewrite", (route) =>
    route.fulfill({ json: success }),
  );
}

test("rewrites, edits, and copies the edited message; changing intent clears obsolete output", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await mockSuccess(page);
  await page.goto("/");
  await expect(page.getByRole("radio", { name: "Professional" })).toBeChecked();
  await page.locator(".sample-toggle").click();
  await page.getByRole("button", { name: "A follow-up", exact: true }).click();
  await page.getByRole("button", { name: "Make over my message" }).click();
  const rewritten = page.getByLabel("Your rewritten message");
  await expect(rewritten).toHaveValue(output);
  await rewritten.fill("My own edit. Please send it by 3 PM today.");
  await page.getByRole("button", { name: "Copy message" }).click();
  await expect(page.getByRole("button", { name: "Copied!" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "My own edit. Please send it by 3 PM today.",
  );
  await expect(
    page.getByText("You’ve edited the result.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("What’s your intention?").selectOption("Decline");
  await expect(rewritten).toHaveCount(0);
});

test("handles clarification by preserving the draft and returning keyboard focus", async ({
  page,
}) => {
  await page.route("**/api/rewrite", (route) =>
    route.fulfill({
      json: {
        status: "needs_clarification",
        question: "Are you accepting or declining the invitation?",
      },
    }),
  );
  await page.goto("/");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("I would like to attend.");
  await page.getByLabel("What’s your intention?").selectOption("Decline");
  await page.getByRole("button", { name: "Make over my message" }).click();
  await expect(
    page.getByText("Are you accepting or declining the invitation?"),
  ).toBeVisible();
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "I would like to attend.",
  );
  await page.getByRole("button", { name: "Back to my draft" }).click();
  await expect(page.getByLabel("Your message", { exact: true })).toBeFocused();
  await expect(page.getByRole("button", { name: "Copy message" })).toHaveCount(
    0,
  );
});

test("handles provider failure and manual retry without losing the draft", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/rewrite", (route) => {
    calls += 1;
    return calls === 1
      ? route.fulfill({
          status: 429,
          json: {
            error: {
              code: "rate_limit",
              message: "The request limit was reached. Try again.",
            },
          },
        })
      : route.fulfill({ json: success });
  });
  await page.goto("/");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Please send the file today.");
  await page.getByRole("button", { name: "Make over my message" }).click();
  await expect(
    page
      .getByRole("region", { name: "What would you like to say?" })
      .getByRole("alert"),
  ).toContainText("request limit");
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "Please send the file today.",
  );
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByLabel("Your rewritten message")).toHaveValue(output);
  expect(calls).toBe(2);
});

test("does not submit empty input and enforces the character limit", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/rewrite", (route) => {
    calls += 1;
    return route.fulfill({ json: success });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Make over my message" }).click();
  await expect(
    page
      .getByRole("region", { name: "What would you like to say?" })
      .getByRole("alert"),
  ).toContainText("Add a message");
  await expect(page.getByLabel("Your message", { exact: true })).toBeFocused();
  expect(calls).toBe(0);
  await page
    .getByLabel("Your message", { exact: true })
    .fill("a".repeat(2_001));
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "a".repeat(2_000),
  );
  await expect(page.locator("#draft-count")).toHaveText("2,000 / 2,000");
});

test("blocks duplicate submission and discards a delayed rewrite after draft edits", async ({
  page,
}) => {
  let calls = 0;
  let release: () => void = () => {};
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/rewrite", async (route) => {
    calls += 1;
    if (calls === 1) await delayed;
    try {
      await route.fulfill({ json: success });
    } catch {
      /* Client canceled the stale request. */
    }
  });
  await page.goto("/");
  await page.getByLabel("Your message", { exact: true }).fill("Old request");
  await page.getByRole("button", { name: "Make over my message" }).click();
  await expect(
    page.getByRole("button", { name: "Finding the right words" }),
  ).toBeDisabled();
  await expect.poll(() => calls).toBe(1);
  await page.getByLabel("Your message", { exact: true }).fill("New request");
  release();
  await expect(
    page.getByRole("heading", { name: "Your next draft starts here." }),
  ).toBeVisible();
  await expect(page.getByLabel("Your rewritten message")).toHaveCount(0);
  await page.getByRole("button", { name: "Make over my message" }).click();
  await expect(page.getByLabel("Your rewritten message")).toHaveValue(output);
  expect(calls).toBe(2);
});

test("clipboard rejection selects the editable text for manual copy", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Permission denied")),
      },
    });
  });
  await mockSuccess(page);
  await page.goto("/");
  await page.locator(".sample-toggle").click();
  await page.getByRole("button", { name: "A polite no", exact: true }).click();
  await page.getByRole("button", { name: "Make over my message" }).click();
  await page.getByRole("button", { name: "Copy message" }).click();
  await expect(page.getByRole("status")).toContainText("copy it manually");
  const result = page.getByLabel("Your rewritten message");
  await expect(result).toBeFocused();
  expect(
    await result.evaluate(
      (node: HTMLTextAreaElement) => node.selectionEnd - node.selectionStart,
    ),
  ).toBe(output.length);
});

test("keyboard navigation and desktop/mobile layout remain usable", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Message Makeover home" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Your message", { exact: true })).toBeFocused();
  const disclosure = page.locator(".sample-toggle");
  await expect(
    page.getByRole("button", { name: "A follow-up", exact: true }),
  ).toBeHidden();
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "A follow-up", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".sample-button")).toHaveCount(11);
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "A follow-up", exact: true }),
  ).toBeHidden();
  await page.getByRole("radio", { name: "Professional" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "Firm" })).toBeChecked();
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const inputPanel = await page.locator(".draft-panel").boundingBox();
  const resultPanel = await page.locator(".result-panel").boundingBox();
  expect(resultPanel!.y).toBeGreaterThan(inputPanel!.y + inputPanel!.height);
  await expect(
    page.getByRole("button", { name: "Make over my message" }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("real local endpoint reports missing credentials instead of sample output", async ({
  request,
}) => {
  // No provider is mocked in this check. The first local build has no key configured.
  const response = await request.post("/api/rewrite", {
    data: {
      draft: "Please send the file today.",
      tone: "Professional",
      intent: "Keep original",
    },
  });
  const body = await response.json();
  expect(response.status()).toBe(503);
  expect(body.error.code).toBe("configuration");
  expect(body.error.message).toContain("API key");
});

test("unexpected transport content gives a readable error instead of technical details", async ({
  page,
}) => {
  await page.route("**/api/rewrite", (route) =>
    route.fulfill({
      status: 502,
      contentType: "text/html",
      body: "<html>private upstream details</html>",
    }),
  );
  await page.goto("/");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Please send the file today.");
  await page.getByRole("button", { name: "Make over my message" }).click();
  const alert = page
    .getByRole("region", { name: "What would you like to say?" })
    .getByRole("alert");
  await expect(alert).toContainText("We couldn’t read the response");
  await expect(alert).not.toContainText("upstream details");
  await expect(page.getByLabel("Your message", { exact: true })).toHaveValue(
    "Please send the file today.",
  );
});

test("sends preferences, invalidates results, and pauses other controls in grammar-only mode", async ({
  page,
}) => {
  const requests: Record<string, unknown>[] = [];
  await page.route("**/api/rewrite", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ json: success });
  });
  await page.goto("/");
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Alex i cant attend friday.");
  await page
    .getByLabel("Message length", { exact: true })
    .selectOption("Short");
  await page
    .getByLabel("Message format", { exact: true })
    .selectOption("Email");
  await page.getByRole("button", { name: "Make over my message" }).click();
  await expect(page.getByLabel("Your rewritten message")).toBeVisible();
  expect(requests[0]).toMatchObject({
    length: "Short",
    format: "Email",
    grammarOnly: false,
  });
  await page
    .getByLabel("Message length", { exact: true })
    .selectOption("Detailed");
  await expect(page.getByLabel("Your rewritten message")).toHaveCount(0);
  await page.getByLabel("Grammar-only mode").check();
  for (const name of [
    "Message length",
    "Message format",
    "What’s your intention?",
  ]) {
    await expect(
      page.getByLabel(name, { exact: name !== "What’s your intention?" }),
    ).toBeDisabled();
  }
  await expect(
    page.getByRole("radio", { name: "Professional" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Fix grammar", exact: true }).click();
  await expect(page.getByLabel("Your rewritten message")).toBeVisible();
  expect(requests[1]).toMatchObject({
    grammarOnly: true,
    intent: "Keep original",
    length: "Balanced",
    format: "Chat message",
  });
  await expect(page.getByText("Grammar only", { exact: true })).toBeVisible();
  await page.getByLabel("Grammar-only mode").uncheck();
  await expect(page.getByLabel("Message length", { exact: true })).toHaveValue(
    "Detailed",
  );
  await expect(page.getByLabel("Message format", { exact: true })).toHaveValue(
    "Email",
  );
  await expect(page.getByRole("radio", { name: "Professional" })).toBeEnabled();
  await expect(page.getByLabel("Your rewritten message")).toHaveCount(0);
});
