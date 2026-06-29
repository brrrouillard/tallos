import {
  Banknote,
  Check,
  Clock,
  FlaskConical,
  Headset,
  Megaphone,
  Package,
  Settings2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { Blueprint, BlueprintCategory } from "~/lib/blueprints";
import { CATEGORY_LABELS } from "~/lib/blueprints";
import { panelLabel } from "~/lib/styles";

const CATEGORY_ICONS: Record<BlueprintCategory, LucideIcon> = {
  "customer-support": Headset,
  finance: Banknote,
  marketing: Megaphone,
  operations: Settings2,
  people: Users,
  product: Package,
  research: FlaskConical,
  sales: Target,
};

export const BlueprintCard = ({ blueprint }: { blueprint: Blueprint }) => {
  const Icon = CATEGORY_ICONS[blueprint.category];

  return (
    <Card className="w-full">
      <CardContent className="grid gap-8 py-2 md:grid-cols-12 md:gap-10">
        <div className="flex flex-col gap-4 md:col-span-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-muted text-foreground">
              <Icon className="size-5" />
            </span>
            <Badge variant="outline">
              {CATEGORY_LABELS[blueprint.category]}
            </Badge>
          </div>
          <div>
            <h3 className="font-heading text-2xl font-semibold tracking-tight">
              {blueprint.name}
            </h3>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              {blueprint.shortDescription}
            </p>
          </div>
          <span className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            Potential time back: {blueprint.estTimeSaved}
          </span>
        </div>

        <div className="flex flex-col gap-6 md:col-span-8">
          <div className="rounded-2xl border border-border bg-foreground/[0.03] p-4">
            <p className={`${panelLabel} flex items-center gap-1.5`}>
              <TrendingUp className="size-3.5" />
              Value
            </p>
            <p className="mt-1.5 text-pretty text-sm font-medium text-foreground">
              {blueprint.outcome}
            </p>
          </div>

          <div>
            <p className={panelLabel}>What it does</p>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {blueprint.features.map((feature) => (
                <li className="flex items-start gap-2 text-sm" key={feature}>
                  <Check className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className={panelLabel}>Why it fits you</p>
              <p className="mt-1.5 text-pretty text-sm text-foreground">
                {blueprint.whyItFits}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <p className={panelLabel}>Try</p>
              <p className="mt-1.5 text-pretty text-sm text-foreground">
                “{blueprint.exampleTask}”
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
