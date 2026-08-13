import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GameCard } from "@/components/GameCard";
import {
  BLOCKING_STATUSES,
  startOfToday,
  summarizeGameAvailability,
} from "@/lib/availability";

export default async function MijnFavorietenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const today = startOfToday();
  const rentalsFilter = {
    status: { in: [...BLOCKING_STATUSES] },
    startDate: { lte: today },
    endDate: { gte: today },
  };

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      game: {
        include: {
          rentals: { where: rentalsFilter, select: { endDate: true } },
          variants: {
            include: {
              rentals: { where: rentalsFilter, select: { endDate: true } },
            },
          },
        },
      },
    },
  });

  const games = favorites.map((f) => ({
    ...f.game,
    availability: summarizeGameAvailability(f.game),
  }));

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Mijn favorieten
      </h1>
      {games.length === 0 ? (
        <p className="text-foreground/60">
          Je hebt nog geen spellen bewaard. Klik op het hartje bij een spel in{" "}
          <Link href="/" className="text-primary underline">
            de catalogus
          </Link>{" "}
          om het hier terug te vinden.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.id} game={game} favorited />
          ))}
        </div>
      )}
    </div>
  );
}
