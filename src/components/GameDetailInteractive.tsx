"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Euro } from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import { GameSpecTable } from "@/components/GameSpecTable";
import { RentalRequestForm } from "@/components/RentalRequestForm";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { LeasingInfo } from "@/components/LeasingInfo";
import { StarRating } from "@/components/StarRating";
import { YoutubeLink } from "@/components/YoutubeLink";
import { WaitlistButton } from "@/components/WaitlistButton";
import type { AvailabilityStatus } from "@/lib/availability";
import type { Game } from "@prisma/client";

type VariantWithAvailability = {
  id: string;
  name: string;
  imageUrl: string | null;
  productImageUrl: string | null;
  totalCopies: number;
  availability: AvailabilityStatus;
  unavailableDates: string[];
};

export function GameDetailInteractive({
  game,
  gameAvailability,
  gameUnavailableDates,
  variants,
  galleryImages,
  isLoggedIn,
  onWaitlist,
}: {
  game: Pick<
    Game,
    | "id"
    | "title"
    | "imageUrl"
    | "productImageUrl"
    | "shortDescription"
    | "minPlayers"
    | "maxPlayers"
    | "playTime"
    | "complexity"
    | "category"
    | "minAge"
    | "theme"
    | "totalCopies"
    | "rating"
    | "reviewCount"
    | "purchasePrice"
  >;
  gameAvailability: AvailabilityStatus;
  gameUnavailableDates: string[];
  variants: VariantWithAvailability[];
  galleryImages: string[];
  isLoggedIn: boolean;
  onWaitlist: boolean;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id
  );
  const [selectedRange, setSelectedRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const unavailableDates =
    selectedVariant?.unavailableDates ?? gameUnavailableDates;
  const unavailableSet = useMemo(
    () => new Set(unavailableDates),
    [unavailableDates]
  );

  function rangeCrossesUnavailableDay(start: string, end: string) {
    const cursor = new Date(start);
    const endDate = new Date(end);
    while (cursor <= endDate) {
      if (unavailableSet.has(cursor.toISOString().slice(0, 10))) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  function handleSelectDate(dateKey: string) {
    if (dateKey === "") {
      setSelectedRange({ start: null, end: null });
      return;
    }
    setSelectedRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: dateKey, end: null };
      }
      if (dateKey <= prev.start || rangeCrossesUnavailableDay(prev.start, dateKey)) {
        return { start: dateKey, end: null };
      }
      return { start: prev.start, end: dateKey };
    });
  }

  function handleVariantChange(variantId: string) {
    setSelectedVariantId(variantId);
    setSelectedRange({ start: null, end: null });
  }

  const mainImage =
    selectedVariant?.productImageUrl ??
    selectedVariant?.imageUrl ??
    game.productImageUrl ??
    game.imageUrl;
  const availability = selectedVariant?.availability ?? gameAvailability;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <ProductGallery
        title={game.title}
        mainImage={mainImage}
        extraImages={variants.length > 0 ? [] : galleryImages}
        availability={availability}
      />
      <div>
        <h1 className="font-display text-3xl font-semibold">{game.title}</h1>
        <div className="mt-1">
          <StarRating rating={game.rating} reviewCount={game.reviewCount} size="md" />
        </div>

        {variants.length > 0 && (
          <label className="mt-3 flex flex-col gap-1 text-sm">
            Editie
            <select
              value={selectedVariantId}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <p className="mt-3 whitespace-pre-line font-medium text-primary">
          {game.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1 text-2xl font-semibold text-primary">
            <Euro size={22} />
            {game.purchasePrice.toFixed(2)}{" "}
            <span className="text-sm font-normal text-foreground/60">
              aanschafprijs
            </span>
          </p>
          <YoutubeLink title={game.title} />
        </div>
        {availability.available && availability.availableCopies <= 1 && (
          <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            Laatste exemplaar beschikbaar
          </p>
        )}
        {!availability.available && (
          <WaitlistButton
            gameId={game.id}
            onWaitlist={onWaitlist}
            isLoggedIn={isLoggedIn}
          />
        )}

        <div className="mt-4">
          <GameSpecTable
            game={{
              ...game,
              totalCopies: selectedVariant?.totalCopies ?? game.totalCopies,
            }}
          />
        </div>

        <div id="aanvragen" className="mt-6 scroll-mt-4 border-t border-ink/10 pt-6">
          <h2 className="mb-3 font-display text-lg font-medium">
            Beschikbaarheid
          </h2>
          <AvailabilityCalendar
            key={selectedVariant?.id ?? "base"}
            unavailableDates={unavailableDates}
            selectedStart={selectedRange.start}
            selectedEnd={selectedRange.end}
            onSelectDate={handleSelectDate}
          />
        </div>

        <div className="mt-6 border-t border-ink/10 pt-6">
          <h2 className="mb-3 font-display text-lg font-medium">
            Huren als leasing
          </h2>
          <LeasingInfo
            purchasePrice={game.purchasePrice}
            selectedStart={selectedRange.start}
            selectedEnd={selectedRange.end}
          />
        </div>

        <div className="mt-6 border-t border-ink/10 pt-6">
          <h2 className="mb-3 font-display text-lg font-medium">
            Spel aanvragen
          </h2>
          {isLoggedIn ? (
            <RentalRequestForm
              gameId={game.id}
              variantId={selectedVariant?.id}
              initialStartDate={selectedRange.start}
              initialEndDate={selectedRange.end}
            />
          ) : (
            <p className="text-sm text-foreground/60">
              <Link href="/login" className="text-primary underline">
                Log in
              </Link>{" "}
              om dit spel aan te vragen.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
