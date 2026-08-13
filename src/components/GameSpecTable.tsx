import { Users, Clock, Gauge, Tag, Cake, Package } from "lucide-react";
import type { Game } from "@prisma/client";
import { getThemeIcon } from "@/lib/theme-icons";
import { ComplexityMeter } from "@/components/ComplexityMeter";

export function GameSpecTable({
  game,
}: {
  game: Pick<
    Game,
    | "minPlayers"
    | "maxPlayers"
    | "playTime"
    | "complexity"
    | "category"
    | "minAge"
    | "theme"
    | "totalCopies"
  >;
}) {
  const ThemeIcon = getThemeIcon(game.theme);

  const rows = [
    { icon: Tag, label: "Classificatie", value: game.category },
    { icon: ThemeIcon, label: "Thema", value: game.theme },
    {
      icon: Users,
      label: "Aantal spelers",
      value: `${game.minPlayers}-${game.maxPlayers}`,
    },
    { icon: Cake, label: "Leeftijd", value: `${game.minAge}+` },
    { icon: Clock, label: "Speelduur", value: `${game.playTime} min` },
    {
      icon: Gauge,
      label: "Complexiteit",
      value: <ComplexityMeter value={game.complexity} size="md" />,
    },
    {
      icon: Package,
      label: "Exemplaren",
      value: `${game.totalCopies}`,
    },
  ];

  return (
    <table className="w-full overflow-hidden rounded-lg text-sm">
      <tbody>
        {rows.map(({ icon: Icon, label, value }, i) => (
          <tr
            key={label}
            className={i % 2 === 0 ? "bg-cream-muted" : "bg-transparent"}
          >
            <td className="px-3 py-2 text-foreground/60">
              <span className="inline-flex items-center gap-2">
                <Icon size={15} className="text-primary" />
                {label}
              </span>
            </td>
            <td className="px-3 py-2 text-right font-medium">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
