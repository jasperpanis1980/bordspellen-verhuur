import { prisma } from "@/lib/prisma";

export const BLOCKING_STATUSES = ["CONFIRMED", "ACTIVE"] as const;

export function startOfToday() {
  return new Date(new Date().toDateString());
}

export type AvailabilityStatus =
  | { available: true; availableCopies: number; totalCopies: number }
  | { available: false; nextAvailableDate: Date | null; totalCopies: number };

export function summarizeAvailability(
  totalCopies: number,
  blockingRentals: { endDate: Date }[]
): AvailabilityStatus {
  const availableCopies = totalCopies - blockingRentals.length;
  if (availableCopies > 0) {
    return { available: true, availableCopies, totalCopies };
  }
  const earliest = [...blockingRentals].sort(
    (a, b) => a.endDate.getTime() - b.endDate.getTime()
  )[0];
  return {
    available: false,
    nextAvailableDate: earliest?.endDate ?? null,
    totalCopies,
  };
}

export function summarizeGameAvailability(game: {
  totalCopies: number;
  rentals: { endDate: Date }[];
  variants?: { totalCopies: number; rentals: { endDate: Date }[] }[];
}): AvailabilityStatus {
  if (game.variants && game.variants.length > 0) {
    const totalCopies = game.variants.reduce((sum, v) => sum + v.totalCopies, 0);
    const blockingRentals = game.variants.flatMap((v) => v.rentals);
    return summarizeAvailability(totalCopies, blockingRentals);
  }
  return summarizeAvailability(game.totalCopies, game.rentals);
}

export async function getOverlappingCount(
  gameId: string,
  startDate: Date,
  endDate: Date
) {
  return prisma.rental.count({
    where: {
      gameId,
      status: { in: [...BLOCKING_STATUSES] },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
  });
}

// Local (not UTC) date key, so this lines up with dates picked in
// <input type="date"> and the calendar UI regardless of timezone offset.
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getUnavailableDates(
  totalCopies: number,
  blockingRentals: { startDate: Date; endDate: Date }[],
  rangeStart: Date,
  rangeEnd: Date
): string[] {
  const unavailable: string[] = [];
  const cursor = new Date(rangeStart);
  while (cursor <= rangeEnd) {
    const bookedCopies = blockingRentals.filter(
      (r) => r.startDate <= cursor && r.endDate >= cursor
    ).length;
    if (bookedCopies >= totalCopies) {
      unavailable.push(toDateKey(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return unavailable;
}

export async function isAvailable(
  gameId: string,
  totalCopies: number,
  startDate: Date,
  endDate: Date
) {
  const overlapping = await getOverlappingCount(gameId, startDate, endDate);
  return overlapping < totalCopies;
}
