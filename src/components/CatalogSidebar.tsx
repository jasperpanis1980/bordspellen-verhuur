"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getThemeIcon, THEME_OPTIONS } from "@/lib/theme-icons";
import { CATEGORY_OPTIONS } from "@/lib/game-options";

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-foreground/50">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3 lg:flex lg:flex-col lg:grid-cols-1">
        {children}
      </div>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-ink/5 dark:hover:bg-cream/10">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-primary"
      />
      {Icon && <Icon size={14} className="text-foreground/50" />}
      <span className={checked ? "font-medium" : "text-foreground/70"}>
        {label}
      </span>
    </label>
  );
}

export function CatalogSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTheme = searchParams.get("theme") ?? "";
  const activeCategory = searchParams.get("category") ?? "";

  function toggleParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key) ?? "";
    if (current === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-48">
      <FilterGroup title="Thema">
        {THEME_OPTIONS.map((theme) => (
          <CheckboxRow
            key={theme}
            label={theme}
            icon={getThemeIcon(theme)}
            checked={activeTheme === theme}
            onChange={() => toggleParam("theme", theme)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Classificatie">
        {CATEGORY_OPTIONS.map((category) => (
          <CheckboxRow
            key={category}
            label={category}
            checked={activeCategory === category}
            onChange={() => toggleParam("category", category)}
          />
        ))}
      </FilterGroup>
    </aside>
  );
}
