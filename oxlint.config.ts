import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

export default defineConfig({
  extends: [core],
  // shadcn-generated components follow shadcn's own style; don't lint them.
  ignorePatterns: [...(core.ignorePatterns ?? []), "src/components/ui/**"],
});
