// Shared presentational class tokens used across marketing pages/components.
export const container = "mx-auto w-full max-w-6xl px-6";
// Section eyebrow reads as a drafting annotation: a short marking-pencil leader
// line (accent) precedes the mono label, tying the blueprint motif through every
// section. `before` is a flex child, so `gap` spaces it from the text.
export const eyebrow =
  "inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground before:h-px before:w-6 before:bg-primary before:content-['']";
export const panelLabel =
  "font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground";
// Fluid heading — scales smoothly 30px→36px instead of jumping at the sm
// breakpoint (clamp() per the responsive fluid-typography guidance).
export const sectionHeading =
  "mt-4 font-heading text-[clamp(1.875rem,1.5rem+1.7vw,2.25rem)] font-semibold tracking-tight";
