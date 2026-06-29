import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const STEP_MS = 1500;
const STEP_COUNT = 3;

type StepState = "done" | "pending" | "working";

const stateOf = (index: number, active: number): StepState => {
  if (index < active) {
    return "done";
  }
  if (index === active) {
    return "working";
  }
  return "pending";
};

const StepRow = ({ label, state }: { label: string; state: StepState }) => (
  <li className="flex items-center gap-3 py-1">
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
        state === "done" && "border-transparent bg-foreground text-background",
        state === "working" && "border-foreground/40",
        state === "pending" && "border-border"
      )}
    >
      {state === "done" ? <Check className="size-3" /> : null}
      {state === "working" ? (
        <span className="size-1.5 animate-pulse rounded-full bg-foreground motion-reduce:animate-none" />
      ) : null}
    </span>
    <span
      className={cn(
        "font-mono text-xs",
        state === "pending" ? "text-muted-foreground/50" : "text-foreground"
      )}
    >
      {label}
    </span>
  </li>
);

export const BuildProgress = ({ domain }: { domain: string }) => {
  const [active, setActive] = useState(0);
  const steps = [
    `Reading ${domain}`,
    "Understanding the business",
    "Designing 3 agents",
  ];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(STEP_COUNT - 1);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < STEP_COUNT; i += 1) {
      timers.push(setTimeout(() => setActive(i), i * STEP_MS));
    }
    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <Card className="mx-auto w-full max-w-md animate-in gap-0 p-0 fade-in duration-300 motion-reduce:animate-none">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
          Building your agents
        </span>
        <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none" />
      </div>
      <ol className="flex flex-col gap-0.5 px-4 py-4">
        {steps.map((stepLabel, index) => (
          <StepRow
            key={stepLabel}
            label={stepLabel}
            state={stateOf(index, active)}
          />
        ))}
      </ol>
    </Card>
  );
};
