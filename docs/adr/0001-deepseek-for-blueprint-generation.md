# Use DeepSeek for public blueprint generation

The `/build` page scrapes a visitor's website and asks an LLM to generate 3 agent **blueprints** from it. We chose **DeepSeek V4 Flash** (direct `api.deepseek.com`, OpenAI-compatible, key in `.env` as `DEEPSEEK_API_KEY`, model id via `DEEPSEEK_MODEL`, default `deepseek-chat`) for this generation step.

This is surprising on two counts, which is why it's worth recording: Tallos is otherwise an Anthropic-ecosystem project, and the scraper we lifted comes from the sibling **LeadsRover** repo, which uses **Google Gemini** for its own website analysis. A future reader will reasonably ask "why a third provider here?"

We weighed Claude (best marketing-facing copy, ecosystem alignment) and reusing Gemini (zero new infra) against DeepSeek, and chose DeepSeek for cost on a **public, abusable, unauthenticated** endpoint while accepting it as a deliberate per-feature choice, not a platform-wide standard. Because DeepSeek offers JSON mode rather than strict schema-guaranteed structured output, the generator prompts for JSON, validates against the Blueprint schema (`src/lib/blueprints.ts`), and retries once before failing. Swapping providers is contained to `src/server/blueprints.ts` (any OpenAI-compatible endpoint) should the trade-off change.
