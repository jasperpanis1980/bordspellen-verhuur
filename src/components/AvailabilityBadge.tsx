import { CheckCircle2, CalendarClock } from "lucide-react";
import type { AvailabilityStatus } from "@/lib/availability";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  if (status.available) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100/90 px-2 py-0.5 text-xs font-medium text-green-800 shadow-sm backdrop-blur-sm dark:border-green-900 dark:bg-green-950/90 dark:text-green-300">
        <CheckCircle2 size={12} />
        {status.totalCopies > 1
          ? `${status.availableCopies}/${status.totalCopies} beschikbaar`
          : "Beschikbaar nu"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-100/90 px-2 py-0.5 text-xs font-medium text-amber-800 shadow-sm backdrop-blur-sm dark:border-amber-900 dark:bg-amber-950/90 dark:text-amber-300">
      <CalendarClock size={12} />
      Vanaf {status.nextAvailableDate ? formatDate(status.nextAvailableDate) : "onbekend"}
    </span>
  );
}
