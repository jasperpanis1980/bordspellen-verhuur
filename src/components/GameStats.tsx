import { Users, Clock, Tag, Cake } from "lucide-react";
import type { Game } from "@prisma/client";
import { getThemeIcon } from "@/lib/theme-icons";
import { ComplexityMeter } from "@/components/ComplexityMeter";

export function GameStats({
  game,
  size = "sm",
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
  >;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? 14 : 16;
  const textClass = size === "sm" ? "text-xs" : "text-sm";
  const ThemeIcon = getThemeIcon(game.theme);

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${textClass} text-foreground/60`}>
      <span className="inline-flex items-center gap-1">
        <Tag size={iconSize} className="text-primary" />
        {game.category}
      </span>
      <span className="inline-flex items-center gap-1">
        <ThemeIcon size={iconSize} className="text-primary" />
        {game.theme}
      </span>
      <span className="inline-flex items-center gap-1">
        <Users size={iconSize} className="text-primary" />
        {game.minPlayers}-{game.maxPlayers}
      </span>
      <span className="inline-flex items-center gap-1">
        <Cake size={iconSize} className="text-primary" />
        {game.minAge}+
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock size={iconSize} className="text-primary" />
        {game.playTime} min
      </span>
      <ComplexityMeter value={game.complexity} size={size} />
    </div>
  );
}
