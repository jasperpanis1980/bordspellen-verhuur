import { prisma } from "@/lib/prisma";
import {
  toggleDepositPaid,
  toggleRefundPaid,
  updateRentalStatus,
} from "@/lib/actions/admin-rentals";
import type { RentalStatus } from "@prisma/client";

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

const NEXT_ACTIONS: Partial<Record<RentalStatus, { label: string; next: RentalStatus }[]>> = {
  PENDING: [
    { label: "Bevestigen", next: "CONFIRMED" },
    { label: "Afwijzen", next: "REJECTED" },
  ],
  CONFIRMED: [
    { label: "Markeer als opgehaald", next: "ACTIVE" },
    { label: "Annuleren", next: "CANCELLED" },
  ],
  ACTIVE: [{ label: "Markeer als teruggebracht", next: "RETURNED" }],
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminRentalsPage() {
  const rentals = await prisma.rental.findMany({
    include: { game: true, user: true, variant: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Huuraanvragen
      </h1>
      <div className="flex flex-col gap-3">
        {rentals.length === 0 && (
          <p className="text-foreground/60">Er zijn nog geen aanvragen.</p>
        )}
        {rentals.map((rental) => {
          const showDeposit = ["CONFIRMED", "ACTIVE", "RETURNED"].includes(
            rental.status
          );
          const showRefund =
            rental.status === "RETURNED" && rental.refundAmount != null;

          return (
            <div
              key={rental.id}
              className="flex flex-col gap-3 rounded-xl bg-cream-muted p-4 shadow-sm ring-1 ring-ink/5 transition hover:shadow-md dark:ring-cream/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-medium">
                    {rental.game.title}
                    {rental.variant && ` — ${rental.variant.name}`}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {rental.user.name} ({rental.user.email})
                  </p>
                  <p className="text-sm text-foreground/60">
                    {formatDate(rental.startDate)} – {formatDate(rental.endDate)}
                  </p>
                  {rental.note && (
                    <p className="mt-1 text-sm text-foreground/60">
                      Opmerking: {rental.note}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${STATUS_COLORS[rental.status]}`}
                  >
                    {STATUS_LABELS[rental.status]}
                  </span>
                  <div className="flex gap-2">
                    {(NEXT_ACTIONS[rental.status] ?? []).map((action) => (
                      <form
                        key={action.next}
                        action={updateRentalStatus.bind(
                          null,
                          rental.id,
                          action.next
                        )}
                      >
                        <button
                          type="submit"
                          className="rounded-md border border-ink/15 px-3 py-1.5 text-sm hover:bg-primary hover:text-white hover:border-primary dark:border-cream/20"
                        >
                          {action.label}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </div>

              {(showDeposit || showRefund) && (
                <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-3 text-sm dark:border-cream/10">
                  {showDeposit && (
                    <p className="text-foreground/70">
                      Aanschafprijs geïnd:{" "}
                      <span className="font-medium">
                        €{rental.game.purchasePrice.toFixed(2)}
                      </span>
                    </p>
                  )}
                  {showDeposit && (
                    <form
                      action={toggleDepositPaid.bind(
                        null,
                        rental.id,
                        !rental.depositPaid
                      )}
                    >
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                          rental.depositPaid
                            ? "border-green-200 bg-green-100/90 text-green-800 dark:border-green-900 dark:bg-green-950/90 dark:text-green-300"
                            : "border-ink/15 text-foreground/60 hover:bg-ink/5 dark:border-cream/20"
                        }`}
                      >
                        {rental.depositPaid
                          ? "✓ Borg betaald"
                          : "Markeer borg als betaald"}
                      </button>
                    </form>
                  )}
                  {showRefund && (
                    <>
                      <p className="text-foreground/70">
                        Terug te betalen:{" "}
                        <span className="font-medium">
                          €{rental.refundAmount!.toFixed(2)}
                        </span>
                      </p>
                      <form
                        action={toggleRefundPaid.bind(
                          null,
                          rental.id,
                          !rental.refundPaid
                        )}
                      >
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                            rental.refundPaid
                              ? "border-green-200 bg-green-100/90 text-green-800 dark:border-green-900 dark:bg-green-950/90 dark:text-green-300"
                              : "border-ink/15 text-foreground/60 hover:bg-ink/5 dark:border-cream/20"
                          }`}
                        >
                          {rental.refundPaid
                            ? "✓ Restitutie uitbetaald"
                            : "Markeer restitutie als uitbetaald"}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
