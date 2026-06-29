import { Check } from "lucide-react";

import { cn } from "~/lib/utils";

export type StepState = "done" | "pending" | "working";

export const stateOf = (index: number, active: number): StepState => {
  if (index < active) {
    return "done";
  }
  if (index === active) {
    return "working";
  }
  return "pending";
};

const StepMarker = ({ state }: { state: StepState }) => {
  if (state === "done") {
    return <Check className="size-3" />;
  }
  if (state === "working") {
    return (
      <span className="size-1.5 animate-pulse rounded-full bg-foreground motion-reduce:animate-none" />
    );
  }
  return null;
};

export const StepRow = ({
  label,
  state,
}: {
  label: string;
  state: StepState;
}) => (
  <li className="flex items-center gap-3 py-1">
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
        state === "done" && "border-transparent bg-foreground text-background",
        state === "working" && "border-foreground/40",
        state === "pending" && "border-border"
      )}
    >
      <StepMarker state={state} />
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
