"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type VariantInput = {
  name: string;
  imageUrl: string;
  productImageUrl: string;
  totalCopies: number;
};

const inputClass =
  "rounded-md border border-ink/15 bg-cream px-2 py-1.5 text-sm focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted";

export function VariantsEditor({
  defaultVariants,
}: {
  defaultVariants: VariantInput[];
}) {
  const [variants, setVariants] = useState<VariantInput[]>(defaultVariants);

  function updateVariant(index: number, patch: Partial<VariantInput>) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...patch } : v))
    );
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { name: "", imageUrl: "", productImageUrl: "", totalCopies: 1 },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm">
        Varianten (optioneel — bv. losse edities of uitbreidingen die
        klanten apart kunnen kiezen, zoals bij Unlock!)
      </label>
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      {variants.map((variant, i) => (
        <div
          key={i}
          className="flex flex-wrap items-end gap-2 rounded-md border border-ink/15 p-2 dark:border-cream/20"
        >
          <label className="flex flex-1 flex-col gap-1 text-xs">
            Naam
            <input
              value={variant.name}
              onChange={(e) => updateVariant(i, { name: e.target.value })}
              placeholder="bv. Secret Adventures"
              className={inputClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs">
            Afbeelding — catalogus
            <input
              value={variant.imageUrl}
              onChange={(e) => updateVariant(i, { imageUrl: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-xs">
            Afbeelding — productpagina
            <input
              value={variant.productImageUrl}
              onChange={(e) =>
                updateVariant(i, { productImageUrl: e.target.value })
              }
              placeholder="https://..."
              className={inputClass}
            />
          </label>
          <label className="flex w-24 flex-col gap-1 text-xs">
            Exemplaren
            <input
              type="number"
              min={0}
              value={variant.totalCopies}
              onChange={(e) =>
                updateVariant(i, {
                  totalCopies: Number(e.target.value) || 0,
                })
              }
              className={inputClass}
            />
          </label>
          <button
            type="button"
            onClick={() => removeVariant(i)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            aria-label="Variant verwijderen"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addVariant}
        className="inline-flex w-fit items-center gap-1 rounded-md border border-ink/15 px-3 py-1.5 text-sm hover:bg-cream-muted dark:border-cream/20"
      >
        <Plus size={14} />
        Variant toevoegen
      </button>
    </div>
  );
}
