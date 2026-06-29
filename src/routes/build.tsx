import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { BlueprintCard } from "~/components/blueprint-card";
import { BuildProgress } from "~/components/build-progress";
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
  invalid_url: "That doesn't look like a website. Try something like acme.com.",
  rate_limited: "You've run a few in a row — give it a minute and try again.",
  scrape_failed:
    "We couldn't read that site — it may block bots or be down. Try another URL.",
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

  const run = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }
    setStatus("loading");
    setResult(null);
    setErrorCode(null);

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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className={`${container} flex h-14 items-center justify-between`}>
          <Link
            className="font-heading text-lg font-semibold tracking-tight"
            to="/"
          >
            Tallos
          </Link>
          <Button asChild size="sm" variant="ghost">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>

      <main className={`${container} py-16 md:py-24`}>
        <div className="mx-auto max-w-2xl text-center">
          <p className={eyebrow}>Free · no signup</p>
          <h1 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            See the agents we'd build for your business
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Drop in your website. Tallos reads it and designs three AI agents
            tailored to how your team works.
          </p>

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

        <div className="mt-14">
          {status === "loading" ? (
            <BuildProgress domain={displayDomain(url)} />
          ) : null}

          {status === "error" && errorCode ? (
            <div
              className={`mx-auto max-w-md rounded-2xl border border-border bg-muted/30 p-6 text-center ${enterAnim} slide-in-from-bottom-2`}
            >
              <p className="text-pretty text-sm text-foreground">
                {ERROR_MESSAGES[errorCode]}
              </p>
              <Button
                className="mt-4 active:scale-[0.96]"
                onClick={run}
                size="sm"
                variant="outline"
              >
                Try again
              </Button>
            </div>
          ) : null}

          {status === "done" && result ? (
            <div className="flex flex-col gap-10">
              <div
                className={`text-center ${enterAnim} slide-in-from-bottom-2`}
              >
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
                  These are tailored to {result.domain}. Book a call and we'll
                  help you put them to work.
                </p>
                <Button asChild className="mt-6 active:scale-[0.96]" size="lg">
                  <a href={BOOK_A_CALL_URL}>Book a call</a>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/build")({
  component: Build,
  head: () => ({
    meta: [
      { title: "Tallos — see the agents we'd build for your business" },
      {
        content:
          "Enter your website and Tallos designs three AI agents tailored to your business — free, no signup.",
        name: "description",
      },
    ],
  }),
});
