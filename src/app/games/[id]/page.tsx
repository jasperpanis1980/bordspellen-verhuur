import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GameDetailInteractive } from "@/components/GameDetailInteractive";
import { GameCard } from "@/components/GameCard";
import {
  BLOCKING_STATUSES,
  getUnavailableDates,
  startOfToday,
  summarizeAvailability,
  summarizeGameAvailability,
} from "@/lib/availability";

const CALENDAR_WINDOW_DAYS = 180;

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const today = startOfToday();
  const rentalsFilter = {
    status: { in: [...BLOCKING_STATUSES] },
    startDate: { lte: today },
    endDate: { gte: today },
  };
  const calendarRangeEnd = new Date(today);
  calendarRangeEnd.setDate(calendarRangeEnd.getDate() + CALENDAR_WINDOW_DAYS);
  const calendarRentalsFilter = {
    status: { in: [...BLOCKING_STATUSES] },
    startDate: { lte: calendarRangeEnd },
    endDate: { gte: today },
  };

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      rentals: {
        where: calendarRentalsFilter,
        select: { startDate: true, endDate: true },
      },
      images: { orderBy: { order: "asc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 6 },
      variants: {
        orderBy: { order: "asc" },
        include: {
          rentals: {
            where: calendarRentalsFilter,
            select: { startDate: true, endDate: true },
          },
        },
      },
    },
  });
  if (!game) notFound();

  const gameAvailability = summarizeAvailability(
    game.totalCopies,
    game.rentals.filter((r) => r.startDate <= today)
  );
  const gameUnavailableDates = getUnavailableDates(
    game.totalCopies,
    game.rentals,
    today,
    calendarRangeEnd
  );
  const variantsWithAvailability = game.variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    imageUrl: variant.imageUrl,
    productImageUrl: variant.productImageUrl,
    totalCopies: variant.totalCopies,
    availability: summarizeAvailability(
      variant.totalCopies,
      variant.rentals.filter((r) => r.startDate <= today)
    ),
    unavailableDates: getUnavailableDates(
      variant.totalCopies,
      variant.rentals,
      today,
      calendarRangeEnd
    ),
  }));
  const session = await auth();

  let relatedGames = await prisma.game.findMany({
    where: { theme: game.theme, id: { not: game.id } },
    take: 3,
    include: {
      rentals: { where: rentalsFilter, select: { endDate: true } },
      variants: {
        include: { rentals: { where: rentalsFilter, select: { endDate: true } } },
      },
    },
  });
  if (relatedGames.length === 0) {
    relatedGames = await prisma.game.findMany({
      where: { category: game.category, id: { not: game.id } },
      take: 3,
      include: {
        rentals: { where: rentalsFilter, select: { endDate: true } },
        variants: {
          include: { rentals: { where: rentalsFilter, select: { endDate: true } } },
        },
      },
    });
  }
  const relatedWithAvailability = relatedGames.map((related) => ({
    ...related,
    availability: summarizeGameAvailability(related),
  }));

  const favorites = session?.user
    ? await prisma.favorite.findMany({
        where: { userId: session.user.id },
        select: { gameId: true },
      })
    : [];
  const favoritedIds = new Set(favorites.map((f) => f.gameId));

  const onWaitlist = session?.user
    ? (await prisma.waitlist.findUnique({
        where: { userId_gameId: { userId: session.user.id, gameId: game.id } },
      })) !== null
    : false;

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1 text-sm text-foreground/60">
        <Link href="/" className="hover:text-primary hover:underline">
          Catalogus
        </Link>
        <ChevronRight size={14} />
        <Link
          href={`/?theme=${encodeURIComponent(game.theme)}`}
          className="hover:text-primary hover:underline"
        >
          {game.theme}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground">{game.title}</span>
      </nav>

      <GameDetailInteractive
        game={game}
        gameAvailability={gameAvailability}
        gameUnavailableDates={gameUnavailableDates}
        variants={variantsWithAvailability}
        galleryImages={game.images.map((i) => i.url)}
        isLoggedIn={!!session?.user}
        onWaitlist={onWaitlist}
      />

      <div className="mt-10 border-t border-ink/10 pt-6">
        <h2 className="mb-3 font-display text-lg font-medium">
          Beschrijving
        </h2>
        <p className="whitespace-pre-line">{game.description}</p>
      </div>

      {game.reviews.length > 0 && (
        <div className="mt-10 border-t border-ink/10 pt-6">
          <h2 className="mb-4 font-display text-lg font-medium">
            Wat huurders zeggen
            <span className="ml-2 text-sm font-normal text-foreground/50">
              {game.rating.toFixed(1)} · {game.reviewCount} beoordelingen
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {game.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl bg-cream-muted p-4 shadow-sm ring-1 ring-ink/5 dark:ring-cream/5"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-foreground/20"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.authorName}</span>
                </div>
                <p className="text-sm text-foreground/70">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {relatedWithAvailability.length > 0 && (
        <div className="mt-10 border-t border-ink/10 pt-6">
          <h2 className="mb-4 font-display text-lg font-medium">
            Gerelateerde spellen
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedWithAvailability.map((related) => (
              <GameCard
                key={related.id}
                game={related}
                favorited={favoritedIds.has(related.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
