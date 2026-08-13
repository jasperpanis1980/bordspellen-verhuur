import { Info } from "lucide-react";
import {
  LEASE_MILESTONES,
  calculateOwedAmount,
  calculateRefundAmount,
  daysBetween,
} from "@/lib/leasing";

function formatEuro(value: number) {
  return `€${value.toFixed(2)}`;
}

export function LeasingInfo({
  purchasePrice,
  selectedStart,
  selectedEnd,
}: {
  purchasePrice: number;
  selectedStart?: string | null;
  selectedEnd?: string | null;
}) {
  const selectedDays =
    selectedStart && selectedEnd
      ? daysBetween(new Date(selectedStart), new Date(selectedEnd))
      : null;

  return (
    <div className="rounded-xl border border-ink/10 bg-cream-muted p-4 dark:border-cream/10">
      <p className="mb-1 flex items-center gap-1.5 text-sm font-medium">
        <Info size={15} className="text-primary" />
        Je betaalt {formatEuro(purchasePrice)} vooraf (aanschafprijs)
      </p>
      <p className="mb-3 text-xs text-foreground/60">
        Bij het terugbrengen krijg je het niet-gebruikte deel terug. Hoe
        korter je het spel houdt, hoe meer je terugkrijgt — na 8 weken is het
        volledig van jou.
      </p>

      {selectedDays !== null && selectedDays >= 0 && (
        <div className="mb-3 rounded-lg bg-primary/10 p-3 text-sm">
          <p className="font-medium text-primary">
            Bij {selectedDays} {selectedDays === 1 ? "dag" : "dagen"}: je
            betaalt{" "}
            <span className="font-semibold">
              {formatEuro(calculateOwedAmount(purchasePrice, selectedDays))}
            </span>
            , je krijgt{" "}
            <span className="font-semibold">
              {formatEuro(calculateRefundAmount(purchasePrice, selectedDays))}
            </span>{" "}
            terug
          </p>
        </div>
      )}

      <table className="w-full text-xs">
        <tbody>
          {LEASE_MILESTONES.map((m) => (
            <tr key={m.label} className="border-t border-ink/10 dark:border-cream/10">
              <td className="py-1.5 text-foreground/60">{m.label}</td>
              <td className="py-1.5 text-right font-medium">
                {formatEuro(calculateOwedAmount(purchasePrice, m.days))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
