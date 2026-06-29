# Tallos

The shared language of Tallos — a B2B platform where teams spin up AI agents to get work done. This glossary is the source of truth for what our terms mean; keep code, copy, and conversation aligned to it.

## Language

**Agent**:
A real, runnable AI worker that Tallos executes on a user's behalf, instantiated from an agent definition.
_Avoid_: bot, assistant, worker

**Agent definition**:
The data that describes an agent (its name, scope, tools, behaviour). Agents are instantiated from definitions; modelling definitions as data is what lets v2 support user-created agents.
_Avoid_: config (too generic), template

**Blueprint**:
A _proposed_ agent definition generated for a visitor's business on the public page. A blueprint is not runnable and is not an Agent — it is a suggestion that could be instantiated into a real agent (in v2). Each blueprint has a name, a short description, and a set of features.
_Avoid_: agent idea, suggested agent, agent (bare)
