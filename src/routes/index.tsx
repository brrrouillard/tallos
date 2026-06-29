import { createFileRoute } from "@tanstack/react-router";

const Home = () => (
  <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background text-foreground">
    <h1 className="font-heading text-4xl font-bold">Welcome to Tallos</h1>
    <p className="text-muted-foreground">
      Server-rendered by TanStack Start, styled with the shadcn radix-luma
      theme.
    </p>
  </main>
);

export const Route = createFileRoute("/")({
  component: Home,
});
