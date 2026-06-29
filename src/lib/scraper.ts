// Website scraper ported from the LeadsRover repo (same TanStack Start + Bun
// stack). Native fetch with browser-like headers, falling back to Jina Reader
// for JS-rendered or bot-protected sites. Some sites still return nothing —
// callers must handle an empty result.

interface ScrapedPage {
  statusCode: number;
  text: string;
  url: string;
}

export interface SiteScrape {
  baseUrl: string;
  domain: string;
  pageCount: number;
  rawText: string;
}

// Common pages worth crawling for extra business context.
const COMMON_PAGES = [
  "/about",
  "/about-us",
  "/contact",
  "/services",
  "/products",
  "/pricing",
  "/solutions",
  "/team",
];

// Browser-like headers to get past basic bot detection. Keys sorted to satisfy
// the strict lint ruleset.
const BROWSER_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// Minimum text length before we treat a scrape as usable.
const MIN_HOMEPAGE_CONTENT = 50;
const MIN_TOTAL_CONTENT = 200;
const FAST_TIMEOUT_MS = 6000;
const JINA_TIMEOUT_MS = 15_000;
const MAX_TEXT_CHARS = 12_000;

const extractTextFromHtml = (html: string): string =>
  html
    .replaceAll(/<script[^>]*>[\s\S]*?<\/script>/giu, " ")
    .replaceAll(/<style[^>]*>[\s\S]*?<\/style>/giu, " ")
    .replaceAll(/<noscript[^>]*>[\s\S]*?<\/noscript>/giu, " ")
    .replaceAll(/<!--[\s\S]*?-->/gu, " ")
    .replaceAll(/<[^>]+>/gu, " ")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll(/\s+/gu, " ")
    .trim();

const withProtocol = (input: string): string => {
  const trimmed = input.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/^http:\/\//u, "https://");
  }
  return `https://${trimmed}`;
};

const BLOCKED_HOSTS = new Set(["0.0.0.0", "::1", "127.0.0.1", "localhost"]);

const isPrivateIpv4 = (hostname: string): boolean => {
  const parts = hostname.split(".");
  if (parts.length !== 4 || !parts.every((p) => /^\d+$/u.test(p))) {
    return false;
  }
  const first = Number.parseInt(parts[0] ?? "", 10);
  const second = Number.parseInt(parts[1] ?? "", 10);
  return (
    first === 10 ||
    first === 127 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 169 && second === 254)
  );
};

// Validate the URL and block private/internal addresses (SSRF protection).
export const isSafeUrl = (input: string): boolean => {
  try {
    const parsed = new URL(withProtocol(input));
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    return !(BLOCKED_HOSTS.has(hostname) || isPrivateIpv4(hostname));
  } catch {
    return false;
  }
};

const scrapePage = async (
  url: string,
  timeoutMs: number
): Promise<ScrapedPage | null> => {
  try {
    const response = await fetch(url, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      return null;
    }
    const text = extractTextFromHtml(await response.text());
    return { statusCode: response.status, text, url };
  } catch {
    return null;
  }
};

// Jina Reader renders JS and returns clean text. Used as a fallback when the
// direct fetch comes back empty.
const scrapeViaJina = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain", "X-No-Cache": "true" },
      signal: AbortSignal.timeout(JINA_TIMEOUT_MS),
    });
    if (!response.ok) {
      return null;
    }
    const body = await response.text();
    const text = body.trim();
    return text.length < MIN_HOMEPAGE_CONTENT ? null : text;
  } catch {
    return null;
  }
};

// Scrape a business site: crawl the homepage plus a few common pages in
// parallel, falling back to Jina Reader when the direct fetch is too thin.
// Resolves to `null` when nothing usable could be read.
export const scrapeSite = async (input: string): Promise<SiteScrape | null> => {
  const fullUrl = withProtocol(input);
  const parsed = new URL(fullUrl);
  const baseUrl = `${parsed.protocol}//${parsed.host}`;
  const domain = parsed.host.replace(/^www\./u, "");

  const targets = [fullUrl, ...COMMON_PAGES.map((path) => `${baseUrl}${path}`)];
  const results = await Promise.allSettled(
    targets.map((url) => scrapePage(url, FAST_TIMEOUT_MS))
  );

  const pages: ScrapedPage[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      pages.push(result.value);
    }
  }

  let rawText = pages.map((p) => p.text).join("\n\n");

  if (rawText.length < MIN_TOTAL_CONTENT) {
    const jina = await scrapeViaJina(fullUrl);
    if (jina) {
      rawText = [rawText, jina].filter(Boolean).join("\n\n");
    }
  }

  if (rawText.trim().length < MIN_HOMEPAGE_CONTENT) {
    return null;
  }

  return {
    baseUrl,
    domain,
    pageCount: pages.length,
    rawText: rawText.slice(0, MAX_TEXT_CHARS),
  };
};
