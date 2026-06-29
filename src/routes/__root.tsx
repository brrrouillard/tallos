/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

const RootDocument = ({ children }: { children: ReactNode }) => (
  <html className="dark" lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      {children}
      <TanStackRouterDevtools position="bottom-right" />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      {
        content:
          "Tallos lets you build AI agents tailored to your own tools, data, and workflows — agents that do your team's real work and show their reasoning before anything ships.",
        name: "description",
      },
      { title: "Tallos — build AI agents tailored to your business" },
    ],
  }),
  shellComponent: RootDocument,
});
