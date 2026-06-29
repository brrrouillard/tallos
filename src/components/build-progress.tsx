import { useEffect, useState } from "react";

import { StepRow, stateOf } from "~/components/step-list";
import { Card } from "~/components/ui/card";
import { BLUEPRINT_COUNT } from "~/lib/blueprints";
import { panelLabel } from "~/lib/styles";

const STEP_MS = 1500;

const buildSteps = (domain: string): string[] => [
  `Reading ${domain}`,
  "Understanding the business",
  `Designing ${BLUEPRINT_COUNT} agents`,
];

export const BuildProgress = ({ domain }: { domain: string }) => {
  const [active, setActive] = useState(0);
  const steps = buildSteps(domain);
  const stepCount = steps.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(stepCount - 1);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < stepCount; i += 1) {
      timers.push(setTimeout(() => setActive(i), i * STEP_MS));
    }
    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, [stepCount]);

  return (
    <Card className="mx-auto w-full max-w-md animate-in gap-0 p-0 fade-in duration-300 motion-reduce:animate-none">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className={panelLabel}>Building your agents</span>
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
