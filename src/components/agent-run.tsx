import { useEffect, useState } from "react";

import { stateOf, StepRow } from "~/components/step-list";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { panelLabel } from "~/lib/styles";
import { cn } from "~/lib/utils";

const GOAL =
  "Prep me for the 2pm with Acme. What's open, and what should I know?";

const STEPS = [
  "Reading the last 3 threads with Acme",
  "Summarizing the open deal and blockers",
  "Checking the renewal date in the contract",
  "Drafting your talking points",
];

const BRIEF = [
  "Renewal lands Aug 14, 38 days out.",
  "Blocker: security review, waiting on our SOC 2 report.",
  "Raise pilot seats before the pricing conversation.",
];

const STEP_MS = 1100;
const RUN_SECONDS = ((STEPS.length * STEP_MS) / 1000).toFixed(1);

export const AgentRun = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(STEPS.length);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= STEPS.length; i += 1) {
      timers.push(setTimeout(() => setActive(i), i * STEP_MS));
    }
    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, []);

  const done = active >= STEPS.length;

  return (
    <Card className="gap-0 overflow-hidden p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className={panelLabel}>Renewals agent</span>
        <Badge className="gap-1.5" variant="outline">
          <span
            className={cn(
              "size-1.5 rounded-full",
              done
                ? "bg-emerald-500"
                : "animate-pulse bg-muted-foreground motion-reduce:animate-none"
            )}
          />
          {done ? `Done · ${RUN_SECONDS}s` : "Working"}
        </Badge>
      </div>

      <div className="px-4 py-4">
        <p className={panelLabel}>Goal</p>
        <p className="mt-1.5 text-sm text-foreground">{GOAL}</p>

        <ol className="mt-4 flex flex-col gap-0.5">
          {STEPS.map((label, index) => (
            <StepRow key={label} label={label} state={stateOf(index, active)} />
          ))}
        </ol>

        {done ? (
          <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 duration-500 animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none">
            <p className={panelLabel}>Draft brief</p>
            <ul className="mt-2 flex flex-col gap-1">
              {BRIEF.map((line) => (
                <li className="flex gap-2 text-sm text-foreground" key={line}>
                  <span className="text-muted-foreground">·</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <Button disabled={!done} size="sm">
          Approve & send
        </Button>
        <Button disabled={!done} size="sm" variant="ghost">
          Edit draft
        </Button>
        <span className="ml-auto font-mono text-[0.7rem] text-muted-foreground">
          you approve every send
        </span>
      </div>
    </Card>
  );
};
