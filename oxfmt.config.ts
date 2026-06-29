import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // Leave shadcn-generated components in their own formatting.
  ignorePatterns: [...(ultracite.ignorePatterns ?? []), "src/components/ui/**"],
});
