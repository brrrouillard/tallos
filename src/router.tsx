import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

// TanStack Start auto-discovers this `getRouter` export to create the router
// on both the server and the client.
export const getRouter = () =>
  createRouter({
    defaultPreload: "intent",
    routeTree,
    scrollRestoration: true,
  });
