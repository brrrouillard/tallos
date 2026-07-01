import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { Button } from "~/components/ui/button";
import { BOOK_A_CALL_URL } from "~/lib/links";
import { container } from "~/lib/styles";

// Route-aware so the navbar works from any page (e.g. /build), not just home.
const NAV_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#agents", label: "Examples" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const navLink = `inline-flex items-center rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground ${focusRing}`;

const mobileNavLink = `flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${focusRing}`;

// Native <details> disclosure — keyboard-accessible with zero client JS, and no
// focus trap needed (it's a disclosure, not a modal). Gives mobile full nav
// parity instead of dropping the links below md.
const MobileMenu = () => (
  <details className="relative md:hidden">
    <summary
      className={`flex size-11 cursor-pointer list-none items-center justify-center rounded-md text-muted-foreground hover:text-foreground ${focusRing} [&::-webkit-details-marker]:hidden`}
    >
      <Menu className="size-5" />
      <span className="sr-only">Open menu</span>
    </summary>
    <div className="absolute right-0 z-50 mt-2 flex w-56 flex-col gap-1 rounded-lg border border-border bg-popover p-2 shadow-card">
      {NAV_LINKS.map((link) => (
        <a className={mobileNavLink} href={link.href} key={link.href}>
          {link.label}
        </a>
      ))}
      <Link className={mobileNavLink} to="/build">
        Build agents
      </Link>
      <a className={mobileNavLink} href={BOOK_A_CALL_URL}>
        Book a call
      </a>
    </div>
  </details>
);

export const SiteHeader = () => (
  <header className="sticky top-0 z-40 border-b border-border bg-background">
    <div className={`${container} flex h-14 items-center justify-between`}>
      <a
        className="font-heading text-lg font-semibold tracking-tight"
        href="/#top"
      >
        Tallos
        <span
          aria-hidden="true"
          className="ml-0.5 align-super font-mono text-[0.6em] text-primary"
        >
          +
        </span>
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
        <MobileMenu />
      </div>
    </div>
  </header>
);
