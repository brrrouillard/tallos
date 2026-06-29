// A Blueprint is a *proposed* agent definition generated for a visitor's
// business — not a runnable Agent. See CONTEXT.md. The category comes from a
// closed set so the UI can map it to an icon without trusting model output.

export const BLUEPRINT_CATEGORIES = [
  "customer-support",
  "finance",
  "marketing",
  "operations",
  "people",
  "product",
  "research",
  "sales",
] as const;

export type BlueprintCategory = (typeof BLUEPRINT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<BlueprintCategory, string> = {
  "customer-support": "Customer Support",
  finance: "Finance",
  marketing: "Marketing",
  operations: "Operations",
  people: "People",
  product: "Product",
  research: "Research",
  sales: "Sales",
};

export interface Blueprint {
  category: BlueprintCategory;
  estTimeSaved: string;
  exampleTask: string;
  features: string[];
  name: string;
  shortDescription: string;
  whyItFits: string;
}

export interface BlueprintsResult {
  blueprints: Blueprint[];
  domain: string;
}

export const BLUEPRINT_COUNT = 3;

const isCategory = (value: unknown): value is BlueprintCategory =>
  typeof value === "string" &&
  (BLUEPRINT_CATEGORIES as readonly string[]).includes(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const toBlueprint = (raw: unknown): Blueprint | null => {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const features = Array.isArray(record.features)
    ? record.features.filter(isNonEmptyString)
    : [];

  if (
    !(
      isCategory(record.category) &&
      isNonEmptyString(record.name) &&
      isNonEmptyString(record.shortDescription) &&
      isNonEmptyString(record.whyItFits) &&
      isNonEmptyString(record.exampleTask) &&
      isNonEmptyString(record.estTimeSaved) &&
      features.length > 0
    )
  ) {
    return null;
  }

  return {
    category: record.category,
    estTimeSaved: record.estTimeSaved.trim(),
    exampleTask: record.exampleTask.trim(),
    features: features.map((f) => f.trim()),
    name: record.name.trim(),
    shortDescription: record.shortDescription.trim(),
    whyItFits: record.whyItFits.trim(),
  };
};

// Validate the model's JSON. Returns exactly BLUEPRINT_COUNT blueprints, or
// null when the payload is malformed or too short (caller retries once).
export const parseBlueprints = (raw: unknown): Blueprint[] | null => {
  const list = Array.isArray(raw)
    ? raw
    : (raw as { blueprints?: unknown })?.blueprints;
  if (!Array.isArray(list)) {
    return null;
  }

  const valid: Blueprint[] = [];
  for (const item of list) {
    const blueprint = toBlueprint(item);
    if (blueprint) {
      valid.push(blueprint);
    }
  }

  return valid.length >= BLUEPRINT_COUNT
    ? valid.slice(0, BLUEPRINT_COUNT)
    : null;
};
