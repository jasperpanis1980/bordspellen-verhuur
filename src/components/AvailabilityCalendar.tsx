"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toDateKey } from "@/lib/availability";

const WEEKDAY_LABELS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const MONTH_LABELS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
];

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

export function AvailabilityCalendar({
  unavailableDates,
  selectedStart,
  selectedEnd,
  onSelectDate,
}: {
  unavailableDates: string[];
  selectedStart?: string | null;
  selectedEnd?: string | null;
  onSelectDate?: (dateKey: string) => void;
}) {
  const today = useMemo(() => new Date(new Date().toDateString()), []);
  const [cursor, setCursor] = useState(() =>
    startOfMonth(today.getFullYear(), today.getMonth())
  );
  const unavailableSet = useMemo(
    () => new Set(unavailableDates),
    [unavailableDates]
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = startOfMonth(year, month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // Monday-first

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="rounded-xl border border-ink/10 bg-cream-muted p-4 dark:border-cream/10">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Vorige maand"
          disabled={isCurrentMonth}
          onClick={() => setCursor(startOfMonth(year, month - 1))}
          className="rounded-md p-1.5 hover:bg-ink/10 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-cream/10"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="font-display font-medium capitalize">
          {MONTH_LABELS[month]} {year}
        </p>
        <button
          type="button"
          aria-label="Volgende maand"
          onClick={() => setCursor(startOfMonth(year, month + 1))}
          className="rounded-md p-1.5 hover:bg-ink/10 dark:hover:bg-cream/10"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {onSelectDate && (
        <p className="mb-2 text-xs text-foreground/60">
          {!selectedStart
            ? "Klik een startdatum..."
            : !selectedEnd
              ? "Klik nu een einddatum..."
              : `${selectedStart} t/m ${selectedEnd}`}
        </p>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-foreground/50">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const key = toDateKey(date);
          const isPast = date < today;
          const isToday = key === toDateKey(today);
          const isBooked = unavailableSet.has(key);
          const isRangeEndpoint = key === selectedStart || key === selectedEnd;
          const isInRange =
            !!selectedStart &&
            !!selectedEnd &&
            key > selectedStart &&
            key < selectedEnd;
          const isClickable = !!onSelectDate && !isPast && !isBooked;

          return (
            <button
              key={key}
              type="button"
              disabled={!isClickable}
              title={isBooked ? "Bezet" : undefined}
              onClick={() => isClickable && onSelectDate?.(key)}
              className={`flex aspect-square items-center justify-center rounded-md text-xs transition ${
                isPast
                  ? "text-foreground/20"
                  : isBooked
                    ? "bg-red-100 text-red-700 line-through dark:bg-red-950/60 dark:text-red-400"
                    : isRangeEndpoint
                      ? "bg-primary font-semibold text-white"
                      : isInRange
                        ? "bg-primary/20 text-foreground"
                        : "text-foreground/80"
              } ${isToday && !isRangeEndpoint ? "ring-1 ring-primary" : ""} ${
                isClickable && !isRangeEndpoint && !isInRange
                  ? "hover:bg-primary/10 cursor-pointer"
                  : ""
              } ${!isClickable ? "cursor-default" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-foreground/60">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-100 dark:bg-red-950/60" />
          Bezet
        </span>
        {onSelectDate && (selectedStart || selectedEnd) && (
          <button
            type="button"
            onClick={() => onSelectDate("")}
            className="ml-auto text-primary hover:underline"
          >
            Selectie wissen
          </button>
        )}
      </div>
    </div>
  );
}
