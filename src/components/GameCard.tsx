import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import type { Game } from "@prisma/client";
import { GameStats } from "@/components/GameStats";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { StarRating } from "@/components/StarRating";
import { FavoriteButton } from "@/components/FavoriteButton";
import { YoutubeLink } from "@/components/YoutubeLink";
import type { AvailabilityStatus } from "@/lib/availability";
import { POPULAR_REVIEW_THRESHOLD } from "@/lib/game-options";
import { LEASE_MILESTONES, calculateOwedAmount } from "@/lib/leasing";

// Most cover art has its title near the top, so cards crop from the top by
// default. A few covers place the title elsewhere, so those need an override.
const IMAGE_POSITION_OVERRIDES: Record<string, string> = {
  Dominion: "center 10%",
  "Dice Throne: Season One": "center bottom",
};

export type GameCardData = Pick<
  Game,
  | "id"
  | "title"
  | "imageUrl"
  | "shortDescription"
  | "purchasePrice"
  | "minPlayers"
  | "maxPlayers"
  | "playTime"
  | "complexity"
  | "category"
  | "minAge"
  | "theme"
  | "rating"
  | "reviewCount"
> & { availability: AvailabilityStatus };

export function GameCard({
  game,
  favorited = false,
}: {
  game: GameCardData;
  favorited?: boolean;
}) {
  const isPopular = game.reviewCount >= POPULAR_REVIEW_THRESHOLD;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-cream-muted shadow-sm ring-1 ring-ink/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:ring-primary/20 dark:ring-cream/5 ${
        game.availability.available ? "" : "opacity-60 hover:opacity-80"
      }`}
    >
      <Link href={`/games/${game.id}`} className="flex flex-1 flex-col">
        <div className="relative overflow-hidden">
          {game.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.imageUrl}
              alt={game.title}
              loading="lazy"
              decoding="async"
              style={{
                objectPosition: IMAGE_POSITION_OVERRIDES[game.title] ?? "center top",
              }}
              className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center bg-ink/10 text-4xl">
              🎲
            </div>
          )}
          {isPopular && (
            <span className="absolute left-0 top-3 inline-flex items-center gap-1 rounded-r-md bg-orange-500 py-1 pl-2 pr-2.5 text-xs font-medium text-white shadow">
              <Flame size={12} className="fill-white" />
              Meest gewild
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-medium">
              {game.availability.available && (
                <span
                  title="Beschikbaar"
                  className="h-2 w-2 shrink-0 rounded-full bg-green-500"
                />
              )}
              {game.title}
            </h2>
            <StarRating rating={game.rating} reviewCount={game.reviewCount} />
          </div>
          {!game.availability.available && (
            <div>
              <AvailabilityBadge status={game.availability} />
            </div>
          )}
          <GameStats game={game} />
          <p className="whitespace-pre-line pt-1 text-xs text-foreground/70">
            {game.shortDescription}
          </p>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-foreground/40 line-through">
                  Aanschafwaarde €{game.purchasePrice.toFixed(2)}
                </p>
                <p className="text-lg font-semibold text-primary">
                  vanaf €{calculateOwedAmount(game.purchasePrice, LEASE_MILESTONES[0].days).toFixed(2)}
                </p>
              </div>
              <YoutubeLink title={game.title} />
            </div>
            <div className="mt-1.5 grid grid-cols-4 gap-1 rounded-md bg-ink/5 p-1.5 text-center dark:bg-cream/5">
              {LEASE_MILESTONES.slice(1).map((m) => (
                <div key={m.days}>
                  <p className="text-[10px] text-foreground/50">{m.shortLabel}</p>
                  <p className="text-[11px] font-medium">
                    €{calculateOwedAmount(game.purchasePrice, m.days).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <FavoriteButton
        gameId={game.id}
        favorited={favorited}
        className="absolute right-2 top-2 z-10"
      />

      <Link
        href={`/games/${game.id}#aanvragen`}
        className="absolute inset-x-2 top-[122px] z-10 flex translate-y-1 items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-medium text-white opacity-0 shadow-md transition duration-200 group-hover:translate-y-0 group-hover:opacity-100"
      >
        Direct huren
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
