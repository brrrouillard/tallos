import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

import type { BlueprintsResult, Generation } from "~/lib/blueprints";
import {
  BLUEPRINT_CATEGORIES,
  BLUEPRINT_COUNT,
  parseGeneration,
} from "~/lib/blueprints";
import { checkRateLimit } from "~/lib/rate-limit";
import { isSafeUrl, scrapeSite } from "~/lib/scraper";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
const MAX_TOKENS = 2200;

const SYSTEM_PROMPT = `You are an operations advisor for Tallos, a platform where a team spins up internal AI agents that take recurring work off their plate.

You are given the text scraped from a company's website. Put yourself in the seat of the FOUNDER/OPERATOR running this company and propose exactly ${BLUEPRINT_COUNT} internal AI agents ("blueprints") — teammates that would do real, recurring work for THEIR team. Think about what eats their week: answering the same questions, chasing leads, writing the same content, reconciling data, onboarding people, pulling reports.

Return ONLY a JSON object of this exact shape:
{
  "understanding": "string — 2-3 sentences, first person (\\"I can see that…\\"), explaining what THIS company does, who it serves, and how it operates or makes money. Shown to the user as you thinking out loud, so be specific to them, not generic.",
  "blueprints": [
    {
      "name": "string — short, brandable agent name (1-3 words), specific to this business, not generic",
      "category": "one of: ${BLUEPRINT_CATEGORIES.join(", ")}",
      "shortDescription": "string — one sentence, max ~18 words, the recurring job this agent owns",
      "features": ["3-5 short concrete capability phrases"],
      "outcome": "string — one sentence stating the concrete, tangible RESULT for the team (what measurably changes), phrased as an outcome, not a feature",
      "whyItFits": "string — one sentence citing something specific from THIS business",
      "exampleTask": "string — a concrete instruction the operator would hand the agent, specific to their domain",
      "estTimeSaved": "string — a HEDGED rough range like '~3-5 hrs/wk', never a precise number"
    }
  ]
}

Rules:
- Write "understanding" first, grounded in what the site actually says — specific to this company.
- Exactly ${BLUEPRINT_COUNT} blueprints, each in a DIFFERENT category from the allowed list.
- Each agent works INTERNALLY for the team, using their own tools and data. It is NOT a feature to add to the company's product, and NOT a rebuild of something the company already sells or already does for its own users. If the company already offers a capability, the agent helps the team RUN the business around it — it never duplicates the product.
- Ground every blueprint in what the website actually says. If the site is thin, stay general but plausible — never invent specific facts (named customers, metrics) that aren't present.
- estTimeSaved must always be a hedged range with a "~", e.g. "~2-4 hrs/wk".
- Output the JSON object only, no prose, no markdown fences.`;

const callDeepSeek = async (
  userContent: string,
  apiKey: string
): Promise<unknown> => {
  const response = await fetch(DEEPSEEK_URL, {
    body: JSON.stringify({
      max_tokens: MAX_TOKENS,
      messages: [
        { content: SYSTEM_PROMPT, role: "system" },
        { content: userContent, role: "user" },
      ],
      model: DEEPSEEK_MODEL,
      response_format: { type: "json_object" },
      temperature: 0.6,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek returned no content");
  }
  return JSON.parse(content);
};

const attemptGenerate = async (
  userContent: string,
  apiKey: string
): Promise<Generation | null> => {
  try {
    return parseGeneration(await callDeepSeek(userContent, apiKey));
  } catch {
    return null;
  }
};

// Generate the understanding + 3 validated blueprints, retrying once if the
// model returns malformed or insufficient JSON.
const generateBlueprints = async (
  rawText: string,
  domain: string
): Promise<Generation> => {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set");
  }

  const userContent = `Website: ${domain}\n\nScraped content:\n${rawText}`;

  const firstTry = await attemptGenerate(userContent, apiKey);
  if (firstTry) {
    return firstTry;
  }

  const secondTry = await attemptGenerate(userContent, apiKey);
  if (secondTry) {
    return secondTry;
  }

  throw new Error("Could not generate valid blueprints");
};

export type GenerateResult =
  | { error: BlueprintError; ok: false }
  | { data: BlueprintsResult; ok: true };

export type BlueprintError =
  | "generation_failed"
  | "invalid_url"
  | "rate_limited"
  | "scrape_failed";

const clientIp = (): string =>
  getRequestIP() ?? getRequestHeader("x-forwarded-for") ?? "unknown";

export const generateBlueprintsForSite = createServerFn({ method: "POST" })
  .validator((input: { url: string }) => ({ url: input.url }))
  .handler(async ({ data }): Promise<GenerateResult> => {
    const url = data.url.trim();
    if (!(url && isSafeUrl(url))) {
      return { error: "invalid_url", ok: false };
    }

    const limit = checkRateLimit(
      `blueprints:${clientIp()}`,
      RATE_LIMIT_MAX,
      RATE_LIMIT_WINDOW_MS
    );
    if (!limit.allowed) {
      return { error: "rate_limited", ok: false };
    }

    const scrape = await scrapeSite(url);
    if (!scrape) {
      return { error: "scrape_failed", ok: false };
    }

    try {
      const generation = await generateBlueprints(
        scrape.rawText,
        scrape.domain
      );
      return {
        data: {
          blueprints: generation.blueprints,
          domain: scrape.domain,
          understanding: generation.understanding,
        },
        ok: true,
      };
    } catch {
      return { error: "generation_failed", ok: false };
    }
  });
