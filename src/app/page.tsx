import { Suspense } from "react";
import Link from "next/link";
import { Dices, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GameCard } from "@/components/GameCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogSidebar } from "@/components/CatalogSidebar";
import { LeasingExplainer } from "@/components/LeasingExplainer";
import { auth } from "@/auth";
import {
  BLOCKING_STATUSES,
  startOfToday,
  summarizeGameAvailability,
} from "@/lib/availability";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 24;

function buildOrderBy(sort: string): Prisma.GameOrderByWithRelationInput {
  switch (sort) {
    case "name-desc":
      return { title: "desc" };
    case "price-asc":
      return { purchasePrice: "asc" };
    case "price-desc":
      return { purchasePrice: "desc" };
    case "popular":
      return { rentals: { _count: "desc" } };
    default:
      return { title: "asc" };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    theme?: string;
    category?: string;
    players?: string;
    age?: string;
    playtime?: string;
    complexity?: string;
    available?: string;
    favorites?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const today = startOfToday();
  const currentPage = Math.max(1, Number(params.page) || 1);
  const players = params.players ? Number(params.players) : undefined;
  const age = params.age ? Number(params.age) : undefined;
  const playtime = params.playtime ? Number(params.playtime) : undefined;

  const session = await auth();

  const complexityRange: Record<string, { lt?: number; gte?: number }> = {
    licht: { lt: 1.8 },
    gemiddeld: { gte: 1.8, lt: 3 },
    zwaar: { gte: 3 },
  };

  const where: Prisma.GameWhereInput = {
    ...(params.q ? { title: { contains: params.q } } : {}),
    ...(params.theme ? { theme: params.theme } : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(players && !Number.isNaN(players)
      ? { minPlayers: { lte: players }, maxPlayers: { gte: players } }
      : {}),
    ...(age && !Number.isNaN(age) ? { minAge: { lte: age } } : {}),
    ...(playtime && !Number.isNaN(playtime) ? { playTime: { lte: playtime } } : {}),
    ...(params.complexity && complexityRange[params.complexity]
      ? { complexity: complexityRange[params.complexity] }
      : {}),
    ...(params.favorites === "1" && session?.user
      ? { favorites: { some: { userId: session.user.id } } }
      : {}),
  };

  const rentalsFilter = {
    status: { in: [...BLOCKING_STATUSES] },
    startDate: { lte: today },
    endDate: { gte: today },
  };

  const [games, totalGameCount, heroGames, favorites] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy: buildOrderBy(params.sort ?? "name-asc"),
      include: {
        rentals: { where: rentalsFilter, select: { endDate: true } },
        variants: {
          include: { rentals: { where: rentalsFilter, select: { endDate: true } } },
        },
      },
    }),
    prisma.game.count(),
    prisma.game.findMany({
      where: { imageUrl: { not: null } },
      orderBy: { reviewCount: "desc" },
      take: 4,
      select: { id: true, title: true, imageUrl: true },
    }),
    session?.user
      ? prisma.favorite.findMany({
          where: { userId: session.user.id },
          select: { gameId: true },
        })
      : Promise.resolve([]),
  ]);

  const favoritedIds = new Set(favorites.map((f) => f.gameId));

  const gamesWithAvailability = games.map((game) => ({
    ...game,
    availability: summarizeGameAvailability(game),
  }));

  const filteredGames =
    params.available === "1"
      ? gamesWithAvailability.filter((g) => g.availability.available)
      : gamesWithAvailability;

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleGames = filteredGames.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function pageHref(page: number) {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.theme) query.set("theme", params.theme);
    if (params.category) query.set("category", params.category);
    if (params.players) query.set("players", params.players);
    if (params.age) query.set("age", params.age);
    if (params.playtime) query.set("playtime", params.playtime);
    if (params.complexity) query.set("complexity", params.complexity);
    if (params.available) query.set("available", params.available);
    if (params.favorites) query.set("favorites", params.favorites);
    if (params.sort) query.set("sort", params.sort);
    if (page > 1) query.set("page", String(page));
    const qs = query.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div>
      <div className="hero-surface relative mb-8 overflow-hidden rounded-2xl px-6 py-10 text-cream shadow-lg sm:px-10 sm:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-cream/70">
              Huren zonder verlies
            </p>
            <h1 className="max-w-xl font-display text-3xl font-semibold sm:text-4xl">
              Betaal vooraf, speel zo lang je wilt, krijg het verschil terug
            </h1>
            <p className="mt-3 max-w-md text-sm text-cream/80 sm:text-base">
              Geen vaste prijs per dag — je betaalt de aanschafprijs, en hoe
              eerder je het spel terugbrengt, hoe meer je terugkrijgt.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-cream/80 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-cream" />
                Geen verborgen kosten
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={16} className="text-cream" />
                {totalGameCount}+ spellen beschikbaar
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap size={16} className="text-cream" />
                Direct online huren
              </span>
            </div>
          </div>

          {heroGames.length > 0 && (
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:w-56">
              {heroGames.map((game, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={game.id}
                  src={game.imageUrl!}
                  alt={game.title}
                  className={`h-20 w-full rounded-lg object-cover object-top shadow-md ring-2 ring-cream/20 sm:h-24 ${
                    i % 2 === 1 ? "mt-4" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LeasingExplainer />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <Suspense>
          <CatalogSidebar />
        </Suspense>

        <div className="min-w-0 flex-1">
          <Suspense>
            <CatalogFilters isLoggedIn={!!session?.user} />
          </Suspense>

          <p className="mb-4 text-sm text-foreground/60">
            {filteredGames.length} spel{filteredGames.length === 1 ? "" : "len"}{" "}
            gevonden
          </p>

          {visibleGames.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-16 text-center dark:border-cream/15">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Dices size={22} />
              </span>
              <p className="font-display text-base font-medium">
                Geen spellen gevonden
              </p>
              <p className="max-w-sm text-sm text-foreground/60">
                Probeer een andere zoekterm of zet een paar filters uit — er
                wachten nog {totalGameCount} spellen op je.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  favorited={favoritedIds.has(game.id)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              {safePage > 1 ? (
                <Link
                  href={pageHref(safePage - 1)}
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-sm hover:bg-primary hover:text-white hover:border-primary dark:border-cream/20"
                >
                  Vorige
                </Link>
              ) : (
                <span className="rounded-md border border-ink/10 px-3 py-1.5 text-sm text-foreground/30 dark:border-cream/10">
                  Vorige
                </span>
              )}
              <span className="text-sm text-foreground/60">
                Pagina {safePage} van {totalPages}
              </span>
              {safePage < totalPages ? (
                <Link
                  href={pageHref(safePage + 1)}
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-sm hover:bg-primary hover:text-white hover:border-primary dark:border-cream/20"
                >
                  Volgende
                </Link>
              ) : (
                <span className="rounded-md border border-ink/10 px-3 py-1.5 text-sm text-foreground/30 dark:border-cream/10">
                  Volgende
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
