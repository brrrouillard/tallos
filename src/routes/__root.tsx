/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

const RootDocument = ({ children }: { children: ReactNode }) => (
  <html className="dark antialiased" lang="en">
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
          "Build AI agents shaped to your own tools, data, and workflows. Each one does your team's real work and shows every step before anything ships.",
        name: "description",
      },
      { title: "Tallos: build AI agents tailored to your business" },
    ],
  }),
  shellComponent: RootDocument,
});
