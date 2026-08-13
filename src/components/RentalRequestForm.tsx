"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createRentalRequest,
  type RentalRequestState,
} from "@/lib/actions/rentals";

const initialState: RentalRequestState = {};

export function RentalRequestForm({
  gameId,
  variantId,
  initialStartDate,
  initialEndDate,
}: {
  gameId: string;
  variantId?: string | null;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    createRentalRequest,
    initialState
  );
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (state.success) {
      setResetKey((k) => k + 1);
    }
  }, [state.success]);

  const today = new Date().toISOString().slice(0, 10);
  const formKey = `${resetKey}-${initialStartDate ?? ""}-${initialEndDate ?? ""}`;

  return (
    <form key={formKey} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="gameId" value={gameId} />
      {variantId && <input type="hidden" name="variantId" value={variantId} />}
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Startdatum
          <input
            name="startDate"
            type="date"
            min={today}
            defaultValue={initialStartDate ?? undefined}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Einddatum
          <input
            name="endDate"
            type="date"
            min={initialStartDate ?? today}
            defaultValue={initialEndDate ?? undefined}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Opmerking (optioneel)
        <textarea
          name="note"
          rows={2}
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-700 dark:text-green-400">
          Aanvraag verstuurd! Je ziet de status bij &quot;Mijn aanvragen&quot;.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {pending ? "Bezig..." : "Aanvragen"}
      </button>
    </form>
  );
}
