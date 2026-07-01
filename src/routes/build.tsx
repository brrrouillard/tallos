import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { AgentChat } from "~/components/agent-chat";
import { BlueprintCard } from "~/components/blueprint-card";
import { SiteHeader } from "~/components/site-header";
import { Button } from "~/components/ui/button";
import type { BlueprintsResult } from "~/lib/blueprints";
import { BLUEPRINT_COUNT } from "~/lib/blueprints";
import { BOOK_A_CALL_URL } from "~/lib/links";
import { container, eyebrow } from "~/lib/styles";
import type { BlueprintError } from "~/server/blueprints";
import { generateBlueprintsForSite } from "~/server/blueprints";

type Status = "done" | "error" | "idle" | "loading";

const ERROR_MESSAGES: Record<BlueprintError, string> = {
  generation_failed:
    "Something went wrong building your agents. Please try again.",
  invalid_url: "That doesn’t look like a website. Try something like acme.com.",
  rate_limited: "You’ve run a few in a row — give it a minute and try again.",
  scrape_failed:
    "We couldn’t read that site — it may block bots or be down. Try another URL.",
};

const enterAnim =
  "animate-in fade-in fill-mode-backwards duration-500 motion-reduce:animate-none";

const displayDomain = (input: string): string => {
  const stripped = input
    .trim()
    .replace(/^https?:\/\//u, "")
    .replace(/^www\./u, "");
  return stripped.split("/")[0] || stripped;
};

const Build = () => {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<BlueprintsResult | null>(null);
  const [errorCode, setErrorCode] = useState<BlueprintError | null>(null);
  const [pendingDomain, setPendingDomain] = useState("");

  const run = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }
    setStatus("loading");
    setResult(null);
    setErrorCode(null);
    setPendingDomain(displayDomain(trimmed));

    try {
      const response = await generateBlueprintsForSite({
        data: { url: trimmed },
      });
      if (response.ok) {
        setResult(response.data);
        setStatus("done");
      } else {
        setErrorCode(response.error);
        setStatus("error");
      }
    } catch {
      setErrorCode("generation_failed");
      setStatus("error");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run();
  };

  return (
    <div className="min-h-svh">
      <SiteHeader />

      <main className={`${container} py-16 md:py-24`}>
        <div className="mx-auto flex max-w-2xl flex-col text-center">
          <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            See the agents we’d build for your business
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Drop in your website. Tallos reads it and designs {BLUEPRINT_COUNT}{" "}
            AI agents tailored to how your team works.
          </p>

          {status === "idle" ? null : (
            <div className="mt-10">
              <AgentChat
                domain={pendingDomain}
                errorMessage={errorCode ? ERROR_MESSAGES[errorCode] : undefined}
                status={status}
                understanding={result?.understanding}
              />
            </div>
          )}

          <form
            className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <input
              aria-label="Website URL"
              autoComplete="url"
              className="h-11 w-full rounded-4xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              disabled={status === "loading"}
              inputMode="url"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="yourcompany.com"
              type="text"
              value={url}
            />
            <Button
              className="h-11 shrink-0 active:scale-[0.96]"
              disabled={status === "loading" || !url.trim()}
              size="lg"
              type="submit"
            >
              {status === "loading" ? (
                "Working…"
              ) : (
                <>
                  Show me
                  <ArrowRight />
                </>
              )}
            </Button>
          </form>
        </div>

        {status === "done" && result ? (
          <div className="mt-16 flex flex-col gap-10">
            <div className={`text-center ${enterAnim} slide-in-from-bottom-2`}>
              <p
                className={`${eyebrow} flex items-center justify-center gap-1.5`}
              >
                <Sparkles className="size-3.5" />
                {BLUEPRINT_COUNT} agents for {result.domain}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {result.blueprints.map((blueprint, index) => (
                <div
                  className={`${enterAnim} slide-in-from-bottom-3`}
                  key={blueprint.name}
                  style={{ animationDelay: `${(index + 1) * 90}ms` }}
                >
                  <BlueprintCard blueprint={blueprint} />
                </div>
              ))}
            </div>

            <div
              className={`mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center ${enterAnim} slide-in-from-bottom-2 [animation-delay:360ms]`}
            >
              <h2 className="text-balance font-heading text-2xl font-semibold tracking-tight">
                Want these working for you?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-muted-foreground">
                These are tailored to {result.domain}. Book a call and we’ll
                help you put them to work.
              </p>
              <Button asChild className="mt-6 active:scale-[0.96]" size="lg">
                <a href={BOOK_A_CALL_URL}>Book a call</a>
              </Button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export const Route = createFileRoute("/build")({
  component: Build,
  head: () => ({
    meta: [
      { title: "Tallos — see the agents we’d build for your business" },
      {
        content:
          "Enter your website and Tallos designs three AI agents tailored to your business — free, no signup.",
        name: "description",
      },
    ],
  }),
});
