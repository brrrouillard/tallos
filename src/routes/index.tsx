import { createFileRoute } from "@tanstack/react-router";

import { AgentRun } from "~/components/agent-run";
import { Button } from "~/components/ui/button";

const PROCESS = [
  {
    body: "Tell Tallos what the agent should do, which of your tools it can touch, and what good looks like — all in plain language.",
    title: "Describe the agent",
  },
  {
    body: "The agent pulls context from your tools and data, works through each step, and keeps a record you can read.",
    title: "It does the work",
  },
  {
    body: "Review the result, refine the agent, and approve. Nothing leaves your workspace without your okay.",
    title: "You stay in control",
  },
];

const AGENTS = [
  {
    detail:
      "Tracks your accounts, flags churn risk, and preps you before every renewal call.",
    title: "Renewals agent",
  },
  {
    detail:
      "Triages your shared inbox, drafts replies, and routes what it can't answer.",
    title: "Inbox agent",
  },
  {
    detail:
      "Walks every new hire or customer through your exact steps, at your standard.",
    title: "Onboarding agent",
  },
  {
    detail:
      "Digs through your docs and the web on demand, and cites every source.",
    title: "Research agent",
  },
];

const eyebrow =
  "font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground";
const container = "mx-auto w-full max-w-6xl px-6";
const sectionHeading =
  "mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl";

const Home = () => (
  <div className="min-h-svh">
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className={`${container} flex h-14 items-center justify-between`}>
        <a
          className="font-heading text-lg font-semibold tracking-tight"
          href="#top"
        >
          Tallos
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          <a
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="#how"
          >
            How it works
          </a>
          <a
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            href="#agents"
          >
            Examples
          </a>
        </nav>
        <Button size="sm">Request access</Button>
      </div>
    </header>

    <main>
      <section id="top">
        <div
          className={`${container} grid gap-12 py-20 md:grid-cols-2 md:gap-10 md:py-28 lg:items-center`}
        >
          <div className="flex flex-col">
            <p className={eyebrow}>Custom AI agents for your business</p>
            <h1 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Build the agents
              <br />
              your business needs.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Tallos lets you design AI agents around your own tools, data, and
              workflows — each one shaped to a real job your team needs done,
              and showing its work before anything ships.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg">Request access</Button>
              <Button asChild size="lg" variant="ghost">
                <a href="#how">How it works</a>
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              Private beta · shaped to your business, not a template
            </p>
          </div>
          <div className="md:pl-4">
            <AgentRun />
          </div>
        </div>
      </section>

      <section className="border-t border-border" id="how">
        <div className={`${container} py-20 md:py-24`}>
          <div className="max-w-xl">
            <p className={eyebrow}>How it works</p>
            <h2 className={sectionHeading}>
              You build the agent. It does the work.
            </h2>
          </div>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {PROCESS.map((step, index) => (
              <li
                className="flex flex-col border-t border-border pt-5"
                key={step.title}
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-lg font-medium">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30" id="agents">
        <div className={`${container} py-20 md:py-24`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className={eyebrow}>Agents teams build</p>
              <h2 className={sectionHeading}>
                Build one for every job that piles up
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Each one is shaped to a real job in your business — with the
              tools, data, and guardrails you give it. These four are just
              examples.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {AGENTS.map((agent) => (
              <div className="bg-background p-6" key={agent.title}>
                <h3 className="font-heading text-lg font-medium">
                  {agent.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {agent.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div
          className={`${container} grid gap-10 py-20 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16 md:py-24`}
        >
          <div>
            <p className={eyebrow}>Tailored to you</p>
            <h2 className={sectionHeading}>
              Not a template.
              <br />
              Your agents.
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-base text-muted-foreground">
            <p>
              Give each agent the tools it needs, the data it should know, and
              the exact scope of its job. No two businesses run the same way —
              and neither do their agents.
            </p>
            <p>
              Assemble a roster that mirrors how your team actually works, and
              let them run in parallel while you stay in control.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className={`${container} py-20 text-center md:py-28`}>
          <h2 className="mx-auto max-w-2xl text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Build agents that fit your business
          </h2>
          <p className="mx-auto mt-5 max-w-md text-muted-foreground">
            Design an agent around your real work, watch it run, and ship on
            your terms.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg">Request access</Button>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-border">
      <div
        className={`${container} flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex items-center gap-3">
          <span className="font-heading font-semibold">Tallos</span>
          <span className="font-mono text-xs text-muted-foreground">
            Custom AI agents for your business
          </span>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          © 2026 Tallos · Private beta
        </p>
      </div>
    </footer>
  </div>
);

export const Route = createFileRoute("/")({
  component: Home,
});
