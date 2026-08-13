"use client";

import { useActionState } from "react";
import type { GameFormState } from "@/lib/actions/games";
import type { Game } from "@prisma/client";
import { THEME_OPTIONS } from "@/lib/theme-icons";
import { VariantsEditor, type VariantInput } from "@/components/VariantsEditor";

const initialState: GameFormState = {};

type GameVariantData = {
  name: string;
  imageUrl: string | null;
  productImageUrl: string | null;
  totalCopies: number;
};

export function GameForm({
  action,
  game,
}: {
  action: (
    state: GameFormState,
    formData: FormData
  ) => Promise<GameFormState>;
  game?: Game & {
    images?: { url: string }[];
    variants?: GameVariantData[];
  };
}) {
  const defaultVariants: VariantInput[] = (game?.variants ?? []).map((v) => ({
    name: v.name,
    imageUrl: v.imageUrl ?? "",
    productImageUrl: v.productImageUrl ?? "",
    totalCopies: v.totalCopies,
  }));
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <p className="-mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
        Basisinformatie
      </p>
      <label className="flex flex-col gap-1 text-sm">
        Titel
        <input
          name="title"
          defaultValue={game?.title}
          required
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Korte beschrijving (precies 2 regels, wordt niet afgekapt)
        <textarea
          name="shortDescription"
          defaultValue={game?.shortDescription}
          rows={2}
          required
          placeholder={"Eerste regel...\nTweede regel..."}
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Volledige beschrijving
        <textarea
          name="description"
          defaultValue={game?.description}
          rows={4}
          required
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      <p className="-mb-1 mt-2 border-t border-ink/10 pt-4 text-xs font-semibold uppercase tracking-widest text-primary dark:border-cream/10">
        Spelkenmerken
      </p>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Classificatie
          <select
            name="category"
            defaultValue={game?.category ?? "Familie"}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          >
            <option value="Strategie">Strategie</option>
            <option value="Familie">Familie</option>
            <option value="Party">Party</option>
            <option value="Kaartspel">Kaartspel</option>
            <option value="Kinderspel">Kinderspel</option>
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Thema
          <select
            name="theme"
            defaultValue={game?.theme ?? "Overig"}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          >
            {THEME_OPTIONS.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Complexiteit (1-5)
          <input
            name="complexity"
            type="number"
            step="0.1"
            min={1}
            max={5}
            defaultValue={game?.complexity ?? 2}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Minimumleeftijd
          <input
            name="minAge"
            type="number"
            min={0}
            max={18}
            defaultValue={game?.minAge ?? 8}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
      </div>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Min. spelers
          <input
            name="minPlayers"
            type="number"
            min={1}
            defaultValue={game?.minPlayers ?? 2}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Max. spelers
          <input
            name="maxPlayers"
            type="number"
            min={1}
            defaultValue={game?.maxPlayers ?? 4}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Speeltijd (min)
          <input
            name="playTime"
            type="number"
            min={1}
            defaultValue={game?.playTime ?? 30}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
      </div>
      <p className="-mb-1 mt-2 border-t border-ink/10 pt-4 text-xs font-semibold uppercase tracking-widest text-primary dark:border-cream/10">
        Prijs &amp; voorraad
      </p>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Beoordeling (1-5)
          <input
            name="rating"
            type="number"
            step="0.1"
            min={1}
            max={5}
            defaultValue={game?.rating ?? 4.5}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Aantal beoordelingen
          <input
            name="reviewCount"
            type="number"
            min={0}
            defaultValue={game?.reviewCount ?? 0}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
      </div>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Aanschafprijs / borg (€) — volledig bedrag voor de leasing-formule
          <input
            name="purchasePrice"
            type="number"
            step="0.01"
            min={0}
            defaultValue={game?.purchasePrice ?? 29.99}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Aantal exemplaren
          <input
            name="totalCopies"
            type="number"
            min={1}
            defaultValue={game?.totalCopies ?? 1}
            required
            className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
          />
        </label>
      </div>
      <p className="-mb-1 mt-2 border-t border-ink/10 pt-4 text-xs font-semibold uppercase tracking-widest text-primary dark:border-cream/10">
        Afbeeldingen
      </p>
      <label className="flex flex-col gap-1 text-sm">
        Afbeelding URL — catalogus (optioneel)
        <input
          name="imageUrl"
          type="url"
          defaultValue={game?.imageUrl ?? ""}
          placeholder="https://..."
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Afbeelding URL — productpagina (optioneel, valt terug op catalogusfoto)
        <input
          name="productImageUrl"
          type="url"
          defaultValue={game?.productImageUrl ?? ""}
          placeholder="https://..."
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Extra foto&apos;s voor de galerij (één URL per regel, optioneel)
        <textarea
          name="galleryImages"
          defaultValue={game?.images?.map((i) => i.url).join("\n") ?? ""}
          rows={3}
          placeholder={"https://...\nhttps://..."}
          className="rounded-md border border-ink/15 bg-cream px-3 py-2 focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted"
        />
      </label>
      <VariantsEditor defaultVariants={defaultVariants} />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {pending ? "Bezig..." : game ? "Opslaan" : "Toevoegen"}
      </button>
    </form>
  );
}
