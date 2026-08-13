"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dices, ClipboardList } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Overzicht", icon: LayoutDashboard },
  { href: "/admin/games", label: "Spellen", icon: Dices },
  { href: "/admin/rentals", label: "Huuraanvragen", icon: ClipboardList },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-2 border-b border-ink/10 pb-4 text-sm dark:border-cream/10">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition ${
              active
                ? "bg-primary text-white shadow-sm"
                : "text-foreground/60 hover:bg-cream-muted hover:text-foreground"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
