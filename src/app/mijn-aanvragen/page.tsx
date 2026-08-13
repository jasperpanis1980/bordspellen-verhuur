import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelRental } from "@/lib/actions/rentals";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "In afwachting",
  CONFIRMED: "Bevestigd",
  REJECTED: "Afgewezen",
  ACTIVE: "Actief (uitgeleend)",
  RETURNED: "Teruggebracht",
  CANCELLED: "Geannuleerd",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "border-amber-200 bg-amber-100/90 text-amber-800 dark:border-amber-900 dark:bg-amber-950/90 dark:text-amber-300",
  CONFIRMED:
    "border-blue-200 bg-blue-100/90 text-blue-800 dark:border-blue-900 dark:bg-blue-950/90 dark:text-blue-300",
  REJECTED:
    "border-red-200 bg-red-100/90 text-red-800 dark:border-red-900 dark:bg-red-950/90 dark:text-red-300",
  ACTIVE:
    "border-green-200 bg-green-100/90 text-green-800 dark:border-green-900 dark:bg-green-950/90 dark:text-green-300",
  RETURNED:
    "border-zinc-200 bg-zinc-100/90 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-300",
  CANCELLED:
    "border-zinc-200 bg-zinc-100/60 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function MijnAanvragenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rentals = await prisma.rental.findMany({
    where: { userId: session.user.id },
    include: { game: true, variant: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Mijn aanvragen
      </h1>
      {rentals.length === 0 ? (
        <p className="text-foreground/60">
          Je hebt nog geen spellen aangevraagd.{" "}
          <Link href="/" className="text-primary underline">
            Bekijk de catalogus
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rentals.map((rental) => {
            const thumbUrl = rental.variant?.imageUrl ?? rental.game.imageUrl;
            return (
            <div
              key={rental.id}
              className="flex items-center justify-between rounded-xl bg-cream-muted p-4 shadow-sm ring-1 ring-ink/5 transition hover:shadow-md dark:ring-cream/5"
            >
              <div className="flex items-center gap-3">
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-14 shrink-0 rounded-lg object-cover object-top"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-ink/10 text-xl">
                    🎲
                  </div>
                )}
                <div>
                  <Link
                    href={`/games/${rental.gameId}`}
                    className="font-display font-medium hover:underline"
                  >
                    {rental.game.title}
                    {rental.variant && ` — ${rental.variant.name}`}
                  </Link>
                  <p className="text-sm text-foreground/60">
                    {formatDate(rental.startDate)} – {formatDate(rental.endDate)}
                  </p>
                  {rental.note && (
                    <p className="mt-1 text-sm text-foreground/60">
                      Opmerking: {rental.note}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${STATUS_COLORS[rental.status]}`}
                >
                  {STATUS_LABELS[rental.status]}
                </span>
                {rental.status === "PENDING" && (
                  <form action={cancelRental.bind(null, rental.id)}>
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline"
                    >
                      Annuleren
                    </button>
                  </form>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
