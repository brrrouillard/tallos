import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

import type { Blueprint, BlueprintsResult } from "~/lib/blueprints";
import {
  BLUEPRINT_CATEGORIES,
  BLUEPRINT_COUNT,
  parseBlueprints,
} from "~/lib/blueprints";
import { checkRateLimit } from "~/lib/rate-limit";
import { isSafeUrl, scrapeSite } from "~/lib/scraper";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
const MAX_TOKENS = 1800;

const SYSTEM_PROMPT = `You are a product strategist for Tallos, a platform where teams spin up AI agents to do work for them.

Given the text scraped from a company's website, propose exactly ${BLUEPRINT_COUNT} AI agents ("blueprints") that would help THAT specific business. These are aspirational ideas — agents the team could build in Tallos.

Return ONLY a JSON object of this exact shape:
{
  "blueprints": [
    {
      "name": "string — short, brandable agent name (1-3 words), specific to this business, not generic",
      "category": "one of: ${BLUEPRINT_CATEGORIES.join(", ")}",
      "shortDescription": "string — one sentence, max ~18 words, what the agent does",
      "features": ["3-5 short concrete capability phrases"],
      "whyItFits": "string — one sentence citing something specific from THIS business",
      "exampleTask": "string — a concrete goal the user would hand the agent, phrased as a natural instruction, specific to their domain",
      "estTimeSaved": "string — a HEDGED rough range like '~3-5 hrs/wk', never a precise number"
    }
  ]
}

Rules:
- Exactly ${BLUEPRINT_COUNT} blueprints, each in a DIFFERENT category from the allowed list.
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
): Promise<Blueprint[] | null> => {
  try {
    return parseBlueprints(await callDeepSeek(userContent, apiKey));
  } catch {
    return null;
  }
};

// Generate 3 validated blueprints, retrying once if the model returns
// malformed or insufficient JSON.
const generateBlueprints = async (
  rawText: string,
  domain: string
): Promise<Blueprint[]> => {
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
      const blueprints = await generateBlueprints(
        scrape.rawText,
        scrape.domain
      );
      return { data: { blueprints, domain: scrape.domain }, ok: true };
    } catch {
      return { error: "generation_failed", ok: false };
    }
  });
