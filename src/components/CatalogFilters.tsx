"use client";

import { useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Cake, Clock, Gauge, Heart, Search, Users } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/game-options";

const inputClass =
  "rounded-md border border-ink/15 bg-cream px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-cream/20 dark:bg-ink-muted";

const COMPLEXITY_OPTIONS = [
  { value: "", label: "Alle niveaus" },
  { value: "licht", label: "Licht" },
  { value: "gemiddeld", label: "Gemiddeld" },
  { value: "zwaar", label: "Zwaar" },
];

export function CatalogFilters({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function updateParamDebounced(key: string, value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam(key, value), 300);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <input
          type="text"
          placeholder="Zoek op titel..."
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => updateParamDebounced("q", e.target.value)}
          className={`${inputClass} pl-8`}
        />
      </div>

      <div className="relative">
        <Users
          size={15}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <input
          type="number"
          min={1}
          placeholder="Aantal spelers"
          defaultValue={searchParams.get("players") ?? ""}
          onChange={(e) => updateParamDebounced("players", e.target.value)}
          className={`${inputClass} w-36 pl-8`}
        />
      </div>

      <div className="relative">
        <Cake
          size={15}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <input
          type="number"
          min={1}
          placeholder="Leeftijd"
          defaultValue={searchParams.get("age") ?? ""}
          onChange={(e) => updateParamDebounced("age", e.target.value)}
          className={`${inputClass} w-32 pl-8`}
        />
      </div>

      <div className="relative">
        <Clock
          size={15}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <input
          type="number"
          min={1}
          placeholder="Max. speelduur"
          defaultValue={searchParams.get("playtime") ?? ""}
          onChange={(e) => updateParamDebounced("playtime", e.target.value)}
          className={`${inputClass} w-36 pl-8`}
        />
      </div>

      <div className="relative">
        <Gauge
          size={15}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/40"
        />
        <select
          defaultValue={searchParams.get("complexity") ?? ""}
          onChange={(e) => updateParam("complexity", e.target.value)}
          className={`${inputClass} pl-8`}
        >
          {COMPLEXITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          defaultChecked={searchParams.get("available") === "1"}
          onChange={(e) => updateParam("available", e.target.checked ? "1" : "")}
          className="accent-primary"
        />
        Alleen beschikbare spellen
      </label>

      {isLoggedIn && (
        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            defaultChecked={searchParams.get("favorites") === "1"}
            onChange={(e) => updateParam("favorites", e.target.checked ? "1" : "")}
            className="accent-primary"
          />
          <Heart size={14} className="text-foreground/50" />
          Alleen favorieten
        </label>
      )}

      <select
        defaultValue={searchParams.get("sort") ?? "name-asc"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className={`${inputClass} ml-auto`}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
