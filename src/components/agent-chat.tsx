import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { stateOf, StepRow } from "~/components/step-list";
import { Card } from "~/components/ui/card";
import { BLUEPRINT_COUNT } from "~/lib/blueprints";
import { panelLabel } from "~/lib/styles";

const STEP_MS = 1400;

type ChatStatus = "done" | "error" | "loading";

const bubbleIn =
  "animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-300 motion-reduce:animate-none";

// Turn a domain into a display name: "supermarkett.com" -> "Supermarkett".
const companyName = (domain: string): string => {
  const sld = domain.split(".")[0] ?? "";
  return sld ? sld.charAt(0).toUpperCase() + sld.slice(1) : domain;
};

const AgentBubble = ({ children }: { children: ReactNode }) => (
  <div className={`flex items-start gap-2.5 ${bubbleIn}`}>
    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
      <Sparkles className="size-3" />
    </span>
    <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5 text-sm text-foreground">
      {children}
    </div>
  </div>
);

export const AgentChat = ({
  domain,
  errorMessage,
  status,
  understanding,
}: {
  domain: string;
  errorMessage?: string;
  status: ChatStatus;
  understanding?: string;
}) => {
  const [active, setActive] = useState(0);
  const steps = [
    "Reading the website",
    "Understanding the business",
    `Designing ${BLUEPRINT_COUNT} agents`,
  ];
  const stepCount = steps.length;
  const company = companyName(domain);
  const done = status === "done";
  const activeStep = done ? stepCount : active;

  useEffect(() => {
    if (status !== "loading") {
      return;
    }
    setActive(0);
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
  }, [status, stepCount]);

  return (
    <Card className="mx-auto w-full max-w-xl gap-0 p-0 text-left">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm text-primary-foreground">
            {domain}
          </div>
        </div>

        {status === "error" ? (
          <AgentBubble>{errorMessage}</AgentBubble>
        ) : (
          <>
            <AgentBubble>
              <p>
                Let me analyze what{" "}
                <span className="font-medium">{company}</span> is doing…
              </p>
              <ol className="mt-2.5 flex flex-col gap-0.5">
                {steps.map((label, index) => (
                  <StepRow
                    key={label}
                    label={label}
                    state={stateOf(index, activeStep)}
                  />
                ))}
              </ol>
            </AgentBubble>

            {done ? (
              <AgentBubble>
                <p className={`${panelLabel} mb-1.5`}>Here's what I see</p>
                <p className="text-pretty">
                  {understanding ||
                    `Here's what I found about ${company} — and ${BLUEPRINT_COUNT} agents I'd build for your team below.`}
                </p>
              </AgentBubble>
            ) : null}
          </>
        )}
      </div>
    </Card>
  );
};
