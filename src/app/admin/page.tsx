import Link from "next/link";
import { Dices, Hourglass, PackageOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function ActionListCard({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: { key: string; primary: string; secondary: string }[];
}) {
  return (
    <div className="rounded-xl bg-cream-muted p-4 shadow-sm ring-1 ring-ink/5 dark:ring-cream/5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-medium">{title}</h2>
        <Link
          href="/admin/rentals"
          className="text-xs text-primary hover:underline"
        >
          Bekijk alles
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-foreground/50">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.key} className="text-sm">
              <p className="font-medium">{item.primary}</p>
              <p className="text-foreground/60">{item.secondary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AdminOverviewPage() {
  const today = new Date(new Date().toDateString());
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const [
    gameCount,
    pendingCount,
    activeCount,
    pendingRentals,
    dueThisWeek,
    outstandingRefunds,
  ] = await Promise.all([
    prisma.game.count(),
    prisma.rental.count({ where: { status: "PENDING" } }),
    prisma.rental.count({ where: { status: "ACTIVE" } }),
    prisma.rental.findMany({
      where: { status: "PENDING" },
      include: { game: true, user: true },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    prisma.rental.findMany({
      where: { status: "ACTIVE", endDate: { lte: weekFromNow } },
      include: { game: true, user: true },
      orderBy: { endDate: "asc" },
      take: 5,
    }),
    prisma.rental.findMany({
      where: { status: "RETURNED", refundPaid: false, refundAmount: { not: null } },
      include: { game: true, user: true },
      orderBy: { returnedAt: "asc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      href: "/admin/games",
      value: gameCount,
      label: "Spellen in catalogus",
      icon: Dices,
    },
    {
      href: "/admin/rentals",
      value: pendingCount,
      label: "Openstaande aanvragen",
      icon: Hourglass,
    },
    {
      href: "/admin/rentals",
      value: activeCount,
      label: "Actief uitgeleend",
      icon: PackageOpen,
    },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Beheer overzicht
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ href, value, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-4 rounded-xl bg-cream-muted p-4 shadow-sm ring-1 ring-ink/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20 dark:ring-cream/5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
              <Icon size={20} />
            </span>
            <span>
              <p className="text-3xl font-semibold">{value}</p>
              <p className="text-sm text-foreground/60">{label}</p>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActionListCard
          title="Open aanvragen"
          emptyLabel="Geen openstaande aanvragen."
          items={pendingRentals.map((r) => ({
            key: r.id,
            primary: `${r.game.title} — ${r.user.name}`,
            secondary: `${formatDate(r.startDate)} – ${formatDate(r.endDate)}`,
          }))}
        />
        <ActionListCard
          title="Deze week terug te brengen"
          emptyLabel="Niets deze week terug te verwachten."
          items={dueThisWeek.map((r) => ({
            key: r.id,
            primary: `${r.game.title} — ${r.user.name}`,
            secondary: `Terug op ${formatDate(r.endDate)}`,
          }))}
        />
        <ActionListCard
          title="Openstaande restituties"
          emptyLabel="Geen openstaande restituties."
          items={outstandingRefunds.map((r) => ({
            key: r.id,
            primary: `${r.game.title} — ${r.user.name}`,
            secondary: `€${r.refundAmount!.toFixed(2)} terug te betalen`,
          }))}
        />
      </div>
    </div>
  );
}
