"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  DRAFT_LIMIT,
  INTENTS,
  OUTPUT_LIMIT,
  TONES,
  rewriteInputSchema,
  rewriteResultSchema,
  type Intent,
  type RewriteResult,
  type Tone,
} from "@/lib/contracts";
import { Icon } from "./icon";

const samples = [
  {
    label: "A follow-up",
    draft:
      "Hi Alex, you still haven’t sent the project file. I need it by 3 PM today to finish the review.",
    intent: "Follow up" as Intent,
  },
  {
    label: "A polite no",
    draft:
      "Thanks for inviting me, but I can’t take on another project this week. I don’t have the time.",
    intent: "Decline" as Intent,
  },
  {
    label: "An apology",
    draft:
      "I’m sorry I missed our call today. I forgot to check my calendar. Could we reschedule?",
    intent: "Apologize" as Intent,
  },
];
const toneDetails = {
  Friendly: { icon: "smile", description: "Warm & natural" },
  Professional: { icon: "briefcase", description: "Clear & courteous" },
  Firm: { icon: "flag", description: "Direct & respectful" },
} as const;

export function MessageMakeover() {
  const [draft, setDraft] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [intent, setIntent] = useState<Intent>("Keep original");
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [edited, setEdited] = useState(false);
  const generation = useRef(0);
  const copyGeneration = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(
    () => () => {
      controller.current?.abort();
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  function invalidate() {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    generation.current += 1;
    copyGeneration.current += 1;
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
    setResult(null);
    setOutput("");
    setError("");
    setEdited(false);
    setCopyStatus("idle");
  }

  async function rewrite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (controller.current) return;
    const validated = rewriteInputSchema.safeParse({ draft, tone, intent });
    if (!validated.success) {
      setError("Add a message between 1 and 2,000 characters to get started.");
      draftRef.current?.focus();
      return;
    }
    invalidate();
    const currentGeneration = generation.current;
    const active = new AbortController();
    controller.current = active;
    setLoading(true);
    const timeout = setTimeout(() => active.abort(), 35_000);
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.data),
        signal: active.signal,
      });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("We couldn’t read the response. Please try again.");
      }
      if (currentGeneration !== generation.current) return;
      if (!response.ok) {
        throw new Error(
          typeof data?.error?.message === "string"
            ? data.error.message
            : "We couldn’t rewrite that message. Please try again.",
        );
      }
      const parsed = rewriteResultSchema.safeParse(data);
      if (!parsed.success)
        throw new Error("The response wasn’t readable. Please try again.");
      setResult(parsed.data);
      if (parsed.data.status === "ok") setOutput(parsed.data.rewrite);
    } catch (failure) {
      if (currentGeneration !== generation.current) return;
      setError(
        active.signal.aborted
          ? "That took longer than expected. Please try again."
          : failure instanceof TypeError
            ? "We couldn’t connect. Please try again in a moment."
            : failure instanceof Error
              ? failure.message
              : "We couldn’t connect. Please try again.",
      );
    } finally {
      clearTimeout(timeout);
      if (currentGeneration === generation.current) {
        controller.current = null;
        setLoading(false);
      }
    }
  }

  async function copy() {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    const attempt = ++copyGeneration.current;
    setCopyStatus("idle");
    try {
      await navigator.clipboard.writeText(output);
      if (attempt !== copyGeneration.current) return;
      setCopyStatus("copied");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyStatus("idle"), 2_500);
    } catch {
      if (attempt !== copyGeneration.current) return;
      setCopyStatus("failed");
      outputRef.current?.focus();
      outputRef.current?.select();
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Message Makeover home">
          <span className="brand-mark">
            <Icon name="message" size={23} />
          </span>
          <span>
            message<span className="brand-light">makeover</span>
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <span className="header-note">
          <span className="status-dot" /> A little clarity goes a long way
        </span>
      </header>

      <main id="main-content">
        <section className="intro" aria-labelledby="page-title">
          <span className="eyebrow">
            <Icon name="spark" size={15} /> YOUR MESSAGE, JUST BETTER
          </span>
          <h1 id="page-title">
            Find the words.
            <br />
            <span>Keep your meaning.</span>
          </h1>
          <p>
            From a rough draft to the right tone.
            <br className="mobile-break" /> A thoughtful touch for the things
            you want to say.
          </p>
        </section>

        <div className="workspace">
          <section className="panel draft-panel" aria-labelledby="draft-title">
            <div className="panel-topline">
              <span className="step-label">
                01 <span>YOUR DRAFT</span>
              </span>
              <span className="panel-tag">Start here</span>
            </div>
            <h2 id="draft-title">What would you like to say?</h2>
            <p className="panel-description">
              Write it your way. We’ll help with the wording.
            </p>
            <form onSubmit={rewrite} noValidate>
              <div className="draft-field">
                <label className="visually-hidden" htmlFor="draft">
                  Your message
                </label>
                <textarea
                  id="draft"
                  ref={draftRef}
                  maxLength={DRAFT_LIMIT}
                  value={draft}
                  onChange={(event) => {
                    invalidate();
                    setDraft(event.target.value);
                  }}
                  placeholder="Paste your message here. It doesn’t have to be perfect…"
                  aria-describedby="draft-count"
                  spellCheck
                />
                <div className="field-bottom">
                  <span>Just a draft. No pressure.</span>
                  <span
                    id="draft-count"
                    className={
                      draft.length === DRAFT_LIMIT ? "limit-reached" : ""
                    }
                  >
                    {draft.length.toLocaleString()} / 2,000
                  </span>
                </div>
              </div>
              <div className="sample-row">
                <span>Try an example</span>
                {samples.map((sample) => (
                  <button
                    type="button"
                    key={sample.label}
                    className="sample-button"
                    onClick={() => {
                      invalidate();
                      setDraft(sample.draft);
                      setIntent(sample.intent);
                      draftRef.current?.focus();
                    }}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
              <fieldset className="tone-field">
                <legend>How should it sound?</legend>
                <div className="tone-options">
                  {TONES.map((choice) => (
                    <label
                      key={choice}
                      className={`tone-option ${tone === choice ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={choice}
                        checked={tone === choice}
                        onChange={() => {
                          invalidate();
                          setTone(choice);
                        }}
                      />
                      <Icon name={toneDetails[choice].icon} size={18} />
                      <span>{choice}</span>
                      <small>{toneDetails[choice].description}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="intent-row">
                <label htmlFor="intent">
                  What’s your intention? <span>Optional</span>
                </label>
                <select
                  id="intent"
                  value={intent}
                  onChange={(event) => {
                    invalidate();
                    setIntent(event.target.value as Intent);
                  }}
                >
                  {INTENTS.map((choice) => (
                    <option key={choice}>{choice}</option>
                  ))}
                </select>
              </div>
              {error && (
                <div className="error-notice" role="alert">
                  <Icon name="info" size={18} />
                  <p>{error}</p>
                </div>
              )}
              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                <span>
                  {loading ? (
                    <span className="spinner" aria-hidden="true" />
                  ) : (
                    <Icon name={error ? "refresh" : "spark"} size={19} />
                  )}
                  {loading
                    ? "Finding the right words…"
                    : error
                      ? "Try again"
                      : "Make over my message"}
                </span>
                {!loading && <Icon name="arrow" size={19} />}
              </button>
              <p className="privacy-note">
                Your text is sent to the AI provider when you rewrite.
                <br />
                Messages aren’t saved by this app.
              </p>
            </form>
          </section>

          <section
            className={`panel result-panel ${result?.status === "ok" ? "has-result" : ""}`}
            aria-labelledby="result-title"
            aria-busy={loading}
          >
            <div className="panel-topline">
              <span className="step-label">
                02 <span>YOUR MAKEOVER</span>
              </span>
              {result?.status === "ok" && (
                <span className="panel-tag result-tag">
                  <Icon name="check" size={12} /> {tone}
                </span>
              )}
            </div>
            <h2 id="result-title">A little more like you.</h2>
            <p className="panel-description">
              Same intention. A fresh way to say it.
            </p>
            <div className="result-body" aria-live="polite">
              {loading ? (
                <div className="result-placeholder loading-placeholder">
                  <div className="placeholder-icon">
                    <Icon name="spark" size={32} />
                  </div>
                  <h3>Giving your words a little care.</h3>
                  <p>
                    Keeping your meaning,
                    <br />
                    finding your tone.
                  </p>
                  <div className="loading-bars" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              ) : result?.status === "ok" ? (
                <>
                  <label className="visually-hidden" htmlFor="rewrite">
                    Your rewritten message
                  </label>
                  <textarea
                    id="rewrite"
                    ref={outputRef}
                    className="output-textarea"
                    value={output}
                    maxLength={OUTPUT_LIMIT}
                    onChange={(event) => {
                      copyGeneration.current += 1;
                      setOutput(event.target.value);
                      setEdited(true);
                      setCopyStatus("idle");
                    }}
                  />
                  <div className="explanation">
                    <span className="explanation-label">
                      <Icon name="spark" size={14} /> WHAT CHANGED
                    </span>
                    <p>{result.explanation}</p>
                    {edited && (
                      <small>
                        You’ve edited the result. This explanation describes the
                        original AI rewrite.
                      </small>
                    )}
                  </div>
                  <div className="result-actions">
                    <span>Make it yours before sending.</span>
                    <button
                      type="button"
                      className="copy-button"
                      disabled={!output.trim()}
                      onClick={copy}
                    >
                      <Icon
                        name={copyStatus === "copied" ? "check" : "copy"}
                        size={16}
                      />
                      {copyStatus === "copied" ? "Copied!" : "Copy message"}
                    </button>
                  </div>
                  <p
                    className={`copy-feedback ${copyStatus === "failed" ? "copy-error" : ""}`}
                    role="status"
                  >
                    {copyStatus === "failed"
                      ? "Couldn’t access the clipboard. The text is selected; copy it manually."
                      : copyStatus === "copied"
                        ? "Your edited message is on the clipboard."
                        : "Review the details. AI can sometimes change meaning."}
                  </p>
                </>
              ) : result?.status === "needs_clarification" ? (
                <div className="clarification">
                  <div className="placeholder-icon">
                    <Icon name="message" size={30} />
                  </div>
                  <h3>One little thing to clarify.</h3>
                  <p className="clarification-question">{result.question}</p>
                  <p>Update your draft with that detail, then try again.</p>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => draftRef.current?.focus()}
                  >
                    Back to my draft <Icon name="arrow" size={16} />
                  </button>
                </div>
              ) : (
                <div className="result-placeholder">
                  <div className="chat-illustration" aria-hidden="true">
                    <div className="chat-back">
                      <i />
                      <i />
                    </div>
                    <div className="chat-front">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="chat-spark">
                      <Icon name="spark" size={21} />
                    </span>
                  </div>
                  <h3>Your next draft starts here.</h3>
                  <p>
                    Add a message, pick a tone,
                    <br />
                    and let’s find a better way to say it.
                  </p>
                  <span className="placeholder-footer">
                    <Icon name="check" size={14} /> Your meaning stays at the
                    heart of it.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="principles">
          <span>
            <Icon name="check" size={16} /> Your meaning comes first
          </span>
          <span>
            <Icon name="check" size={16} /> Thoughtful, not overdone
          </span>
          <span>
            <Icon name="check" size={16} /> Always yours to edit
          </span>
        </div>
      </main>
      <footer className="site-footer">
        <span>Less second-guessing. More saying what you mean.</span>
        <span>Made for everyday conversations.</span>
      </footer>
    </div>
  );
}
