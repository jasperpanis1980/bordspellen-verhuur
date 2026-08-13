import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteGame } from "@/lib/actions/games";

type GameStatus = "attention" | "rented" | "available";

const STATUS_META: Record<
  GameStatus,
  { label: string; badge: string; border: string }
> = {
  attention: {
    label: "Nieuwe aanvraag",
    badge:
      "border-amber-200 bg-amber-100/90 text-amber-800 dark:border-amber-900 dark:bg-amber-950/90 dark:text-amber-300",
    border: "border-l-4 border-l-amber-500",
  },
  rented: {
    label: "Uitgeleend",
    badge:
      "border-blue-200 bg-blue-100/90 text-blue-800 dark:border-blue-900 dark:bg-blue-950/90 dark:text-blue-300",
    border: "border-l-4 border-l-blue-500",
  },
  available: {
    label: "Beschikbaar",
    badge:
      "border-green-200 bg-green-100/90 text-green-800 dark:border-green-900 dark:bg-green-950/90 dark:text-green-300",
    border: "border-l-4 border-l-green-500",
  },
};

function gameStatus(game: {
  rentals: { status: string }[];
  variants: { rentals: { status: string }[] }[];
}): GameStatus {
  const statuses = [
    ...game.rentals.map((r) => r.status),
    ...game.variants.flatMap((v) => v.rentals.map((r) => r.status)),
  ];
  if (statuses.includes("PENDING")) return "attention";
  if (statuses.includes("ACTIVE")) return "rented";
  return "available";
}

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: { title: "asc" },
    include: {
      rentals: {
        where: { status: { in: ["PENDING", "ACTIVE"] } },
        select: { status: true },
      },
      variants: {
        select: {
          rentals: {
            where: { status: { in: ["PENDING", "ACTIVE"] } },
            select: { status: true },
          },
        },
      },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">
          Spellen beheren
        </h1>
        <Link
          href="/admin/games/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus size={16} />
          Nieuw spel
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {games.map((game) => {
          const status = gameStatus(game);
          const meta = STATUS_META[status];
          return (
            <div
              key={game.id}
              className={`flex items-center justify-between gap-4 rounded-xl bg-cream-muted p-3 shadow-sm ring-1 ring-ink/5 transition hover:shadow-md dark:ring-cream/5 ${meta.border}`}
            >
              <div className="flex items-center gap-3">
                {game.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-lg object-cover object-top"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink/10 text-xl">
                    🎲
                  </div>
                )}
                <div>
                  <p className="font-display font-medium">{game.title}</p>
                  <p className="text-sm text-foreground/60">
                    €{game.purchasePrice.toFixed(2)} aanschafprijs ·{" "}
                    {game.totalCopies} exemplaar(en)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm ${meta.badge}`}
                >
                  {meta.label}
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/games/${game.id}/edit`}
                    aria-label="Bewerken"
                    className="rounded-md p-2 text-primary hover:bg-primary/10"
                  >
                    <Pencil size={16} />
                  </Link>
                  <form action={deleteGame.bind(null, game.id)}>
                    <button
                      type="submit"
                      aria-label="Verwijderen"
                      className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
