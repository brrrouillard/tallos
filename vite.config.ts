import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    // tanstackStart must come before viteReact; it generates the route tree
    // (src/routeTree.gen.ts) and wires up SSR + the server entry.
    tanstackStart(),
    viteReact(),
    nitro(),
  ],
  resolve: {
    // Vite 8 native (experimental) tsconfig `paths` resolution — drives the
    // `~/*` alias from tsconfig.json without the vite-tsconfig-paths plugin.
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
  },
});
