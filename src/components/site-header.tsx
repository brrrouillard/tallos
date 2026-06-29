import { Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { BOOK_A_CALL_URL } from "~/lib/links";
import { container } from "~/lib/styles";

// Route-aware so the navbar works from any page (e.g. /build), not just home.
const NAV_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#agents", label: "Examples" },
];

const navLink =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

export const SiteHeader = () => (
  <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
    <div className={`${container} flex h-14 items-center justify-between`}>
      <a
        className="font-heading text-lg font-semibold tracking-tight"
        href="/#top"
      >
        Tallos
      </a>
      <nav className="hidden items-center gap-7 md:flex">
        {NAV_LINKS.map((link) => (
          <a className={navLink} href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
        <Link className={navLink} to="/build">
          Build agents
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button
          asChild
          className="hidden sm:inline-flex"
          size="sm"
          variant="ghost"
        >
          <a href={BOOK_A_CALL_URL}>Book a call</a>
        </Button>
        <Button asChild size="sm">
          <Link to="/build">Get started</Link>
        </Button>
      </div>
    </div>
  </header>
);
